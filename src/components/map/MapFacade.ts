import L from 'leaflet';
import { CustomMap } from './map';
import mapConfig, { MapConfig } from './map.config';
import MapInitializer from './MapInitializer';
import MapMarker from './MapMarker';
import MapMarkerLayer from './MapMarkerLayer';
import MapPolylineLayer from './MapPolylineLayer';
import MapUtility from './MapUtility';

export default class MapFacade {
    private map: L.Map | null = L.map(mapConfig.containerID);
    private mapInitializer: CustomMap.Initializer;
    private mapMarkerLayer: CustomMap.MarkerLayer;
    private mapPolylineLayer: CustomMap.PolylineLayer;
    private mapUtility: CustomMap.MapUtitity;

    public constructor(readonly config: MapConfig = mapConfig) {
        if (this.map === null) {
            throw new Error(`Map isn't correctly initialized.`);
        }

        this.mapInitializer = new MapInitializer(this.map, config);
        this.mapMarkerLayer = new MapMarkerLayer(this.map);
        this.mapPolylineLayer = new MapPolylineLayer(this.map);
        this.mapUtility = new MapUtility(this.map);

        this.mapInitializer.initialize();
    }

    public focusCoordinates(lanLng: L.LatLngExpression, options?: CustomMap.ZoomPanOptions) {
        this.mapUtility.flyTo(lanLng, options);
    }

    public drawPin(coordinate: L.LatLngExpression, tooltipTemplete: string = '') {
        const marker = MapMarker.create(coordinate);

        marker.bindTooltip(tooltipTemplete);

        this.mapMarkerLayer.addMarker(marker);
    }

    public drawPins(coordinates: L.LatLngExpression[], tooltipTemplete: string = '') {
        coordinates.forEach(latLng => {
            this.drawPin(latLng, tooltipTemplete);
        });
    }

    public clearPins() {
        this.mapMarkerLayer.clear();
    }

    public drawPolyline(coordinates: L.LatLngExpression[], options?: L.PolylineOptions) {
        this.mapPolylineLayer.addPolyline(coordinates, options);
    }

    public clearPolyline() {
        this.mapPolylineLayer.clear();
    }
}
