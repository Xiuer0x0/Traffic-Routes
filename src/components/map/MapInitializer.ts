import L from 'leaflet';
import { CustomMap } from "./map";
import { MapConfig } from "./map.config";

export default class MapInitializer implements CustomMap.Initializer {
    constructor(
        public readonly map: L.Map,
        public readonly config: MapConfig,
    ) {}

    public initialize() {
        const { coordinate, zoomLevel, tileLayerURL } = this.config;

        this.map.setView(coordinate, zoomLevel);

        L.tileLayer(tileLayerURL)
            .addTo(this.map);
    }
}