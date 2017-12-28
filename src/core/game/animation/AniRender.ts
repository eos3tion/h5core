interface $gmType {
    /**
     * 记录Ani数据
     * 
     * 
     * @memberOf $gmType
     */
    recordAni(): void;
    /**
     * 是否记录Ani数据
     * 
     * @type {boolean}
     * @memberOf $gmType
     */
    _recordAni: boolean;

    /**
     * ani记录
     * 
     * @type {{ [index: number]: $gmAniInfo }}
     * @memberOf $gmType
     */
    _aniRecords: { [index: number]: $gmAniInfo };

    /**
     * 显示aniRender的记录信息
     * 
     * @param {number} time 超过多少时间的进行显示，默认值为0
     * 
     * @memberOf $gmType
     */
    showAniRecords(time?: number): void;

    /**
     * 显示残留的aniRender的堆栈信息
     * 
     * @param {number} [time]
     * 
     * @memberOf $gmType
     */
    showAniStacks(time?: number): void;
}
interface $gmAniInfo {
    /**
     * ani标识
     * 
     * @type {number}
     * @memberOf $gmAniInfo
     */
    guid: number;
    /**
     * 堆栈信息
     * 
     * @type {string}
     * @memberOf $gmAniInfo
     */
    stack: string;
    /**
     * 启动时间
     * 
     * @type {number}
     * @memberOf $gmAniInfo
     */
    time: number;
}
if (DEBUG) {
    var $gm = $gm || <$gmType>{};
    $gm.recordAni = () => {
        $gm._recordAni = !$gm._recordAni;
        if ($gm._recordAni) {
            if (!$gm._aniRecords) {
                $gm._aniRecords = {};
            }
        } else {
            delete $gm._aniRecords;
        }
    }
    $gm.showAniRecords = (time = 0) => {
        let dict = $gm._aniRecords;
        let now = Date.now();
        let output = [];
        for (let guid in dict) {
            let record = dict[guid];
            let delta = now - record.time;
            if (delta > time) {
                output.push({ delta: delta, guid: record.guid, stack: record.stack });
            }
        }
        output.sort((a, b) => a.delta - b.delta);
        if (DEBUG) console.table(output);
    }
    $gm.showAniStacks = (time = 0) => {
        let dict = $gm._aniRecords;
        let now = Date.now();
        let output = {};
        for (let guid in dict) {
            let record = dict[guid];
            let delta = now - record.time;
            if (delta > time) {
                output[record.stack] = ~~output[record.stack] + 1;
            }
        }
        for (let stack in output) {
            if (DEBUG) egret.log("次数：", output[stack], "堆栈：\n", stack);
        }
    }
}
module junyou {
	/**
	 * 由于目前特效和渲染器是完全一一对应关系，所以直接做成AniBitmap
	 * @author 3tion
	 *
	 */
    export class AniRender extends BaseRender implements IRecyclable {
        _render: any;

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

        /**
         * 循环播放次数
         * 
         * @type {number}
         */
        loop?: number;
        /**
         * 事件处理的回调函数
         * 
         * @type {{ (event: Key, render: AniRender, now?: number, ...args) }}
         * @memberof AniOption
         */
        handler?: CallbackInfo<{ (event: Key, render: AniRender, now?: number, ...args) }>;

        /**
         * 是否等待纹理数据加载完成，才播放
         * 
         * @type {boolean}
         * @memberof AniRender
         */
        waitTexture?: boolean;

        /**
         * 资源是否加载完成
         * 
         * @type {boolean}
         */
        resOK: boolean;

        /**
         * 播放起始时间
         * 
         * @type {number}
         */
        plTime: number;
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
                let actionInfo = aniinfo.actionInfo;
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
            let display = this.display;
            if (display && display.draw(this, now)) {
                this.willRenderFrame = undefined;
            }
        }

        /**
         * 派发事件
         * @param event     事件名
         * @param now       当前时间
         */
        protected dispatchEvent(event: string, now: number) {
            let handler = this.handler;
            if (handler) {
                handler.call(event, this, now);
            }
        }

        doComplete(now: number) {
            let handler = this.handler;
            if (handler) {
                handler.call(EventConst.AniComplete, this, now);
            }
            this.state = AniPlayState.Completed;
            let policy = this.recyclePolicy;
            if ((policy & AniRecyclePolicy.RecycleRender) == AniRecyclePolicy.RecycleRender) {//如果有回收Render，则进入Render中判断是否要回收可视对象
                AniRender.recycle(this.guid);
            } else {
                let display = this.display;
                if (display) {
                    //这里不删除和AniRender的引用关系，但移除渲染事件
                    display.off(EgretEvent.ENTER_FRAME, this.render, this);
                    if ((policy & AniRecyclePolicy.RecycleDisplay) == AniRecyclePolicy.RecycleDisplay) {
                        //回收策略要求回收可视对象，才移除引用
                        this.display = undefined;
                        display.recycle();
                    }
                }
            }
        }

        isComplete(info: ActionInfo) {
            let loop = this.loop;
            if (loop != undefined) {
                loop--;
                this.loop = loop;
                return loop < 1;
            }
            return !info.isCircle
        }

        public callback() {
            let _aniInfo = this._aniInfo;
            if (_aniInfo) {
                let { f, loop, display, state } = this;
                this.idx = checkStart(_aniInfo, loop, f);
                display.res = _aniInfo.getResource();
                if (state == AniPlayState.Playing) {
                    this.checkPlay();
                }
            }
        }

        /**
         * 播放
         */
        public play(now?: number) {
            let globalNow = Global.now;
            now = now === void 0 ? globalNow : now;
            this.plTime = globalNow;
            this.renderedTime = now;
            this.nextRenderTime = now;
            this.state = AniPlayState.Playing;
            this.resOK = false;
            this._render = undefined;
            this.checkPlay();
            if (DEBUG) {
                if ($gm._recordAni) {
                    let stack = new Error().stack;
                    let guid = this._guid;
                    let bin = <$gmAniInfo>{ stack, guid, time: now };
                    $gm._aniRecords[guid] = bin;
                }
            }
        }

        private checkPlay() {
            let display = this.display;
            let res = display.res;
            if (res) {//资源已经ok
                let old = this._render;
                let render;
                if (this.waitTexture) {
                    let { a, d } = this;
                    if (res.isResOK(a, d)) {
                        if (!this.resOK) {
                            this.resOK = true;
                            //重新计算时间
                            let deltaTime = Global.now - this.plTime;
                            this.renderedTime = this.nextRenderTime = this.renderedTime + deltaTime;
                        }
                        render = this.render;
                    } else {
                        render = this.checkPlay;
                        res.loadRes(a, d);
                    }
                } else {
                    render = this.render;
                }
                if (old != render) {
                    if (old) {
                        display.off(EgretEvent.ENTER_FRAME, old, this);
                    }
                    if (render) {
                        display.on(EgretEvent.ENTER_FRAME, render, this);
                    }
                }
                this._render = render;
            }
        }

        public onRecycle() {
            if (DEBUG) {
                if ($gm._recordAni) {
                    delete $gm._aniRecords[this._guid];
                }
            }
            let handler = this.handler;
            if (handler) {
                handler.call(EventConst.AniBeforeRecycle, this);
                handler.recycle();
                this.handler = undefined;
            }
            delete AniRender._renderByGuid[this._guid];
            this.state = AniPlayState.Recycled;
            let display = this.display;
            if (display) {
                //这里必须移除和可视对象的关联
                this.display = undefined;
                display.off(EgretEvent.ENTER_FRAME, this.render, this);
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
            if (this.waitTexture) {
                this.waitTexture = false;
            }
            this.loop = undefined;
            this._render = undefined;
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
         * @param {AniOption} [option] 动画的参数
         * @returns (description)
         */
        public static getAni(uri: string, option?: AniOption, qid?: Res.ResQueueID) {
            if (DEBUG && !uri) {
                DEBUG && ThrowError(`创建了没有uri的AniRender`);
            }
            let aniDict = $DD.ani;
            let aniInfo: AniInfo = aniDict[uri];
            if (!aniInfo) {
                aniInfo = new AniInfo();
                aniInfo.key = uri;
                aniDict[uri] = aniInfo;
            }
            aniInfo.qid = qid;
            let res = aniInfo.getResource();
            res && (res.qid = qid);
            let display = recyclable(ResourceBitmap);
            let ani = recyclable(AniRender);
            let guid: number, stop: boolean;
            if (option) {
                guid = option.guid;
                let pos = option.pos;
                let { x, y } = option;
                if (pos) {
                    x = pos.x;
                    y = pos.y;
                }
                if (x != undefined) {
                    display.x = x;
                }
                if (y != undefined) {
                    display.y = y;
                }
                let scale = option.scale;
                if (scale != undefined) {
                    display.scaleX = display.scaleY = scale;
                }
                stop = option.stop;
                let parent = option.parent;
                if (parent) {
                    let idx = option.childIdx;
                    if (idx == undefined) {
                        parent.addChild(display);
                    } else {
                        parent.addChildAt(display, idx);
                    }
                }
                let loop = option.loop;
                ani.loop = loop;
                ani.handler = option.handler
                let recyclePolicy = option.recyclePolicy;
                if (recyclePolicy == undefined) {
                    recyclePolicy = AniRecyclePolicy.RecycleAll;
                }
                ani.recyclePolicy = recyclePolicy;
                ani.waitTexture = !!option.waitTexture;
                ani.idx = checkStart(aniInfo, loop, option.start >>> 0);//强制为正整数
            }
            !guid && (guid = this.guid++);
            this._renderByGuid[guid] = ani;
            ani.init(aniInfo, display, guid);
            if (!stop) {
                ani.play();
            }
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

    function checkStart(aniInfo: AniInfo, loop: number, startFrame: number) {
        let actionInfo = aniInfo.actionInfo;
        if (loop || (loop == undefined && actionInfo && actionInfo.isCircle)) {
            let total = aniInfo.actionInfo.frames.length;
            if (startFrame > total) {
                startFrame = startFrame % total;
            }
        }
        return startFrame;
    }
    export interface AniOption {
        guid?: number;

        /**
         * 坐标集合
         * 如果同时配置此值和x，优先取此值作为坐标X
         * 如果同时配置此值和y，优先取此值作为坐标Y
         * @type {Point}
         * @memberof AniOption
         */
        pos?: Point;

        /**
         * 坐标X
         * 
         * @type {number}
         * @memberof AniOption
         */
        x?: number;
        /**
         * 坐标Y
         * 
         * @type {number}
         * @memberof AniOption
         */
        y?: number;

        /**
         * 容器，如果配置此值，则自动将视图加入到容器中
         * 
         * @type {egret.DisplayObjectContainer}
         * @memberof AniOption
         */
        parent?: egret.DisplayObjectContainer;

        /**
         * 有parent此值才有意义
         * 当有此值时，使用 addChildAt添加
         * @type {number}
         * @memberof AniOption
         */
        childIdx?: number;

        /**
         * 是否初始停止播放
         * 
         * @type {boolean}
         * @memberof AniOption
         */
        stop?: boolean;

        /**
         * 循环播放次数
         * 如果设置此值，不按原始数据的 isCircle进行播放
         * 
         * @type {number}
         * @memberof AniOption
         */
        loop?: number;

        /**
         *  事件处理的回调函数
         * 
         * @type {CallbackInfo<{ (event: Key, render: AniRender, now?: number, ...args) }>}
         * @memberof AniOption
         */
        handler?: CallbackInfo<{ (event: Key, render: AniRender, now?: number, ...args) }>;

        /**
         * ani回收策略
         * 
         * @type {AniRecyclePolicy}
         * @memberof AniOption
         */
        recyclePolicy?: AniRecyclePolicy;

        /**
         * 
         * 是否等待纹理加载完，才播放
         * @type {boolean}
         * @memberof AniOption
         */
        waitTexture?: boolean;

        /**
         * 起始帧  
         * 如果是`循环` loop为true，如果起始帧大于总帧数，则对总帧数取模  
         * 否则不播放
         * 
         * @type {number}
         * @memberof AniOption
         */
        start?: number;

        /**
         * 缩放，默认为 1
         */
        scale?: number;
    }
}
