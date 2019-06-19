/**
 * 资源打包信息
 * AS3的版本中实现了5种打包方式
 * H5中实现了2种（2 按动作打包，4 单方向单动作打包），不过后面只会使用4（单方向单动作）进行打包，其他方式弃用
 * @author 3tion
 */
namespace jy {

    /**
     * 打包类型
     */
    export const enum PakSaveType {
        /**
         * 0 全部打包
         */
        PAK_ALL = 0,
        /**
         * 1 按方向打包 (弃用)
         */
        PAK_BY_DIRECTION = 1,
        /**
         * 2 按动作打包
         */
        PAK_BY_ACTION = 2,
        /**
         * 3 混合打包 (弃用)
         */
        PAK_COMPLEX = 3,
        /**
         * 单方向单动作
         */
        PAK_ONE_A_D = 4
    }

    let parsers: { [index: number]: { new(key: string): SplitInfo } };

    /**
     * 获取处理器
     */
    function getParsers(t: number): { new(key: string): SplitInfo } {
        if (!parsers) {
            parsers = {};
            parsers[PakSaveType.PAK_ALL] = AllSInfo;
            parsers[PakSaveType.PAK_BY_ACTION] = ActionSInfo;
            parsers[PakSaveType.PAK_ONE_A_D] = OneADSInfo;
        }
        return parsers[t];
    }

    /**
     * 存储pst信息
     */
    export class PstInfo {
        /**
    	 * 图片数据字典<br/>
    	 * Key      string  存储图片数据的key <br/>
    	 * Value    UnitResource<br/>
    	 */
        protected _resources: { [uri: string]: UnitResource } | UnitResource;

        /**
         * pst的唯一标识
         */
        key: string;

        type: number;

        /**
         * 动作信息，帧的播放信息的数组  
         * Key      {number}        动作标识
         * Value    {ActionInfo}    动作信息
         */
        frames: { [action: number]: ActionInfo };

        /**
         * 头顶显示的基准坐标Y，相对于角色的原点
         * 
         * @type {number}
         */
        headY: number;

        /**
         * 受创点的基准坐标Y，相对于角色的原点
         * 
         * @type {number}
         */
        hurtY: number;

        /**
         * 施法点
         * KEY      {number}        action << 8 | direction
         * VALUE    {egret.Point}   施法点坐标
         * @type {[adKey:string]:Point}
         */
        protected castPoints: { [adKey: number]: Point };


        urCreator: { new(key: string, pstInfo: PstInfo): UnitResource } = UnitResource;


        /**
         * 获取施法点
         * @param {number} action 动作标识
         * @param {number} direction 方向
         * @return {Point} 如果有施法点
         */
        public getCastPoint(action: number, direction: number) {
            if (this.castPoints) {
                let pt = this.castPoints[ADKey.get(action, direction)];
                if (pt) {
                    return pt;
                }
            }
            return;
        }

        getResKey(direction: number, action: number) {
            return this.splitInfo.getResKey(direction, action);
        }

        bindResource(resKey: string, resouce: SplitUnitResource, textures: { [index: number]: egret.Texture[][] }) {
            return this.splitInfo.bindResource(resKey, resouce, textures);
        }

        public splitInfo: SplitInfo;

        constructor() {

        }

        public init(key: string, data: any[]) {
            this.key = key;
            this._resources = {};
            let type = +data[0];
            this.type = type;
            let parserRef = getParsers(type);
            if (!parserRef) {
                return;
            }
            let parser = new parserRef(key);
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
                let castInfo: { [adKey: number]: number[][] } = extra[2];
                if (castInfo) {
                    let castPoints: { [adKey: number]: Point } = {};
                    this.castPoints = castPoints;
                    for (let a in castInfo) {
                        let aInfo = castInfo[a];
                        for (let d = 0; d < 8; d++) {
                            let pInfo = aInfo[d > 4 ? 8 - d : d];
                            if (pInfo) {
                                castPoints[ADKey.get(+a, d)] = { x: +pInfo[0], y: +pInfo[1] };
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
            for (let uri in data) {
                let res = this.getResource(uri);
                res.decodeData(data[uri]);
            }
        }

        getResource(uri: string) {
            let res = this._resources[uri];
            if (!res) {
                res = new this.urCreator(uri, this);
                this._resources[uri] = res;
            }
            return res;
        }

        /**
         * 获取单位资源
         */
        public getUnitResource(uri) {
            let res = this.getResource(uri);
            res.loadData();
            return res;
        }
    }

    /**
     * 资源打包分隔信息 
     * 只保留了最主流的单动作，单方向
     */
    export abstract class SplitInfo {


        /**
         * 资源字典
         */
        protected _resDict: { [adkey: number]: string };

        /**
         * 子资源列表
         */
        protected _subReses: string[];

        readonly key: string;

        constructor(key: string) {
            this.key = key;
        }

        parseFrameData(data: any) {
            this._resDict = {};
            let frames: { [index: number]: ActionInfo } = {};
            /**
             * 有效的动作数组，有些动作是自定义出来的，不是原始动作
             */
            let alist = [] as number[];
            for (let key in data) {
                let a = +key;
                let aInfo = getActionInfo(data[a], a);
                frames[a] = aInfo;
                let fs = aInfo.frames;
                for (let i = 0; i < fs.length; i++) {
                    const frame = fs[i];
                    alist.pushOnce(frame.a);
                }

            }

            this.parseADDict(alist);
            return frames;
        }

        protected parseADDict(_alist: number[]) { }


        parseSplitInfo(_infos: any) { }

        abstract getResKey(direction: number, action: number): string;

        /**
         * 遍历资源
         * @param _forEach 
         */
        forEach(_forEach: { (resKey: string, adKey: number): any }) {

        }

        abstract bindResource(resKey: string, resouce: SplitUnitResource, textures: { [index: number]: egret.Texture[][] });
    }

    function getRep(data: number, repArr: any[]) {
        let str = "";
        let len = repArr && repArr.length || 0;
        if (len) {
            do {
                str = repArr[data % len] + str;
                data = data / len >> 0;
            } while (data)
        } else {
            str = data + "";
        }
        return str;
    }
    /**
     * action << 8 | direction
     */
    export declare type ADKey = number;
    export const ADKey = {
        /**
         * 得到 A(动作)D(方向)的标识
         * 
         * @static
         * @param {number} action A(动作)标识
         * @param {number} direction D(方向)标识
         * @returns {number} A(动作)D(方向)的标识
         */
        get(action: number, direction: number): ADKey {
            return action << 8 | direction;
        },

        /**
         * 从A(动作)D(方向)的标识中获取 A(动作)标识
         * 
         * @static
         * @param {ADKey} adKey A(动作)D(方向)的标识
         * @returns {number} A(动作)标识
         */
        getAction(adKey: ADKey): number {
            return adKey >> 8;
        },

        /**
         * 从A(动作)D(方向)的标识中获取 D(方向)标识
         * 
         * @static
         * @param {ADKey} adKey A(动作)D(方向)的标识
         * @returns {number} D(方向)标识
         */
        getDirection(adKey: ADKey): number {
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
    class OneADSInfo extends SplitInfo {


        protected _n: string;
        protected _a: any[];
        protected _d: any[];


        /**
         * 动作/方向的字典<br/>
         * key      {string}  资源key<br/>
         * value    {Array}   action<<8|direction
         *                   
         */
        public adDict: { [resKey: string]: ADKey };

        parseADDict(alist: number[]) {
            let adDict = this.adDict = {};
            //检查有效动作
            for (let i = 0; i < alist.length; i++) {
                const a = alist[i];
                for (let d = 0; d < 5; d++) {
                    let res = this.getResKey(d, a);
                    adDict[res] = ADKey.get(a, d);
                }
            }
        }

        parseSplitInfo(infos: any) {
            this._n = infos.n || "{a}{d}";
            this._a = infos.a || _pst$a;
            this._d = infos.d;
        }

        getResKey(direction: number, action: number) {
            let key = ADKey.get(action, direction);
            let res = this._resDict[key];
            if (!res) {
                this._resDict[key] = res = this._n.substitute({ "f": this.key, "a": getRep(action, this._a), "d": getRep(direction, this._d) });
            }
            return res;
        }

        /**
         * 遍历资源
         * @param _forEach 
         */
        forEach(_forEach: { (resKey: string, adKey: number): any }) {
            const dict = this.adDict;
            for (let resKey in dict) {
                if (_forEach(resKey, dict[resKey])) {
                    return
                }
            }
        }

        bindResource(resKey: string, resouce: SplitUnitResource, textures: { [index: number]: egret.Texture[][] }) {
            let adKey = this.adDict[resKey];
            bindResource(adKey, resouce, textures);
        }
    }

    /**
     * 基于动作打包的分隔数据
     * @deprecated 已弃用
     */
    class ActionSInfo extends SplitInfo {


        getADKey(resKey: string) {
            return this.adDict[resKey];
        }

        /**
         * 子资源列表
         */
        protected _subReses: string[];

        protected adDict: { [resKey: string]: number[] };

        parseSplitInfo(infos: any[]) {
            let flag = true;
            if (infos) {
                this._resDict = {};
                this._subReses = [];
                let adDict = this.adDict = {};
                let _resDict = this._resDict;
                let _subReses = this._subReses;
                let len = infos.length;
                for (let i = 0; i < len; i++) {
                    let pak = infos[i][0];
                    let acts = pak.a;
                    if (acts) {
                        let dlen = acts.length;
                        if (dlen) {
                            flag = false;
                            let res = this.getFileName(pak);
                            let arr = adDict[res];
                            if (!arr) {
                                arr = [];
                                adDict[res] = arr;
                            }
                            if (res) {
                                _subReses.pushOnce(res);
                            }
                            for (let j = 0; j < dlen; j++) {
                                let a = acts[j];
                                _resDict[a] = res;
                                //push所有动作的数据
                                arr.push(
                                    ADKey.get(a, 0),
                                    ADKey.get(a, 1),
                                    ADKey.get(a, 2),
                                    ADKey.get(a, 3),
                                    ADKey.get(a, 4)
                                );
                            }
                        }
                    }
                }
            }
            if (flag) {
                throw new Error("no pak split info");
            }
        }


        getFileName(pakInfo: any) {
            let dirs = pakInfo.a;
            return PakSaveType.PAK_BY_ACTION + "-" + dirs.join("_");
        }

        getResKey(_: number, action: number): string {
            return this._resDict[action];
        }

        bindResource(resKey: string, resouce: SplitUnitResource, textures: { [index: number]: egret.Texture[][] }) {
            let adKeyArr = this.adDict[resKey];
            adKeyArr.forEach(adKey => {
                bindResource(adKey, resouce, textures);
            })
        }

    }

    class AllSInfo extends SplitInfo {
        getResKey(_direction: number, _action: number): string {
            return "d"
        }
        bindResource(_resKey: string, resouce: SplitUnitResource, textures: { [index: number]: egret.Texture[][]; }) {
            for (let a in textures) {
                let dTextures = textures[a];
                if (dTextures) {
                    for (let d in dTextures) {
                        let textures = dTextures[d];
                        if (textures) {
                            for (let i = 0; i < textures.length; i++) {
                                resouce.bindTexture(textures[i]);
                            }
                        }
                    }
                }
            }
        }


    }

    function bindResource(adKey: number, resouce: SplitUnitResource, textures: { [index: number]: egret.Texture[][] }) {
        let a = ADKey.getAction(adKey);
        let dTextures = textures[a];
        if (dTextures) {
            let d = ADKey.getDirection(adKey);
            let textures = dTextures[d];
            if (textures) {
                for (let i = 0; i < textures.length; i++) {
                    resouce.bindTexture(textures[i]);
                }
            }
        }
    }
}
