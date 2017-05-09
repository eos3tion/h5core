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
        public moduleID: string | number;

        /**
         * 设置原始大小和坐标
         */
        public set suiRawRect(value: egret.Rectangle) {
            this._baseRect = value;
        }
        /**
         * 
         * 面板在fla中的原始坐标
         * @readonly
         * 
         * @memberOf Panel
         */
        public get suiRawRect() {
            return this._baseRect;
        }
        /**
         * 面板在fla中的原始坐标
         * 
         * @protected
         * @type {egret.Rectangle}
         */
        protected _baseRect: egret.Rectangle;
        /**
         * 自己的key(fla的文件名)
         */
        protected _key: string;
        /**
         * 依赖的除lib,自己以外的其他fla
         */
        protected _otherDepends: string[];
        protected _className: string;
        /**
         * 所有依赖的fla资源
         * 
         * @protected
         * @type {string[]}
         */
        protected _depends: string[];

        protected _ready: boolean;
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


        public constructor() {
            super();
            this.init();
        }

        public get isReady() {
            return this._ready;
        }

        protected init() {
            //this._key=xxxx
            //this._className=xxxx
            //this._otherDepends=[other...];
        }

        public bind(key: string, className: string, ...otherDepends: string[]) {
            this._key = key;
            this._className = className;
            this._otherDepends = otherDepends;
        }

        public startSync() {
            if (this._otherDepends) {
                this._depends = this._otherDepends.concat();
            } else {
                this._depends = [];
            }
            this._depends.push(this._key);
            this.loadNext();
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
                suiData.loadBmd(CallbackInfo.getInstance(this.loadNext, this));
            } else {
                this.loadNext();
            }
        }

        public suiDataFailed(suiData: SuiData): void {
            //暂时用alert
            alert(this._className + "加载失败");
        }

		/**
		 * 绑定皮肤
		 */
        protected bindComponent() {
            singleton(SuiResManager).createComponents(this._key, this._className, this);
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

            this._ready = true;
            if (this._asyncHelper) {
                this._asyncHelper.readyNow();
            }
        }


        protected addedToStage() {
            if (this._isModal) {
                this.addModal();
            }
        }



        public get isModal(): boolean {
            return this._isModal;
        }

        public set isModal(value: boolean) {
            this._isModal = value;
            if (value) {
                if (this.stage) {
                    this.addModal();
                }
                else {
                    this.on(egret.Event.ADDED_TO_STAGE, this.addedToStage, this);
                }
            }
            else {
                if (this.stage) {
                    this.removeModal();
                }
                else {
                    this.off(egret.Event.ADDED_TO_STAGE, this.addedToStage, this);
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
                let g = m.graphics;
                g.beginFill(Panel.MODAL_COLOR, Panel.MODAL_ALPHA);
                let stage = egret.sys.$TempStage;
                width = width || stage.stageWidth;
                height = height || stage.stageHeight;
                g.drawRect(0, 0, width, height);
                g.endFill();
            }
            m.on(egret.TouchEvent.TOUCH_TAP, this.hide, this);
            this.addChildAt(m, 0);
        }

        /**
         * 移除模态
         * 
         * @public
         */
        public removeModal() {
            if (this.modal) {
                this.modal.off(egret.TouchEvent.TOUCH_TAP, this.hide, this);
                removeDisplay(this.modal);
            }
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
