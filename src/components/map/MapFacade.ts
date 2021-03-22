import L from 'leaflet';
import { CustomMap } from './map';
import mapConfig, { MapConfig } from './map.config';
import MapInitializer from './MapInitializer';
import MapMarkerLayer from './MapMarkerLayer';
import MapUtility from './MapUtility';

export default class MapFacade {
    private map: L.Map | null = L.map(mapConfig.containerID);
    private mapInitializer: CustomMap.Initializer;
    private mapMarkerLayer: CustomMap.MarkerLayer;
    private mapUtility: CustomMap.MapUtitity;

    constructor(readonly config: MapConfig) {
        if (this.map === null) {
            throw new Error(`Map isn't correctly initialized.`);
        }

        this.mapInitializer = new MapInitializer(this.map, config);
        this.mapMarkerLayer = new MapMarkerLayer(this.map);
        this.mapUtility = new MapUtility(this.map);

        this.mapInitializer.initialize();
    }

    focusCoordinates(lanLng: L.LatLngExpression, options?: CustomMap.ZoomPanOptions) {
        this.mapUtility.flyTo(lanLng, options);
    }
}