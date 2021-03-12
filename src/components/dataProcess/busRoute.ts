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
        .then(dataSource => filterBusRouteSource(dataSource))
        .then(busRouteClassify => {
            const busRoutes: BusData.Routes = {};

            _.forOwn(busRouteClassify, (values, key) => {
                busRoutes[key] = classifyBusRoute(values);
            });

            return busRoutes;
        });
}

function filterBusRouteSource(busRouteSource: BusData.RouteSource[]): BusData.RoutesFilter {
    const busRouteClassify =  _.reduce(busRouteSource, (result, values, index)=> {
        const { SubrouteUID, Direction, StopID, StopSequence } = values;

        result[SubrouteUID] = result[SubrouteUID] || [];
        result[SubrouteUID].push({
            direction: Direction,
            stopID: StopID,
            stopSequence: StopSequence,
        });

        return result;
    }, {} as BusData.RoutesFilter);

    return busRouteClassify;
}

function classifyBusRoute(routes: BusData.RouteFilter[]): BusData.RouteDirection {
    const outbound: BusData.RouteDirectionInfo[] = [];
    const returnTrip: BusData.RouteDirectionInfo[] = [];
    const cycle: BusData.RouteDirectionInfo[] = [];

    routes.forEach((value, index) => {
        const { direction, stopID, stopSequence } = value;

        switch (direction) {
            case 0:
                outbound.push({ stopID, stopSequence });
                break;
            case 1:
                returnTrip.push({ stopID, stopSequence });
                break;
            case 2:
                cycle.push({ stopID, stopSequence });
                break;
            default:
                console.warn(`bus direction type not defined: ${direction}`);
                break;
        }
    });

    const busRouteInfo: BusData.RouteDirection = {
        outbound: sortRouteToList(outbound),
        returnTrip: sortRouteToList(returnTrip),
        cycle: sortRouteToList(cycle),
    };

    return busRouteInfo;
}

function sortRouteToList(routes: BusData.RouteDirectionInfo[]): LinkedList<BusData.RouteDirectionInfo> | null {
    if (!routes.length) {
        return null;
    }

    const linkList = new GenericLinkedList<BusData.RouteDirectionInfo>();

    routes.sort((a, b) => a.stopSequence - b.stopSequence)
        .forEach((value) => linkList.push(value));

    return linkList;
}
