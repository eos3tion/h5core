module junyou {
	/**
	 * 图片
	 * 外部加载
	 * @pb 
	 *
	 */
	export class Image extends egret.Bitmap {

		/**
         * 资源唯一标识
         */
		uri: string;
		/**
		 * 在flash中设置的大小
		 * 
		 * @type {egret.Rectangle}
		 * @memberOf Image
		 */
		public suiRawRect?: egret.Rectangle;

		noWebp?: boolean;

		constructor() {
			super();
			this.on(EgretEvent.ADDED_TO_STAGE, this.addedToStage, this);
			this.on(EgretEvent.REMOVED_FROM_STAGE, this.removedFromStage, this);
		}

		addedToStage() {
			if (this.uri) {
				let res = ResourceManager.getTextureRes(this.uri, this.noWebp);
				if (res) {
					res.bind(this);
					res.load();
				}
			}
		}

		removedFromStage() {
			if (this.uri) {
				let res = <TextureResource>ResourceManager.getResource(this.uri);
				if (res) {
					res.loose(this);
				}
			}
		}

		/**
		 * 设置资源标识
		 */
		public set source(value: string) {
			if (this.uri == value)
				return;
			if (this.uri) {//解除资源绑定
				this.removedFromStage();
			}
			this.uri = value;
			if (value) {
				if (this.stage) {
					this.addedToStage();
				}
			}
			else {
				this.texture = undefined;
			}
		}

		/**
		 * 销毁图片
		 */
		public dispose() {
			this.removedFromStage();
			this.off(EgretEvent.ADDED_TO_STAGE, this.addedToStage, this);
			this.off(EgretEvent.REMOVED_FROM_STAGE, this.removedFromStage, this);
		}

	}
}