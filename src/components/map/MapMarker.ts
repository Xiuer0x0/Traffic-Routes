import L from 'leaflet';
import { CustomMap } from "./map";

export default class MapMarker implements CustomMap.Marker {
    public marker: L.Marker;

    private constructor(coordinate: L.LatLngExpression) {
        this.marker = L.marker(coordinate);
    }

    static create(coordinate: L.LatLngExpression): MapMarker {
        return new MapMarker(coordinate);
    }

    public bindTooltip(content: string) {
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