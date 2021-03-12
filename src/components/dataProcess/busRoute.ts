import _ from 'lodash';
import { fetchCSV } from "./fetch";
import { BusData } from "./busData";
import { GenericLinkedList, LinkedList } from '../linkedList';

const sourceUrl = '../../assets/data/roadMap_sample.csv';

export default function fetchBusRoute(url: string = sourceUrl) {
    const config: Papa.ParseConfig = {
        comments: '資料版本',
        header: true,
        dynamicTyping: true,
    };

    return fetchCSV(url, config)
        .then(response => response.data as BusData.RouteSource[])
        .then(dataSource => filterSource(dataSource))
        .then(filterData => getBusRoutesData(filterData));
}

function filterSource(busRouteSource: BusData.RouteSource[]): BusData.FilterSource {
    const busRouteClassify =  _.reduce(busRouteSource, (routes, values)=> {
        const { SubrouteUID, Direction, StopID, StopSequence } = values;
        const route = routes[SubrouteUID] || [];
        const stop: BusData.RouteFilter = {
            direction: Direction,
            stopID: StopID,
            stopSequence: StopSequence,
        };

        routes[SubrouteUID] = addStopToRoute(route, stop);

        return routes;
    }, {} as BusData.FilterSource);

    return busRouteClassify;
}

function addStopToRoute<T>(route: T[], stop: T): T[] {
    return [...route, stop];
}

function getBusRoutesData(filterData: BusData.FilterSource): BusData.Routes {
    const busRoutes: BusData.Routes = {};

    _.forOwn(filterData, (values, key) => {
        busRoutes[key] = classifyRoute(values);
    });

    return busRoutes;
}

function classifyRoute(routes: BusData.RouteFilter[]): BusData.RouteDirection {
    const outbound: BusData.RouteDirectionInfo[] = [];
    const returnTrip: BusData.RouteDirectionInfo[] = [];
    const cycle: BusData.RouteDirectionInfo[] = [];

    routes.forEach((value) => {
        const { direction, stopID, stopSequence } = value;
        const routeDirectionInfo: BusData.RouteDirectionInfo = { stopID, stopSequence };

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

    const busRouteInfo: BusData.RouteDirection = {
        outbound: routeToLinkedList(outbound),
        returnTrip: routeToLinkedList(returnTrip),
        cycle: routeToLinkedList(cycle),
    };

    return busRouteInfo;
}

function routeToLinkedList(routes: BusData.RouteDirectionInfo[]): LinkedList<BusData.RouteDirectionInfo> | null {
    if (!routes.length) {
        return null;
    }

    const linkList = new GenericLinkedList<BusData.RouteDirectionInfo>();

    routes.sort((a, b) => a.stopSequence - b.stopSequence)
        .forEach((value) => linkList.push(value));

    return linkList;
}
