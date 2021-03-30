import BusMapFacade from './components/BusMap';
import BusData from './components/dataProcess/busData';
import RouteSearch from './components/RouteSearch';

import './style/style.scss';

const $map = new BusMapFacade();
const busData = BusData.initialize();

busData.then((source) => {
    const { stops, routes, paths } = source;
    const $mapWrapper = <HTMLDivElement | null>(document.querySelector('.map-wrapper'));

    if ($mapWrapper) {
        RouteSearch.create($mapWrapper, $map);
    }
});