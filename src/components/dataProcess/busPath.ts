import _ from 'lodash';
import { fetchCSV } from "./fetch";
import { Bus } from "./Bus";
import { GenericLinkedList, LinkedList } from '../linkedList';

export default function fetchBusPaths(url: string) {
    const config: Papa.ParseConfig = {
        comments: '資料版本',
        header: true,
        dynamicTyping: true,
    };

    return fetchCSV(url, config)
        .then(response => response.data as Bus.Source.RoadMap[])
        .then(dataSource => filterSource(dataSource))
        .then(filterData => getBusPaths(filterData));
}

function filterSource(pathSource: Bus.Source.RoadMap[]): Bus.FilterPathSource {
    const pathClassify =  _.reduce(pathSource, (paths, values) => {
        const { SubrouteUID, Direction, StationUID, StopSequence, StopNameEn, StopNameZh } = values;
        const path = paths[SubrouteUID] || [];
        const stopNameI18n: i18n = {
            en: StopNameEn,
            zhTW: StopNameZh,
        };
        const stop: Bus.PathFilter = {
            direction: Direction,
            stopUID: StationUID,
            stopSequence: StopSequence,
            stopName: stopNameI18n,
        };

        paths[SubrouteUID] = addDataToArray(path, stop);

        return paths;
    }, {} as Bus.FilterPathSource);

    return pathClassify;
}

function getBusPaths(filterData: Bus.FilterPathSource): Bus.Path[] {
    let busPaths: Bus.Path[] = [];

    _.forOwn(filterData, (values, key) => {
        const path: Bus.Path = {
            UID: key,
            ...classifyPath(values),
        };

        busPaths = addDataToArray(busPaths, path);
    });

    return busPaths;
}

function addDataToArray<T>(array: T[], data: T): T[] {
    return [...array, data];
}

function classifyPath(routes: Bus.PathFilter[]): Bus.PathDirection {
    enum Direction {
        outbound = 0,
        returnTrip,
        cycle,
        unknow = 255,
    };

    let outbound: Bus.PathFilter[] = [];
    let returnTrip: Bus.PathFilter[] = [];
    let cycle: Bus.PathFilter[] = [];

    routes.forEach((value) => {
        const { direction } = value;

        switch (direction) {
            case Direction.outbound:
                outbound = addDataToArray(outbound, value);
                break;
            case Direction.returnTrip:
                returnTrip = addDataToArray(returnTrip, value);
                break;
            case Direction.cycle:
                cycle = addDataToArray(cycle, value);
                break;
            default:
                console.warn(`bus direction type not defined: ${direction}`);
                break;
        }
    });

    const busRouteInfo: Bus.PathDirection = {
        outbound: getSequenceInfo(outbound),
        returnTrip: getSequenceInfo(returnTrip),
        cycle: getSequenceInfo(cycle),
    };

    return busRouteInfo;
}

function getSequenceInfo(routes: Bus.PathFilter[]): Bus.PathSequenceInfo | null {
    if (routes.length === 0) {
        return null;
    }

    const sortRoutes = _.sortBy(routes, (obj) => obj.stopSequence);
    const pathSequence = new GenericLinkedList<Bus.PathSequence>();

    sortRoutes.forEach((value) => {
        const { stopUID, stopSequence } = value;

        pathSequence.push({
            stopUID,
            stopSequence,
        });
    });

    const departureStop = _.head(sortRoutes) as Bus.PathFilter;
    const destinationStop = _.last(sortRoutes) as Bus.PathFilter;

    return {
        departure: {...departureStop.stopName},
        destination: {...destinationStop.stopName},
        stopSequence: pathSequence,
    };
}
