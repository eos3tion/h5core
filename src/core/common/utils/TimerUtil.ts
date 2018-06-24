namespace jy {
    /**
     * GTimer
     */
    interface GTimer {
        /**
         * 标识
         */
        tid: number;
        /**
         * 回调列表
         */
        list: CallbackInfo<Function>[];

        nt: number;

    }

    const _timeobj: { [index: number]: GTimer } = {};
    let tmpList: CallbackInfo<Function>[] = [];
    let willDeleted: string[] = [];

    function tick(now: number) {
        let d = 0;
        for (let key in _timeobj) {
            let timer = _timeobj[key];
            if (timer.nt < now) {
                timer.nt = now + timer.tid;
                let list = timer.list;
                let len = list.length;
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        tmpList[i] = list[i];
                    }
                    for (let i = 0; i < len; i++) {
                        tmpList[i].execute(false);
                    }
                }
                len = list.length;
                if (len == 0) {
                    willDeleted[d++] = key;
                }
            }
        }
        for (let i = 0; i < d; i++) {
            delete _timeobj[willDeleted[i]];
        }
    }

    function getInterval(time: number) {
        return Math.ceil(time / 10) * 10;
    }

    /**
     * 
     * 注册回调  会对在同一个时间区间的 `callback`和`thisObj`相同的回调函数进行去重
     * @static
     * @param {number} time 回调的间隔时间，间隔时间会处理成30的倍数，向上取整，如 设置1ms，实际间隔为30ms，32ms，实际间隔会使用60ms
     * @param {Function} callback 回调函数，没有加this指针是因为做移除回调的操作会比较繁琐，如果函数中需要使用this，请通过箭头表达式()=>{}，或者将this放arg中传入
     * @param {any} [thisObj] 回调函数的`this`对象，不传值则使用全局上下文即window
     * @param {any} args 回调函数的参数
     */
    function addCallback(time: number, callback: Function, thisObj?: any, ...args) {
        time = getInterval(time);
        let timer = _timeobj[time];
        if (!timer) {
            let list: CallbackInfo<Function>[] = [];
            timer = <GTimer>{ tid: time, nt: Global.now + time, list };
            _timeobj[time] = timer;
            list.push(CallbackInfo.get(callback, thisObj, ...args));
        } else {
            CallbackInfo.addToList(timer.list, callback, thisObj, ...args);
        }
    }

    /**
     * 注册回调 会对在同一个时间区间的 `callback`相同的情况下，才会去重
     * @param time 
     * @param callback 
     */
    function add(time: number, callback: $CallbackInfo) {
        time = getInterval(time);
        let timer = _timeobj[time];
        if (!timer) {
            timer = <GTimer>{ tid: time, nt: Global.now + time, list: [] };
            _timeobj[time] = timer;
        }
        timer.list.pushOnce(callback);
    }

    /**
     * 移除回调
     * 不回收`CallbackInfo`
     * @param {number} time
     * @param {$CallbackInfo} callback
     */
    function remove(time: number, callback: $CallbackInfo) {
        time = getInterval(time);
        let timer = _timeobj[time];
        if (timer) {
            timer.list.remove(callback);
        }
    }

    /**
     * 移除回调
     * @static
     * @param {number} time         回调的间隔时间，间隔时间会处理成30的倍数，向上取整，如 设置1ms，实际间隔为30ms，32ms，实际间隔会使用60ms
     * @param {Function} callback   回调函数，没有加this指针是因为做移除回调的操作会比较繁琐，如果函数中需要使用this，请通过箭头表达式()=>{}，或者将this放arg中传入
     * @param {*} [thisObj]         回调函数的`this`对象
     */
    function removeCallback(time: number, callback: Function, thisObj?: any) {
        time = getInterval(time);
        let timer = _timeobj[time];
        if (timer) {
            let list = timer.list;
            let info = CallbackInfo.removeFromList(list, callback, thisObj);
            if (info) {
                info.recycle();
            }
        }
    }

    export const TimerUtil = { addCallback, removeCallback, tick, add, remove };
}