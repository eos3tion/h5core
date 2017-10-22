module junyou {

    export interface DataUtilsType {
        /**
         * 获取一组坐标
         * 
         * @param {any[][]} data 
         * @param {Point[]} out 
         * @memberof DataUtilsType
         */
        getZuobiaos(data: any[][], out: Point[]);

        /**
         * 根据 [x,y] 这样的数组，获取点Point
         * 
         * @param {number[]} data 
         * @memberof DataUtilsType
         */
        getZuobiao(data: number[]): Point;

        /**
         * 
         * 解析配置为"x1""x2"....."x100"这样的属性  横向配置
         * @static
         * @param {object} from 被解析的配置数据
         * @param {object} xattr 最终会变成  xattr.x1=100  xattr.x2=123这样的数据
         * @param {boolean} [delOriginKey=true]  是否删除原始数据中的key
         * @param {RegExp} [xReg=/^x\d+$/] 测试用字段，必须经过 test成功，才会进行处理
         * @returns {number} 成功解析到的key的数量
         */
        parseXAttr(from: object, xattr: object, delOriginKey?: boolean, xReg?: RegExp): number
        /**
         * 
         * 解析配置为 pro1  provalue1   pro2  provalue2 ..... pro100 provalue100  这样的纵向配置属性的配置
         * @static
         * @param {Object} from 被解析的配置数据
         * @param {Object} xattr 最终会变成  xattr.x1=100  xattr.x2=123这样的数据
         * @param {string} errPrefix
         * @param {string} [keyPrefix="pro"]
         * @param {string} [valuePrefix="provalue"]
         * @param {boolean} [delOriginKey=true] 是否删除原始数据中的key
         * @returns {number} 成功解析到的key的数量
         */
        parseXAttr2(from: object, xattr: object, keyPrefix?: string, valuePrefix?: string, delOriginKey?: boolean): number
    }

    function getZuobiao(data: number[]): Point {
        return { x: data[0], y: data[1] };
    }
    DataUtils.getZuobiao = getZuobiao;
    DataUtils.getZuobiaos = function (data: any[][], out?: Point[]) {
        out = out || [];
        for (let i = 0; i < data.length; i++) {
            out.push(getZuobiao(data[i]));
        }
    }

    DataUtils.parseXAttr = function (from: object, xattr: object, delOriginKey = true, xReg = /^x\d+$/): number {
        var keyCount = 0;
        for (let key in from) {
            if (xReg.test(key)) {
                var value = +(from[key]);
                if (value > 0) {//只有大于0做处理
                    keyCount++;
                    xattr[key] = value;
                }
                if (delOriginKey) {
                    delete from[key];
                }
            }
        }
        return keyCount;
    }

    DataUtils.parseXAttr2 = function (from: object, xattr: object, keyPrefix = "pro", valuePrefix = "provalue", delOriginKey = true): number {
        var xReg: RegExp = new RegExp("^" + keyPrefix + "(\\d+)$");
        if (DEBUG) {
            var repeatedErr: string = "";
        }
        var keyCount = 0;
        for (let key in from) {
            var obj = xReg.exec(key);
            if (obj) {
                var idx = +(obj[1]) || 0;
                var valueKey: string = valuePrefix + idx;
                if (DEBUG) {
                    if (key in xattr) {
                        repeatedErr += key + " ";
                    }
                }
                var value = +(from[valueKey]);
                if (value > 0) {//只有大于0做处理
                    keyCount++;
                    xattr[from[key]] = value;
                }
                if (delOriginKey) {
                    delete from[key];
                    delete from[valueKey];
                }
            }
        }
        if (DEBUG) {
            if (repeatedErr) {
                ThrowError("有重复的属性值:" + repeatedErr);
            }
        }
        return keyCount;
    }
}
