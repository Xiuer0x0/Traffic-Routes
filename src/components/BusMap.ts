import _ from "lodash";
import L from 'leaflet';
import { Bus } from "./dataProcess/Bus";
import mapConfig from './map/map.config';
import MapFacade from "./map/MapFacade";

export default class BusMapFacade {
    constructor(
        private readonly mapFacade: MapFacade = new MapFacade(mapConfig),
    ) {}

    pinStops(data: Bus.Stop[]) {
        this.clearPins();

        data.map(obj => {
            const tooltipTemplete = `<div>${obj.name.zhTW}</div>`;

            this.mapFacade.drawPin(obj.latLng, tooltipTemplete);    
        });
    }

    drawPath(data: Bus.Stop[]) {
        const coordinates = _.reduce(data, (result, values) => {
            result = [...result, values.latLng];

            return result;
        }, [] as L.LatLngExpression[]);

        this.clearPath();
        this.pinStops(data);
        this.mapFacade.drawPolyline(coordinates);
    }

    clearPins() {
        this.mapFacade.clearPins();
    }

    clearPath() {
        this.clearPins();
        this.mapFacade.clearPolyline();
    }
}