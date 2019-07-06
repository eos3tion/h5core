namespace jy {

    export interface MCEleRef extends Array<any> {
        /**
         * mc的索引，
         * 如果是-1，则新创建
         * 
         * @type {number}
         * @memberof MCEleRef
         */
        0: number;

        /**
         * 变更的数据 或者完整的组件数据
         * 
         * @type {(BaseData | ComponentData)}
         * @memberof MCEleRef
         */
        1?: BaseData | ComponentData;

        /**
         * 如果是文本框，可能有文本数据
         * 
         * @type {TextData}
         * @memberof MCEleRef
         */
        2?: TextData;
    }

    interface MCSelfData extends Array<any> {
        /**
         * 
         * 控件字典
         * @type {ComponentData[]}
         * @memberof SelfData
         */
        0?: ComponentData[];


        /**
         * 关键帧数组
         * 
         * @type {MCRawFrameData[]}
         * @memberof MCSelfData
         */
        1: MCRawFrameData[];

        /**
         * 
         * 总帧数
         * @type {number}
         * @memberof MCSelfData
         */
        2: number;
    }

    interface MCRawFrameData extends Array<any> {
        /**
         * 持续的帧数
         * 
         * @type {number}
         * @memberof MCFrameData
         */
        0: number;
        /**
         * 关键帧数据
         * 
         * @type {((number | MCEleRef)[])}
         * @memberof MCFrameData
         */
        1: (number | MCEleRef)[]
    }

    export interface MCFrameData {
        /**
         * 关键帧索引
         * 
         * @type {number}
         * @memberof MCFrameData
         */
        key: number;

        data: (number | MCEleRef)[]
    }



    export class MovieClip extends Component {
        protected suiData: SuiData;
        protected framesData: MCFrameData[];
        /**
         * 组件字典
         * 
         * @protected
         * @type {{ [index: number]: egret.DisplayObject }}
         */
        protected compData: { [index: number]: egret.DisplayObject };

        /**
         * 当前帧
         * 
         * @readonly
         * @type {number}
         */
        public currentFrame: number;

        /**
         * 是否正在播放
         * 
         * @readonly
         * @type {boolean}
         */
        public playing: boolean;

        /**
         * 是否循环  
         * 默认循环播放
         */
        public loop = true;

        public readonly totalFrame: number;
        /**
         * 每帧播放时长
         * 
         * @type {number}
         */
        public timePerFrame = 100;

        protected _nt: number;

        constructor(data: any, framesData: MCFrameData[]
            , suiData: SuiData) {
            super();
            this.suiData = suiData;
            let compsData = data[0];
            /**
             * 组件字典
             */
            let comps: egret.DisplayObject[];
            if (compsData) {
                let sm = singleton(SuiResManager);
                comps = [];
                for (let i = 0; i < compsData.length; i++) {
                    let dis = sm.createComponent(compsData[i], suiData, this);
                    if (dis instanceof egret.DisplayObject) {
                        comps[i] = dis;
                    }
                }
            } else {
                comps = Temp.EmptyArray;
            }
            this.compData = comps;
            this.framesData = framesData;
            this.totalFrame = framesData.length;
            this.stop(0);
        }

        /**
         * 停在某一帧或当前帧
         * 索引从0开始
         * @param {number} [frame] 
         */
        public stop(frame?: number) {
            let cf = this.validateFrame(this.getFrame(frame));
            this.playing = false;
            this.render(cf);
            this.currentFrame = cf;
            this.off(EgretEvent.ENTER_FRAME, this.doRender, this);
        }
        public play(frame?: number) {
            this.currentFrame = this.getFrame(frame);
            this.playing = true;
            this._nt = Global.now + this.timePerFrame;
            this.on(EgretEvent.ENTER_FRAME, this.doRender, this);
        }

        protected doRender() {
            let now = Global.now;
            let nt = this._nt;
            if (nt < now) {
                let cf = this.currentFrame;
                let timePerFrame = this.timePerFrame;
                //需要增加的帧数
                let delta = (now - nt) / timePerFrame | 0;
                cf = this.validateFrame(cf + 1 + delta);
                this.render(cf);
                this.currentFrame = cf;
                this._nt = nt + (delta + 1) * timePerFrame;
            }
        }

        protected validateFrame(cf: number) {
            let totalFrame = this.totalFrame;
            if (cf >= totalFrame) {
                if (this.loop) {
                    cf = cf % totalFrame;
                } else {
                    //只到最后一帧
                    cf = totalFrame - 1;
                }
            }
            return cf;
        }

        protected getFrame(frame?: number) {
            return frame == undefined ? this.currentFrame : frame;
        }

        protected render(frame: number) {
            let frameData = this.framesData[frame];
            if (frameData && frameData.key != this.currentFrame) {//当前帧是否和要渲染的关键帧相同
                let dict = this.compData;
                let sm = singleton(SuiResManager);
                let tc = sm.sharedTFCreator;
                let suiData = this.suiData;
                //清理子对象
                this.removeChildren(false);
                for (let dat of frameData.data) {
                    let idx: number, pData, comp: egret.DisplayObject, textData: TextData;
                    if (Array.isArray(dat)) {
                        idx = dat[0];
                        pData = dat[1];
                        textData = dat[2];
                    } else {
                        idx = dat;
                    }
                    if (idx == -1) {//-1的一定有pData
                        comp = sm.createComponent(pData, suiData, this);
                    } else {
                        comp = dict[idx];
                        if (comp instanceof egret.DisplayObject) {
                            this.$doAddChild(comp, this.numChildren, false)
                            if (pData) {//调整基础属性
                                SuiResManager.initBaseData(comp, pData);
                            }
                            if (comp instanceof egret.TextField) {//如果是文本框，特殊处理
                                if (!textData) {
                                    textData = comp.rawTextData;
                                }
                                sm.sharedTFCreator.initTextData(comp, textData);
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     * MC创建器
     * 
     * @export
     * @class MovieClipCreator
     * @extends {BaseCreator<MovieClip>}
     */
    export class MovieClipCreator extends BaseCreator<MovieClip>{

        public parseSelfData(data: any) {
            let suiData = this._suiData;
            let framesData = this.$getFramesData(data);
            this._createT = () => new MovieClip(data, framesData, suiData);
        }

        $getFramesData(data: any) {
            let framesData = [] as MCFrameData[];
            let j = 0;
            //整理数据，补全非关键帧
            for (let mcData of data[1] as MCRawFrameData[]) {
                let [frameCount, frameData] = mcData;
                let key = j;
                for (let i = 0; i < frameCount; i++) {
                    framesData[j++] = { key, data: frameData };
                }
            }
            return framesData;
        }
    }
}