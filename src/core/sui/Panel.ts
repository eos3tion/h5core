module junyou {
    export interface Panel extends IAsync {
    }
	/**
	 * 模块面板
	 * @author 3tion
	 *
	 */
    export class Panel extends egret.Sprite implements SuiDataCallback, IAsyncPanel {
        /**
         * 模态颜色
         * 
         * @static
         * @type {number}
         */
        public static MODAL_COLOR: number = 0x0;
        /**
         * 模态透明度
         * 
         * @static
         * @type {number}
         */
        public static MODAL_ALPHA: number = 0.8;

        /**
         * 异步的Helper
         */
        protected _asyncHelper: AsyncHelper;
        /**
         * 模块ID
         */
        public moduleID: Key;

        /**
         * 自己的key(fla的文件名)
         */
        suiLib: string;
        /**
         * 类名
         */
        suiClass: string;
        /**
         * 依赖的除lib,自己以外的其他fla
         */
        protected _otherDepends: string[];
        /**
         * 所有依赖的fla资源
         * 
         * @protected
         * @type {string[]}
         */
        protected _depends: string[];
        /**
         * 模态
         * 
         * @protected
         * @type {egret.Sprite}
         */
        protected modal: egret.Shape;
        /**
         * 是否模态
         * 
         * @type {number}
         */
        protected _isModal: boolean;

        /**
         * 是否预加载位图
         * 
         * @type {boolean}
         */
        public preloadImage: boolean;

        protected _readyState: RequestState = RequestState.UNREQUEST;


        public constructor() {
            super();
            this.init();
        }

        public get isReady() {
            return this._readyState == RequestState.COMPLETE;
        }

        protected init() {
            //this._key=xxxx
            //this._className=xxxx
            //this._otherDepends=[other...];
        }

        public bind(key: string, className: string, ...otherDepends: string[]) {
            this.suiLib = key;
            this.suiClass = className;
            this._otherDepends = otherDepends;
        }

        public startSync() {
            if (this._readyState == RequestState.UNREQUEST) {
                if (this._otherDepends) {
                    this._depends = this._otherDepends.concat();
                } else {
                    this._depends = [];
                }
                this._depends.push(this.suiLib);
                this._readyState = RequestState.REQUESTING;
                this.loadNext();
            }
        }

        protected loadNext() {
            if (this._depends.length) {
                var key = this._depends.pop();
                var suiManager = singleton(SuiResManager);
                suiManager.loadData(key, this);
            }
            else {
                this.skinDataComplete();
            }
        }

        public suiDataComplete(suiData: SuiData): void {
            if (this.preloadImage) {
                suiData.loadBmd(CallbackInfo.get(this.loadNext, this));
            } else {
                this.loadNext();
            }
        }

        public suiDataFailed(suiData: SuiData): void {
            //暂时用alert
            // alert(this._className + "加载失败");
        }

		/**
		 * 绑定皮肤
		 */
        protected bindComponent() {
            singleton(SuiResManager).createComponents(this.suiLib, this.suiClass, this);
        }

		/**
		 * 皮肤数据加载完成
		 */
        skinDataComplete() {
            this.bindComponent();
            if (this["bg"]) {
                this["bg"].touchEnabled = true;
            } else {
                if (this.numChildren) {
                    let bg = this.getChildAt(0);
                    bg.touchEnabled = true;
                }
            }

            this._readyState = RequestState.COMPLETE;
            if (this._asyncHelper) {
                this._asyncHelper.readyNow();
            }
        }


        protected modalToStage() {
            if (this._isModal) {
                this.addModal();
            }
        }



        public get isModal(): boolean {
            return this._isModal;
        }

        public set isModal(value: boolean) {
            if (this._isModal != value) {
                this._isModal = value;
                if (value) {
                    this.setModalTouchClose(true);//默认为true
                    if (this.stage) {
                        this.addModal();
                    } else {
                        this.once(EgretEvent.ADDED_TO_STAGE, this.modalToStage, this);
                    }
                } else {
                    this.removeModal();
                    this.off(EgretEvent.ADDED_TO_STAGE, this.modalToStage, this);
                }
            }
        }

        protected _mTouchClose: boolean;
        /**
         * 设置模式窗口的灰色区域是否可以点击关闭面板
         * 
         * @param {boolean} value 
         */
        public setModalTouchClose(value: boolean) {
            if (this._mTouchClose != value) {
                this._mTouchClose = value;
                let m = this.modal;
                if (!m) {
                    this.modal = m = new egret.Shape();
                    m.touchEnabled = true;
                }
                if (value) {
                    m.on(EgretEvent.TOUCH_TAP, this.hide, this);
                } else {
                    m.off(EgretEvent.TOUCH_TAP, this.hide, this);
                }
            }
        }

        /**
         * 加模态
         * 
         * @public
         */
        public addModal(width?: number, height?: number) {
            let m = this.modal;
            if (!m) {
                this.modal = m = new egret.Shape();
                m.touchEnabled = true;
            }
            let rect = this.suiRawRect;
            let g = m.graphics;
            g.clear();
            g.beginFill(Panel.MODAL_COLOR, Panel.MODAL_ALPHA);
            let stage = egret.sys.$TempStage;
            stage.on(EgretEvent.RESIZE, this.onModalResize, this);
            width = width || stage.stageWidth;
            height = height || stage.stageHeight;
            let { scaleX, scaleY } = this;
            let sx = rect.x - (width - rect.width >> 1);
            let sy = rect.y - (height - rect.height >> 1);
            g.drawRect(sx / scaleX, sy / scaleY, width / scaleX, height / scaleY);
            g.endFill();
            this.addChildAt(m, 0);
            this.x = -sx;
            this.y = -sy;
            if (this._mTouchClose) {
                m.on(EgretEvent.TOUCH_TAP, this.hide, this);
            }
        }

        private onModalResize() {
            this.addModal();
        }

        /**
         * 移除模态
         * 
         * @public
         */
        public removeModal() {
            if (this.modal) {
                this.modal.off(EgretEvent.TOUCH_TAP, this.hide, this);
                removeDisplay(this.modal);
            }
            egret.sys.$TempStage.off(EgretEvent.RESIZE, this.onModalResize, this);
        }

        /**
         * 关闭
         * 
         * @protected
         */
        public hide() {
            toggle(this.moduleID, ToggleState.HIDE);
        }


        protected get isShow(): boolean {
            return this.stage != undefined && this.visible == true;
        }

        public show() {
            toggle(this.moduleID, ToggleState.SHOW);
        }

        //		/**
        //         * @private
        //         * 显示对象添加到舞台
        //         */
        //        $onAddToStage(stage: egret.Stage,nestLevel: number): void {
        //            super.$onAddToStage(stage,nestLevel);
        //            //TODO
        //
        //        }
        //
        //        /**
        //         * @private
        //         * 显示对象从舞台移除
        //         */
        //        $onRemoveFromStage(): void {
        //            super.$onRemoveFromStage();
        //            
        //            //TODO
        //        }

    }

    expand(Panel, FHost, "addReadyExecute");
}
