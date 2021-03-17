import _ from "lodash";
import { Bus } from './Bus';
import { LatLngExpression } from "leaflet";
import { fetchJSON } from './fetch';

const sourceUrl = '../../assets/data/GetStop.json';

export default function fetchBusStop(url: string = sourceUrl) {
    return fetchJSON(url)
        .then(response => response.BusInfo as Bus.Source.Stop[])
        .then(dataSource => filterSource(dataSource));
};

function filterSource(source: Bus.Source.Stop[]): Bus.Stop[] {
    const filterStops: Bus.FilterStopSource = {};

    _.reduce(source, getStops, filterStops);
    
    return Object.values(filterStops);
}

function getStops(result: Bus.FilterStopSource, values: Bus.Source.Stop): Bus.FilterStopSource {
    const { stopLocationId, routeId } = values;
    const stopID = stopLocationId.toString();
    let stop = result[stopID];

    if (stop) {
        stop.routeIDs = addRouteToList(stop.routeIDs, routeId);
    } else {
        stop = getStopInfo(values);
    }

    result[stopID] = stop;
    
    return result;
}

function addRouteToList<T>(list: T[], route: T): T[] {
    return [...list, route];
}

function getStopInfo(source: Bus.Source.Stop): Bus.Stop {
    const { stopLocationId, nameEn, nameZh, latitude, longitude, routeId } = source;
    const stop: Bus.Stop = {
        id: stopLocationId,
        name: {
            en: nameEn,
            zhTW: nameZh,
        },
        latLng: <LatLngExpression>[
            parseFloat(latitude),
            parseFloat(longitude),
        ],
        routeIDs: [routeId],
    };

    return stop;
}