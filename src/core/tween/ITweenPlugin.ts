module junyou {
    /**
     * Tween的插件
     * @author 3tion
     */
    export interface ITweenPlugin {
        /**
         * 插件执行优先级
         * 数字越大，执行优先级越高
         * @type {number}
         */
        priority?: number;

        /**
         * Called by TweenJS when a new tween property initializes that this plugin is registered for. Generally, the call
         * to <code>Plugin.init</code> will be immediately followed by a call to <code>Plugin.step</code>.
         * @method init
         * @param {Tween} tween The related tween instance.
         * @param {String} prop The name of the property that is being initialized.
         * @param {any} value The current value of the property on the tween's target.
         * @return {any} The starting tween value for the property. In most cases, you would simply
         * return the value parameter, but some plugins may need to modify the starting value.
         * @static
         **/
        init(tween: Tween, prop: string, value: any);
        /**
         * Called when a tween property advances that this plugin is registered for.
         * @method tween
         * @param {Tween} tween The related tween instance.
         * @param {String} prop The name of the property being tweened.
         * @param {any} value The current tweened value of the property, as calculated by TweenJS.
         * @param {Object} startValues A hash of all of the property values at the start of the current
         * step. You could access the start value of the current property using
         * startValues[prop].
         * @param {Object} endValues A hash of all of the property values at the end of the current
         * step.
         * @param {Number} ratio A value indicating the eased progress through the current step. This
         * number is generally between 0 and 1, though some eases will generate values outside
         * this range.
         * @param {Boolean} wait Indicates whether the current step is a "wait" step.
         * @param {Boolean} end Indicates that the tween has reached the end.
         * @return {any} Return the value that should be assigned to the target property. For example
         * returning <code>Math.round(value)</code> would assign the default calculated value
         * as an integer. Returning Tween.IGNORE will prevent Tween from assigning a value to
         * the target property.
         * @static
         **/
        tween(tween: Tween, prop: string, value: any, startValues: { [index: string]: any }, endValues: { [index: string]: any }, ratio: number, wait: boolean, end: boolean);
        /**
         * Called by TweenJS when a new step is added to a tween that includes a property the plugin is registered for (ie.
         * a new "to" action is added to a tween).
         * @method init
         * @param {Tween} tween The related tween instance.
         * @param {String} prop The name of the property being tweened.
         * @param {any} startValue The value of the property at the beginning of the step. This will
         * be the same as the init value if this is the first step, or the same as the
         * endValue of the previous step if not.
         * @param {Object} injectProps A generic object to which the plugin can append other properties which should be updated on this step.
         * @param {any} endValue The value of the property at the end of the step.
         * @static
         **/
        step(tween: Tween, prop: string, startValue: any, endValue: any, injectProps: any);
    }
}