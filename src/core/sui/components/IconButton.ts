module junyou {

	/**
	 * 图标按鈕
	 * @pb 
	 *
	 */
	export class IconButton extends Button {
		/*图标布局位置*/
		private _iconLayout: number;

		private _iconContainer: egret.Sprite;

		private _icon: Image;

		private _iconSource: string;

		public constructor() {
			super();
			this.initComponent();
		}

		private initComponent() {
			this._iconContainer = new egret.Sprite();
			this.addChild(this._iconContainer);
			this._iconLayout = LayoutType.TOP_LEFT;
		}

		/**
		 * 设置按钮上的图标 
		 * 支持layout
		 */
		public set icon(value: Image) {
			this._icon = value;
			if (value) {
				this._iconSource = value.source;
				this._iconContainer.removeChildren();
				this._iconContainer.addChild(value);
				this.updateDisplayList();
			}
		}

		public get icon(): Image {
			return this._icon;
		}

		/*图标加载完成后layout*/
		private iconComplete() {
			this.updateDisplayList();
		}

		/**
		 * 设置按钮上的图标资源uri 
		 */
		public set iconSource(value: string) {
			if (this._iconSource == value)
				return;
			this._icon.once(EventConst.Texture_Complete, this.iconComplete, this);
			this._iconSource = value;
			this._icon.source = value;
		}

		public get iconSource(): string {
			return this._iconSource;
		}

		private updateDisplayList() {
			if (this._icon && this._icon.parent)
				this.layout();
		}

		/**
		 * 调整图标在按钮上的位置
		 */
		private layout() {
			Layout.layout(this._iconContainer, this._iconLayout, 0, 0, true, true, this);
		}

		/*设置图标布局*/
		public set iconLayout(value: number) {
			this._iconLayout = value;
			this.updateDisplayList();
		}

		public get iconLayout(): number {
			return this._iconLayout;
		}

	}
}