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
}
