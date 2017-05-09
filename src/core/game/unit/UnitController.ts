module junyou {


    export interface UnitDomainConstructor {

        /**
         * 全部单位
         */
        DOMAIN_ALL: number;
        /**
         * 角色域
         */
        DOMAIN_ROLE: number;
        /**
         * 怪物域
         */
        DOMAIN_MONSTER: number;
    }

    /**
     * 单位的域
     */
    export var UnitDomain: UnitDomainConstructor = <UnitDomainConstructor>{};


    UnitDomain.DOMAIN_ALL = 0;
    UnitDomain.DOMAIN_ROLE = 1;
    UnitDomain.DOMAIN_MONSTER = 2;

	/**
	 * 单位管理器
	 * @author 
	 *
	 */
    export class UnitController {


        /**
         * Key     int  domain的名称<br/>
         * Value Object 一个字典 Key guid  value JUnit
         */
        protected _domains: Object;

		/**
		 * Key 		int domain的名称<br/>
		 * Value 	int 这个域的单位数量
		 */
        protected _domainCounts: Object;

        protected _domainAll: Object;

        public static instance = new UnitController();

        constructor() {
            this._domains = {};
            this._domainCounts = {};
            this._domainAll = {};
            this._domains[UnitDomain.DOMAIN_ALL] = this._domainAll;
            this._domainCounts[UnitDomain.DOMAIN_ALL] = 0;
        }

        /**
         * 注册一个单位
         * @param unit
         * @param domains
         *
         */
        public registerUnit(unit: Unit, ...domains): void {
            var guid: string | number = unit.guid;
            for (var domain of domains) {
                var dom: Object = this._domains[domain];
                if (!dom) {
                    dom = {};
                    this._domains[domain] = dom;
                    this._domainCounts[domain] = 0;
                }
                dom[guid] = unit;
            }
            this._domainAll[guid] = unit;
        }

		/**
		 * 移除单位
		 * @param guid
		 * @return
		 *
		 */
        public removeUnit(guid: number | string): Unit {
            var unit: Unit = this._domainAll[guid];
            if (unit) {
                var tunit: Unit;
                var _domainCounts = this._domainCounts;
                var _domains = this._domains;
                _domainCounts[UnitDomain.DOMAIN_ALL]--;
                for (var key in this._domains) {
                    var domain: Object = _domains[key];
                    tunit = domain[guid];
                    if (tunit) {
                        _domainCounts[key]--;
                        delete domain[guid];
                    }
                }
            }
            return unit;
        }
        /**
		 * 获取指定域的单位集合
		 * @param domain	指定域
		 * @return
		 *
		 */
        public getDomainUnits(domain: number): Object {
            return this._domains[domain];
        }
        /**
         * 获取指定域的单位数量
         * @param domain
         * @return
         *
         */
        public getDomainUnitCount(domain: number): number {
            return this._domainCounts[domain];
        }

        /**
         * 根据GUID获取JUnit
         * @param guid
         * @return
         *
         */
        public getUnit(guid: number | string): Unit {
            return this._domainAll[guid];
        }

		/**
		 * 清理对象
		 * @param exceptGuids	需要保留的单位的GUID列表
		 *
		 */
        public clear(exceptGuids?: Array<number | string>): void {
            var gcList = Temp.SharedArray1;
            gcList.length = 0;
            var i = 0;
            for (var guid in this._domainAll) {
                if (!exceptGuids || !~exceptGuids.indexOf(guid)) {
                    gcList[i++] = guid;
                }
            }
            for (guid of gcList) {
                this.removeUnit(guid);
            }
            gcList.length = 0;
        }
    }
}
