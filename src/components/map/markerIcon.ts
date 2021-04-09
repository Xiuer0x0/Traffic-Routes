/**
 * Reference [leaflet-color-markers](https://github.com/pointhi/leaflet-color-markers)
 */

import L from 'leaflet';
import _ from 'lodash';

type Color = 'blue' | 'gold' | 'red' | 'green' | 'orange' | 'yellow' | 'violet' | 'grey' | 'black';

type MarkerIconOptions = {
    [color in Color]: L.IconOptions;
};;;

const normalOptions: L.BaseIconOptions = {
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
};

function getIconUrl(color: Color) {
    return `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`
}

function genericMarkerIcon() {
    const colorList: Color[] = ['blue', 'gold', 'red', 'green', 'orange', 'yellow', 'violet', 'grey', 'black'];
    let icons = {} as MarkerIconOptions;

    _.map(colorList, (value) => {
        const newColor: L.IconOptions = {
            iconUrl: getIconUrl(value),
            ...normalOptions,
        };

        icons = {
            ...icons,
            [value]: newColor,
        };
    });

    return icons;
}

const markerIcon: MarkerIconOptions = genericMarkerIcon();

export default markerIcon;
