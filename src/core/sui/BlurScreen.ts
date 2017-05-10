module junyou {
    /**
     * 
     * 用于弹出窗口，并将下层模糊的工具类
     * @export
     * @class BlurScreen
     * @author gushuai
     */
    export class BlurScreen {

        protected _engine: GameEngine;

        /**
         * 用于显示的位图对象
         * 
         * @protected
         * @type {egret.Bitmap}
         */
        protected _bmp: egret.Bitmap;

        protected _stage: egret.Stage;

        /**
         * 用于绘制的临时容器
         * 
         * @protected
         * @type {egret.Sprite}
         */
        protected _con: egret.Sprite;

        /**
         * 用于绘制的RenderTexture
         * 
         * @protected
         * @type {egret.RenderTexture}
         */
        protected _tex: egret.RenderTexture;

        /**
         * 模块id和层绑定的字典  
         * key      {number}            模块id  
         * value    {GameLayer[]}    层id的数组
         * 
         * @protected
         * @type {{ [index: number]: GameLayer[] }}
         */
        protected _dic: { [index: number]: GameLayer[] };

        protected _current: Key;

        public constructor() {
            this._engine = GameEngine.instance;
            this._bmp = new egret.Bitmap();
            this._stage = egret.sys.$TempStage;
            this._con = new egret.Sprite();
            this._tex = new egret.RenderTexture();
            this._dic = {};
        }

        public registerModuleLayers(moduleid: Key, ...ids: GameLayerID[]) {
            let dic = this._dic;
            let layers = ids.map(id => this._engine.getLayer(id));
            layers.doSort("id");
            dic[moduleid] = layers;
        }

        public checkShowBlur(id: Key) {
            let dic = this._dic;
            let layers = dic[id];
            this._current = id;
            if (layers && layers.length) {
                this._stage.on(egret.Event.RESIZE, this.drawBlur, this);
                this.drawBlur();
            }
        }

        public checkHideBlur(id: Key) {
            this._current = id;
            let dic = this._dic;
            let layers = dic[id];
            if (layers && layers.length) {
                this.hideBlur();
            }
        }

        protected drawBlur(e?: egret.Event) {
            if (e) {
                dispatch(EventConst.ReLayout);
            }
            let tex = this._tex;
            let bmp = this._bmp;
            let stage = this._stage;
            let layers = this._dic[this._current];
            if (layers) {
                let con = this._con;
                let len = layers.length;
                for (let i = 0; i < len; i++) {
                    let layer = layers[i];
                    con.addChild(layer);
                }
                tex.drawToTexture(con);
                con.removeChildren();
                bmp.texture = tex;
                bmp.refreshBMD();
                bmp.filters = FilterUtils.blur;
                stage.addChildAt(bmp, 0);
            }
        }

        public hideBlur() {
            this._stage.off(egret.Event.RESIZE, this.drawBlur, this);
            removeDisplay(this._bmp);
            this._tex.$renderBuffer.resize(0, 0);
            let layers = this._dic[this._current];
            if (layers) {
                let len = layers.length;
                let engine = this._engine;
                for (let i = 0; i < len; i++) {
                    let layer = layers[i];
                    this._engine.awakeLayer(layer.id);
                }
            }
        }
    }
}