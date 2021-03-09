import _ from 'lodash';
import { fetchCSV } from "./fetch";
import * as Bus from "./busData";

const sourceUrl = '../../assets/data/roadMap_sample.csv';

export default function fetchBusRoute(url: string = sourceUrl) {
    const config: Papa.ParseConfig = {
        comments: '資料版本',
        header: true,
        dynamicTyping: true,
    };

    return fetchCSV(url, config)
        .then(response => response.data as Bus.RouteSource[])
        .then(dataSource => filterBusRouteSource(dataSource))
        .then(busRouteClassify => {
            const busRoutes: Bus.Routes = {};

            _.forOwn(busRouteClassify, (values, key) => {
                busRoutes[key] = classifyBusRoute(values);
            });

            return busRoutes;
        });
}

function filterBusRouteSource(busRouteSource: Bus.RouteSource[]): Bus.RoutesFilter {
    const busRouteClassify =  _.reduce(busRouteSource, (result, values, index)=> {
        const { SubrouteUID, Direction, StopID, StopSequence } = values;

        result[SubrouteUID] = result[SubrouteUID] || [];
        result[SubrouteUID].push({
            direction: Direction,
            stopID: StopID,
            stopSequence: StopSequence,
        });

        return result;
    }, {} as Bus.RoutesFilter);

    return busRouteClassify;
}

function classifyBusRoute(routes: Bus.RouteFilter[]): Bus.RouteInfo {
    const outbound: Bus.ClassifyBusRoute[] = [];
    const returnTrip: Bus.ClassifyBusRoute[] = [];
    const cycle: Bus.ClassifyBusRoute[] = [];

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

    const busRouteInfo: Bus.RouteInfo = {
        outbound,
        returnTrip,
        cycle,
    };

    return busRouteInfo;
}
