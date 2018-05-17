namespace jy {
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
		 * 设置图片的加载列队优先级
		 */
		qid?: Res.ResQueueID;

		noWebp?: boolean;
		/**
		 * 占位用纹理
		 * 
		 * @type {egret.Texture}
		 * @memberof Image
		 */
		placehoder?: egret.Texture;

		constructor() {
			super();
			this.on(EgretEvent.ADDED_TO_STAGE, this.addedToStage, this);
			this.on(EgretEvent.REMOVED_FROM_STAGE, this.removedFromStage, this);
		}

		addedToStage() {
			if (this.uri) {
				let res = ResManager.getTextureRes(this.uri, this.noWebp);
				if (res) {
					res.qid = this.qid;
					//先设置为占位用，避免有些玩家加载慢，无法看到图
					this.texture = this.placehoder;
					res.bind(this);
					res.load();
				}
			}
		}

		removedFromStage() {
			if (this.uri) {
				let res = <TextureResource>ResManager.getResource(this.uri);
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

	export interface Image extends ComponentWithEnable { };

	addEnable(Image);
}