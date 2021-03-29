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

    clearPins() {
        this.mapFacade.clearPins();
    }
}