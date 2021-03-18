import { LatLngExpression } from "leaflet";
import { LinkedList } from "../linkedList";

declare namespace Bus {
    namespace Source {
        /** GetStop.json */
        interface Stop {
            /** 站牌代碼 */
            Id: number;
            /** 所屬路線代碼 (主路線 ID) */
            routeId: number;
            /** 地址 */
            address: string;
            /** 去返程 （0：去程 / 1：返程 / 2：未知） */
            goBack: string;
            /** 緯度 */
            latitude: string;
            /** 經度 */
            longitude: string;
            /** 英文名稱 */
            nameEn: string;
            /** 中文名稱 */
            nameZh: string;
            /** 上下車站別 （-1：可下車、0：可上下車、1：可上車） */
            pgp: string;
            /** 於路線上的順序 */
            seqNo: number;
            /** 顯示用緯度 */
            showLat: string;
            /** 顯示用經度 */
            showLon: string;
            /** 站位 ID */
            stopLocationId: number;
            /** 向量角：0~359，預設為空白 */
            vector: string;
        };

        /** RoadMap.csv */
        interface RoadMap {
            /** 所屬業管機關 */
            Authority: string;
            /** 去返程 [0: 去程; 1: 返程; 2: 迴圈; 255: 未知] */
            Direction: number;
            /** 地理識別碼 */
            Geohash: string;
            /** 資料代表日期(yyyy-MM-dd) */
            InfoDate: string;
            /** 站牌位置縣市之代碼 */
            LocationCityCode: string;
            /** 營運業者編號 */
            OpreatorNo: number;
            /** 位置緯度(WGS84) */
            PositionLat: number;
            /** 位置緯度(WGS84) */
            PositionLon: number;
            /** 來源端平台資料更新時間(yyyy-MM-dd HH:mm:ss) */
            SrcUpdateTime: string;
            /** 站牌所屬的站位代碼 */
            StationID: number;
            /** 站牌所屬的站名碼 */
            StationNameID: string | null;
            /** 站牌所屬的站位唯一代碼 */
            StationUID: string;
            /** 上下車站別 [0: 可上下車; 1: 可上車; -1: 可下車] */
            StopBoarding: number;
            /** 地區既用中之站牌代碼 */
            StopID: number;
            /** 站牌中文名稱 */
            StopNameEn: string;
            /** 站牌中文名稱 */
            StopNameZh: string;
            /** 路線經過站牌之順序 */
            StopSequence: number;
            /** 站牌唯一識別代碼 */
            StopUID: string;
            /** 附屬路線唯一識別代碼 */
            SubrouteUID: string;
            /** 市區鄉鎮代碼 */
            TownID: number;
            /** 市區鄉鎮名稱 */
            TownName: string;
            /** 本平台資料更新時間(yyyy-MM-dd HH:mm:ss) */
            UpdateTime: string;
            /** 資料版本編號 */
            VersionID: number;
        };

        /** GetRoute.json */
        interface Route {
            /** 路線代碼 */
            Id: number;
            /** 業者代碼 */
            providerId: number;
            /** 業者中文名稱 */
            providerName: string;
            /** 中文名稱 */
            nameZh: string;
            /** 英文名稱 */
            nameEn: string;
            /** 路線別名 */
            aliasName: string;
            /** 所屬附屬路線 ID */
            pathAttributeId: number;
            /** 所屬附屬路線中文名稱 */
            pathAttributeName: string;
            /** 所屬附屬路線英文名稱 */
            pathAttributeEname: string;
            /** 建制時間，分為 1：1 期、2：2 期、3：3 期、9：非動態資料、10：北縣 */
            buildPeriod: string;
            /** '去程第 1 站' 起站中文名稱 */
            departureZh: string;
            /** '去程第 1 站' 起站英文名稱 */
            departureEn: string;
            /** 回程第 1 站' 訖站中文名稱 */
            destinationZh: string;
            /** 回程第 1 站' 訖站英文名稱 */
            destinationEn: string;
            /** 核定總班次 */
            realSequence: string;
            /** 總往返里程(公里/全程) */
            distance: string;
            /** 站牌顯示時使用，去程第一班發車時間(hhmm) */
            goFirstBusTime: string;
            /** 站牌顯示時使用，回程第一班發車時間(hhmm) */
            backFirstBusTime: string;
            /** 站牌顯示時使用，去程最後一班發車時間(hhmm) */
            goLastBusTime: string;
            /** 站牌顯示時使用，回程最後一班發車時間(hhmm) */
            backLastBusTime: string;
            /** 平日頭末班描述 */
            busTimeDesc: string;
            /** 站牌顯示時使用，尖峰時段發車間隔(hhmm OR mm) */
            peakHeadway: string;
            /** 站牌顯示時使用，離峰時段發車間隔(hhmm OR mm) */
            offPeakHeadway: string;
            /** 平日發車間距描述 */
            headwayDesc: string;
            /** 假日站牌顯示時使用，去程第一班發車時間(HHmm) */
            holidayGoFirstBusTime: string;
            /** 假日站牌顯示時使用，回程第一班發車時間(HHmm) */
            holidayBackFirstBusTime: string;
            /** 假日站牌顯示時使用，去程最後一班發車時間(HHmm) */
            holidayGoLastBusTime: string;
            /** 假日站牌顯示時使用，回程最後一班發車時間(HHmm) */
            holidayBackLastBusTime: string;
            /** 假日頭末班描述 */
            holidayBusTimeDesc: string;
            /** 假日站牌顯示時使用，尖峰時段發車間隔(mmmm OR mm) */
            holidayPeakHeadway: string;
            /** 假日站牌顯示時使用，離峰時段發車間隔(mmmm OR mm) */
            holidayOffPeakHeadway: string;
            /** 假日發車間距描述 */
            holidayHeadwayDesc: string;
            /** 分段緩衝區(中文) */
            segmentBufferZh: string;
            /** 分段緩衝區(英文) */
            segmentBufferEn: string;
            /** 票價描述(中文) */
            ticketPriceDescriptionZh: string;
            /** 票價描述(英文) */
            ticketPriceDescriptionEn: string;
            /** 路線簡圖 URL */
            roadMapUrl: string;
        };
    };

    type CityCode = string;
    type StopUID = string;

    interface DataIndex {
        UID: string;
    };

    interface Stop extends DataIndex {
        latLng: LatLngExpression;
        name: i18n;
        routeUIDs: string[];
    };

    interface FilterStopSource {
        [stopID: string]: Bus.Stop;
    };

    interface PathSequence {
        stopUID: StopUID;
        stopSequence: number;
    };

    interface PathFilter extends PathSequence {
        direction: number;
    };

    interface FilterPathSource {
        [routeID: string]: PathFilter[];
    };

    interface PathDirection {
        outbound: LinkedList<PathSequence> | null;
        returnTrip: LinkedList<PathSequence> | null;
        cycle: LinkedList<PathSequence> | null;
    };

    interface Path extends DataIndex, PathDirection {
    };

    interface Paths {
        [routeID: string]: PathDirection;
    };

    interface Route extends DataIndex {
        pathID: number;
        pathName: i18n;
        providerID: number;
        providerName: string;
        departure: i18n;
        destination: i18n;
        goFirstBusTime: string;
        backFirstBusTime: string;
        goLastBusTime: string;
        backLastBusTime: string;
        roadMapURL: string;
    };

    interface DataSource {
        stops: Stop[];
        routes: Route[];
        paths: Path[];
    };

    interface Data {
        readonly stops: Stop[];
        readonly routes: Route[];
        readonly paths: Path[];

        initialize(): Promise;
        getStop(stopUID: string): Stop | null;
        getRoute(routeUID: string): Route | null;
        getPath(pathUID: string): Path | null;
    };
};
