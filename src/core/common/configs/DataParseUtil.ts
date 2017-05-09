module junyou {

    /**
     *
     * @author 君游项目解析工具
     *
     */
    export const DataParseUtil = {

        /**
        * 将配置from中 type		data1	data2	data3	data4...这些配置，解析存储到<br/>
        * 配置VO为：
        * <pre>
        * class Cfg
        * {
        * 		public var type:int;
        * 		public var datas:Array;
        * }
        * </pre>
        * 上面示例中<br/>
        * typeKey 为 type<br/>
        * dataKey 为 data<br/>
        * checkStart 为 1<br/>
        * checkEnd 为 4<br/>
        * toDatasKey 为 data<br/>
        * to的type  datas数组中<br/>
        * @param to					要写入的配置
        * @param from				配置的数据源
        * @param checkStart		      数据源起始值	data<b><font color="#ff0000">1</font></b>
        * @param checkEnd		      数据源结束值	data<b><font color="#ff0000">4</font></b>
        * @param dataKey			数据源数值的前缀	<b><font color="#ff0000">data</font></b>
        * @param typeKey			数据源/配置的 类型 上例为 <b><font color="#ff0000">type</font></b>
        * @param toDatasKey		      配置的数值存储的数据的数组属性名，上例为 <b><font color="#ff0000">datas</font></b>
        *
        */
        parseDatas: function (to: Object, from: Object, checkStart: number, checkEnd: number, dataKey: string, typeKey: string, toDatasKey: string): void {
            var arr: any[];
            for (var i = checkStart; i <= checkEnd; i++) {
                var key: string = dataKey + i;
                if (key in from) {
                    if (!arr) {
                        arr = [];
                    }
                    arr[i] = from[key];
                }
            }
            if (!arr) {
                if (typeKey in from) {
                    arr = [];
                    to[typeKey] = from[typeKey];
                }
            }
            if (arr) {
                to[toDatasKey] = arr;
            }
        },

        /**
        * 将配置from中 type		data1	data2	data3	data4...这些配置，解析存储到<br/>
        * 配置VO为：
        * <pre>
        * class Cfg
        * {
        * 		public var type:int;
        * 		public var datas:Array;
        * }
        * </pre>
        * 上面示例中<br/>
        * typeKey 为 type<br/>
        * dataKey 为 data<br/>
        * checkStart 为 1<br/>
        * checkEnd 为 4<br/>
        * toDatasKey 为 data<br/>
        * to的type  datas数组中<br/>
        * @static
        * @param {*} to                要写入的配置
        * @param {any[]} valueList     配置的数据源的值列表
        * @param {string[]} keyList    配置数据的属性key列表
        * @param {number} checkStart   数据源起始值	data<b><font color="#ff0000">1</font></b>
        * @param {number} checkEnd     数据源结束值	data<b><font color="#ff0000">4</font></b>
        * @param {string} dataKey      数据源数值的前缀	<b><font color="#ff0000">data</font></b>
        * @param {string} typeKey      数据源/配置的 类型 上例为 <b><font color="#ff0000">type</font></b>
        * @param {string} toDatasKey   配置的数值存储的数据的数组属性名，上例为 <b><font color="#ff0000">datas</font></b>
        */
        parseDatas2: function (to: any, valueList: any[], keyList: string[], checkStart: number, checkEnd: number, dataKey: string, typeKey: string, toDatasKey: string): void {
            let arr: any[];
            for (var i = checkStart; i <= checkEnd; i++) {
                var key: string = dataKey + i;
                let idx = keyList.indexOf(key);
                if (~idx) {
                    if (!arr) {
                        arr = [];
                    }
                    arr[i] = valueList[idx];
                }
            }
            if (!arr) {
                // 数据中有列表值
                let idx = keyList.indexOf(typeKey);
                if (~idx) {
                    arr = [];
                    to[typeKey] = valueList[idx];
                }
            }
            if (arr) {
                to[toDatasKey] = arr;
            }
        },


        /**
         * 从数据集中获取key-value的数据
         * @param valueList 数据集合
         * @param keyList   属性列表
         */
        getData: function (valueList: any[], keyList: string[], o?: Object): any {
            o = o || {};
            for (let i = 0, len = keyList.length; i < len; i++) {
                let key = keyList[i];
                let v = valueList[i];
                if (v != undefined) {
                    o[key] = valueList[i];
                }
            }
            return o;
        },


        /**
         * 获取key-value的数据列表
         * @param dataList  数据集合
         * @param keyList   属性列表
         */
        getDataList: function (dataList: any[][], keyList: string[]): any[] {
            let list = [];
            if (dataList) {
                for (let i = 0, len = dataList.length; i < len; i++) {
                    let valueList = dataList[i];
                    list.push(this.getData(valueList, keyList));
                }
            }
            return list;
        },


        /**
         * 处理数据
         * @param dataList  数据集合
         * @param keyList   属性列表
         * @param forEach
         * @param thisObj
         * @param args
         */
        parseDataList: function (dataList: any[][], keyList: string[], forEach: { (t: Object, args: any[], idx?: number) }, thisObj: any, ...args) {
            if (dataList) {
                for (let i = 0, len = dataList.length; i < len; i++) {
                    let valueList = dataList[i];
                    let to = this.getData(valueList, keyList);
                    forEach.call(thisObj, to, args, i);
                }
            }
        },

        /**
         * 从数组中获取数据，主要针对配置
         * @param to            目标数据
         * @param valueList     值列表
         * @param keyList       属性列表
         */
        copyData: function <T>(to: T, valueList: any[], keyList: string[]) {
            for (let i = 0, len = keyList.length; i < len; i++) {
                let key = keyList[i];
                to[key] = valueList[i];
            }
        },



        /**
         * 设置数据集，将数据赋值，不会对creator类型中，没有setter的数据赋值
         * @param creator   构造器
         * @param dataList  数据集合
         * @param keyList   属性列表
         * @param forEach   
         * @param thisObj
         * @param args
         */
        copyDataList: function <T>(creator: { new (): T }, dataList: any[][], keyList: string[], forEach: { (t: T, args: any[], idx?: number) }, thisObj: any, ...args) {
            if (dataList) {
                for (let i = 0, len = dataList.length; i < len; i++) {
                    let valueList = dataList[i];
                    let to = new creator();
                    this.copyData(to, valueList, keyList);
                    forEach.call(thisObj, to, args, i);
                }
            }
        },

        // /**
        //  * 从H5ExcelTool生成的配置使用此方法解析
        //  * 
        //  * @static
        //  * @template T
        //  * @param {{ new (): T }} creator 配置实例的创建器
        //  * @param {any[][]} dataList 数据集
        //  * @param {{ (t: T, args: any?[], idx?: number):boolean }} [forEach] 如果返回false将不会继续后续的数据解析
        //  * @param {*} [thisObj] this指针
        //  * @param args 其他参数
        //  * @return true 没有数据，或者数据解析完成
        //  *         false forEach函数有返回false的时候，会跳出循环并返回false
        //  */
        // copyDataListForCfg: function <T extends Cfg>(creator: { new (): T }, dataList: any[][], forEach?: { (t: T, args?: any[], idx?: number): boolean }, thisObj?: any, args?: any[]) {
        //     if (dataList) {
        //         for (let i = 0, len = dataList.length; i < len; i++) {
        //             let valueList = dataList[i];
        //             let to = new creator();
        //             to.decode(valueList);
        //             if (forEach && !forEach.call(thisObj, to, args, i)) {
        //                 return false;
        //             }
        //         }
        //     }
        //     return true;
        // }

    }
}
