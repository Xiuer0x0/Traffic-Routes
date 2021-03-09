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
}
