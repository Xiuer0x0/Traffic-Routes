import _ from "lodash";
import { Bus } from "./Bus";
import fetchBusStop from './busStop';
import fetchBusPaths from './busPath';
import fetchBusRoutes from './busRoute';
import { cityCodes } from "./cityCodes";

export default class BusData implements Bus.Data {
    private source: Bus.DataSource = {
        stops: [],
        routes: [],
        paths: [],
    };

    get stops() {
        return [...this.source.stops];
    }

    get routes() {
        return [...this.source.routes];
    }

    get paths() {
        return [...this.source.paths];
    }

    async initialize() {
        const response = await requestBusData();
        const [ stopsSource, routesSource, pathsSource ] = response;

        this.source = {
            stops: [...stopsSource],
            routes: [...routesSource],
            paths: [...pathsSource],
        };
    }

    private findUIDData<T extends Bus.DataIndex>(source: T[], UID: string): T | null {
        const data = _.find(source, (obj) => obj.UID === UID);

        return data || null;
    }

    getStop(stopUID: string) {
        return this.findUIDData(this.stops, stopUID);
    }

    getRoute(routeUID: string) {
        return this.findUIDData(this.routes, routeUID);
    }

    getPath(pathUID: string) {
        return this.findUIDData(this.paths, pathUID);
    }
}

function requestBusData() {
    const stopURL = '../../assets/data/GetStop.json';
    const routeURL = '../../assets/data/GetRoute.json';
    const pathURL = '../../assets/data/roadMap_sample.csv';

    return Promise.all([
        fetchBusStop(stopURL, cityCodes.taipei),
        fetchBusRoutes(routeURL, cityCodes.taipei),
        fetchBusPaths(pathURL),
    ]);
}
