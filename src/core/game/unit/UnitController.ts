namespace jy {

    /**
     * 场景单位域的类型
     * 
     * @export
     * @enum {number}
     */
    export const enum UnitDomainType {
        /**
         * 所有单位
         */
        All = 0,
        /**
         * 角色
         */
        Role = 1,
        /**
         * 怪物
         */
        Monster = 2
    }

    export type UnitDomain = $UnitDomain<Unit>;
    export type $UnitDomain<T extends Unit> = { [guid: string]: T };
	/**
	 * 单位管理器
	 * @author 3tion
	 *
	 */
    export class UnitController<T extends Unit> {

        /**
         * 按类型存放的域
         * 
         * @protected
         * @type {{ [unitDomainType: number]: $UnitDomain<T> }}
         */
        protected _domains: { [unitDomainType: number]: $UnitDomain<T> };


        /**
         * 用于存放单位数量的字典
         * 
         * @protected
         * @type {{ [unitDomainType: number]: number }}
         */
        protected _domainCounts: { [unitDomainType: number]: number };

        /**
         * 所有单位存放的域
         * 
         * @protected
         * @type {UnitDomain}
         */
        protected _domainAll: $UnitDomain<T>;

        constructor() {
            this._domains = {};
            this._domainCounts = {};
            this._domains[UnitDomainType.All] = this._domainAll = {};
            this._domainCounts[UnitDomainType.All] = 0;
        }

        /**
         * 注册一个单位
         * @param unit
         * @param domains
         *
         */
        public registerUnit(unit: T, ...domains)
        public registerUnit() {
            let args = arguments;
            let unit: T = args[0];
            let guid = unit.guid;
            const { _domains, _domainCounts, _domainAll } = this;
            for (let i = 1; i < args.length; i++) {
                let domain = args[i];
                let dom = _domains[domain];
                let count = ~~_domainCounts[domain];
                if (!dom) {
                    dom = {};
                    _domains[domain] = dom;
                }
                if (!dom[guid]) {//之前没有单位
                    _domainCounts[domain] = count + 1;
                }
                dom[guid] = unit;
            }
            if (!_domainAll[guid]) {
                let count = ~~_domainCounts[UnitDomainType.All];
                _domainCounts[UnitDomainType.All] = count + 1;
            }
            _domainAll[guid] = unit;
        }

		/**
		 * 移除单位
		 * @param guid
		 * @return
		 *
		 */
        public removeUnit(guid: Key): T {
            let unit = this._domainAll[guid];
            if (unit) {
                let { _domainCounts, _domains } = this;
                for (let key in _domains) {
                    let domain = _domains[key];
                    let tunit = domain[guid];
                    if (tunit) {
                        _domainCounts[key]--;
                        delete domain[guid];
                    }
                }
            }
            return unit;
        }

        /**
         * 
         * 获取指定域的单位集合
         * @param {number} domain 指定域
         * @returns 
         */
        public get(domain: number) {
            return this._domains[domain];
        }
        /**
         * 获取指定域的单位数量
         * @param domain
         * @return
         *
         */
        public getCount(domain: number) {
            return this._domainCounts[domain];
        }

        /**
         * 根据GUID获取JUnit
         * @param guid
         * @return
         *
         */
        public getUnit(guid: Key) {
            return this._domainAll[guid];
        }

        /**
         * 
         * 清理对象
         * @param {...Key[]} exceptGuids 需要保留的单位的GUID列表
         */
        clear(...exceptGuids: Key[])
        clear() {
            let exceptGuids = {};
            let args = arguments;
            for (let i = 0; i < args.length; i++) {
                let guid = args[i];
                if (guid) {
                    exceptGuids[guid] = true;
                }
            }
            let gcList = Temp.SharedArray1;
            let i = 0;
            for (let guid in this._domainAll) {
                let aguid: any = guid;
                if (aguid == +aguid) {
                    aguid = +aguid;
                }
                if (!exceptGuids || !exceptGuids[guid]) {
                    gcList[i++] = guid;
                }
            }
            gcList.length = i;
            while (--i >= 0) {
                this.removeUnit(gcList[i]);
            }
            gcList.length = 0;
        }

        /**
         * 清理指定的域
         * @param {UnitDomainType[]} domains 
         */
        clearDomain(...domains: UnitDomainType[])
        clearDomain() {
            const { _domains, _domainCounts } = this;
            let gcList = Temp.SharedArray1;
            let j = 0;
            const domains = arguments as ArrayLike<UnitDomainType>;
            for (let i = 0; i < domains.length; i++) {
                let domain = domains[i];
                let dom = _domains[domain];
                if (dom) {
                    for (let guid in dom) {
                        gcList[j++] = guid;
                    }
                }
            }
            gcList.length = j;
            while (--j >= 0) {
                this.removeUnit(gcList[j]);
            }
            gcList.length = 0;
        }
    }
}
