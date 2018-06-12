namespace jy {
    /**
     * 使用数值或者字符串类型作为Key
     * V 作为Value的字典
     * 原生的map(ECMAScript5无Map)无法自定义列表顺序，而是完全按照加载顺序的，所以才需要有此类型
     * 列表存储Value
     * @author 3tion
     * @class ArraySet
     * @template V
     */
    export class ArraySet<V>{
        private _list: V[];
        private _dict: { [index: string]: V };

        constructor() {
            this._list = [];
            this._dict = {};
        }

        /**
         * 获取原始列表，用于重新排序
         * 请不要直接进行 + - 值，使用set delete 方法进行处理
         * @readonly
         * 
         */
        public get rawList() {
            return this._list;
        }

        /**
         * 获取原始的字典
         * 请不要直接行 + - 值，使用set delete 方法进行处理
         * @readonly
         * 
         */
        public get rawDict(): { readonly [index: string]: V } {
            return this._dict;
        }

        /**
         * 设置原始字典
         * 
         * @param { [index: string]: V } dict
         * 
         */
        public setRawDict(dict: { [index: string]: V }) {
            this._dict = dict;
            let list = this._list;
            let i = 0;
            for (let key in dict) {
                list[i++] = dict[key];
            }
            list.length = i;
            return this;
        }

        /**
         * 
         * @param {V[]} list        要放入的数据
         * @param {keyof V} keyPro   索引的属性名称 
         * 
         * 下例是一个形式为：{id:number,name:string}[]的数组，进行设值的例子
         * @example
         * let rawList:{id:number,name:string}[] = [{id:1,name:"test1"},{id:2,name:"test2"},{id:3,name:"test3"}];
         * let set = new ArraySet<{id:number,name:string}>();
         * set.setRawList(rawList,"id"); //设值操作
         * 
         */
        public setRawList(list: V[], keyPro: keyof V) {
            let rawList = this._list;
            let dict = this._dict = {};
            let i = 0;
            if (list) {
                for (let len = list.length; i < len; i++) {
                    let item = list[i];
                    dict[<any>item[keyPro]] = item;
                    rawList[i] = item;
                }
            }
            rawList.length = i;
            return this;
        }

        /**
         * 
         * 设置数据
         * 
         * @param {Key} key
         * @param {V} value
         * @return {number} 返回值加入到数据中的索引
         */
        public set(key: Key, value: V) {
            const { _dict, _list } = this;
            let idx: number;
            let changed: boolean;
            if (key in _dict) {//有原始数据
                let old = _dict[key];
                idx = _list.indexOf(old);
                if (old != value) {
                    changed = true;
                }
            } else {
                idx = _list.length;
                changed = true;
            }
            if (changed) {
                _list[idx] = value;
                _dict[key] = value;
            }
            return idx;
        }

        /**
         * 获取数据
         * 
         * @param {Key} key
         * @returns
         * 
         */
        public get(key: Key) {
            return this._dict[key];
        }

        /**
         * 根据key移除数据
         * 
         * @param {Key} key
         * 
         */
        public delete(key: Key) {
            const { _dict, _list } = this;
            let old = _dict[key];
            delete _dict[key];
            if (old) {
                let idx = _list.indexOf(old);
                if (idx > -1) {
                    _list.splice(idx, 1);
                }
            }
            return old;
        }

        /**
         * 清理数据
         * 
         * 
         */
        public clear() {
            this._list.length = 0;
            this._dict = {};
        }

        /**
         * 获取总长度
         * 
         * @readonly
         * 
         */
        public get size() {
            return this._list.length;
        }
    }
}