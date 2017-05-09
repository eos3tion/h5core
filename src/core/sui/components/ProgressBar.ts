module junyou {

	/**
	 * 进度条
	 * @author 3tion 
	 *
	 */
	export class ProgressBar extends Component {

		public static defaultLabelFunction = function (value: number, maxValue: number) {
			return value + " / " + maxValue;
		}
		private _bg: egret.Bitmap;

		private _tf: egret.TextField;

		private _bar: egret.Bitmap;

		private _labelFunction = ProgressBar.defaultLabelFunction;

		private _value: number = 0;

		private _maxValue: number = 1;

		private _barWidth: number;

		public constructor() {
			super();
			this.initComponent();
		}

		private initComponent() {

		}

		public get labelFunction(): (value: number, maxValue: number) => string {
			return this._labelFunction;
		}

		/**自定义文本显示方法*/
		public set labelFunction(value: (value: number, maxValue: number) => string) {
			if (this._labelFunction != value) {
				this._labelFunction = value;
				this.updateDisplayList();
			}
		}

		public set bg(bg: egret.Bitmap) {
			this._bg = bg;
			this.addChildAt(bg, 0);
		}

		/*传入进度条九宫控件*/
		public set bar(bar: egret.Bitmap) {
			this._bar = bar;
			this._barWidth = bar.width;
			if (bar) {
				this.addChild(bar);
			}
			if (this._tf) {
				this.addChild(this._tf);
			}
		}

		/*传入文本控件*/
		public set tf(tf: egret.TextField) {
			this._tf = tf;
			if (tf) {
				this.addChild(tf);
			}
		}

		public get tf(): egret.TextField {
			return this._tf;
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
			this.updateDisplayList();
		}

		/*更新文本显示*/
		private updateLabelDisplay() {
			let tf = this._tf;
			let fun = this._labelFunction;
			if (tf && fun) {
				tf.text = fun(this._value, this._maxValue);
			}
		}

		/*更新进度条显示*/
		private updateBarDisplay() {
			this._bar.width = this._value * this._barWidth / this._maxValue;
		}

		/*更新显示*/
		private updateDisplayList() {
			if (this._tf) {
				this.updateLabelDisplay();
			}
			this.updateBarDisplay();
		}
	}
}