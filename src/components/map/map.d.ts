import L from 'leaflet';
import { MapConfig } from './map.config';

declare namespace CustomMap {
    interface Initializer {
        readonly map: L.Map;
        readonly config: MapConfig;

        initialize(): void;
    };

    interface Marker {
        marker: L.Marker;
        bindTooltip(content: string): void;
    };

    interface MarkerLayer {
        readonly map: L.Map;
        readonly layer: L.LayerGroup;

        addMarker(marker: Marker): void;
        addMarkers(markers: Marker[]): void;
        clear(): void;
    };
}
