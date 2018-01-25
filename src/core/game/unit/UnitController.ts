module junyou {

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
            const { _domains, _domainCounts } = this;
            for (let i = 1; i < args.length; i++) {
                let domain = args[i];
                let dom = _domains[domain];
                if (!dom) {
                    dom = {};
                    _domains[domain] = dom;
                    _domainCounts[domain] = 0;
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
        public removeUnit(guid: Key): T {
            let unit = this._domainAll[guid];
            if (unit) {
                let { _domainCounts, _domains } = this;
                _domainCounts[UnitDomainType.All]--;
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
        public clear(...exceptGuids: Key[]): void {
            let gcList = Temp.SharedArray1;
            let i = 0;
            for (let guid in this._domainAll) {
                if (!exceptGuids || !~exceptGuids.indexOf(guid)) {
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
         * @param domains 
         */
        clearDomain(...domains) {
            const { _domains, _domainCounts } = this;
            let gcList = Temp.SharedArray1;
            let i = 0;
            for (let i = 1; i < domains.length; i++) {
                let domain = domains[i];
                let dom = _domains[domain];
                if (dom) {
                    for (let guid in dom) {
                        gcList[i++] = guid;
                    }
                }
            }
            gcList.length = i;
            while (--i >= 0) {
                this.removeUnit(gcList[i]);
            }
            gcList.length = 0;
        }
    }
}
