import L from 'leaflet';
import { CustomMap } from "./map";

export default class MapUtility implements CustomMap.MapUtitity {
    constructor(public readonly map: L.Map) {
        
    }

    flyTo(latLng: L.LatLngExpression, options?: CustomMap.ZoomPanOptions) {
        const zoom = options?.zoom;

        this.map.flyTo(latLng, zoom, options);
    }
}