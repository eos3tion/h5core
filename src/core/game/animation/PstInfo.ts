/**
 * 资源打包信息
 * AS3的版本中实现了5种打包方式
 * H5中实现了2种（2 按动作打包，4 单方向单动作打包），不过后面只会使用4（单方向单动作）进行打包，其他方式弃用
 * @author 3tion
 */
module junyou {

    // /**
    //  * 打包类型
    //  */
    // const enum PakSaveType {
    //     // /**全部打包 (弃用)*/
    //     // PAK_ALL = 0,
    //     // /**1 按方向打包 (弃用)*/
    //     // PAK_BY_DIRECTION = 1,
    //     // /**2 按动作打包 (弃用)*/
    //     // PAK_BY_ACTION = 2,
    //     // /**3 混合打包 (弃用)*/
    //     // PAK_COMPLEX = 3,
    //     /**
    //      * 单方向单动作
    //      */
    //     PAK_ONE_A_D = 4
    // }

    // var parsers: { [index: number]: { new (key: string): SplitInfo } };

    // /**
    //  * 获取处理器
    //  */
    // function getParsers(t: number): { new (key: string): SplitInfo } {
    //     if (!parsers) {
    //         parsers = {};
    //         // 后续H5项目只使用PAK_ONE_A_D一种打包方式
    //         // 其他方式弃用
    //         // parsers[PakSaveType.PAK_BY_ACTION] = ActionSInfo;
    //         parsers[PakSaveType.PAK_ONE_A_D] = OneADSInfo;
    //     }
    //     return parsers[t];
    // }

    /**
     * 存储pst信息
     */
    export class PstInfo {
        /**
    	 * 图片数据字典<br/>
    	 * Key      string  存储图片数据的key <br/>
    	 * Value    UnitResource<br/>
    	 */
        protected _resources: { [index: string]: UnitResource } | UnitResource;

        /**
         * pst的唯一标识
         */
        public key: string;

        /**
         * 动作信息，帧的播放信息的数组  
         * Key      {number}        动作标识
         * Value    {ActionInfo}    动作信息
         */
        public frames: { [index: number]: ActionInfo };

        /**
         * 头顶显示的基准坐标Y，相对于角色的原点
         * 
         * @type {number}
         */
        public headY: number;

        /**
         * 受创点的基准坐标Y，相对于角色的原点
         * 
         * @type {number}
         */
        public hurtY: number;

        /**
         * 施法点
         * KEY      {number}        action << 8 | direction
         * VALUE    {egret.Point}   施法点坐标
         * @type {[index:string]:egret.Point}
         */
        protected castPoints: { [index: number]: egret.Point };


        /**
         * 获取施法点
         * @param {number} action 动作标识
         * @param {number} direction 方向
         * @return {egret.Point} 如果有施法点
         */
        public getCastPoint(action: number, direction: number) {
            if (this.castPoints) {
                let pt = this.castPoints[PstUtils.getADKey(action, direction)];
                if (pt) {
                    return pt;
                }
            }
            return;
        }

        public splitInfo: SplitInfo;

        constructor() {

        }

        public init(key: string, data: any[]) {
            this.key = key;
            this._resources = {};
            // let parserRef = getParsers(data[0]);
            // if (!parserRef) {
            //     return;
            // }
            // let parser = new parserRef(key);
            let parser = new OneADSInfo(key);
            //处理数据
            this.splitInfo = parser;
            parser.parseSplitInfo(data[1]);
            this.frames = parser.parseFrameData(data[2]);
            // extra [0] 头顶坐标Y number
            // extra [1] 受创点Y number
            // extra [2] 施法点 {[index:string]:Array<Array<number>(2)>(5)}
            let extra = data[3];
            if (extra) {
                this.headY = +extra[0];
                this.hurtY = +extra[1];
                let castInfo: { [index: number]: number[][] } = extra[2];
                if (castInfo) {
                    let castPoints: { [index: number]: egret.Point } = {};
                    this.castPoints = castPoints;
                    for (let a in castInfo) {
                        let aInfo = castInfo[a];
                        for (let d = 0; d < 8; d++) {
                            let pInfo: number[] = aInfo[d > 4 ? 8 - d : d];
                            if (pInfo) {
                                let pt: egret.Point = new egret.Point();
                                castPoints[PstUtils.getADKey(+a, d)] = pt;
                                pt.x = +pInfo[0];
                                pt.y = +pInfo[1];
                            }
                        }
                    }
                }
            }
        }


        /**
         * 解析图片数据
         * 用于批量处理数据
         */
        public decodeImageDatas(data: { [index: string]: {} }) {
            for (var uri in data) {
                var res = this.getResource(uri);
                res.decodeData(data[uri]);
            }
        }

        getResource(uri: string): UnitResource {
            var res: UnitResource = this._resources[uri];
            if (!res) {
                res = new UnitResource(uri, this.splitInfo);
                this._resources[uri] = res;
            }
            return res;
        }

        /**
         * 获取单位资源
         */
        public getUnitResource(uri): UnitResource {
            var res = this.getResource(uri);
            res.loadData();
            return res;
        }
    }

    /**
     * 资源打包分隔信息
     */
    export abstract class SplitInfo {

        /**
         * 资源字典
         */
        protected _resDict: { [index: number]: string };

        /**
         * 子资源列表
         */
        protected _subReses: string[];

        /**
         * key
         */
        protected _key: string;

        /**
         * 动作/方向的字典<br/>
         * key      {string}  资源uri<br/>
         * value    {Array}   action<<8|direction
         *                   
         */
        public adDict: { [index: string]: number[] };

        /**
         * 处理分隔信息
         * @param data
         */
        abstract parseSplitInfo(data: any[]);

        constructor(key: string) {
            this._key = key;
        }

        /**
         * 处理帧数据
         * @param data
         */
        public parseFrameData(data: any[]): { [index: number]: ActionInfo } {
            var frames: { [index: number]: ActionInfo } = {};
            for (let key in data) {
                let a = +key;
                frames[a] = getActionInfo(data[a], a);
            }
            return frames;
        }

        /**
         * 根据方向和动作获取原始资源
         * @param direction 方向
         * @param action    动作
         */
        abstract getResource(direction: number, action: number): string;

    }
    export const PstUtils = {
        /**
         * 得到 A(动作)D(方向)的标识
         * 
         * @static
         * @param {number} action A(动作)标识
         * @param {number} direction D(方向)标识
         * @returns {number} A(动作)D(方向)的标识
         */
        getADKey(action: number, direction: number): number {
            return action << 8 | direction;
        },

        /**
         * 从A(动作)D(方向)的标识中获取 A(动作)标识
         * 
         * @static
         * @param {number} adKey A(动作)D(方向)的标识
         * @returns {number} A(动作)标识
         */
        getAFromADKey(adKey: number): number {
            return adKey >> 8;
        },

        /**
         * 从A(动作)D(方向)的标识中获取 D(方向)标识
         * 
         * @static
         * @param {number} adKey A(动作)D(方向)的标识
         * @returns {number} D(方向)标识
         */
        getDFromADKey(adKey: number): number {
            return adKey & 0xff;
        }
    }

    /**
     * 默认动作数组
     * [a,b,c....x,y,z,A,B,C...X,Y,Z]
     */
    const _pst$a = function () {
        let a: string[] = [];
        m(97, 122);//a-z
        m(65, 90);//A-Z
        return a;
        function m(f: number, t: number) {
            for (let i = f; i <= t; i++) {
                a.push(String.fromCharCode(i));
            }
        }
    }();
    /**
     * 单方向单动作分隔数据
     * 后面只用这种打包方式
     */
    export class OneADSInfo extends SplitInfo {


        protected _n: string;
        protected _a: any[];
        protected _d: any[];

        parseFrameData(data: any) {
            this._resDict = {};
            let _adDict = this.adDict = {};
            let frames: { [index: number]: ActionInfo } = {};
            for (let key in data) {
                let a = +key;
                frames[a] = getActionInfo(data[a], a);
                for (let d = 0; d < 5; d++) {
                    let res = this.getResource(d, a);
                    _adDict[res] = [PstUtils.getADKey(a, d)];
                }
            }
            return frames;
        }

        parseSplitInfo(infos: any) {
            this._n = infos.n || "{a}{d}";
            this._a = infos.a || _pst$a;
            this._d = infos.d;
        }

        getResource(direction: number, action: number): string {
            let key = PstUtils.getADKey(action, direction);
            let res = this._resDict[key];
            if (!res) {
                this._resDict[key] = res = this._n.substitute({ "f": this._key, "a": getRep(action, this._a), "d": getRep(direction, this._d) });
            }
            return res;
            function getRep(data: number, repArr: any[]): string {
                var str = data + "";
                if (repArr && (data in repArr)) {
                    str = repArr[data];
                }
                return str;
            }
        }
    }

    // /**
    //  * 基于动作打包的分隔数据
    //  * @deprecated 已弃用
    //  */
    // export class ActionSInfo extends SplitInfo {

    //     parseSplitInfo(infos: any[]) {
    //         var flag = true;
    //         if (infos) {
    //             this._resDict = {};
    //             this._subReses = [];
    //             var _adDict: { [index: string]: number[] } = {};
    //             this.adDict = _adDict;
    //             var _resDict = this._resDict;
    //             var _subReses = this._subReses;
    //             var len = infos.length;
    //             for (let i = 0; i < len; i++) {
    //                 let pak = infos[i][0];
    //                 let acts = pak.a;
    //                 if (acts) {
    //                     let dlen = acts.length;
    //                     if (dlen) {
    //                         flag = false;
    //                         let res = this.getFileName(pak);
    //                         let arr = _adDict[res];
    //                         if (!arr) {
    //                             arr = [];
    //                             _adDict[res] = arr;
    //                         }
    //                         if (res && _subReses.indexOf(res) == -1) {
    //                             _subReses.push(res);
    //                         }
    //                         for (let j = 0; j < dlen; j++) {
    //                             let a = acts[j];
    //                             _resDict[a] = res;
    //                             //push所有动作的数据
    //                             arr.push(SplitInfo.getADKey(a, 0), SplitInfo.getADKey(a, 1), SplitInfo.getADKey(a, 2), SplitInfo.getADKey(a, 3), SplitInfo.getADKey(a, 4));
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //         if (flag) {
    //             throw new Error("no pak split info");
    //         }
    //     }


    //     getFileName(pakInfo: any) {
    //         var dirs = pakInfo.a;
    //         return PakSaveType.PAK_BY_ACTION + "-" + dirs.join("_");
    //     }

    //     getResource(direction: number, action: number): string {
    //         return this._resDict[action];
    //     }
    // }
}
