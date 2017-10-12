module junyou {
	export interface ProgressBarSkinDele {
		/**
		 * 进度条的顶
		 * 
		 * @type {egret.DisplayObject}
		 * @memberof ProgressBarSkin
		 */
		bar: egret.DisplayObject;

		/**
		 * 进度条背景
		 * 
		 * @type {egret.DisplayObject}
		 * @memberof ProgressBarSkin
		 */
		bg?: egret.DisplayObject;

		/**
		 * 进度条文本框
		 * 
		 * @type {egret.TextField}
		 * @memberof ProgressBarSkin
		 */
		tf?: egret.TextField;
	}

	/**
	 * 进度条
	 * @author 3tion 
	 *
	 */
	export class ProgressBar extends Component {

		public static defaultLabelFunction = function (value: number, maxValue: number) {
			return value + " / " + maxValue;
		}
		bg: egret.DisplayObject;

		tf: egret.TextField;

		bar: egret.DisplayObject;

		protected _labelFun = ProgressBar.defaultLabelFunction;

		protected _value: number = 0;

		protected _maxValue: number = 1;

		/**
		 * 背景和bar的差值
		 * 
		 * @protected
		 */
		protected _delta = 0;

		protected _barWidth: number;

		/**
		 * 
		 * 进度条的bar是否按遮罩的方式控制
		 * @type {boolean}
		 */
		public useMask: boolean;

		protected _skin: ProgressBarSkinDele;

		public constructor() {
			super();
		}

		public get labelFun(): (value: number, maxValue: number) => string {
			return this._labelFun;
		}

		/**自定义文本显示方法*/
		public set labelFun(value: (value: number, maxValue: number) => string) {
			if (this._labelFun != value) {
				this._labelFun = value;
				this.refresh();
			}
		}

		/**
		 * 设置进度条宽度
		 * 
		 * @param {number} width 
		 */
		setWidth(width: number) {
			const { bg, bar, tf } = this;
			if (bg) {
				bg.width = width;
			}
			bar.width = width - this._delta;
		}

		set skin(skin: ProgressBarSkinDele) {
			if (this._skin != skin) {
				this._skin = skin;
				const { bg, bar, tf } = skin;
				this.bar = bar;
				this._barWidth = bar.width;
				if (bg) {
					this.bg = bg;
					this._delta = bg.width - bar.width;
				}
				this.tf = tf;
			}
		}



		/*设置进度*/
		public progress(value: number, maxValue: number) {
			if (value < 0) {
				value = 0;
			}
			if (maxValue < 0) {
				if (DEBUG) {
					ThrowError("进度条最大宽度不应小等于0");
				}
				maxValue = 0.00001;
			}
			if (value > maxValue) {
				value = maxValue;
			}
			this._value = value;
			this._maxValue = maxValue;
			this.refresh();
		}

		/*更新文本显示*/
		private updateLabel() {
			let tf = this.tf;
			let fun = this._labelFun;
			if (tf && fun) {
				tf.text = fun(this._value, this._maxValue);
			}
		}

		/*更新进度条显示*/
		private updateBar() {
			let bar = this.bar;
			let v = this._value * this._barWidth / this._maxValue;
			if (this.useMask) {
				let rect = bar.scrollRect;
				if (!rect) {
					rect = new egret.Rectangle(0, 0, 0, bar.height);
				}
				rect.width = v;
				bar.scrollRect = rect;
			} else {
				bar.width = v;
			}
		}

		/*更新显示*/
		private refresh() {
			this.updateLabel();
			this.updateBar();
		}
	}
	/**
	 * 进度条创建
	 *
	 */
	export class ProgressBarCreator extends BaseCreator<ProgressBar>{

		public parseSelfData(data: any) {
			this._createT = () => {
				let progressBar: ProgressBar = new ProgressBar();
				let len = data.length;
				let item, tf: egret.TextField, bar: egret.DisplayObject, bg: egret.DisplayObject;
				for (let i = 0; i < len; i++) {
					item = data[i];
					if (item) {
						let dis = this.createElement(item);
						if (i == 0) {
							tf = <egret.TextField>dis;
						} else if (i == 1) {
							bar = <egret.Bitmap>dis;
						} else if (i == 2) {
							bg = <egret.Bitmap>dis;
						}
					}
				}
				if (bg) {
					progressBar.addChild(bg);
				}
				if (bar) {
					progressBar.addChild(bar);
				}
				if (tf) {
					progressBar.addChild(tf);
				}
				progressBar.skin = { bg, bar, tf };
				return progressBar;
			}
		}
	}

	/**
	 * MC进度条创建
	 * 
	 * @export
	 * @class MCProgressCreator
	 * @extends {BaseCreator<ProgressBar>}
	 */
	export class MCProgressCreator extends BaseCreator<ProgressBar> {
		public parseSelfData(data: any) {
			let suiData = this._suiData;
			let framesData = MovieClipCreator.prototype.$getFramesData(data);
			this._createT = () => {
				let mc = new MovieClip(data, framesData, suiData) as any;
				let bar = new ProgressBar();
				bar.addChild(mc);
				bar.skin = mc;
				return bar;
			}
		}
	}
}
