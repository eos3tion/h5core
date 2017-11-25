module junyou {
    /**
     * 振动的接口实现
     * 
     * @export
     * @interface Shake
     * @author 3tion
     */
    export interface Shake {

        /**
         * 
         * 总时间
         * @type {number}
         * @memberOf Shake
         */
        total: number;
        /**
         * 设置振动的目标
         * 
         * @param {ShakeTarget} target
         * 
         * @memberOf Shake
         */
        setShakeTarget(target: ShakeTarget): Shake;
        readonly target: ShakeTarget;
        /**
         * 
         * 震动开始
         * 
         * @memberOf Shake
         */
        start(): void;


        /**
         *  执行更新
         * 
         * @param {number} duration 
         * @param {{ x: number, y: number }} outPt 
         * 
         * @memberOf Shake
         */
        tick(duration: number, outPt: { x: number, y: number });

        /**
         * 强行结束
         */
        end(): void;
    }

    /**
     * 振动的目标
     * 
     * @export
     * @interface ShakeTarget
     */
    export interface ShakeTarget {
        x: number;
        y: number;
        /**
         * 可派发事件
         */
        dispatch?: { (type: string | number, ...any): boolean }
    }
}