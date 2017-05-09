module junyou {
	import TouchEvent = egret.TouchEvent;
	/**
	 * 按钮
	 * 在fla中 按钮只是需要1帧
	 * 按钮帧数对应的状态为
	 * 第1帧  启用 未选中
	 * 第2帧  启用 选中
	 * 第3帧  禁用 未选中
	 * 第4帧  禁用 选中
	 * 
	 * 第4帧 没有，会用 第3帧代替
	 * 第3帧 或者 第2帧 没有，会用第一帧代替
	 * @author 3tion
	 *
	 */
	export class Button extends Component implements IGroupItem {

		public txtLabel: egret.TextField;
		public bitmaps: egret.Bitmap[];
		/**
		 * 按钮的底部
		 * 
		 * @type {egret.DisplayObject}
		 * @memberOf Button
		 */
		public floor?: egret.DisplayObject;
		/**
		 * 按钮的顶部
		 * 
		 * @type {egret.DisplayObject}
		 * @memberOf Button
		 */
		public ceil?: egret.DisplayObject;


		/**
		 * 
		 * 用于放置子容器
		 * @protected
		 * @type {egret.DisplayObjectContainer}
		 */
		protected _children?: egret.DisplayObjectContainer;

		protected _label: string = "";

        /**
         * 是否选中
         */
		protected _selected: boolean;

		protected _currentBmp: egret.Bitmap;

		public useDisableFilter(value: boolean) {
			this._useDisableFilter = value;
		}

		public constructor() {
			super();
			TouchDown.bindItem(this);
		}

		public bindChildren() {
			if (this.txtLabel) {
				this.addChild(this.txtLabel);
			}
			this.refresh(true);
		}

		/**
		 * 设置按钮上的标签
		 */
		public set label(value: string) {
			if (this.txtLabel) {
				if (this._label != value) {
					this.txtLabel.text = value;
				}
			}
		}

		/**
		 * 获取按钮上的标签
		 */
		public get label(): string {
			return this._label;
		}

		protected $setEnabled(value: boolean) {
			super.$setEnabled(value);
			this.refresh();
		}

		/**
		 * 设置选中
		 */
		public set selected(value: boolean) {
			if (this._selected != value) {
				this.$setSelected(value);
			}
		}

		protected $setSelected(value: boolean) {
			this._selected = value;
			this.refresh();
		}

		/**
		 * 获取当前按钮选中状态
		 */
		public get selected(): boolean {
			return this._selected;
		}

		protected refresh(changed?: boolean) {
			var frame = +!this._enabled << 1 | (+this._selected);
			var bmp = this.bitmaps[frame];
			var old = this._currentBmp;
			if (!bmp) {
				bmp = this.bitmaps[0];
			}
			if (old != bmp) {
				changed = true;
				removeDisplay(old);
				this._currentBmp = bmp;
			}
			if (changed) {
				if (this.floor) {
					super.addChild(this.floor);
				}
				if (bmp) {
					super.addChild(bmp);
				}
				if (this.txtLabel) {
					super.addChild(this.txtLabel);
				}
				if (this.ceil) {
					super.addChild(this.ceil);
				}
				if (this._children) {
					super.addChild(this._children);
				}
			}
		}

		/**
		 * 绑定TOUCH_TAP的回调
		 * 
		 * @param {Function} handler
		 * @param {*} thisObject
		 * @param {number} [priority]
		 * @param {boolean} [useCapture]
		 * 
		 * @memberOf Button
		 */
		public bindTouch<T>(handler: { (this: T, e?: egret.Event): any }, thisObject: T, priority?: number, useCapture?: boolean) {
			this.on(TouchEvent.TOUCH_TAP, handler, thisObject, useCapture, priority);
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
		public looseTouch(handler: Function, thisObject: any, useCapture?: boolean) {
			this.off(TouchEvent.TOUCH_TAP, handler, thisObject, useCapture);
		}

		public addChild(child: egret.DisplayObject) {
			let children = this._children;
			if (!children) {
				this._children = children = new egret.DisplayObjectContainer;
				this.refresh(true);
			}
			children.addChild(child);
			return child;
		}

		public dispose() {
			super.dispose();
			TouchDown.looseItem(this);
		}

	}
}
