import * as Bus from './busData';
import { LatLngExpression } from "leaflet";
import { fetchJSON } from './fetch';

const sourceUrl = '../../assets/data/GetStop.json';

export default function fetchBusStop(url: string = sourceUrl) {
    return fetchJSON(url)
        .then(response => response.BusInfo as Bus.StopSource[])
        .then(busStopSource => busStopSource.map(info => {
            const { stopID, latitude, longitude, nameEn, nameZh } = info;
            const busStopInfo: Bus.Stop = {
                id: stopID,
                latLng: <LatLngExpression>[
                    parseFloat(latitude),
                    parseFloat(longitude),
                ],
                nameEn,
                nameZh,
            };

            return busStopInfo;
        }));
};