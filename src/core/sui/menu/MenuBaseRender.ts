module junyou {

    /**
     * @author gushuai
     * (description)
     * 
     * @export
     * @class MenuBaseRender
     * @extends {egret.Sprite}
     * @template T
     */
    export class MenuBaseRender<T extends MenuBaseVO> {

        protected _data: T;

        protected _skin: egret.DisplayObject;

        protected _size: egret.Rectangle;
        protected itemClick() {
            let data = this._data;
            if (data) {
                let callBack = data.callBack;
                if (callBack) {
                    callBack.call(Menu.currentShow, data);
                }
            }
        }

        public getSize() {
            return this._size;
        }

        public set data(value: T) {
            this.$setData(value);
        }

        /**
         * 只允许子类重写
         * @protected
         */
        protected $setData(val: T) {
            this._data = val;
        }

        public get data(): T {
            return this._data;
        }

        public set skin(value: egret.DisplayObject) {
            if (value != this._skin) {
                this.$setSkin(value);
            }
        }

        public get skin() {
            return this._skin;
        }

        protected $setSkin(value: egret.DisplayObject) {
            this._skin = value;
            this._size = value.getBounds();
            value.on(egret.TouchEvent.TOUCH_TAP, this.itemClick, this);
            this.bindComponent();
        }

        protected bindComponent() {

        }

        public get view() {
            return this._skin;
        }
    }
}