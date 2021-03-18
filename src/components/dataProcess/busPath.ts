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
        const { SubrouteUID, Direction, StopUID, StopSequence } = values;
        const path = paths[SubrouteUID] || [];
        const stop: Bus.PathFilter = {
            direction: Direction,
            stopUID: StopUID,
            stopSequence: StopSequence,
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

    let outbound: Bus.PathSequence[] = [];
    let returnTrip: Bus.PathSequence[] = [];
    let cycle: Bus.PathSequence[] = [];

    routes.forEach((value) => {
        const { direction, stopUID: stopID, stopSequence } = value;
        const pathSequence: Bus.PathSequence = { stopUID: stopID, stopSequence };

        switch (direction) {
            case Direction.outbound:
                outbound = addDataToArray(outbound, pathSequence);
                break;
            case Direction.returnTrip:
                returnTrip = addDataToArray(returnTrip, pathSequence);
                break;
            case Direction.cycle:
                cycle = addDataToArray(cycle, pathSequence);
                break;
            default:
                console.warn(`bus direction type not defined: ${direction}`);
                break;
        }
    });

    const busRouteInfo: Bus.PathDirection = {
        outbound: pathToLinkedList(outbound),
        returnTrip: pathToLinkedList(returnTrip),
        cycle: pathToLinkedList(cycle),
    };

    return busRouteInfo;
}

function pathToLinkedList(routes: Bus.PathSequence[]): LinkedList<Bus.PathSequence> | null {
    if (!routes.length) {
        return null;
    }

    const sortRoutes = _.sortBy(routes, (obj) => obj.stopSequence);
    const linkList = new GenericLinkedList<Bus.PathSequence>();

    sortRoutes.forEach((value) => linkList.push(value));

    return linkList;
}
