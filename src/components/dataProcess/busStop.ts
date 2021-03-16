import { Bus } from './Bus';
import { LatLngExpression } from "leaflet";
import { fetchJSON } from './fetch';

const sourceUrl = '../../assets/data/GetStop.json';

export default function fetchBusStop(url: string = sourceUrl) {
    return fetchJSON(url)
        .then(response => response.BusInfo as Bus.Source.Stop[])
        .then(busStopSource => busStopSource.map(info => {
            const { Id, latitude, longitude, nameEn, nameZh } = info;
            const busStopInfo: Bus.Stop = {
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