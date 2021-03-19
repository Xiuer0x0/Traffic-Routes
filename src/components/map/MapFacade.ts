import L from 'leaflet';
import { CustomMap } from './map';
import mapConfig, { MapConfig } from './map.config';
import MapInitializer from './MapInitializer';
import MapMarkerLayer from './MapMarkerLayer';

export default class MapFacade {
    private map: L.Map | null = L.map(mapConfig.containerID);
    private mapInitializer: CustomMap.Initializer;
    private mapMarkerLayer: CustomMap.MarkerLayer;

    constructor(readonly config: MapConfig) {
        if (this.map === null) {
            throw new Error(`Map isn't correctly initialized.`);
        }

        this.mapInitializer = new MapInitializer(this.map, config);
        this.mapMarkerLayer = new MapMarkerLayer(this.map);

        this.mapInitializer.initialize();
    }
}
