import _ from 'lodash';
import { Bus } from './dataProcess/Bus';

type RouteItemOnclick = (event: HTMLElementEventMap['click']) => void;

export default class RouteSearch {
    private $wrap: HTMLDivElement;
    private $searchInput: HTMLInputElement;
    private $filterList: HTMLUListElement;
    
    private constructor(
        private readonly $container: HTMLElement,
        private readonly source: Bus.Route[],
    ) {
        this.$wrap = this.createWrapper();
        this.$searchInput = this.createSearchInput();
        this.$filterList = this.createFilterList();
        this.drawUI();
    }

    static create($container: HTMLElement, source: Bus.Route[]) {
        return new RouteSearch($container, [...source]);
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

            this.upgradeRouteList(this.$filterList, this.source, value);
        });

        return $input;
    }

    private createFilterList(): HTMLUListElement {
        const $ul = document.createElement('ul');

        $ul.id = 'FilterList';
        $ul.className = 'filter-list';

        return $ul;
    }

    private upgradeRouteList($filterList: HTMLUListElement, source: Bus.Route[], keyword: string = '') {
        if (keyword === '') {
            $filterList.innerHTML = '';
            return false;
        }
    
        const filterData = this.filterRouteData(source, keyword);
    
        $filterList.innerText = '';
        this.appendToList($filterList, filterData);
    }

    private filterRouteData(source: Bus.Route[], keyword: string): Bus.Route[] {
        const filterData = source.filter((value) => {
            const pathName = value.pathName.zhTW;
    
            if (pathName) {
                return pathName.indexOf(keyword) >= 0;
            }
        });
    
        return filterData;
    }

    private appendToList($ul: HTMLUListElement, routes: Bus.Route[]) {
        routes.forEach((obj) => {
            const $li = this.createRouteItem(obj);
    
            if ($li) {
                $ul.appendChild($li);
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
        $li.dataset.UID = UID;
    
        return $li;
    }

    bindRouteItemOnclick(callback: RouteItemOnclick = () => {}) {
        this.$filterList.addEventListener('click', (e) => {
            const target = e.target as HTMLDivElement;

            if (target.className === 'route-item') {
                callback(e);
            }
        });
    }
}