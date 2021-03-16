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
        .then(filterData => getBusRoutesData(filterData));
}

function filterSource(busRouteSource: Bus.Source.RoadMap[]): Bus.FilterPathSource {
    const busRouteClassify =  _.reduce(busRouteSource, (routes, values) => {
        const { SubrouteUID, Direction, StopID, StopSequence } = values;
        const route = routes[SubrouteUID] || [];
        const stop: Bus.PathFilter = {
            direction: Direction,
            stopID: StopID,
            stopSequence: StopSequence,
        };

        routes[SubrouteUID] = addStopToRoute(route, stop);

        return routes;
    }, {} as Bus.FilterPathSource);

    return busRouteClassify;
}

function addStopToRoute<T>(route: T[], stop: T): T[] {
    return [...route, stop];
}

function getBusRoutesData(filterData: Bus.FilterPathSource): Bus.Paths {
    const busRoutes: Bus.Paths = {};

    _.forOwn(filterData, (values, key) => {
        busRoutes[key] = classifyRoute(values);
    });

    return busRoutes;
}

function classifyRoute(routes: Bus.PathFilter[]): Bus.PathDirection {
    const outbound: Bus.PathSequence[] = [];
    const returnTrip: Bus.PathSequence[] = [];
    const cycle: Bus.PathSequence[] = [];

    routes.forEach((value) => {
        const { direction, stopID, stopSequence } = value;
        const routeDirectionInfo: Bus.PathSequence = { stopID, stopSequence };

        switch (direction) {
            case 0:
                outbound.push(routeDirectionInfo);
                break;
            case 1:
                returnTrip.push(routeDirectionInfo);
                break;
            case 2:
                cycle.push(routeDirectionInfo);
                break;
            default:
                console.warn(`bus direction type not defined: ${direction}`);
                break;
        }
    });

    const busRouteInfo: Bus.PathDirection = {
        outbound: routeToLinkedList(outbound),
        returnTrip: routeToLinkedList(returnTrip),
        cycle: routeToLinkedList(cycle),
    };

    return busRouteInfo;
}

function routeToLinkedList(routes: Bus.PathSequence[]): LinkedList<Bus.PathSequence> | null {
    if (!routes.length) {
        return null;
    }

    const linkList = new GenericLinkedList<Bus.PathSequence>();

    routes.sort((a, b) => a.stopSequence - b.stopSequence)
        .forEach((value) => linkList.push(value));

    return linkList;
}
