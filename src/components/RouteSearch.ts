import _ from 'lodash';
import BusMapFacade from './BusMap';
import { Bus } from './dataProcess/Bus';
import BusData from './dataProcess/busData';
import { LinkedList } from './linkedList';

//#region Font Awesome
import fontawesome from '@fortawesome/fontawesome';
import { faSearch } from '@fortawesome/fontawesome-free-solid';
import { faTimesCircle } from '@fortawesome/fontawesome-free-regular';

fontawesome.library.add(faSearch, faTimesCircle);
//#endregion

type Direction = keyof Bus.PathDirection;

export default class RouteSearch {
    public $wrap: HTMLDivElement;
    public $searchInput: HTMLDivElement;
    public $filterList: HTMLUListElement;

    private $container: HTMLElement | null = null;
    private directionWrapperClassName = 'direction-wrapper';

    private constructor(
        private readonly $map: BusMapFacade,
        private readonly busData: Bus.Data,
    ) {
        this.$wrap = this.createWrapper();
        this.$searchInput = this.createSearchInput();
        this.$filterList = this.createFilterList();
    }

    public static async create($map: BusMapFacade, busData?: Bus.Data) {
        const source = busData || await BusData.initialize();

        return new RouteSearch($map, source);
    }

    /**
     * ```html
     *  <div class="input-wrapper">
     *      <input type="text" id="SearchInput">
     *      <ul id="FilterList" class="filter-list"></ul>
     *  </div>
     * ```
     */
    public drawTo($container: HTMLElement) {
        this.$container = $container;

        this.$wrap.innerText = '';
        this.$wrap.appendChild(this.$searchInput);
        this.$wrap.appendChild(this.$filterList);
        this.upgradeRouteList();

        this.$container.appendChild(this.$wrap);
    }

    private createWrapper(): HTMLDivElement {
        const $div = document.createElement('div');

        $div.className = 'route-search';

        return $div;
    }

    /**
     * ```html
     *  <div class="search-input-wrapper">
     *      <span class="icon-search">
     *          <i class="fas fa-search"></i>
     *      </span>
     *      <input id="SearchInput" class="search-input" type="text">
     *      <span class="btn-clear">
     *          <i class="far fa-times-circle"></i>
     *      </span>
     *  </div>
     * ```
     */
    private createSearchInput(): HTMLDivElement {
        const $inputWrapper = document.createElement('div');
        const $input = document.createElement('input');
        const $searchIcon = document.createElement('span');
        const $clearBtn = document.createElement('span');

        //#region $input
        $input.id = 'SearchInput';
        $input.className = 'search-input';
        $input.type = 'text';
        $input.placeholder = '搜尋公車路線';
        $input.addEventListener('keyup', (e) => {
            const value = $input.value;

            this.upgradeRouteList(value);

            (value)
                ? $clearBtn.classList.remove('hide')
                : $clearBtn.classList.add('hide');
        });
        //#endregion

        //#region $clear
        $clearBtn.className = 'btn-clear hide';
        $clearBtn.innerHTML = '<i class="far fa-times-circle"></i>';
        $clearBtn.addEventListener('click', (e) => {
            $input.value = '';
            this.upgradeRouteList();
            $clearBtn.classList.add('hide');
        });
        //#endregion

        //#region $searchIcon
        $searchIcon.className = 'icon-search';
        $searchIcon.innerHTML = '<i class="fas fa-search"></i>';
        //#endregion

        //#region $inputWrapper
        $inputWrapper.className = 'search-input-wrapper';
        $inputWrapper.appendChild($searchIcon);
        $inputWrapper.appendChild($input);
        $inputWrapper.appendChild($clearBtn);
        //#endregion

        return $inputWrapper;
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

    /**
     * ```html
     *  <ul id="FilterList" class="filter-list">
     *      <li class="reoute-item"></li>
     *      ...
     *  </ul>
     * ```
     */
    private appendToFilterList(routes: Bus.Route[]) {
        const $fragment = document.createDocumentFragment();

        routes.forEach((obj) => {
            const $li = this.createRouteItem(obj);

            if ($li) {
                $fragment.appendChild($li);
            }
        });

        this.$filterList.appendChild($fragment);
    }

    /**
     * 點擊 `route-item` 才產生 `direction-wrapper`
     * ```html 
     *  <li class="route-item">
     *      <label class="route-name">路線名稱</label>
     *      <div class="direction-wrapper"></div>
     *  </li>
     * ```
     */
    private createRouteItem(data: Bus.Route): HTMLLIElement | null {
        const { UID, pathName } = data;

        if (pathName.zhTW === undefined) {
            return null;
        }

        const $routeName = document.createElement('label');

        $routeName.innerText = pathName.zhTW;
        $routeName.className = 'route-name';

        const $li = document.createElement('li');

        $li.appendChild($routeName);
        $li.className = 'route-item';
        $li.addEventListener('click', (e) => {
            const path = this.busData.getPath(UID);

            if (path && $li.querySelector(`.${this.directionWrapperClassName}`) === null) {
                this.clearAllPathDirection();

                const $pathDirection = this.createPathDirection(path);

                $li.appendChild($pathDirection);
            }
        });

        return $li;
    }

    private clearAllPathDirection() {
        const $directionWrapper = this.$filterList.querySelectorAll(`.${this.directionWrapperClassName}`);

        $directionWrapper.forEach(($el) => {
            $el.remove();
        });
    }

    /**
     * ```html
     *  <div class="direction-wrapper">
     *      <span class="direction">{行徑方向}</span>
     *      ...
     *  </div>
     * ```
     */
    private createPathDirection(path: Bus.PathDirection): HTMLDivElement {
        enum direction {
            outbound = '去程',
            returnTrip = '回程',
            cycle = '循環',
        };

        const $directionWrapper = document.createElement('div');

        $directionWrapper.className = this.directionWrapperClassName;

        _.mapKeys(path, (value, key) => {
            const keyword = key as Direction;
            const currentDirection = direction[keyword];
            const pathSequenceInfo = path[keyword];

            if (value && currentDirection && pathSequenceInfo) {
                const $direction = this.createPathDirectionTag(currentDirection, pathSequenceInfo);

                $directionWrapper.appendChild($direction);
            }
        });

        return $directionWrapper;
    }

    /**
     * ```html
     *  <span class="direction">{行徑方向}</span>
     * ```
     */
    private createPathDirectionTag(text: string, pathSequenceInfo: Bus.PathSequenceInfo): HTMLSpanElement {
        const directionName = this.getPathDirectionName(pathSequenceInfo);
        const $span = document.createElement('span');

        $span.className = 'direction';
        $span.innerText = (directionName ? `${text}： ${directionName}` : text);
        $span.addEventListener('click', (e) => {
            this.pathDirectionTagActive(e.target as HTMLSpanElement);
            this.drawPathToMap(pathSequenceInfo.stopSequence);
            e.stopPropagation();
        });

        return $span;
    }

    private pathDirectionTagActive($el: HTMLSpanElement) {
        $el.parentNode?.querySelectorAll('.active').forEach(($item) => {
            $item.classList.remove('active');
        });

        $el.classList.add('active');
    }

    private getPathDirectionName(pathSequenceInfo: Bus.PathSequenceInfo): string | null {
        const { departure, destination } = pathSequenceInfo;

        return (departure.zhTW && destination.zhTW)
            ? `${departure.zhTW} → ${destination.zhTW}`
            : null;
    }

    private drawPathToMap(path: LinkedList<Bus.PathSequence>) {
        const pathArray = path.toArray();
        let stops: Bus.Stop[] = [];

        pathArray.forEach((values) => {
            const { stopUID } = values;
            const stopInfo = this.busData.getStop(stopUID);

            if (stopInfo) {
                stops = [...stops, stopInfo];
            }
        });

        this.$map.drawPath(stops);
    }
}