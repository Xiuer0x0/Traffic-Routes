import _ from 'lodash';
import { Bus } from "./Bus";
import { fetchJSON } from "./fetch";

export default function fetchBusRoutes(url: string, cityCode: Bus.CityCode) {

    return fetchJSON(url)
        .then(response => response.BusInfo as Bus.Source.Route[])
        .then(dataSource => filterSource(dataSource, cityCode));
}

function filterSource(data: Bus.Source.Route[], cityCode: Bus.CityCode): Bus.Route[] {
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
            UID: `${cityCode}${pathAttributeId}`,
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
