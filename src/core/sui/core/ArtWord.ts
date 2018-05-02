namespace jy {
    /**
     * 图片字字库
     * Key为图片文字文件名（不带扩展名）
     * Value为egret.Texture
     * 
     * @export
     * @class ArtWord
     * @author 3tion
     */
    export class ArtWord {

        private _txs: { [index: string]: egret.Texture } = {};

        /**
         * 获取纹理数据
         * 
         * @param {Key} key
         * @returns
         * 
         * @memberOf ArtWord
         */
        public getTexture(key: Key) {
            return this._txs[key];
        }
        private _suiData: SuiData;
        /**
         * 字库名称
         * 
         * 
         * @memberOf ArtWord
         * @readonly
         */
        public readonly name: string;
        constructor(name: string) {
            this.name = name;
        }

        public parseData(data: any[][], suiData: SuiData) {
            this._suiData = suiData;
            // const imgs = suiData.pngtexs;
            const txs = this._txs;
            for (let i = 0, len = data.length; i < len; i++) {
                let dat = data[i];
                let key = dat[0];
                txs[key] = suiData.getTexture(dat[1]);//imgs[dat[1]];
            }
            refreshTexs(suiData, this as any);
        }
    }
}