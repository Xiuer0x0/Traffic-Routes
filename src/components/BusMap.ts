import _ from "lodash";
import L from 'leaflet';
import { Bus } from "./dataProcess/Bus";
import mapConfig, { MapConfig } from './map/map.config';
import MapFacade from "./map/MapFacade";

interface BusMapFacadeOptions {
    readonly config?: MapConfig;
    readonly mapFacade?: MapFacade;
};

export default class BusMapFacade {
    public readonly config: MapConfig;
    public readonly mapFacade: MapFacade;

    public constructor({
        config = mapConfig,
        mapFacade = new MapFacade(config),
    }: BusMapFacadeOptions = {}) {
        this.config = config;
        this.mapFacade = mapFacade;
    }

    public drawStops(data: Bus.Stop[]) {
        data.map(obj => {
            const tooltipTemplete = `<div>${obj.name.zhTW}</div>`;

            this.mapFacade.drawPin(obj.latLng, tooltipTemplete);    
        });
    }

    public clearStops() {
        this.mapFacade.clearPins();
    }

    public drawPath(data: Bus.Stop[]) {
        const coordinates = _.reduce(data, (result, values) => {
            result = [...result, values.latLng];

            return result;
        }, [] as L.LatLngExpression[]);

        this.clearPath();
        this.drawStops(data);
        this.mapFacade.drawPolyline(coordinates);
    }

    public clearPath() {
        this.mapFacade.clearPins();
        this.mapFacade.clearPolyline();
    }
}
