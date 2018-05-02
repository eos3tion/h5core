/**
 * 参考createjs和白鹭的tween
 * 调整tick的驱动方式
 * https://github.com/CreateJS/TweenJS
 * @author 3tion
 */
namespace jy {
    export const enum TweenActionMode {
        /**
         * Constant defining the none actionsMode for use with setPosition.
         */
        NONE = 0,
        /**
         * Constant defining the loop actionsMode for use with setPosition. 
         */
        LOOP = 1,
        /**
         * Constant defining the reverse actionsMode for use with setPosition.
         */
        REVERSE = 2,

    }

    export interface TweenAction {
        /**
         * 回调函数
         */
        f: Function;
        /**
         * 回调函数的this指针
         */
        o: Object;
        /**
         * 执行的持续时间
         */
        t?: number;
        /**
         * 回调函数的参数列表
         */
        p: any[];
    }

    export interface TweenStep {
        /**
         * 执行的持续时间
         */
        t: number;

        p0: Object;

        p1: Object;

        e: IEaseFunction;

        /**
         * The duration of the wait in milliseconds (or in ticks if `useTicks` is true)
         */
        d: number;

        v?: boolean;
    }

    export interface TweenOption {

        /**
         * 是否循环执行
         * sets the loop property on this tween
         * @type {boolean}
         * @memberOf TweenOption
         */
        loop?: boolean;

        /**
         * uses ticks for all durations instead of milliseconds.
         * 
         * @type {boolean}
         * @memberOf TweenOption
         */
        useTicks?: boolean;

        /**
         * 是否忽略全局暂停
         * sets the {{#crossLink "Tween/ignoreGlobalPause:property"}}{{/crossLink}} property on this tween.
         * 
         * @type {boolean}
         * @memberOf TweenOption
         */
        ignoreGlobalPause?: boolean;

        /**
         * 如果设置为true,则绑定到同一目标的其他tween将被移除
         * if true, `Tween.removeTweens(target)` will be called to remove any other tweens with the same target
         * @type {boolean}
         * @memberOf TweenOption
         */
        override?: boolean;

        /**
         * 设置tween是否暂停
         * indicates whether to start the tween paused
         * @type {boolean}
         * @memberOf TweenOption
         */
        paused?: boolean;

        /**
         * 设置Tween的初始位置
         * indicates the initial position for this tween
         * @type {number}
         * @memberOf TweenOption
         */
        position?: number;

        /**
         * 指定是否监听change事件回调
         * specifies a listener for the "change" event
         * @type {Function}
         * @memberOf TweenOption
         */
        onChange?: { (e?: egret.Event) };

        /**
         * onChange的回调执行对象
         * 
         * @type {*}
         * @memberOf TweenOption
         */
        onChangeObj?: any;

        /**
         * 是否将数值处理为整形
         * 
         * @type {{ [index: string]: number }}
         * @memberOf TweenOption
         */
        int?: { [index: string]: number }
    }


    export class Tween extends egret.EventDispatcher {

        /**
         * Constant returned by plugins to tell the tween not to use default assignment.
         * @property IGNORE
         * @type Object
         * @static
         */
        public static IGNORE = {};

        protected _manager: TweenManager;

        public target: any;
        public _registered: boolean;
        public _useTicks: boolean;

        ignoreGlobalPause: boolean;

        loop: boolean = false;

        pluginData: any;


        /**
         * 当前序列的属性值
         * 
         * @type {{ [index: string]: any }}
         */
        _curQueueProps: any;//{ [index: string]: any };

        /**
         * 初始状态的属性值
         * 
         * @private
         * @type {{ [index: string]: any }}
         */
        protected _initQueueProps: { [index: string]: any };

        protected _steps: TweenStep[];

        protected _actions: TweenAction[];

        paused: boolean;

        duration: number = 0;

        protected _prevPos: number = -1;

        position: number = null;

        protected _prevPosition: number = 0;

        protected _stepPosition: number = 0;

        protected _int: { [index: string]: number };

        passive: boolean = false;

        constructor(target: any, props: TweenOption, pluginData: any, manager: TweenManager) {
            super();
            this.initialize(target, props, pluginData, manager);
        }


        private initialize(target: any, props: TweenOption, pluginData: any, manager: TweenManager): void {
            this.target = target;
            let oldManager = this._manager;
            if (oldManager && oldManager != manager) {
                oldManager.removeTweens(target);
            }
            if (props) {
                this._useTicks = props.useTicks;
                this.ignoreGlobalPause = props.ignoreGlobalPause;
                this.loop = props.loop;
                props.onChange && this.on(EventConst.TWEEN_CHANGE, props.onChange, props.onChangeObj);
                if (props.override) {
                    manager.removeTweens(target);
                }
                this._int = props.int;
            }
            this._manager = manager;
            this.pluginData = pluginData || {};
            this._curQueueProps = {};
            this._initQueueProps = {};
            this._steps = [];
            this._actions = [];
            if (props && props.paused) {
                this.paused = true;
            }
            else {
                manager._register(this, true);
            }
            if (props && props.position != null) {
                this.setPosition(props.position, TweenActionMode.NONE);
            }
        }

        /**
         * 将tween设置到一个指定的时间点
         * Advances the tween to a specified position.
         * @method setPosition
         * @param {Number} value The position to seek to in milliseconds (or ticks if useTicks is true).
         * @param {Number} [actionsMode=1] Specifies how actions are handled (ie. call, set, play, pause):
         * <ul>
         *      <li>{{#crossLink "Tween/NONE:property"}}{{/crossLink}} (0) - run no actions.</li>
         *      <li>{{#crossLink "Tween/LOOP:property"}}{{/crossLink}} (1) - if new position is less than old, then run all
         *      actions between old and duration, then all actions between 0 and new.</li>
         *      <li>{{#crossLink "Tween/REVERSE:property"}}{{/crossLink}} (2) - if new position is less than old, run all
         *      actions between them in reverse.</li>
         * </ul>
         * @return {Boolean} Returns `true` if the tween is complete (ie. the full tween has run & {{#crossLink "Tween/loop:property"}}{{/crossLink}}
         * is `false`).
         */
        public setPosition(value: number, actionsMode: TweenActionMode = TweenActionMode.LOOP): boolean {
            if (value < 0) {
                value = 0;
            }
            // normalize position:
            var t: number = value;
            var end: boolean = false;
            if (t >= this.duration) {
                if (this.loop) {
                    t = t % this.duration;
                }
                else {
                    t = this.duration;
                    end = true;
                }
            }
            if (t == this._prevPos) {
                return end;
            }
            var prevPos = this._prevPos;
            this.position = this._prevPos = t;
            this._prevPosition = value;
            // handle tweens:
            if (this.target) {
                if (end) {
                    // addresses problems with an ending zero length step.
                    this._updateTargetProps(null, 1);
                } else if (this._steps.length > 0) {
                    // find our new tween index:
                    for (var i = 0, l = this._steps.length; i < l; i++) {
                        if (this._steps[i].t > t) {
                            break;
                        }
                    }
                    var step = this._steps[i - 1];
                    this._updateTargetProps(step, (this._stepPosition = t - step.t) / step.d);
                }
            }

            if (end) {
                this.setPaused(true);
            }

            // run actions:
            if (actionsMode != TweenActionMode.NONE && this._actions.length > 0) {
                if (this._useTicks) {
                    // only run the actions we landed on.
                    this._runActions(t, t);
                } else if (actionsMode == TweenActionMode.LOOP && t < prevPos) {
                    if (prevPos != this.duration) {
                        this._runActions(prevPos, this.duration);
                    }
                    this._runActions(0, t, true);
                } else {
                    this._runActions(prevPos, t);
                }
            }
            this.dispatch(<any>EventConst.TWEEN_CHANGE);
            return end;
        }


        private _runActions(startPos: number, endPos: number, includeStart: boolean = false) {
            var sPos: number = startPos;
            var ePos: number = endPos;
            var i: number = -1;
            var j: number = this._actions.length;
            var k: number = 1;
            if (startPos > endPos) {
                //把所有的倒置
                sPos = endPos;
                ePos = startPos;
                i = j;
                j = k = -1;
            }
            while ((i += k) != j) {
                var action = this._actions[i];
                var pos = action.t;
                if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                    action.f.apply(action.o, action.p);
                }
            }
        }


        private _updateTargetProps(step: TweenStep, ratio: number) {
            var p0: { [index: string]: any }, p1: { [index: string]: any }, v, v0, v1, arr: ITweenPlugin[];
            if (!step && ratio == 1) {
                this.passive = false;
                p0 = p1 = this._curQueueProps;
            } else {
                this.passive = !!step.v;
                //不更新props.
                if (this.passive) {
                    return;
                }
                //使用ease
                if (step.e) {
                    ratio = step.e(ratio, 0, 1, 1);
                }
                p0 = step.p0;
                p1 = step.p1;
            }

            for (var n in this._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = this._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof v0 != "number")) {
                    v = ratio == 1 ? v1 : v0;
                } else {
                    v = v0 + (v1 - v0) * ratio;
                }

                var ignore = false;
                if (arr = this._manager._plugins[n]) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                        if (v2 == Tween.IGNORE) {
                            ignore = true;
                        }
                        else {
                            v = v2;
                        }
                    }
                }
                if (!ignore) {
                    if (this._int && this._int[n]) v = Math.round(v);
                    this.target[n] = v;
                }
            }
        }

        private _addStep(o): Tween {
            if (o.d > 0) {
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        }


        private _appendQueueProps(o): any {
            var arr: ITweenPlugin[], oldValue, i, l, injectProps;
            for (var n in o) {
                if (this._initQueueProps[n] === undefined) {
                    oldValue = this.target[n];
                    //设置plugins
                    if (arr = this._manager._plugins[n]) {
                        for (i = 0, l = arr.length; i < l; i++) {
                            oldValue = arr[i].init(this, n, oldValue);
                        }
                    }
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                } else {
                    oldValue = this._curQueueProps[n];
                }
            }

            for (var n in o) {
                oldValue = this._curQueueProps[n];
                if (arr = this._manager._plugins[n]) {
                    injectProps = injectProps || {};
                    for (i = 0, l = arr.length; i < l; i++) {
                        if (arr[i].step) {
                            arr[i].step(this, n, oldValue, o[n], injectProps);
                        }
                    }
                }
                this._curQueueProps[n] = o[n];
            }
            if (injectProps) {
                this._appendQueueProps(injectProps);
            }
            return this._curQueueProps;
        }


        private _addAction(o: TweenAction): Tween {
            o.t = this.duration;
            this._actions.push(o);
            return this;
        }


        private _set(props: any, o): void {
            for (var n in props) {
                o[n] = props[n];
            }
        }


        /**
         * 暂停或者播放tween
         * Pauses or plays this tween.
         * @method setPaused
         * @param {Boolean} [value=true] Indicates whether the tween should be paused (`true`) or played (`false`). true 暂停   false 播放
         * @return {Tween} This tween instance (for chaining calls)
         */
        public setPaused(value: boolean): Tween {
            this.paused = value;
            this._manager._register(this, !value);
            return this;
        }

        /**
         * 排列一个等待时间
         * Queues a wait (essentially an empty tween).
         * <h4>Example</h4>
         *
         *		//This tween will wait 1s before alpha is faded to 0.
         *		createjs.Tween.get(target).wait(1000).to({alpha:0}, 1000);
         *
         * @method wait
         * @param {Number} duration The duration of the wait in milliseconds (or in ticks if `useTicks` is true).
         * @param {Boolean} [passive] Tween properties will not be updated during a passive wait. This
         * is mostly useful for use with {{#crossLink "Timeline"}}{{/crossLink}} instances that contain multiple tweens
         * affecting the same target at different times.
         * @return {Tween} This tween instance (for chaining calls).
         **/
        public wait(duration: number, passive?: boolean): Tween {
            if (duration == null || duration <= 0) {
                return this;
            }
            var o = this._curQueueProps.clone()
            return this._addStep({ d: duration, p0: o, p1: o, v: passive });
        }


        /**
         * 让目标在duration的时间内，按照ease的差值算法，变为指定的属性
         * Queues a tween from the current values to the target properties. Set duration to 0 to jump to these value.
         * Numeric properties will be tweened from their current value in the tween to the target value. Non-numeric
         * properties will be set at the end of the specified duration.
         * <h4>Example</h4>
         *
         *		createjs.Tween.get(target).to({alpha:0}, 1000);
         *
         * @method to
         * @param {Object} props An object specifying property target values for this tween (Ex. `{x:300}` would tween the x
         * property of the target to 300).
         * @param {number} [duration=0] The duration of the wait in milliseconds (or in ticks if `useTicks` is true).
         * @param {IEaseFunction} [ease="linear"] The easing function to use for this tween. See the {{#crossLink "Ease"}}{{/crossLink}}
         * class for a list of built-in ease functions.
         * @return {Tween} This tween instance (for chaining calls).
         */
        public to(props: Object, duration?: number, ease?: IEaseFunction): Tween {
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            return this._addStep({ d: duration || 0, p0: this._curQueueProps.clone(), e: ease, p1: this._appendQueueProps(props).clone() });
        }


        /**
         * 排列一个指定的函数进行执行
         * Queues an action to call the specified function.
         * <h4>Example</h4>
         *
         *   	//would call myFunction() after 1 second.
         *   	myTween.wait(1000).call(myFunction);
         *
         * @method call
         * @param {Function} callback The function to call.
         * @param {Array} [params]. The parameters to call the function with. If this is omitted, then the function
         *      will be called with a single param pointing to this tween.
         * @param {Object} [scope]. The scope to call the function in. If omitted, it will be called in the target's
         *      scope.
         * @return {Tween} This tween instance (for chaining calls).
         */
        public call(callback: Function, thisObj?: any, ...params: any[]): Tween {
            return this._addAction({ f: callback, p: params, o: thisObj ? thisObj : this.target });
        }


        /**
         * 设置属性
         * Queues an action to set the specified props on the specified target. If target is null, it will use this tween's
         * target.
         * <h4>Example</h4>
         *
         *		myTween.wait(1000).set({visible:false},foo);
         *
         * @method set
         * @param {Object} props The properties to set (ex. `{visible:false}`).
         * @param {Object} [target] The target to set the properties on. If omitted, they will be set on the tween's target.
         * @return {Tween} This tween instance (for chaining calls).
         */
        public set(props: any, target?: any): Tween {
            return this._addAction({ f: this._set, o: this, p: [props, target || this.target] });
        }


        /**
         * 排列一个其他的tween来执行（如果不赋值，则执行自己）
         * Queues an action to play (unpause) the specified tween. This enables you to sequence multiple tweens.
         * <h4>Example</h4>
         *
         *		myTween.to({x:100},500).play(otherTween);
         *
         * @method play
         * @param {Tween} tween The tween to play.
         * @return {Tween} This tween instance (for chaining calls).
         */
        public play(tween?: Tween): Tween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, false);
        }


        /**
         * 排列一个tween的暂停操作，如果tween不赋值，则暂停自己
         * Queues an action to pause the specified tween.
         * @method pause
         * @param {Tween} tween The tween to pause. If null, it pauses this tween.
         * @return {Tween} This tween instance (for chaining calls)
         */
        public pause(tween?: Tween): Tween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, true);
        }


        /**
         * 进行一次tick
         * Advances this tween by the specified amount of time in milliseconds (or ticks if`useTicks` is `true`).
         * This is normally called automatically by the Tween engine (via {{#crossLink "Tween/tick"}}{{/crossLink}}), but is
         * exposed for advanced uses.
         * @method tick
         * @param {Number} delta The time to advance in milliseconds (or ticks if `useTicks` is `true`).
         */
        public tick(delta: number): void {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        }

        public onRecycle() {
            this._int = undefined;
        }
    }
}
