import _ from 'lodash';
import BusMapFacade from './components/BusMap';
import { Bus } from './components/dataProcess/Bus';
import BusData from './components/dataProcess/busData';
import { LinkedListNode } from './components/linkedList';
import RouteSearch from './components/RouteSearch';

import './style/style.scss';

const map = new BusMapFacade();
const busData = BusData.initialize();

busData.then((source) => {
    const { stops, routes, paths } = source;
    const $mapWrapper = <HTMLDivElement | null>(document.querySelector('.map-wrapper'));

    if ($mapWrapper) {
        const $routeSearch = RouteSearch.create($mapWrapper, routes);

        $routeSearch.bindRouteItemOnclick((e) => {
            const target = e.target as HTMLDivElement;
            const UID = target.dataset.UID;

            if (UID === undefined) {
                return false;
            }

            const path = findPath(paths, UID);
            console.log(`Route ${target.innerText} ${UID}`, path);

            if (path === null || path.outbound === null) {
                return false;
            }

            const stops = getStopOfPath(source, path.outbound.head)

            map.drawPath(stops);
        });
    }
});

function findPath(paths: Bus.Path[], UID: string): Bus.Path | null {
    const path = _.find(paths, (obj) => { return obj.UID === UID });

    return path || null;
}

function getStopOfPath(busData: Bus.Data, path: LinkedListNode<Bus.PathSequence> | null): Bus.Stop[] {
    let currentStop: LinkedListNode<Bus.PathSequence> | null = path;
    let stops: Bus.Stop[] = [];

    while (currentStop) {
        const stopInfo = busData.getStop(currentStop.value.stopUID);

        if (stopInfo) {
            stops = [...stops, stopInfo];
        }

        currentStop = currentStop.next;
    }

    return stops;
}