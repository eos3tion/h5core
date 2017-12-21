module junyou {
	/**
	 * 基本单位<br/>
	 * 是一个状态机<br/>
	 * @author 3tion
	 *
	 */
    export abstract class Unit extends egret.EventDispatcher {

        /**
         * 单位状态
         * 
         * @type {UnitState}
         */
        public state: UnitState;

        /**
         * 单位标识
         */
        public guid: Key;
        /**
         * 播放速度，默认为1倍速度<br/>
         * 值越高，速度越快
         */
        public get playSpeed(): number {
            return this._render.playSpeed;
        }

        /**
         * 设置播放速度
         */
        public set playSpeed(value: number) {
            this._render.playSpeed = value;
        }

    	/**
    	 * 用于放纸娃娃贴图的容器
         * 只允许放ResourceBitmap
    	 */
        protected _model: UModel;
        /**
    	 * 用于放纸娃娃贴图的容器
         * 只允许放ResourceBitmap
    	 */
        public get model(): Readonly<UModel> {
            return this._model;
        }

        /**
         * 人物身体
         */
        protected body: DSprite;

        /**
         * 人物底图资源的字典
         */
        protected _resDict: { [index: string]: UnitResource };

        /**
         * 人物底图资源的字典  
         * key      {string}            部位  
         * value    {UnitResource}      资源  
         * @readonly
         * @type {{}
         */
        public get resDict(): { readonly [index: string]: UnitResource } {
            return this._resDict;
        }

        /**
         * 当前骑乘标识
         */
        protected _mountType: MountType = MountType.ground;


        /**
         * 资源列表改变
         */
        protected _resListChange: Boolean;

        /**
         * 打包信息
         */
        protected _pstInfo: PstInfo;

        /**
         * 渲染器
         */
        protected _render: UnitRender;

        /**
         * 角色的动作序列
         * 
         * @protected
         * @type {number}
         */
        protected _action: number;

        /**
         * 纸娃娃排序列表
         * 从下层到上层排序
         * @protected
         * @type {Key[]}
         */
        protected _partList: Key[];

        /**
         * 上一次渲染的信息
         * 
         * @protected
         * @type {FrameInfo}
         */
        public lastFrame: Readonly<FrameInfo>;

        /**
         * 设置单位pst
         */
        public set pst(pst: string) {
            let pstInfo = this.getPstInfo(pst);
            if (pstInfo != this._pstInfo) {
                this._pstInfo = pstInfo;
                this.pstInfoChange();
            }
        }

        protected abstract pstInfoChange();

        protected abstract getPstInfo(pst: string): PstInfo;


        public init(pst: string, setting: UnitSetting) {
            this._resDict = {};
            this.initDisplayList(setting);
            this.pst = pst;
            this.initDefaultAction();
            this.startUnitAction();
            this.onSpawn();
            return this;
        }

        public onSpawn() {
            this.state = UnitState.Init;
            this.dispatch(EventConst.UnitCreate);
        }

        /**
         * 重置渲染器时间
         * 
         * @param {number} now (description)
         */
        public resetRenderTime(now: number) {
            this._render.reset(now);
        }

        /**
         * 初始化显示列表
         * @param setting
         */
        protected initDisplayList(setting: UnitSetting) {
            let render = new UnitRender(this);
            let model = new UModel();
            let body = new DSprite();
            this._render = render;
            render.model = model;
            this._model = model;
            this.body = body;
            body.addChild(model);

            //其他设置

            this._depth = setting.getDepth();

            if (setting.addToEngine) {
                this.addedToEngine();
            }
        }

        /**
         * 设置朝向
         */
        public set faceTo(value: number) {
            this._render.faceTo = value >> 0;
        }

        /**
         * 获取朝向
         */
        public get faceTo() {
            return this._render.faceTo;
        }

        /**
         * 播放自定义动作
         * 
         * @param {ActionInfo} customAction 自定义动作
         * @param {number} [startFrame=-1]  起始帧
         */
        public doCustomAction(customAction: ActionInfo, startFrame: number = -1) {
            let render = this._render;
            let action = customAction.key;
            if (this._action != action) {
                this._action = action;
                render.actionInfo = customAction;
                startFrame = 0;
            }
            if (startFrame > -1) {
                render.f = startFrame;
            }
        }


        /**
         * 执行动作序列
         * @private 只允许UnitAction调用
         */
        public doAction(now: number, action: number, startFrame: number = -1): Readonly<ActionInfo> {
            let render = this._render;
            action = ~~action;
            if (this._action != action) {
                this._action = action;
                render.actionInfo = this._pstInfo.frames[action];
                render.reset(now);
                startFrame = 0;
            }
            if (startFrame > -1) {
                render.f = startFrame;
            }
            return render.actionInfo as ActionInfo;
        }
        /**
         * 获取当前动作序列
         */
        public getCurAction(): Readonly<ActionInfo> {
            return this._render.actionInfo as ActionInfo;
        }


        /**
         * 对指定部位设置资源
         * 
         * @protected
         * @param {Key} part 部位
         * @param {string} [uri] 资源路径，不传则清空部位
         * @param {string} [pst] 通过其他pst配置进行加载
         */
        protected setRes(part: Key, uri?: string, pst?: string) {
            let old = this._resDict[part];
            let res: UnitResource;
            if (uri) {
                let pstInfo: PstInfo;
                if (pst) {
                    pstInfo = this.getPstInfo(pst);
                } else {
                    pstInfo = this._pstInfo;
                }
                if (pstInfo) {
                    res = pstInfo.getUnitResource(uri);
                }
            }
            if (res != old) {
                this._resDict[part] = res;
                this.invalidateResList();
            }
        }

        /**
         * 资源列表发生改变
         */
        protected invalidateResList() {
            this._resListChange = true;
        }

        /**
         * 刷新资源列表
         */
        protected refreshResList() {
            if (this._resListChange) {
                this.checkResList(this._partList);
                this._resListChange = false;
            }
        }

        /**
         * 检查/重置资源列表
         * 
         * @param {string[]} [resOrder] 部位的排列顺序
         * @param {{ [index: string]: UnitResource }} [resDict] 部位和资源的字典
         */
        public checkResList(resOrder?: Key[], resDict?: { [index: string]: UnitResource }) {
            this._model.checkResList(resOrder || this._partList, resDict || this._resDict)
        }


        /**
         * 执行默认的，基于enterframe的渲染
         * 
         * @protected
         */
        protected $render(): void {
            let now = Global.now;
            this.refreshResList();
            var currentAction = this._currentAction;
            if (currentAction) {
                currentAction.doData(this, now);
                currentAction.doRender(this, now);
            }
            this._render.render(now);
        }

        /**
         * 通过其他方式驱动数据
         * 
         * @param {number} now 时间戳
         */
        public doData(now: number) {
            var currentAction = this._currentAction;
            if (currentAction) {
                currentAction.doData(this, now);
            }
            this._render.doData(now);
        }

        /**
         * 通过其他方式驱动渲染
         * 
         * @param {number} now 时间戳
         */
        public doRender(now: number) {
            this.refreshResList();
            var currentAction = this._currentAction;
            if (currentAction) {
                currentAction.doRender(this, now);
            }
            this._render.doRender(now);
        }

        /**
         * 回收
         */
        public onRecycle() {
            removeDisplay(this.body);
            const model = this._model;
            model.off(EgretEvent.ENTER_FRAME, this.$render, this);
            model.clear();
            this.rotation = 0;
            this.z = 0;
            // 回收ResourceBitmap
            let dict = this._resDict;
            for (let key in dict) {
                delete dict[key];
            }
            let current = this._currentAction;
            if (current) {
                current.recycle();
                this._currentAction = undefined;
            }
            let next = this._nextAction;
            if (next) {
                next.recycle();
                this._nextAction = undefined;
            }
            this._action = undefined;
            if (this._render) {
                this._render.reset(0);
            }
            this.lastFrame = undefined;
            this.dispatch(EventConst.UnitRecycle);
        }

        /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓UnitAction相关↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/

        /**
         * 当前正在执行的动作
         */
        protected _currentAction: UnitAction;

        /**
         * 下一个动作
         */
        protected _nextAction: UnitAction;

        protected aStandBy: UnitAction;


        protected initDefaultAction() {
            this.aStandBy = new UnitAction();
        }


        /**
         * 开始执行单位动作
         * @param {UnitAction} [action]     准备执行的动作，默认为待机动作
         * @param {number}     [now]        执行时间，默认取全局时间
         * @param {boolean}    [override]   是否强制覆盖当前动作，默认为否
         * @return true     成功执行动作
         *         false    未成功执行动作，将动作覆盖到下一个动作
         */
        public startUnitAction(action?: UnitAction, now?: number, override?: boolean): boolean {
            if (this.state != UnitState.Stage) {
                return;
            }
            let next = this._nextAction;
            if (next != action) {
                if (next) {
                    next.recycle();
                }
                this._nextAction = action;
                next = action;
            }
            now = now || Global.now;
            let currentAction = this._currentAction;
            /**
             * 是否成功执行新的动作
             */
            let flag = false;
            if (currentAction) {
                if (currentAction != next) {
                    if (currentAction.isEnd) {//已结束
                        currentAction.recycle();
                        flag = true;
                    } else if (override || currentAction.canStop) {//可结束
                        currentAction.terminate();
                        currentAction.recycle();
                        flag = true;
                    }
                } else {
                    this._nextAction = undefined;
                }
            } else {
                flag = true;
            }
            if (flag) {
                currentAction = undefined;
                if (next) {
                    if (next.start(this, now)) {//无法执行
                        currentAction = next;
                    } else {
                        next.recycle();
                        this._nextAction = undefined;
                    }
                }
            }
            if (!currentAction) {
                currentAction = this.aStandBy;
            }
            this._currentAction = currentAction;
            currentAction.playAction(this, this._mountType, now);
            return flag;
        }

        /**
         * 停止单位当前动作，做待机动作
         * 
         * @param {number} [now] 
         */
        public stopUnitAction(now?: number) {
            this.startUnitAction(null, now, true);
        }

        public setMountType(value: MountType) {
            if (value != this._mountType) {
                this._mountType = value;
                //由子类实现 先向服务器请求坐骑状态变更，处理其他
            }
        }

        /**
         * 动作的动画播放完毕
         */
        public playComplete(now: number) {
            let currentAction = this._currentAction;
            let flag: boolean;
            if (currentAction) {
                currentAction.playComplete(this, now);
                if (currentAction.isEnd) {
                    flag = true;
                } else {
                    currentAction.playAction(this, this._mountType, now);
                }
            } else {
                flag = true;
            }
            if (flag) {
                this.startUnitAction(this._nextAction, now);
            }
        }

        /**
         * 动作进行渲染的时候
         */
        public onRenderFrame(now: number) {
            let currentAction = this._currentAction;
            if (currentAction) {
                if (currentAction.isEnd) {
                    this.startUnitAction(this._nextAction, now);
                }
            } else {
                this.startUnitAction(this._nextAction, now);
            }
        }


        /**
         * 执行动作中的回调事件
         */
        public fire(eventType: string, now: number) {
            var currentAction = this._currentAction;
            if (currentAction) {
                currentAction.dispatchEvent(this, eventType, now);
            }
        }

        //        /**
        //         * 绘制快照
        //         */ 
        //        public drawShortcut(){
        //            //TODO
        //            
        //        }

        /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑UnitAction相关↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/





        /**
         * 加到游戏引擎中
         * 
         * @param {boolean} [doRender=true] 是否添加Event.ENTER_FRAME事件
         */
        public addedToEngine(doRender = true) {
            // 子类实现其他层的添加
            GameEngine.instance.getLayer(GameLayerID.Sorted).addChild(this.body);
            if (doRender) {
                this.model.on(EgretEvent.ENTER_FRAME, this.$render, this);
            }
            this.state = UnitState.Stage;
            this.dispatch(EventConst.UnitAddToStage);
        }

        /**
         * 添加到容器中
         * 
         * @param {Container} container
         * @param {boolean} [doRender=true]
         * 
         * @memberOf Unit
         */
        public addToContainer(container: egret.DisplayObjectContainer, doRender = true) {
            container.addChild(this.body);
            if (doRender) {
                this.model.on(EgretEvent.ENTER_FRAME, this.$render, this);
            }
            this.state = UnitState.Stage;
            this.dispatch(EventConst.UnitAddToStage);
        }

        protected _depth: number;

        protected _x: number;

        protected _y: number;

        protected _z = 0;

        public get x() {
            return this._x;
        }

        /**
         * 此方法只允许 UnitAction调用
         */
        public set x(value: number) {
            value = value || 0;
            if (this._x != value) {
                this._x = value;
                this.checkPosition();
            }
        }

        public get y() {
            return this._y;
        }

        /**
         * 此方法只允许 UnitAction调用
         */
        public set y(value: number) {
            value = value || 0;
            if (this._y != value) {
                this._y = value;
                this.checkPosition();
                GameEngine.invalidateSort();
            }
        }


        public get z(): number {
            return this._z;
        }

        /**
         * 此方法只允许 UnitAction调用
         */
        public set z(value: number) {
            value = value || 0;
            if (this._z != value) {
                this._z = value;
                this.checkPosition();
            }
        }

        /**
         * 检查模型和其他的y轴
         */
        protected checkPosition() {
            var body = this.body;
            if (body) {
                body.depth = this._depth + this._y;
                body.y = this._y + this._z;
                body.x = this._x;
            }
        }

        protected _rotation: number = 0;

        /**
         * 设置旋转角度
         * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位。
         * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。对于此范围之外的值，可以通过加上或减去 360 获得该范围内的值。
         * 例如，myDisplayObject.rotation = 450语句与 myDisplayObject.rotation = 90 是相同的
         */
        public set rotation(value: number) {
            if (this._rotation != value) {
                this._rotation = value;
                if (this._model.scaleX >= 0) {
                    this._model.rotation = value;
                }
                else {
                    this._model.rotation = -value;
                }
            }
        }



        /**
         * 根据 resKey 获取纹理
         * @param {Key} resKey resDict的key
         * @param {IDrawInfo} [drawInfo] 动作，方向，帧数信息
         */
        getTexture(resKey: Key, drawInfo?: IDrawInfo) {
            drawInfo = drawInfo || this._render;
            if (drawInfo) {
                let res = this._resDict[resKey];
                if (res) {
                    return res.getTexture(drawInfo);
                }
            }
        }

        /**
         * 获得模型的旋转角度
         */
        public get rotation() {
            return this._rotation;
        }
    }
}