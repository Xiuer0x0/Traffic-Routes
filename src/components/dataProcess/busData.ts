import _ from "lodash";
import { Bus } from "./Bus";
import fetchBusStop from './busStop';
import fetchBusPaths from './busPath';
import fetchBusRoutes from './busRoute';
import { cityCodes } from "./cityCodes";

export default class BusData implements Bus.Data {
    private static instance: Bus.Data;

    private constructor(private source: Bus.DataSource) {
    }

    private static async request() {
        const response = await requestBusData();
        const { stops, routes, paths } = response;
        const source: Bus.DataSource = {
            stops: [...stops],
            routes: [...routes],
            paths: [...paths],
        };

        return source;
    }

    static async initialize() {
        if (!this.instance) {
            const dataSource = await BusData.request();

            this.instance = new BusData(dataSource);
        }

        return this.instance;
    }

    get stops() {
        return [...this.source.stops];
    }

    get routes() {
        return [...this.source.routes];
    }

    get paths() {
        return [...this.source.paths];
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
    const stopURL = './assets/data/GetStop.json';
    const routeURL = './assets/data/GetRoute.json';
    const pathURL = './assets/data/roadMap_sample.csv';

    const request = Promise.all([
        fetchBusStop(stopURL, cityCodes.taipei),
        fetchBusRoutes(routeURL, cityCodes.taipei),
        fetchBusPaths(pathURL),
    ]).then((data) => {
        const [ stops, routes, paths ] = data;
        const newRoutes = comparisonRoutesAndPathsData({stops, routes, paths});

        return {
            stops,
            routes: newRoutes,
            paths,
        };
    });

    return request;
}

function comparisonRoutesAndPathsData(data: Bus.DataSource): Bus.Route[] {
    const { routes, paths } = data;
    const filterKey = _.map(paths, 'UID');
    const newRoutes = _.filter(routes, (info) => {
        return filterKey.indexOf(info.UID) >= 0;
    });

    return newRoutes;
}