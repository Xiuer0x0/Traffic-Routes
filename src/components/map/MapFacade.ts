import L from 'leaflet';
import _ from 'lodash';
import { CustomMap } from './map';
import mapConfig, { MapConfig } from './map.config';
import MapInitializer from './MapInitializer';
import MapMarker from './MapMarker';
import MapMarkerLayer from './MapMarkerLayer';
import MapPolylineLayer from './MapPolylineLayer';
import MapUtility from './MapUtility';

interface drawPinOptions extends L.MarkerOptions {
    tooltipTemplete?: string | HTMLElement,
};

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

    public drawPin(coordinate: L.LatLngExpression, options: drawPinOptions = {}) {
        const pickKey = _.remove(Object.keys(options), (v) => v !== 'tooltipTemplete');
        const markerOptions = _.pick(options, pickKey);
        const marker = MapMarker.create(coordinate, markerOptions);
        const { tooltipTemplete } = options;

        marker.bindTooltip(tooltipTemplete || '');

        this.mapMarkerLayer.addMarker(marker);
    }

    public drawPins(coordinates: L.LatLngExpression[], options: drawPinOptions = {}) {
        coordinates.forEach(latLng => {
            this.drawPin(latLng, options);
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
