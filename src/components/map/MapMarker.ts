import L from 'leaflet';
import { CustomMap } from "./map";

export default class MapMarker implements CustomMap.Marker {
    public marker: L.Marker;

    private constructor(coordinate: L.LatLngExpression, options: L.MarkerOptions) {
        this.marker = L.marker(coordinate, options);
    }

    static create(coordinate: L.LatLngExpression, options: L.MarkerOptions): MapMarker {
        return new MapMarker(coordinate, options);
    }

    public bindTooltip(content: string | HTMLElement) {
        const { marker } = this;

        marker.bindTooltip(content);

        marker.on('mouseover', () => {
            marker.openTooltip();
        });

        marker.on('mouseleave', () => {
            marker.openTooltip();
        });
    }
}