import _ from 'lodash';
import { fetchCSV } from "./fetch";
import { Bus } from "./Bus";
import { GenericLinkedList, LinkedList } from '../linkedList';

const sourceUrl = '../../assets/data/roadMap_sample.csv';

export default function fetchBusPaths(url: string = sourceUrl) {
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
        const { SubrouteUID, Direction, StopID, StopSequence } = values;
        const path = paths[SubrouteUID] || [];
        const stop: Bus.PathFilter = {
            direction: Direction,
            stopID: StopID,
            stopSequence: StopSequence,
        };

        paths[SubrouteUID] = addStopToPath(path, stop);

        return paths;
    }, {} as Bus.FilterPathSource);

    return pathClassify;
}

function addStopToPath<T>(path: T[], stop: T): T[] {
    return [...path, stop];
}

function getBusPaths(filterData: Bus.FilterPathSource): Bus.Paths {
    const busRoutes: Bus.Paths = {};

    _.forOwn(filterData, (values, key) => {
        busRoutes[key] = classifyPath(values);
    });

    return busRoutes;
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
        const { direction, stopID, stopSequence } = value;
        const pathSequence: Bus.PathSequence = { stopID, stopSequence };

        switch (direction) {
            case Direction.outbound:
                outbound = addStopToPath(outbound, pathSequence);
                break;
            case Direction.returnTrip:
                returnTrip = addStopToPath(returnTrip, pathSequence);
                break;
            case Direction.cycle:
                cycle = addStopToPath(cycle, pathSequence);
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
