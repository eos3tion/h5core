module junyou {
    export interface ComponentWithEnable {

        /**
         * 控件是否启用
         */
        enabled: boolean;
        useDisFilter?: boolean;
        /**
         * @private
         */
        _enabled?: boolean;

        /**
         * @private
         */
        $setEnabled(value: boolean);
    }

    export function addEnable(ref: { prototype: any, useDisFilter?: boolean }) {
        let pt = ref.prototype;
        pt.$setEnabled = $setEnabled;
        pt.useDisFilter = true;
        Object.defineProperty(pt, "enabled", getDescriptor(
            {
                set(value: boolean) {
                    if (this._enabled != value) {
                        this.$setEnabled(value);
                    }
                },
                get() {
                    return this._enabled;
                }
            })
        )
    }

    function $setEnabled(value: boolean) {
        this._enabled = value;
        this.touchEnabled = value;
        this.touchChildren = value;
        if (this.useDisFilter) {
            this.filters = value ? null : FilterUtils.gray;
        }
    }


	/**
	 * 用于处理接收flash软件制作的UI，导出的数据，仿照eui
	 * 不过简化eui的一些layout的支持
	 * 按目前情况看，不太会制作复杂排版的ui，父容器不做统一的测量和重新布局
	 * 都会基于固定大小(传奇世界H5，采用480×800，viewport设置为不可缩放，宽度基于设备的)
	 * @author 3tion 
	 *
	 */
    export class Component extends egret.Sprite {

        /**
         * 附加的数据
         * 
         * @type {*}@memberof Component
         */
        public data?: any;

        protected _guid: string;

        protected _creator: BaseCreator<egret.DisplayObject>;

        /**
         * 是否使用disable滤镜
         * 现在默认为 true
         * @protected
         * @type {boolean}
         * @memberOf Component
         */
        useDisFilter = true;

    	/**
    	 * 控件命名规则
    	 * 如果是和模块关联@开头，则为mediator，通过getView取到面板
    	 * 为!开头的数字guid，则此控件的上级是个列表，通过getItemViewAt(idx)可以取得控件
    	 * 
    	 * 如引导:
    	 * skill对应面板下
    	 * 模块zhudongskill对应面板下
    	 * 名字为skillpage的控件下
    	 * 索引2的控件下
    	 * 名字为btnButton的按钮
    	 * 可以构造一个@skill/@zhudongskill/skillpage/!2/btnButton的字符串来主播引导
    	 * 
    	 */
        public get guid() {
            return this._guid;
        }

        public constructor() {
            super();
        }

        public init(c: BaseCreator<egret.DisplayObject>) {
            this._creator = c;
            this.enabled = true;
            this.stageEvent();
            this.bindChildren();
        }

        protected stageEvent(remove?: boolean) {
            let handler = remove ? this.off : this.on;
            handler.call(this, EgretEvent.ADDED_TO_STAGE, this.awake, this);
            handler.call(this, EgretEvent.REMOVED_FROM_STAGE, this.sleep, this);
        }

        protected awake() {

        }

        protected sleep() {

        }

        public dispose() {
            this.removeAllListeners();
        }

        protected bindChildren() {

        }

		/**
		 * 绘制一个代理图形
		 */
        protected drawDele() {
            if (this._creator) {
                let g = this.graphics;
                g.lineStyle(2, 0x00ff00);
                g.beginFill(0xff, 0.3);
                g.drawRectangle(this._creator.size);
            }
        }

        /**
        * @language zh_CN
        * 设置元素的布局大小。这是元素在屏幕上进行绘制时所用的大小。<p/>
        *
        * 如果 width 和/或 height 参数尚未指定 (NaN))，则 EUI 会将该元素的布局大小设置为首选宽度和/或首选高度。<p/>
        *
        * 请注意，调用 setLayoutBoundSize() 方法会影响布局位置，因此请在调用 setLayoutBoundSize()
        * 之后再调用 setLayoutBoundPosition()。
        *
        * @param layoutWidth 元素的布局宽度。
        * @param layoutHeight 元素的布局高度。
        *
        * @version Egret 2.4
        * @version eui 1.0
        * @platform Web,Native
        */
        protected setLayoutBoundsSize(layoutWidth: number, layoutHeight: number) {

        }



		/**
         * @language zh_CN
         * 获取组件的首选尺寸,常用于父级的<code>measure()</code>方法中。<p/>
         * 按照：外部显式设置尺寸>测量尺寸 的优先级顺序返回尺寸。<p/>
         * 注意此方法返回值已经包含scale和rotation。
         *
         * @param bounds 可以放置结果的<code>egret.Rectangle</code>实例。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getPreferredBounds(bounds: egret.Rectangle) {

        }


        /**
         * @language zh_CN
         * 设置元素在屏幕上进行绘制时所用的布局坐标。<p/>
         *
         * 请注意，调用 setLayoutBoundSize() 方法会影响布局位置，因此请在调用 setLayoutBoundSize()
         * 之后再调用 setLayoutBoundPosition()。
         *
         * @param x 边框左上角的 X 坐标。
         * @param y 边框左上角的 Y 坐标。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected setLayoutBoundsPosition(x: number, y: number) {

        }

        /**
         * @language zh_CN
         * 组件的布局尺寸,常用于父级的<code>updateDisplayList()</code>方法中。<p/>
         * 按照：布局尺寸>外部显式设置尺寸>测量尺寸 的优先级顺序返回尺寸。<p/>
         * 注意此方法返回值已经包含scale和rotation。
         *
         * @param bounds 可以放置结果的<code>egret.Rectangle</code>实例。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getLayoutBounds(bounds: egret.Rectangle) {

        }

        public get view() {
            return this;
        }
    }

    export interface Component extends ComponentWithEnable { };

    addEnable(Component);
}
