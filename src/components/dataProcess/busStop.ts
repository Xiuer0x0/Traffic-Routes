import { BusData } from './busData';
import { LatLngExpression } from "leaflet";
import { fetchJSON } from './fetch';

const sourceUrl = '../../assets/data/GetStop.json';

export default function fetchBusStop(url: string = sourceUrl) {
    return fetchJSON(url)
        .then(response => response.BusInfo as BusData.StopSource[])
        .then(busStopSource => busStopSource.map(info => {
            const { Id, latitude, longitude, nameEn, nameZh } = info;
            const busStopInfo: BusData.Stop = {
                id: Id,
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