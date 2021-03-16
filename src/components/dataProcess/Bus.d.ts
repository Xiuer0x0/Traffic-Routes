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
    };

    type StopID = number;

    interface Stop {
        id: StopID;
        latLng: LatLngExpression;
        nameEn: string;
        nameZh: string;
    };

    interface PathSequence {
        stopID: StopID;
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

    interface Paths {
        [routeID: string]: PathDirection;
    };
};
