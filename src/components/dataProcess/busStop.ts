import _ from "lodash";
import { Bus } from './Bus';
import { LatLngExpression } from "leaflet";
import { fetchJSON } from './fetch';

export default function fetchBusStop(url: string, cityCode: Bus.CityCode) {
    return fetchJSON(url)
        .then(response => response.BusInfo as Bus.Source.Stop[])
        .then(dataSource => filterSource(dataSource, cityCode));
};

function filterSource(source: Bus.Source.Stop[], cityCode: Bus.CityCode): Bus.Stop[] {
    const filterStops: Bus.FilterStopSource = {};

    _.reduce(source, (result, values) => {
        const { stopLocationId, routeId } = values;
        const routeUID = `${cityCode}${routeId}`;
        const stopID = stopLocationId.toString();
        let stop = result[stopID];
    
        if (stop) {
            stop.routeUIDs = addRouteToList(stop.routeUIDs, routeUID);
        } else {
            stop = getStopInfo(values, cityCode);
        }
    
        result[stopID] = stop;
        
        return result;
    }, filterStops);
    
    return Object.values(filterStops);
}

function addRouteToList<T>(list: T[], route: T): T[] {
    return [...list, route];
}

function getStopInfo(source: Bus.Source.Stop, cityCode: Bus.CityCode): Bus.Stop {
    const { stopLocationId, nameEn, nameZh, latitude, longitude, routeId } = source;
    const routeUID = `${cityCode}${routeId}`;
    const stop: Bus.Stop = {
        UID: `${cityCode}${stopLocationId}`,
        name: {
            en: nameEn,
            zhTW: nameZh,
        },
        latLng: <LatLngExpression>[
            parseFloat(latitude),
            parseFloat(longitude),
        ],
        routeUIDs: [routeUID],
    };

    return stop;
}