namespace jy {


    export interface DataUtilsType {
        /**
         * 将配置from中 type		data1	data2	data3	data4...这些配置，解析存储到  
         * 配置VO为：
         * ```typescript
         * class Cfg {
         * 		type:int;
         * 		datas:any[];
         * }
         * ```
         * 上面示例中  
         * typeKey 为 `type`  
         * dataKey 为 `data`
         * checkStart 为 `1`  
         * checkEnd 为 `4`  
         * toDatasKey 为 `data`  
         * to的type  `datas数组中`
         * @param {object} to 要写入的配置
         * @param {object} from 配置的数据源
         * @param {number} checkStart 数据源起始值	data **`1`**
         * @param {number} checkEnd 数据源结束值	data **`4`**
         * @param {string} dataKey 数据源数值的前缀	**`data`**
          * @param {string} toDatasKey  配置的数值存储的数据的数组属性名，上例为 **`datas`**
         * @memberof DataUtilsType
         */
        parseDatas(to: object, from: object, checkStart: number, checkEnd: number, dataKey: string, toDatasKey: string): void;

        /**
         * 将配置from中 type		data1	data2	data3	data4...这些配置，解析存储到  
         * 配置VO为：
         * ```typescript
         * class Cfg {
         * 		type:int;
         * 		datas:any[];
         * }
         * ```
         * 上面示例中  
         * typeKey 为 `type`  
         * dataKey 为 `data`
         * checkStart 为 `1`  
         * checkEnd 为 `4`  
         * toDatasKey 为 `data`  
         * to的type  `datas数组中`
         * @param {*} to                要写入的配置
         * @param {any[]} valueList     配置的数据源的值列表
         * @param {string[]} keyList    配置数据的属性key列表
         * @param {number} checkStart 数据源起始值	data **`1`**
         * @param {number} checkEnd 数据源结束值	data **`4`**
         * @param {string} dataKey 数据源数值的前缀	**`data`**
         * @param {string} toDatasKey  配置的数值存储的数据的数组属性名，上例为 **`datas`**
         * @memberof DataUtilsType
         */
        parseDatas2(to: any, valueList: any[], keyList: string[], checkStart: number, checkEnd: number, dataKey: string, toDatasKey: string);
        /**
         * 从数据集中获取key-value的数据
         * 
         * @param {any[]} valueList 数据集合
         * @param {string[]} keyList 属性列表
         * @param {Object} [o] 
         * @returns {*} 
         * @memberof DataUtilsType
         */
        getData(valueList: any[], keyList: string[], o?: Object): any;
        /**
         * 从数据集中获取key-value的数据 的数组
         * 
         * @param {any[][]} dataList 数据集合
         * @param {string[]} keyList 属性列表
         * @returns {any[]} 
         * @memberof DataUtilsType
         */
        getDataList(dataList: any[][], keyList: string[]): any[];
        /**
         * 处理数据
         * 
         * @param {any[][]} dataList 数据集合
         * @param {string[]} keyList 属性列表
         * @param {(t: Object, args: any[], idx?: number) => any} forEach 处理器
         * @param {*} thisObj 
         * @param {...any[]} args 附加参数
         * @memberof DataUtilsType
         */
        parseDataList(dataList: any[][], keyList: string[], forEach: (t: Object, args: any[], idx?: number) => any, thisObj: any, ...args: any[]);
        /**
         * 将`valueList` 按 `keyList`向 `to` 拷贝数据
         * 
         * @template T 
         * @param {T} to 目标对象
         * @param {any[]} valueList 数据集
         * @param {(keyof T)[]} keyList 属性列表
         * @memberof DataUtilsType
         */
        copyData<T>(to: T, valueList: any[], keyList: (keyof T)[]);
        /**
         * 拷贝一组数据
         * 
         * @template T 
         * @param {Creator<T>} creator 
         * @param {any[][]} dataList 
         * @param {(keyof T)[]} keyList 
         * @param {(t: T, args: any[], idx?: number) => any} forEach 
         * @param {*} thisObj 
         * @param {...any[]} args 
         * @memberof DataUtilsType
         */
        copyDataList<T>(creator: Creator<T>, dataList: any[][], keyList: (keyof T)[], forEach: (t: T, args: any[], idx?: number) => any, thisObj: any, ...args: any[]);

    }

    function getData(valueList: any[], keyList: string[], o?: Object): any {
        o = o || {};
        for (let i = 0, len = keyList.length; i < len; i++) {
            let key = keyList[i];
            let v = valueList[i];
            if (v != undefined) {
                o[key] = valueList[i];
            }
        }
        return o;
    }

    function copyData<T>(to: T, valueList: any[], keyList: (keyof T)[]) {
        for (let i = 0, len = keyList.length; i < len; i++) {
            let key = keyList[i];
            to[key] = valueList[i];
        }
    }
    /**
     *
     * @author 君游项目解析工具
     *
     */
    export const DataUtils = {
        parseDatas(to: Object, from: Object, checkStart: number, checkEnd: number, dataKey: string, toDatasKey: string) {
            let arr: any[] = [];
            for (let i = checkStart, j = 0; i <= checkEnd; i++) {
                let key: string = dataKey + i;
                if (key in from) {
                    arr[j++] = from[key];
                }
            }
            to[toDatasKey] = arr;
        },
        parseDatas2(to: any, valueList: any[], keyList: string[], checkStart: number, checkEnd: number, dataKey: string, toDatasKey: string) {
            let arr: any[] = [];
            for (let i = checkStart, j = 0; i <= checkEnd; i++) {
                let key: string = dataKey + i;
                let idx = keyList.indexOf(key);
                if (~idx) {
                    arr[j++] = valueList[idx];
                }
            }
            to[toDatasKey] = arr;
        },
        getData,
        getDataList(dataList: any[][], keyList: string[]): any[] {
            let list = [];
            if (dataList) {
                for (let i = 0, len = dataList.length; i < len; i++) {
                    let valueList = dataList[i];
                    list.push(getData(valueList, keyList));
                }
            }
            return list;
        },
        parseDataList(dataList: any[][], keyList: string[], forEach: { (t: Object, args: any[], idx?: number) }, thisObj: any, ...args) {
            if (dataList) {
                for (let i = 0, len = dataList.length; i < len; i++) {
                    let valueList = dataList[i];
                    let to = getData(valueList, keyList);
                    forEach.call(thisObj, to, args, i);
                }
            }
        },
        copyData,
        copyDataList<T>(creator: { new(): T }, dataList: any[][], keyList: (keyof T)[], forEach: { (t: T, args: any[], idx?: number) }, thisObj: any, ...args) {
            if (dataList) {
                for (let i = 0, len = dataList.length; i < len; i++) {
                    let valueList = dataList[i];
                    let to = new creator();
                    copyData(to, valueList, keyList);
                    forEach.call(thisObj, to, args, i);
                }
            }
        },


    } as DataUtilsType;
}
