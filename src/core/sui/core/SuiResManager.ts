module egret {
    export interface DisplayObject {
        /**
         * 扩展sui的可视对象，的原始尺寸和坐标  
         * 由flash导出的原始视图尺寸
         * @type {SuiRawRect}
         * @memberOf DisplayObject
         */
        suiRawRect?: jy.SuiRawRect;
        /**
         * sui的资源名称
         */
        suiLib?: string;
        /**
         * sui的引用名称
         */
        suiClass?: string;
    }
}

namespace jy {
    import Texture = egret.Texture;
    export interface SuiRawRect extends egret.Rectangle {
    }

    export const enum SuiResConst {
        DataFile = "s.json"
    }

    export function getSuiDataUri(key: string) {
        return "$SuiData$_" + key;
    }
	/**
	 * 用于管理位图和数据
	 * @author 3tion
	 *
	 */
    export class SuiResManager {

    	/**
    	 * Key      {string}    fla的文件名
    	 * Value    {SuiData}   数据
    	 */
        protected _suiDatas: { [index: string]: SuiData };


    	/**
    	 * Key      {string}    主配置文件的加载地址
    	 * Value    {SuiData}   数据
    	 */
        protected _urlKey: { [index: string]: SuiData };

    	/**
    	 * 创建器
    	 */
        protected _creators: { [index: string]: { new(): BaseCreator<egret.DisplayObject> } };


    	/**
    	 * 共享的文本创建器
    	 */
        sharedTFCreator: TextFieldCreator;

        public constructor() {
            this._suiDatas = {};
            this._urlKey = {};
            this.initInlineCreators();
            // ResourceManager.addChecker(this);
        }

        protected initInlineCreators() {
            this._creators = {
                [ExportType.Button]: ButtonCreator,
                [ExportType.ShapeNumber]: ArtTextCreator,
                [ExportType.ScaleBitmap]: ScaleBitmapCreator,
                [ExportType.NumericStepper]: NumericStepperCreator,
                [ExportType.Slider]: SliderCreator,
                [ExportType.ScrollBar]: ScrollBarCreator,
                [ExportType.ProgressBar]: ProgressBarCreator,
                [ExportType.SlotBg]: ScaleBitmapCreator,
                [ExportType.ShareBmp]: ShareBitmapCreator,
                [ExportType.Slot]: SlotCreator,
                [ExportType.MovieClip]: MovieClipCreator,
                [ExportType.MCButton]: MCButtonCreator,
                [ExportType.MCProgress]: MCProgressCreator,
            };
            this.sharedTFCreator = new TextFieldCreator();
        }

        public getData(key: string) {
            return this._suiDatas[key];
        }

		/**
		 * 加载数据
		 */
        public loadData(key: string, callback?: SuiDataCallback, qid?: Res.ResQueueID) {
            let suiData = this._suiDatas[key];
            if (!suiData) {
                suiData = this.createSuiData(key);
            }
            let state = suiData.state;
            if (state == RequestState.FAILED) {
                callback && callback.suiDataFailed(suiData);
            } else if (state == RequestState.COMPLETE) {
                callback && callback.suiDataComplete(suiData);
            } else {
                let callbacks = suiData.callbacks;
                if (!callbacks) {
                    suiData.callbacks = callbacks = [];
                }
                callback && callbacks.pushOnce(callback);
                if (state == RequestState.UNREQUEST) {
                    suiData.state = RequestState.REQUESTING;
                    //先加载配置
                    Res.load(suiData.uri, suiData.url, CallbackInfo.get(this.checkData, this), qid);
                }

            }
        }

		/**
		 * 数据加载完成
		 */
        protected checkData(item: Res.ResItem) {
            let { uri, data } = item;
            var suiData = this._urlKey[uri];
            if (!data) {//加载失败
                suiData.state = RequestState.UNREQUEST;
                let callbacks = suiData.callbacks;
                if (callbacks) {
                    for (let i = 0; i < callbacks.length; i++) {
                        let callback = callbacks[i];
                        callback.suiDataFailed(suiData);
                    }
                    delete suiData.callbacks;
                }
                return;
            }
            this._initSuiData(data, suiData);
        }

        /**
         * 
         * 直接将已经加载好的内置数据，和key进行绑定
         * @param {string} key
         * @param {any} data
         * @param {string} [skinUri] 皮肤标识
         */
        public setInlineData(key: string, data: any, skinUri?: string) {
            let uri = getSuiDataUri(key);
            let suiData = this._urlKey[uri];
            if (!suiData) {
                suiData = this.createSuiData(key);
            }
            suiData.skinUri = skinUri;
            this._initSuiData(data, suiData);
        }

        createSuiData(key: string) {
            let suiData = new SuiData(key);
            this._suiDatas[key] = suiData;
            this._urlKey[suiData.uri] = suiData;
            return suiData;
        }

        /**
         * 
         * 初始化数据
         * @private
         * @param {*} data
         * @param {SuiData} suiData
         */
        private _initSuiData(data: any, suiData: SuiData) {
            //  data的数据结构：
            //  lib[
            //     [ //图片
            // 		[128,32,12,33],//图片1   索引0
            //        [224,210,33,66],//图片2  索引1
            //         ......
            //        [48,62,133,400],//图片21 索引20
            //      ],{
            //        "btn":[ //按钮类型/页签/单选框/多选框 3帧或者4帧  0弹起 1选中 2禁用(未选中的样子) 3禁用(选中)
            //             //存放导出名字,
            //           ["ui.btn.Button1", //索引0
            //             "ui.tab.Tab1"],   //索引1
            // 			//存放数据
            //             [{...},
            //             {...}]
            //        ],
            //        "scroll":[//滚动条 track bar
            // 		],
            //        "progress":[//进度条
            //        ]
            //        },{
            //          "panel":[
            //    
            //          ]
            //        }
            //     ]

            //解析img节点
            let pngs = data[0];
            if (pngs) {
                this.parseTextureData(pngs, suiData, true);
            }
            let jpgs = data[2];
            if (jpgs) {
                this.parseTextureData(jpgs, suiData);
            }
            //处理控件
            this.parseComponentData(data[1], suiData);
            let panelsData: PanelsData;
            let panelNames: string[] = data[4];
            if (panelNames) {
                let list = data[3] as [number, SizeData, ComponentData[]][];
                panelsData = {};
                for (let i = 0; i < list.length; i++) {
                    let pdata = list[i];
                    let className = panelNames[pdata[0]];
                    panelsData[className] = pdata.slice(1) as PanelData;
                }
                suiData.panelNames = panelNames;
            } else {//未来版本将不再支持此方案
                panelsData = data[3] as PanelsData;
            }
            if (panelsData) {
                suiData.panelsData = panelsData;
            }

            //数据已经完成，未加载位图
            suiData.state = RequestState.COMPLETE;
            let callbacks = suiData.callbacks;
            if (callbacks) {
                for (let i = 0; i < callbacks.length; i++) {
                    let callback = callbacks[i];
                    callback.suiDataComplete(suiData);
                }
                delete suiData.callbacks;
            }
        }


        /**
         * 处理控件数据
         */
        protected parseComponentData(allComData: SourceComponentDataDict, suiData: SuiData) {
            suiData.sourceComponentData = allComData;
            for (let type in allComData) {
                let comsData = allComData[type];
                let nameData: string[] = comsData[0];//["ui.btn.Button1", "ui.tab.Tab1"] 
                let comData = comsData[1];//[{...},{...}]//组件的数据
                let sizeData = comsData[2];
                let len = nameData.length;
                if (<any>type == ExportType.ArtWord) {//字库数据特殊处理
                    let fonts = suiData.fonts;
                    for (let i = 0; i < len; i++) {
                        let linkName = nameData[i];
                        let dat = comData[i];
                        let fontLib = new ArtWord(linkName);
                        fontLib.parseData(dat, suiData);
                        if (!fonts) {
                            suiData.fonts = fonts = {};
                        }
                        fonts[linkName] = fontLib;
                    }
                } else {
                    let ref = this._creators[type];
                    if (ref) {
                        let lib = suiData.lib;
                        for (let i = 0; i < len; i++) {
                            let name = nameData[i];
                            let dat = comData[i];
                            let creator = new ref;
                            creator.parseData(null, suiData);
                            if (dat) {
                                creator.parseSelfData(dat);
                                creator.parseSize(sizeData[i]);
                            }
                            lib[name] = creator;
                        }
                    }
                }
            }
        }


        /**
         * 解析图片数据
         *  0 图片宽  1图片高度   2偏移X   3偏移Y
         */
        protected parseTextureData(data: number[][], suiData: SuiData, ispng?: boolean) {
            if (data) {
                let imgs = [];
                let bcs = suiData.bmplibs;
                if (!bcs) {
                    suiData.bmplibs = bcs = {};
                }
                suiData.createBmpLoader(ispng, imgs);
                for (let i = 0, len = data.length; i < len; i++) {
                    let imgData: number[] = data[i];
                    let tex: Texture = new Texture();
                    let width = imgData[0];
                    let height = imgData[1];
                    let sx = imgData[2];
                    let sy = imgData[3];
                    tex.$initData(sx, sy, width, height, 0, 0, width, height, width, height);
                    imgs[i] = tex;
                    let bc = new BitmapCreator(suiData);
                    let idx = ispng ? i : -1 - i;
                    bc.parseSelfData(idx);
                    bcs[idx] = bc;
                }
            }
        }

        /**
         * 创建可视控件
         * @param uri           皮肤标识
         * @param className     类名字
         * @param baseData      基础数据
         */
        public createDisplayObject(uri: string, className: string, baseData?: any): egret.DisplayObject {
            let suiData = this._suiDatas[uri];
            if (suiData) {
                let creator = suiData.lib[className];
                if (creator) {
                    creator.setBaseData(baseData);
                    let disp = creator.get();
                    disp.suiClass = className;
                    disp.suiLib = uri;
                    return disp;
                } else if (DEBUG) {
                    ThrowError(`没有在[${suiData.key}]找到对应组件[${className}]`);
                }
            }
            // //[3,["btn2",14.5,139,79,28,0],0,0]
            // return;
        }

        /**
         * 处理元素数据
         * 对应 https://github.com/eos3tion/ExportUIFromFlash  项目中
         * Solution.ts -> getElementData的元素数据的解析
         * @param {string} uri 库标识
         * @param {ComponentData} data 长度为4的数组
         * 0 导出类型
         * 1 基础数据 @see Solution.getEleBaseData
         * 2 对象数据 不同类型，数据不同
         * 3 引用的库 0 当前库  1 lib  字符串 库名字
         * @memberOf BaseCreator
         */
        public createElement(uri: string | SuiData, data: ComponentData): egret.DisplayObject {
            let suiData = typeof uri === "string" ? this._suiDatas[uri] : uri;
            if (suiData) {
                let cRef = this._creators[+data[0]];
                if (cRef) {
                    let creator = new cRef();
                    creator.parseData(data, suiData);
                    let dis = creator.get();
                    dis.suiLib = suiData.key;
                    return dis;
                } else if (DEBUG) {
                    ThrowError(`createElement时，没有找到对应组件，索引：[${+data[0]}]`);
                }
            }
        }


        /**
         * 创建位图对象
         * @param uri       皮肤标识
         * @param index     位图索引 data[2]
         * @param baseData  基础数据 data[1]
         */
        public createBitmap(uri: string, index: number, baseData: BaseData): egret.Bitmap {
            var suiData = this._suiDatas[uri];
            if (suiData) {
                let bcs = suiData.bmplibs;
                let bc = bcs[index];
                if (bc) {
                    bc.setBaseData(baseData);
                    return bc.get();
                }
            }
        }

        /**
         * 获取美术字
         * 
         * @param {string} uri          皮肤标识
         * @param {string} artword      美术字
         * @returns
         * 
         * @memberOf SuiResManager
         */
        public getArtWord(uri: string, artword: string) {
            let suiData = this._suiDatas[uri];
            if (suiData) {
                let fonts = suiData.fonts;
                if (fonts) {
                    return fonts[artword];
                }
            }
        }

        /**
         * 获取美术字的纹理
         * 
         * @param {string} uri          皮肤标识
         * @param {string} artword      美术字
         * @param {Key} font         指定的文字
         * @returns
         * 
         * @memberOf SuiResManager
         */
        public getArtWordTexture(uri: string, artword: string, font: Key) {
            let fonts = this.getArtWord(uri, artword);
            if (fonts) {
                return fonts.getTexture(font);
            }
        }

        /**
         *  创建位图对象
         * @param uri       皮肤标识
         * @param data      JSON的数据
         */
        public createBitmapByData(uri: string, data: any): egret.Bitmap {
            return this.createBitmap(uri, data[2], data[1]);
        }


        /**
         * 创建文本框
         * @param uri       皮肤标识
         * @param data      私有数据 data[2]
         * @param baseData  基础数据 data[1]
         */
        public createTextField(uri: string, data: any, baseData: any): egret.TextField {
            let tfCreator = this.sharedTFCreator;
            tfCreator.parseSelfData(data);
            tfCreator.setBaseData(baseData);
            return tfCreator.get();
        }

        /**
        *  创建文本框
        * @param uri       皮肤标识
        * @param data      JSON的数据
        */
        public createTextFieldByData(uri: string, data: any) {
            return this.createTextField(uri, data[2], data[1]);
        }

        public static initBaseData(dis: egret.DisplayObject, data: any) {
            const [name, x, y, w, h, rot, alpha, adjustColors] = data;
            if (name) {
                dis.name = name;
            }
            dis.suiRawRect = new egret.Rectangle(x, y, w, h);
            if (Array.isArray(rot)) {//matrix
                const [a, b, c, d] = rot;
                const matrix = dis.matrix;
                matrix.setTo(a, b, c, d, x, y);
                dis.$setMatrix(matrix, true);
            } else {//用于兼容之前的数据
                dis.width = w;
                dis.height = h;
                dis.x = x;
                dis.y = y;
                if (rot) {
                    dis.rotation = rot;
                }
            }
            if (alpha != undefined) {
                dis.alpha = alpha;
            }
            if (adjustColors) {
                dis.filters = [FilterUtils.adjustColorFilter(adjustColors[0], adjustColors[1], adjustColors[2], adjustColors[3])];
            }
        }

        /**
         * 创建子控件
         * 
         * @param {string} key
         * @param {string} className
         * @param {egret.DisplayObjectContainer} view
         */
        public createComponents(key: string, className: string, view: egret.DisplayObjectContainer) {
            const suiData = this._suiDatas[key];
            if (suiData) {
                const panelsData = suiData.panelsData;
                if (panelsData) {
                    const panelData = panelsData[className];
                    if (panelData) {
                        const [sizeData, compsData] = panelData;
                        view.suiRawRect = new egret.Rectangle(sizeData[0], sizeData[1], sizeData[2], sizeData[3]);
                        view.suiClass = className;
                        view.suiLib = key;
                        this._createComponents(suiData, view, compsData);
                    }
                }
            }
        }


        private _createComponents(suiData: SuiData, view: egret.DisplayObjectContainer, compsData: ComponentData[]) {
            if (!compsData) {
                return;
            }
            for (let i = 0; i < compsData.length; i++) {
                this.createComponent(compsData[i], suiData, view);
            }
        }

        public createComponent(data: ComponentData, suiData: SuiData, view: egret.DisplayObjectContainer) {
            let ele;
            let baseData = data[1];
            let type = data[0];
            if (type == ExportType.Rectangle) {
                ele = new egret.Rectangle(baseData[1], baseData[2], baseData[3], baseData[4]);
            } else {
                if (type == ExportType.Container) {
                    ele = new egret.Sprite();
                    SuiResManager.initBaseData(ele, baseData);
                    this._createComponents(suiData, ele, data[2]);
                } else {
                    ele = this.getElement(suiData, data);
                }
                if (ele) {
                    view.addChild(ele);
                } else if (DEBUG) {
                    ThrowError(`没有正确创建原件，类型：${type}，数据：${JSON.stringify(data)}`);
                }
            }
            let name = baseData[0];
            if (name) {//有些图片没有做实例引用，有名字的才进行赋值
                view[name] = ele;
            }
            return ele;
        }

        public getElement(suiData: SuiData, data: ComponentData) {
            let [type, bd, sd, lib] = data;
            switch (type) {
                case ExportType.Text:
                    let tc = new TextFieldCreator();
                    tc.setBaseData(bd)
                    tc.parseSelfData(sd);
                    return tc.get();
                case ExportType.Image:
                    let bg = new BitmapCreator(suiData);
                    bg.parseData(data, suiData);
                    return bg.get();
                case ExportType.Sprite:
                    let sp = new egret.Sprite();
                    SuiResManager.initBaseData(sp, bd);
                    return sp;
                case ExportType.ImageLoader:
                    let il = new Image();
                    SuiResManager.initBaseData(il, bd);
                    return il;
                default:
                    if (lib == undefined) lib = 0;
                    let libKey: string;
                    switch (lib) {
                        case 0:
                            libKey = suiData.key;
                            break;
                        case 1:
                            libKey = "lib";
                            break;
                        default:
                            libKey = lib;
                            break;
                    }
                    if (type == ExportType.ExportedContainer) {
                        let className = suiData.panelNames[~~sd];
                        let v = new View(libKey, className);
                        SuiResManager.initBaseData(v, bd);
                        return v;
                    } else {
                        if (typeof sd == "string" && type == ExportType.MCButton) {
                            let v = this.createDisplayObject(libKey, sd, bd);
                            return new MCButton(v as MovieClip);
                        }
                        let source = suiData.sourceComponentData;
                        if (source) {
                            let sourceData = source[type];
                            if (sourceData) {//有引用类型数据
                                let names = sourceData[0];//名字列表
                                if (names) {//有引用名 
                                    let idx = sd;
                                    let name = names[idx];
                                    if (name) {
                                        return this.createDisplayObject(libKey, name, bd);
                                    }
                                }
                            }
                        }
                        return this.createElement(libKey, data);
                    }
            }
        }

        /**
         * 获取控件尺寸
         * 
         * @param {string} key 
         * @param {string} className 
         * @param {egret.Rectangle} [outRect] 
         * @returns 
         */
        public getSize(key: string, className: string, outRect?: egret.Rectangle) {
            const suiData = this._suiDatas[key];
            if (suiData) {
                const panelsData = suiData.panelsData;
                if (panelsData) {
                    const panelData = panelsData[className];
                    if (panelData) {
                        const sizeData = panelData[0];
                        outRect = outRect || new egret.Rectangle();
                        outRect.setTo(sizeData[0], sizeData[1], sizeData[2], sizeData[3]);
                        return outRect;
                    }
                }
            }
        }

    }

    export type SourceComponentDataDict = { [type in ExportType]: SourceComponentData };

    /**
     * 原始组件数据，通过`ExportUIFromFlash`项目导出的数据
     */
    export interface SourceComponentData {
        /**
         * 控件名称数组
         */
        0: string[];
        /**
         * 组件数据的数组
         */
        1: any[];
        /**
         * 尺寸数据的数组
         */
        2: SizeData[]
    }
    export interface SizeData {
        /**
         * x坐标
         * 
         * @type {number}
         * @memberOf BaseData
         */
        0: number;
        /**
         * y坐标
         * 
         * @type {number}
         * @memberOf BaseData
         */
        1: number;
        /**
         * width
         * 
         * @type {number}
         * @memberOf BaseData
         */
        2: number;
        /**
         * height
         * 
         * @type {number}
         * @memberOf BaseData
         */
        3: number;
    }

    export interface ComponentData extends Array<any> {
        /**
         * 导出类型
         * 
         * @type {ExportType}
         * @memberOf ComponentData
         */
        0: ExportType;

        /**
         * 基础数据
         * 
         * @type {BaseData}
         * @memberOf ComponentData
         */
        1: BaseData;

        /**
         * 组件数据
         * 
         * @type {any}
         * @memberOf ComponentData
         */
        2: any;

        /**
         * 是否引用lib
         * 如果没有此值或者0，则使用当前key  
         * 1 使用 lib
         * 其他字符串，则为 suiData的key
         * @type {1|string}
         * @memberOf ComponentData
         */
        3?: 0 | 1 | string;
    }

    export interface BaseData {
        /**
         * 控件名称
         * 
         * @type {string}
         * @memberOf BaseData
         */
        0: string;
        /**
         * x坐标
         * 
         * @type {number}
         * @memberOf BaseData
         */
        1: number;
        /**
         * y坐标
         * 
         * @type {number}
         * @memberOf BaseData
         */
        2: number;
        /**
         * width
         * 
         * @type {number}
         * @memberOf BaseData
         */
        3: number;
        /**
         * height
         * 
         * @type {number}
         * @memberOf BaseData
         */
        4: number;
        /**
         * 旋转角度/或者matrix的[a,b,c,d]四个值组成的数组
         * 
         * @type {number}
         * @memberOf BaseData
         */
        5: number | Array<number>;

        /**
         * alpha
         * 
         * @type {number}
         * @memberof BaseData
         */
        6?: number;
    }

    export interface PanelData extends Array<any> {
        0: SizeData;
        1: ComponentData[];
    }
    export interface PanelsData { [index: string]: PanelData }
}
