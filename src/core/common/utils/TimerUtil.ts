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
     * 注册回调
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
            timer = <GTimer>{};
            timer.tid = time;//setInterval(check, time, timer);
            timer.nt = Global.now + time;
            let list: CallbackInfo<Function>[] = [];
            timer.list = list;
            _timeobj[time] = timer;
            list.push(CallbackInfo.get(callback, thisObj, ...args));
        } else {
            CallbackInfo.addToList(timer.list, callback, thisObj, ...args);
        }
    }

    /**
     * 移除回调
     * 
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
            let j = -1;
            for (let i = 0, len = list.length; i < len; i++) {
                let info = list[i];
                if (info.checkHandle(callback, thisObj)) {
                    j = i;
                    break;
                }
            }
            if (~j) {
                list.splice(j, 1);
            }
        }
    }

    export const TimerUtil = { addCallback, removeCallback, tick };
}