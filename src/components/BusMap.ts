import _ from "lodash";
import L from 'leaflet';
import { Bus } from "./dataProcess/Bus";
import mapConfig, { MapConfig } from './map/map.config';
import MapFacade from "./map/MapFacade";
import markerIcon from "./map/markerIcon";

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
        const normalIcon = new L.Icon(markerIcon.blue);
        const firstIcon = new L.Icon(markerIcon.green);
        const lastIcon = new L.Icon(markerIcon.red);

        data.map((obj, index) => {
            const tooltipTemplete = `<div>${obj.name.zhTW}</div>`;
            let icon: L.Icon | undefined = normalIcon;

            if (index === 0) {
                icon = firstIcon;
            }
            else if (index === data.length - 1) {
                icon = lastIcon;
            }

            this.mapFacade.drawPin(obj.latLng, {
                tooltipTemplete,
                icon,
            });
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
