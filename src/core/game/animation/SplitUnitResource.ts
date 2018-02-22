module junyou {
    /**
     * 拆分的资源
     * @author 3tion
     */
    export class SplitUnitResource implements IResource {
        /**
        * 资源id
        */
        readonly uri: string;

        readonly url: string;

        qid: Res.ResQueueID;

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
            return this.state == RequestState.REQUESTING;//加载中，本次不允许卸载
        }

        constructor(uri: string, url: string) {
            this.uri = uri;
            this.url = url;
            this.textures = [];
        }

        /**
         * 绑定纹理集
         * 
         * @param {{ [index: number]: JTexture[][] }} textures (description)
         * @param {number[]} adKeys (description)
         */
        public bindTextures(textures: { [index: number]: JTexture[][] }, adKey: ADKey) {
            let a = ADKey.getAction(adKey);
            let dTextures = textures[a];
            if (dTextures) {
                let d = ADKey.getDirection(adKey);
                let textures = dTextures[d];
                if (textures) {
                    for (let i = 0; i < textures.length; i++) {
                        this.bindTexture(textures[i]);
                    }
                }
            }
        }

        /**
         * 绑定纹理
         */
        public bindTexture(tex: JTexture) {
            const textures = this.textures;
            if (!~textures.indexOf(tex)) {
                textures.push(tex);
                if (this.bmd) {
                    tex.$bitmapData = this.bmd;
                }
            }
        }

        public load() {
            if (this.state == RequestState.UNREQUEST) {
                this.state = RequestState.REQUESTING;
                Res.load(this.uri, this.url, CallbackInfo.get(this.loadComplete, this), this.qid);
            }
        }

        /**
         * 资源加载完成
         */
        loadComplete(item: Res.ResItem) {
            let { uri, data } = item;
            if (uri == this.uri) {
                if (data) {
                    let bmd = data.bitmapData as egret.BitmapData;
                    this.bmd = bmd;
                    this.state = RequestState.COMPLETE;
                    //将已经请求的位图设置为加载完成的位图
                    const textures = this.textures;
                    for (let i = 0; i < textures.length; i++) {
                        let texture = textures[i];
                        if (texture) {
                            texture.$bitmapData = bmd;
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
