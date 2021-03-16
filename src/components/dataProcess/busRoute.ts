import _ from 'lodash';
import { Bus } from "./Bus";
import { fetchJSON } from "./fetch";

const sourceURL = '../../assets/data/GetRoute.json';

export default function fetchBusRoutes(url: string = sourceURL) {

    return fetchJSON(url)
        .then(response => response.BusInfo as Bus.Source.Route[])
        .then(dataSource => filterSource(dataSource));
}

function filterSource(data: Bus.Source.Route[]): Bus.Route[] {
    const routes = _.reduce(data, (result, values) => {
        const { 
            providerId,
            providerName,
            pathAttributeId,
            pathAttributeEname,
            pathAttributeName,
            departureEn,
            departureZh,
            destinationEn,
            destinationZh,
            goFirstBusTime,
            goLastBusTime,
            backFirstBusTime,
            backLastBusTime,
            roadMapUrl,
        } = values;

        const route: Bus.Route = {
            pathID: pathAttributeId,
            pathName: { 
                en: pathAttributeEname,
                zhTW: pathAttributeName,
            },
            providerID: providerId,
            providerName,
            departure: {
                en: departureEn,
                zhTW: departureZh,
            },
            destination: {
                en: destinationEn,
                zhTW: destinationZh,
            },
            goFirstBusTime,
            goLastBusTime,
            backFirstBusTime,
            backLastBusTime,
            roadMapURL: roadMapUrl,
        };

        result = [...result, route];

        return result;
    }, [] as Bus.Route[]);

    return routes;
}
