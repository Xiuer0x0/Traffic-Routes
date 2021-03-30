import _ from 'lodash';
import BusMapFacade from './BusMap';
import { Bus } from './dataProcess/Bus';
import BusData from './dataProcess/busData';

export default class RouteSearch {
    public $wrap: HTMLDivElement;
    public $searchInput: HTMLInputElement;
    public $filterList: HTMLUListElement;

    private constructor(
        private readonly $container: HTMLElement,
        private readonly $map: BusMapFacade,
        private readonly busData: Bus.Data,
    ) {
        this.$wrap = this.createWrapper();
        this.$searchInput = this.createSearchInput();
        this.$filterList = this.createFilterList();
        this.drawUI();

        this.upgradeRouteList();
    }

    public static async create($container: HTMLElement, $map: BusMapFacade) {
        const busData = await BusData.initialize();

        return new RouteSearch($container, $map, busData);
    }

    private drawUI() {
        // <div class="input-wrapper">
        //     <input type="text" id="SearchInput">
        //     <ul id="FilterList" class="filter-list"></ul>
        // </div>

        this.$wrap.appendChild(this.$searchInput);
        this.$wrap.appendChild(this.$filterList);

        this.$container.appendChild(this.$wrap);
    }

    private createWrapper(): HTMLDivElement {
        const $div = document.createElement('div');

        $div.className = 'route-search';

        return $div;
    }

    private createSearchInput(): HTMLInputElement {
        const $input = document.createElement('input');

        $input.id = 'SearchInput';
        $input.className = 'search-input';
        $input.type = 'text';
        $input.addEventListener('keyup', (e) => {
            const value = $input.value;

            this.upgradeRouteList(value);
        });

        return $input;
    }

    private createFilterList(): HTMLUListElement {
        const $ul = document.createElement('ul');

        $ul.id = 'FilterList';
        $ul.className = 'filter-list';

        return $ul;
    }

    private upgradeRouteList(keyword: string = '') {
        this.$filterList.innerText = '';

        const filterData = (keyword === '')
            ? this.busData.routes
            : this.filterRouteData(keyword);

        this.appendToFilterList(filterData);
    }

    private filterRouteData(keyword: string): Bus.Route[] {
        const { routes } = this.busData;
        const filterData = routes.filter((value) => {
            const pathName = value.pathName.zhTW;

            if (pathName) {
                return pathName.indexOf(keyword) >= 0;
            }
        });

        return filterData;
    }

    private appendToFilterList(routes: Bus.Route[]) {
        routes.forEach((obj) => {
            const $li = this.createRouteItem(obj);

            if ($li) {
                this.$filterList.appendChild($li);
            }
        });
    }

    private createRouteItem(data: Bus.Route): HTMLLIElement | null {
        const { UID, pathName } = data;

        if (pathName.zhTW === undefined) {
            return null;
        }

        const $li = document.createElement('li');

        $li.innerText = pathName.zhTW;
        $li.className = 'route-item';
        $li.addEventListener('click', () => {
            const path = this.busData.getPath(UID);
            const pathArray = path?.outbound?.toArray();
            let stops: Bus.Stop[] = [];

            pathArray?.forEach((values) => {
                const { stopUID } = values;
                const stopInfo = this.busData.getStop(stopUID);

                if (stopInfo) {
                    stops = [...stops, stopInfo];
                }
            });

            this.$map.drawPath(stops);
        });

        return $li;
    }
}