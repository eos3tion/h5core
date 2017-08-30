module junyou {
    export interface IButton extends Component {
        /**
         * 按钮上的标签
         * 
         * @type {string}
         * @memberof IButton
         */
        label: string;

        /**
         * 是否选中
         * 
         * @type {boolean}
         */
        selected: boolean;
		/**
		 * 绑定TOUCH_TAP的回调
		 * 
		 * @template T 
		 * @param {{ (this: T, e?: egret.Event): any }} handler 
		 * @param {T} [thisObject] 
		 * @param {number} [priority] 
		 * @param {boolean} [useCapture] 
		 */
        bindTouch<T>(handler: { (this: T, e?: egret.Event): any }, thisObject?: T, priority?: number, useCapture?: boolean);
		/**
		 * 解除TOUCH_TAP的回调的绑定
		 * 
		 * @param {Function} handler
		 * @param {*} thisObject
		 * @param {boolean} [useCapture]
		 * 
		 * @memberOf Button
		 */
        looseTouch(handler: Function, thisObject?: any, useCapture?: boolean);
    }
}