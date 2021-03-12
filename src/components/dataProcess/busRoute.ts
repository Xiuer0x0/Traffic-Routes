import _ from 'lodash';
import { fetchCSV } from "./fetch";
import { BusData } from "./busData";

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

function classifyBusRoute(routes: BusData.RouteFilter[]): BusData.RouteInfo {
    const outbound: BusData.ClassifyBusRoute[] = [];
    const returnTrip: BusData.ClassifyBusRoute[] = [];
    const cycle: BusData.ClassifyBusRoute[] = [];

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

        outbound,
        returnTrip,
        cycle,
    const busRouteInfo: BusData.RouteInfo = {
    };

    return busRouteInfo;
}
