module junyou {

    /**
     * 用于记录单位(Unit)的序列
     * 
     * @export
     * @interface PhantomTarget
     * @author 3tion
     */
    export class PSeries {
        /**
         * 时间序列
         */
        public t: number;
        /**
         * 渲染列表中的资源列表
         * 
         * @type {[index: number]: UnitResource}
         * @memberOf PSeries
         */
        public resDict: { [index: number]: UnitResource };
        /**
         * 帧信息
         * 
         * @type {FrameInfo}
         * @memberOf PSeries
         */
        public frame: FrameInfo;
        public x: number;
        public y: number;
        public z: number;

        /**
         * 朝向
         * 
         * @type {number}
         * @memberOf PSeries
         */
        public faceTo: number;

        /**
         * 前一个序列
         * 
         * @type {Recyclable<PSeries>}
         * @memberOf PSeries
         */
        public prev?: Recyclable<PSeries>;
        /**
         * 后一个序列
         * 
         * @type {Recyclable<PSeries>}
         * @memberOf PSeries
         */
        public next?: Recyclable<PSeries>;

        public record(unit: Unit, now: number) {
            this.t = now;
            this.x = unit.x;
            this.y = unit.y;
            this.z = unit.z;
            this.faceTo = unit.faceTo;
            this.frame = unit.lastFrame;
        }
    }
}