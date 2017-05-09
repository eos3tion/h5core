/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
module junyou {
    export class TweenManager {

        protected _tweens: Tween[] = [];
        /**
         * 注册过的插件列表
         * Key      {string}            属性
         * Value    {ITweenPlugin[]}    插件列表
         * 
         * @type {{ [index: string]: ITweenPlugin[] }}
         */
        public _plugins: { [index: string]: ITweenPlugin[] } = {};
        /**
         * Returns a new tween instance. This is functionally identical to using "new Tween(...)", but looks cleaner
         * with the chained syntax of TweenJS.
         * <h4>Example</h4>
         *
         *		var tween = createjs. this.get(target);
        *
        * @method get
        * @param {Object} target The target object that will have its properties tweened.
        * @param {TweenOption} [props] The configuration properties to apply to this tween instance (ex. `{loop:true, paused:true}`).
        * All properties default to `false`. Supported props are:
        * <UL>
        *    <LI> loop: sets the loop property on this tween.</LI>
        *    <LI> useTicks: uses ticks for all durations instead of milliseconds.</LI>
        *    <LI> ignoreGlobalPause: sets the {{#crossLink "Tween/ignoreGlobalPause:property"}}{{/crossLink}} property on
        *    this tween.</LI>
        *    <LI> override: if true, `createjs. this.removeTweens(target)` will be called to remove any other tweens with
        *    the same target.
        *    <LI> paused: indicates whether to start the tween paused.</LI>
        *    <LI> position: indicates the initial position for this tween.</LI>
        *    <LI> onChange: specifies a listener for the {{#crossLink "Tween/change:event"}}{{/crossLink}} event.</LI>
        * </UL>
        * @param {Object} [pluginData] An object containing data for use by installed plugins. See individual plugins'
        * documentation for details.
        * @param {Boolean} [override=false] If true, any previous tweens on the same target will be removed. This is the
        * same as calling ` this.removeTweens(target)`.
        * @return {Tween} A reference to the created tween. Additional chained tweens, method calls, or callbacks can be
        * applied to the returned tween instance.
        * @static
        */
        public get(target: any, props?: TweenOption, pluginData?: any, override?: boolean) {
            if (override) {
                this.removeTweens(target);
            }
            return new Tween(target, props, pluginData, this);
        }
        /**
         * 移除指定对象的所有tween
         * Removes all existing tweens for a target. This is called automatically by new tweens if the `override`
         * property is `true`.
         * @method removeTweens
         * @param {Object} target The target object to remove existing tweens from.
         * @static
         */
        public removeTweens(target: any) {
            if (!target.tween_count) {
                return;
            }
            const tweens: Tween[] = this._tweens;
            let j = 0;
            for (let i = 0, len = tweens.length; i < len; i++) {
                let tween = tweens[i];
                if (tween.target == target) {
                    tween.paused = true;
                    tween.onRecycle();
                } else {
                    tweens[j++] = tween;
                }
            }
            tweens.length = j;
            target.tween_count = 0;
        }

        /**
         * 移除单个tween
         * 
         * @param {Tween} twn
         * @returns
         * 
         * @memberOf TweenManager
         */
        public removeTween(twn: Tween) {
            if (!twn) {
                return;
            }
            let tweens: Tween[] = this._tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                let tween = tweens[i];
                if (tween == twn) {
                    tween.paused = true;
                    tweens.splice(i, 1);
                    tween.onRecycle();
                    break;
                }
            }
        }
        /**
         * 暂停某个对象的全部Tween
         * 
         * @static
         * @param {*} target 指定对象
         */
        public pauseTweens(target: any) {
            if (!target.tween_count) {
                return;
            }
            var tweens: Tween[] = this._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i].target == target) {
                    tweens[i].paused = true;
                }
            }
        }
        /**
         * 恢复某个对象的全部Tween
         * 
         * @static
         * @param {*} target 指定对象
         */
        public resumeTweens(target: any): void {
            if (!target.tween_count) {
                return;
            }
            var tweens: Tween[] = this._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i].target == target) {
                    tweens[i].paused = false;
                }
            }
        }
        /**
         * 由外部进行调用，进行心跳
         * Advances all tweens. This typically uses the {{#crossLink "Ticker"}}{{/crossLink}} class, but you can call it
         * manually if you prefer to use your own "heartbeat" implementation.
         * @method tick
         * @param {Number} delta The change in time in milliseconds since the last tick. Required unless all tweens have
         * `useTicks` set to true.
         * @param {Boolean} paused Indicates whether a global pause is in effect. Tweens with {{#crossLink "Tween/ignoreGlobalPause:property"}}{{/crossLink}}
         * will ignore this, but all others will pause if this is `true`.
         * @static
         */
        public tick(delta: number, paused?: boolean) {
            if (!this._tweens.length) {
                return;
            }
            var tweens: Tween[] = this._tweens.concat();
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween: Tween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.tick(tween._useTicks ? 1 : delta);
            }
        }
        /**
         * 将tween注册/注销到管理器中，
         * 
         * @param {Tween} tween 
         * @param {boolean} [value] (description)
         * @returns {void}
         * @private 此方法只允许tween调用
         */
        public _register(tween: Tween, value?: boolean) {
            var target: any = tween.target;
            var tweens: Tween[] = this._tweens;
            if (value && !tween._registered) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
            } else {
                if (target) {
                    target.tween_count--;
                }
                var i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        tween.onRecycle();
                        return;
                    }
                }
            }
        }
        /**
         * Stop and remove all existing tweens.
         * 终止并移除所有的tween
         * @method removeAllTweens
         * @static
         * @since 0.4.1
         */
        public removeAllTweens(): void {
            var tweens: Tween[] = this._tweens;
            for (var i = 0, l = tweens.length; i < l; i++) {
                var tween: Tween = tweens[i];
                tween.paused = true;
                tween.onRecycle();
                tween.target.tweenjs_count = 0;
            }
            tweens.length = 0;
        }

        /**
         * Indicates whether there are any active tweens (and how many) on the target object (if specified) or in general.
         * @method hasActiveTweens
         * @param {Object} [target] The target to check for active tweens. If not specified, the return value will indicate
         * if there are any active tweens on any target.
         * @return {Boolean} If there are active tweens.
         * @static
         */
        public hasActiveTweens(target) {
            if (target) { return target.tweenjs_count != null && !!target.tweenjs_count; }
            return this._tweens && !!this._tweens.length;
        }

        /**
         * Installs a plugin, which can modify how certain properties are handled when tweened. See the {{#crossLink "CSSPlugin"}}{{/crossLink}}
         * for an example of how to write TweenJS plugins.
         * @method installPlugin
         * @static
         * @param {Object} plugin The plugin class to install
         * @param {Array} properties An array of properties that the plugin will handle.
         */
        public installPlugin(plugin: ITweenPlugin, properties: string[]) {
            var priority = plugin.priority;
            if (priority == null) { plugin.priority = priority = 0; }
            for (var i = 0, l = properties.length, p = this._plugins; i < l; i++) {
                var n = properties[i];
                if (!p[n]) { p[n] = [plugin]; }
                else {
                    var arr = p[n];
                    for (var j = 0, jl = arr.length; j < jl; j++) {
                        if (priority < arr[j].priority) { break; }
                    }
                    p[n].splice(j, 0, plugin);
                }
            }
        }

    }
}