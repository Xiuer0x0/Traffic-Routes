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
    return source.map(data => getBusStopInfo(data));
}

function getBusStopInfo(source: Bus.Source.Stop): Bus.Stop {
    const { Id, latitude, longitude, nameEn, nameZh } = source;
    const busStopInfo: Bus.Stop = {
        id: Id,
        name: {
            en: nameEn,
            zhTW: nameZh,
        },
        latLng: <LatLngExpression>[
            parseFloat(latitude),
            parseFloat(longitude),
        ],
    };

    return busStopInfo;
}