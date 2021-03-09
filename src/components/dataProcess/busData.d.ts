import { LatLngExpression } from "leaflet";

type StopID = number;

declare interface Stop {
    id: StopID;
    latLng: LatLngExpression;
    nameEn: string;
    nameZh: string;
};

declare interface StopSource {
    stopID: StopID;
    routeID: number;
    address: string;
    goBack: string;
    latitude: string;
    longitude: string;
    nameEn: string;
    nameZh: string;
    pgp: string;
    seqNo: number;
    showLat: string;
    showLon: string;
    stopLocationId: number;
    vector: string;
};
