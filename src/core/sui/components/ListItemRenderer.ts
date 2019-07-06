namespace jy {

    export interface ListItemRenderSkin extends egret.DisplayObject {
        $_rndIdx?: number;
    }

    export interface ListItemRender<T> extends egret.EventDispatcher, IRecyclable {

        handleView(): void;

        dispose(): void;

        readonly view: egret.DisplayObject;

        /**
         * 持有的数据
         * 
         * @type {T}
         * @memberOf ListItemRender
         */
        data: T;

        /**
         * 是否选中
         * 
         * @type {boolean}
         * @memberOf ListItemRender
         */
        selected: boolean;

        /**
         * 数据改变的标记
         */
        dataChange?: boolean;

        /**
         * 是否初始化
         * @protected
         */
        inited?: boolean;

        /**
         * 绑定子控件
         * 
         * @type {{ () }}
         * @memberOf ListItemRender
         */
        bindComponent?: { () };

        /**
         * 当前索引
         * 
         * @type {number}
         * @memberOf ListItemRender
         */
        index?: number;
    }

    export interface ListItemRenderer<T, S extends ListItemRenderSkin> extends ViewController {
    }

    export class ListItemRenderer<T, S extends ListItemRenderSkin> extends egret.EventDispatcher implements ListItemRender<T>, SelectableComponents {

        private _idx: number;
        public get index(): number {
            return this._idx;
        }
        public set index(value: number) {
            this._idx = value;
            let v = this._skin;
            if (v) {
                v.$_rndIdx = value;
            }
        }

        protected _data: T;

        private _dataChange: boolean;

        public get dataChange(): boolean {
            return this._noCheckSame || this._dataChange;
        }

        public set dataChange(value: boolean) {
            this._dataChange = value;
        }

        public skinlib: string;

        public skinClass: string;
        /**
         * 永远执行刷新数据的操作
         * 
         * @type {boolean}
         * @memberOf ListItemRender
         */
        protected _noCheckSame?: boolean;

        protected _selected: boolean;

        protected _defaultWidth: number = 5;

        protected _defalutHeight: number = 5;

        protected _skin: S;

        protected _ready = true;

        protected _container: egret.DisplayObjectContainer;

        // protected _skinTemplete: S;

        /**
         * 是否已经检查过尺寸
         */
        private _sizeChecked: boolean;

        private _oldWidth: number = -1;

        private _oldHeight: number = -1;

        inited = false;

        public constructor() {
            super();

        }

        onRecycle() {

        }

        onSpawn() {

        }

        /**
         * 子类重写
         * 初始化组件
         * 一定要super调一下
         */
        private _bind() {
            let skin = this._skin;
            if (!skin) {
                if (this.skinlib && this.skinClass) {
                    this.skin = singleton(SuiResManager).createDisplayObject(this.skinlib, this.skinClass) as S;
                }
            } else {
                this.inited = true;
                this.stageChange(!!skin.stage)
            }

            this.checkInject();
            this.bindComponent();
        }

        bindComponent() { }

        private onTouchTap() {
            this.dispatch(EventConst.ITEM_TOUCH_TAP);
            this.dispatchEventWith(EgretEvent.TOUCH_TAP);
        }

        protected $setData(value: T) {
            this._data = value;
            if (!this.inited) {
                this._bind();
            }
        }

        public get data() {
            return this._data;
        }

        public set data(value: T) {
            if (this._noCheckSame || value != this._data) {
                this.$setData(value);
            }
        }

        /**
         * 设置容器
         * 
         * @param {egret.DisplayObjectContainer} value 
         * 
         * @memberOf ListItemRenderer
         */
        public setContainer(value: egret.DisplayObjectContainer) {
            let old = this._container;
            this._container = value;
            let s = this._skin;
            if (s) {
                if (value) {
                    value.addChild(s);
                } else if (old && old.contains(s)) {
                    old.removeChild(s);
                }
            }
            return this;
        }

        // /**
        //  * 设置已定位好的皮肤
        //  * (description)
        //  */
        // public set skinTemplete(value: S) {
        //     this._skinTemplete = value;
        //     // let parent = value.parent;
        //     this.skin = value;
        //     // parent.addChild(this);
        // }

        public set skin(value: S) {
            if (value != this._skin) {
                this.$setSkin(value);
            }
        }

        protected $setSkin(value: S) {
            let old = this._skin;
            if (old) {
                old.$_rndIdx = undefined;//置空
                //移除之前的事件监听
                this.removeSkinListener(old);
            }
            this._skin = value;
            value.$_rndIdx = this._idx;
            this.$setVisible(value.visible);
            value.touchEnabled = true;
            this.addSkinListener(this._skin);
            let c = this._container;
            if (c) {
                c.addChild(value);
            }
            this._bind();
        }

        public get skin() {
            return this._skin;
        }
        /**
         * 根据数据处理视图
         * 
         * 子类重写
         */
        public handleView() {
            if (!this._sizeChecked) {
                this._sizeChecked = true;
                this.checkViewSize();
            }
        }

        /**
         * force为true时无条件派发一次事件，通知更新坐标
         * 
         * @protected
         * @ param {boolean} [force=false] 是否强制标记为尺寸变更
         */
        protected checkViewSize(force?: boolean) {
            this._sizeChecked = false;
            let view = this._skin;
            let w = view.width;
            let h = view.height;
            if (!force) {
                if (this._oldHeight != h || this._oldWidth != w) {
                    force = true;
                }
            }
            this._oldHeight = h;
            this._oldWidth = w;
            if (force) {
                this.dispatch(EventConst.Resize);
            }
        }

        /**
         * 
         * 获取视图
         * @readonly
         */
        public get view() {
            return this._skin;
        }

        private _visible = true;

        public set visible(value: boolean) {
            if (value != this._visible) {
                this.$setVisible(value);
            }
        }

        protected $setVisible(value: boolean) {
            this._visible = value;
            let skin = this._skin;
            if (skin) {
                skin.visible = value;
            }
        }

        public get visible() {
            return this._visible;
        }

        public set selected(value: boolean) {
            if (this._selected != value) {
                this.$setSelected(value);
            }
        }

        /**
         * 设置视图的坐标
         * 
         * @param {number} [x] 
         * @param {number} [y] 
         * 
         * @memberOf ListItemRenderer
         */
        public setPos(x?: number, y?: number);
        /**
         * 设置视图的坐标
         * 
         * @param {{ x: number, y: number }} pos 坐标
         * 
         * @memberOf ListItemRenderer
         */
        public setPos(pos: { x: number, y: number });
        public setPos(x?: number | { x: number, y: number }, y?: number) {
            let v = this._skin;
            if (v) {
                if (typeof x == "object") {
                    v.x = x.x;
                    v.y = x.y;
                } else {
                    x != undefined && (v.x = x);
                    y != undefined && (v.y = y);
                }
            }
            return this;
        }
        protected $setSelected(value: boolean) {
            this._selected = value;
            this.dispatch(EventConst.CHOOSE_STATE_CHANGE);
        }

        public dispatch(type: Key, data?: any) {
            let s = this._skin;
            if (s) {
                s.dispatch(type, data);
            }
            return super.dispatch(type, data);
        }

        public get selected() {
            return this._selected;
        }

        /**
         * 子类重写
         * 销毁组件
         */
        public dispose() {
            this.removeSkinListener(this._skin);
            //清理自身所有事件
            this.removeAllListeners();
        }

        removeSkinListener(skin: egret.DisplayObject) {
            if (skin) {
                skin.off(EgretEvent.TOUCH_TAP, this.onTouchTap, this);
                ViewController.prototype.removeSkinListener.call(this, skin);
            }
        }

        addSkinListener(skin: egret.DisplayObject) {
            if (skin) {
                skin.on(EgretEvent.TOUCH_TAP, this.onTouchTap, this);
                ViewController.prototype.addSkinListener.call(this, skin);
            }
        }

		/**
		 * 绑定TOUCH_TAP的回调
		 * 
		 * @template T 
		 * @param {{ (this: T, e?: egret.Event): any }} handler 
		 * @param {T} [thisObject] 
		 * @param {number} [priority] 
		 * @param {boolean} [useCapture] 
		 */
        bindTouch(handler: { (this: T, e?: egret.Event): any }, thisObject?: T, priority?: number, useCapture?: boolean) {
            this.skin.touchEnabled = true;
            this.on(EgretEvent.TOUCH_TAP, handler, thisObject, useCapture, priority);
        }

        /**
         * 解除TOUCH_TAP的回调的绑定
         * 
         * @param {Function} handler
         * @param {*} thisObject
         * @param {boolean} [useCapture]
         * 
         * @memberOf Button
         */
        public looseTouch(handler: Function, thisObject?: any, useCapture?: boolean) {
            this.off(EgretEvent.TOUCH_TAP, handler, thisObject, useCapture);
        }

        /**
		 * 作为依赖者的Helper
		 */
        protected _dependerHelper: DependerHelper;

        public get isReady() {
            return this._ready;
        }

        public startSync() {

        }
    }
    expand(ListItemRenderer, ViewController, "addReadyExecute", "addDepend", "onStage", "interest", "checkInject", "checkInterest", "awakeTimer", "sleepTimer", "bindTimer", "looseTimer", "stageChange");

    // export abstract class AListItemRenderer<T, S extends egret.DisplayObject> extends ListItemRenderer<T, S> implements SuiDataCallback {
    //     /**
    //      * 子类重写设置皮肤
    //      * 
    //      * @protected
    //      * @abstract
    //      * 
    //      * @memberOf ListItemRenderer
    //      */
    //     protected abstract initSkin();

    //     protected $setSkin(value: S) {
    //         if (value instanceof View) {
    //             //检查SuiResManager是否已经加载了key
    //             singleton(SuiResManager).loadData(value.key, this.$setSkin)
    //             value.key
    //         } else {
    //             super.$setSkin(value);
    //         }
    //     }

    // }
}