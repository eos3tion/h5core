module junyou {
    import Event = egret.Event;
	/**
	 * 由于目前特效和渲染器是完全一一对应关系，所以直接做成AniBitmap
	 * @author 3tion
	 *
	 */
    export class AniRender extends BaseRender implements IRecyclable {

        /**
         * 0 初始化，未运行
         * 1 正在运行
         * 2 已回收
         */
        public state: AniPlayState = AniPlayState.Standby;

        /**
         * 非循环动画，播放完毕后的回收策略  
         * 默认为全部回收
         */
        public recyclePolicy = AniRecyclePolicy.RecycleAll;

        protected _guid: number;

        /**
         * 特效标识
         */
        public get guid(): number {
            return this._guid;
        }

        /**
         * 显示对象
         */
        public display: Recyclable<ResourceBitmap>;

        protected _aniInfo: AniInfo;

        public constructor() {
            super();
            // ani动画的`暂定`动作固定值0
            this.a = 0;
        }

        protected render() {
            let aniinfo = this._aniInfo;
            if (aniinfo) {
                var actionInfo = aniinfo.actionInfo;
                if (actionInfo) {
                    let now = Global.now;
                    this.onData(actionInfo, now);
                    this.doRender(now);
                }
            }
        }
        /**
         * 处理数据
         * 
         * @param {number} now 时间戳
         */
        public doData(now: number) {
            if (this._aniInfo) {
                var actionInfo = this._aniInfo.actionInfo;
                if (actionInfo) {
                    this.onData(actionInfo, now);
                }
            }
        }

        renderFrame(frame: FrameInfo, now: number) {
            if (!frame) {
                return;
            }
            this.f = frame.f;
            this.display.draw(this, now);
        }

        doComplete(now: number) {
            this.state = AniPlayState.Completed;
            let policy = this.recyclePolicy;
            if ((policy & AniRecyclePolicy.RecycleRender) == AniRecyclePolicy.RecycleRender) {//如果有回收Render，则进入Render中判断是否要回收可视对象
                AniRender.recycle(this.guid);
            } else {
                let display = this.display;
                if (display) {
                    //这里不删除和AniRender的引用关系，但移除渲染事件
                    display.off(Event.ENTER_FRAME, this.render, this);
                    if ((policy & AniRecyclePolicy.RecycleDisplay) == AniRecyclePolicy.RecycleDisplay) {
                        //回收策略要求回收可视对象，才移除引用
                        this.display = undefined;
                        display.recycle();
                    }
                }
            }
        }

        public callback() {
            if (this._aniInfo) {
                let display = this.display;
                display.res = this._aniInfo.getResource();
                if (this.state == AniPlayState.Playing) {
                    display.on(Event.ENTER_FRAME, this.render, this);
                }
            }
        }

        /**
         * 播放
         */
        public play(now?: number) {
            now = now === void 0 ? Global.now : now;
            this.renderedTime = now;
            this.nextRenderTime = now;
            this.state = AniPlayState.Playing;
            if (this.display.res) {
                this.display.on(Event.ENTER_FRAME, this.render, this);
            }
        }

        public onRecycle() {
            delete AniRender._renderByGuid[this._guid];
            this.state = AniPlayState.Recycled;
            let display = this.display;
            if (display) {
                //这里必须移除和可视对象的关联
                this.display = undefined;
                display.off(Event.ENTER_FRAME, this.render, this);
                if ((this.recyclePolicy & AniRecyclePolicy.RecycleDisplay) == AniRecyclePolicy.RecycleDisplay) {
                    display.recycle();
                }
            }
            if (this._aniInfo) {
                this._aniInfo.loose(this);
                this._aniInfo = undefined;
            }
            this.idx = 0;
            this._guid = NaN;
        }

        public onSpawn() {
            this.f = 0;
            this.state = 0;
            this.recyclePolicy = AniRecyclePolicy.RecycleAll;
            this._playSpeed = 1;
        }

        public init(aniInfo: AniInfo, display: Recyclable<ResourceBitmap>, guid: number) {
            this._aniInfo = aniInfo;
            this.display = display;
            if (aniInfo.state == RequestState.COMPLETE) {
                display.res = aniInfo.getResource();
            } else {
                aniInfo.bind(this);
            }
            this._guid = guid;
        }


        /***********************************静态方法****************************************/
        private static _renderByGuid: { [index: number]: Recyclable<AniRender> } = {};

        private static guid = 1;
        /**
         * 获取ANI动画
         * 
         * @static
         * @param {string} uri    动画地址
         * @param {number} [guid] 外部设置动画的guid
         * @returns (description)
         */
        public static getAni(uri: string, guid?: number) {
            let aniDict = $DD.ani;
            let aniInfo: AniInfo = aniDict[uri];
            if (!aniInfo) {
                aniInfo = new AniInfo();
                aniInfo.key = uri;
                aniDict[uri] = aniInfo;
            }
            let display = recyclable(ResourceBitmap);
            let ani = recyclable(AniRender);
            guid = guid === void 0 ? this.guid++ : guid;
            this._renderByGuid[guid] = ani;
            ani.init(aniInfo, display, guid);
            return ani;
        }


        /**
         * 获取正在运行的AniRender
         * @param guid  唯一标识
         */
        public static getRunningAni(guid: number) {
            return this._renderByGuid[guid];
        }

        /**
         * 回收某个特效
         * @param {number} guid AniRender的唯一标识
         */
        public static recycle(guid: number) {
            let ani = this._renderByGuid[guid];
            if (ani) {
                ani.recycle();
            }
        }
    }
}
