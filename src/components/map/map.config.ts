import { LatLngExpression } from "leaflet";

export interface MapConfig {
    coordinate: LatLngExpression;
    zoomLevel: number;
    tileLayerURL: string;
    containerID: string;
};

const config: MapConfig = {
    coordinate: [25.0330, 121.5654],
    zoomLevel: 15,
    tileLayerURL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    containerID: 'Map',
};

export default config;