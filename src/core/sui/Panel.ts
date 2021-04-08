namespace jy {

    const enum Const {
        defaultModalAlpha = .8
    }

    export interface Panel extends IAsync, ComponentWithEnable {
        createNativeDisplayObject(): void;
    }
    /**
     * 模块面板
     * @author 3tion
     *
     */
    export class Panel extends egret.Sprite implements SuiDataCallback, IAsyncPanel {
        /**
         * 背景/底
         */
        bg?: egret.DisplayObject;
        /**
         * 异步的Helper
         */
        protected _asyncHelper: AsyncHelper;
        /**
         * 模块ID
         */
        public moduleID: Key;

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
         * @type {egret.Bitmap}
         */
        protected modal: egret.Bitmap;
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

        /**
         * 模式窗口的Alpha
         */
        modalAlpha: number;

        /**
         * 公共的模式窗口的alpha
         */
        static modalAlpha = Const.defaultModalAlpha;

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

        public bind(key: string, className?: string, ...otherDepends: string[]) {
            this.suiLib = key;
            this.suiClass = className;
            this._otherDepends = otherDepends;
        }

        public startSync() {
            if (this._readyState <= RequestState.UNREQUEST) {//Failed情况下允许重新请求
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
                let key = this._depends.pop();
                let suiManager = singleton(SuiResManager);
                suiManager.loadData(key, this);
            }
            else {
                this.skinDataComplete();
            }
        }

        public suiDataComplete(suiData: SuiData) {
            if (this.preloadImage) {
                suiData.loadBmd(CallbackInfo.get(this.loadNext, this));
            } else {
                this.loadNext();
            }
        }

        public suiDataFailed(_: SuiData) {
            this._readyState = RequestState.FAILED;
            this.readyNow(true);
        }

        protected readyNow(failed?: boolean) {
            let asyncHelper = this._asyncHelper;
            if (asyncHelper) {
                asyncHelper.readyNow();
                if (failed) {//如果是加载失败执行的回调，则将`_ready`再恢复成`false`
                    asyncHelper.isReady = false;
                }
            }
        }

        /**
         * 绑定皮肤
         */
        protected bindComponent() {
            let suiClass = this.suiClass;
            if (suiClass) {
                singleton(SuiResManager).createComponents(this.suiLib, suiClass, this);
            }
        }

        /**
         * 皮肤数据加载完成
         */
        skinDataComplete() {
            this.bindComponent();
            let bg = this.bg;
            if (!bg && this.numChildren) {
                bg = this.getChildAt(0);
            }
            if (bg) {
                bg.touchEnabled = true;
            }
            this._readyState = RequestState.COMPLETE;
            this.readyNow();
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
                let m = this.getModal();
                if (value) {
                    m.on(EgretEvent.TOUCH_TAP, this.hide, this);
                } else {
                    m.off(EgretEvent.TOUCH_TAP, this.hide, this);
                }
            }
        }

        getModal() {
            let m = this.modal;
            if (!m) {
                this.modal = m = new egret.Bitmap();
                let alpha = this.modalAlpha;
                if (alpha == undefined) {
                    alpha = Panel.modalAlpha;
                }
                if (alpha == undefined) {
                    alpha = Const.defaultModalAlpha;
                }
                m.texture = ColorUtil.getTexture(0, alpha);
                m.touchEnabled = true;
            }
            return m;
        }

        /**
         * 加模态
         * 
         * @public
         */
        public addModal(width?: number, height?: number) {
            let m = this.getModal();
            let rect = this.suiRawRect;
            let stage = egret.sys.$TempStage;
            stage.on(EgretEvent.RESIZE, this.onModalResize, this);
            width = width || stage.stageWidth;
            height = height || stage.stageHeight;
            let { scaleX, scaleY } = this;
            let sx = rect.x - (width - rect.width >> 1);
            let sy = rect.y - (height - rect.height >> 1);
            m.x = sx / scaleX;
            m.y = sy / scaleY;
            m.width = width / scaleX;
            m.height = height / scaleY;
            this.addChildAt(m, 0, false);
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

    addEnable(Panel);
}
