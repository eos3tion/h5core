module junyou {
    const webp = Global.webp ? Ext.WEBP : "";
    /**
     * 拆分的资源
     * @author 3tion
     */
    export class SplitUnitResource implements IResource {
        /**
        * 资源id
        */
        resID: string;

        url: string;

        /**
         * 资源最后使用时间
         * 
         * @type {number}
         */
        public lastUseTime: number;

        /**
         * 资源加载状态
         */
        public state: RequestState = RequestState.UNREQUEST;

        /**
         * 图片按动作或者方向的序列帧，装箱处理后的图片位图资源
         */
        public bmd: egret.BitmapData;

        /**
         * 关联的纹理
         */
        public textures: JTexture[];

        public get isStatic() {
            return this.state != RequestState.REQUESTING;//加载中，本次不允许卸载
        }

        constructor(uri: string) {
            this.resID = uri;
            this.url = ConfigUtils.getResUrl(uri + webp);
            this.textures = [];
        }

        /**
         * 绑定纹理集
         * 
         * @param {{ [index: number]: JTexture[][] }} textures (description)
         * @param {number[]} adKeys (description)
         */
        public bindTextures(textures: { [index: number]: JTexture[][] }, adKeys: number[]) {
            adKeys.forEach(adKey => {
                let a = PstUtils.getAFromADKey(adKey);
                let dTextures = textures[a];
                if (dTextures) {
                    let d = PstUtils.getDFromADKey(adKey);
                    let textures = dTextures[d];
                    if (textures) {
                        textures.forEach(tex => { this.bindTexture(tex) });
                    }
                }
            });
        }

        /**
         * 绑定纹理
         */
        public bindTexture(tex: JTexture) {
            const textures = this.textures;
            if (!~textures.indexOf(tex)) {
                textures.push(tex);
                if (this.bmd) {
                    tex._bitmapData = this.bmd;
                }
            }
        }

        public load() {
            if (this.state == RequestState.UNREQUEST) {
                this.state = RequestState.REQUESTING;
                //后续尝试直接用ImageLoader加载
                RES.getResByUrl(this.url, this.loadComplete, this, RES.ResourceItem.TYPE_IMAGE);
            }
        }

        /**
         * 资源加载完成
         */
        loadComplete(res: JTexture, key: string) {
            if (key == this.url) {
                if (res) {
                    var bmd = res.bitmapData;
                    this.bmd = bmd;
                    this.state = RequestState.COMPLETE;
                    //将已经请求的位图设置为加载完成的位图
                    const textures = this.textures;
                    for (let i = 0; i < textures.length; i++) {
                        let texture = textures[i];
                        if (texture) {
                            texture._bitmapData = bmd;
                        }
                    }
                }
                else {
                    this.state = RequestState.FAILED;
                }
            }
        }

        dispose() {
            const textures = this.textures;
            for (let i = 0; i < textures.length; i++) {
                let texture = textures[i];
                if (texture) {
                    texture.dispose();
                }
            }
            textures.length = 0;
            if (this.bmd) {
                this.bmd = undefined;
            }
            //将加载状态标记为未加载
            this.state = RequestState.UNREQUEST;
        }
    }
}
