module junyou {
    import Point = egret.Point;
    /**
     * 按标准  x坐标(整数类型):y坐标(整数类型)|x坐标(整数类型):y坐标(整数类型)|x坐标(整数类型):y坐标(整数类型)... 转换成坐标点集
     * @param data
     * @param outVector		用来装载点集的数组
     * @param errorMsg		如果有错误的报错信息
     *
     */
    export const GDataParseUtils = {
        convertZuobiaoList: function (data: string, outVector: Point[]): void {
            if (data) {
                if (DEBUG) {
                    var error = false;
                }
                for (let zuobiao of data.split("|")) {
                    var zuobiaoList: any[] = zuobiao.split(":");
                    if (zuobiaoList.length == 2) {
                        var x = zuobiaoList[0];
                        var y = zuobiaoList[1];
                        if (DEBUG) {
                            if (+x != x || +y != y) {
                                error = true;
                            }
                        }
                        outVector.push(new Point(+x, +y));
                    }
                    else if (DEBUG) {
                        error = true;
                    }
                }
                if (DEBUG) {
                    if (error) {
                        ThrowError("格式不符合 x坐标(整数类型):y坐标(整数类型)|x坐标(整数类型):y坐标(整数类型)|x坐标(整数类型):y坐标(整数类型)");
                    }
                }
            }
        },

        /**
         * 
         * 解析配置为"x1""x2"....."x100"这样的属性  横向配置
         * @static
         * @param {Object} from 被解析的配置数据
         * @param {Object} xattr 最终会变成  xattr.x1=100  xattr.x2=123这样的数据
         * @param {boolean} [delOriginKey=true]  是否删除原始数据中的key
         * @returns {number}
         */
        parseAttribute: function (from: Object, xattr: Object, delOriginKey = true, xReg = /^x\d+$/): number {
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
        },

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
         * @returns {number}
         */
        parseAttribute1: function (from: Object, xattr: Object, keyPrefix = "pro", valuePrefix = "provalue", delOriginKey = true): number {
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
        },
    }
}
