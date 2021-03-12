import { LatLngExpression } from "leaflet";

declare namespace BusData {
    type StopID = number;

    interface Stop {
        id: StopID;
        latLng: LatLngExpression;
        nameEn: string;
        nameZh: string;
    };

    interface StopSource {
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

    interface RouteSource {
        Authority: string;
        Direction: number;
        Geohash: string;
        InfoDate: string;
        LocationCityCode: string;
        OpreatorNo: number;
        PositionLat: number;
        PositionLon: number;
        SrcUpdateTime: string;
        StationID: number;
        StationNameID: string | null;
        StationUID: string;
        StopBoarding: number;
        StopID: StopID;
        StopNameEn: string;
        StopNameZh: string;
        StopSequence: number;
        StopUID: string;
        SubrouteUID: string;
        TownID: number;
        TownName: string;
        UpdateTime: string;
        VersionID: number;
    };

    interface RouteFilter {
        direction: number;
        stopID: StopID;
        stopSequence: number;
    };

    interface RoutesFilter {
        [routeID: string]: RouteFilter[];
    };

    interface RouteInfo {
        outbound: StopID[] | null;
        returnTrip: StopID[] | null;
        cycle: StopID[] | null;
    };

    interface Routes {
        [routeID: string]: RouteInfo;
    };

    interface ClassifyBusRoute {
        stopID: StopID;
        stopSequence: number;
    };
};
