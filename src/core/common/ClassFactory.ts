module junyou {
    /**
     * 
     * 调整ClassFactory
     * @export
     * @class ClassFactory
     * @template T
     */
    export class ClassFactory<T>{

        private _creator: { new (): T };

        private _props: { [index: string]: any };

        /**
         * Creates an instance of ClassFactory.
         * 
         * @param {{ new (): T }} creator
         * @param {{ [index: string]: any }} [props]    属性模板
         */
        public constructor(creator: { new (): T }, props?: { [index: string]: any }) {
            this._creator = creator;
            this._props = props;
        }

        public newInstance() {
            let ins = new this._creator();
            let p = this._props;
            for (let key in p) {
                ins[key] = p[key];
            }
            return ins;
        }
    }
}