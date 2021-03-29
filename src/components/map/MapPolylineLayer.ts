import L from 'leaflet';
import { CustomMap } from "./map";

export default class MapPolylineLayer implements CustomMap.PolylineLayer {
    public readonly layer = L.layerGroup();

    constructor(public readonly map: L.Map) {
        this.layer.addTo(map);
    }

    addPolyline(coordinates: L.LatLngExpression[], options?: L.PolylineOptions) {
        const polyline = new L.Polyline(coordinates, options);

        polyline.addTo(this.layer);
    }

    clear() {
        this.layer.clearLayers();
    }
}