namespace jy {

    /**
     * 序列的记录器
     * 用于做残影或者时光倒流的操作
     * @export
     * @class PSRecorder
     * @author 3tion
     */
    export class PSRecorder {

        private _count: number;
        private _max: number;

        /**
         * 序列头
         * 
         * @private
         * @type {PSeries}
         */
        private _head: Recyclable<PSeries>;
        /**
         * 序列尾
         * 
         * @private
         * @type {PSeries}
         */
        private _tail: Recyclable<PSeries>;


        /**
         * 初始化一个序列
         * 
         * @param {number} [delay=30]
         * @param {number} [max=4]
         * @returns
         */
        public init(max = 4) {
            if (max < 1) {//至少的有一个
                max = 1;
            }
            this._max = max;
            this._count = 0;
            this._head = undefined;
            this._tail = undefined;
            return this;
        }

        public record(unit: Unit, now: number) {
            if (unit) {
                //处理头
                let series: Recyclable<PSeries>;
                if (this._count < this._max) {
                    series = recyclable(PSeries);
                    this._head = series;
                } else {
                    series = this._head;
                    this._head = series.next;
                    //清除头的前一个
                    this._head.prev = undefined;
                    series.next = undefined;
                }

                //对当前赋值
                series.record(unit, now);
                let resDict = {};
                series.resDict = resDict;
                unit.resDict.copyto(resDict);

                //处理尾
                let tail = this._tail;
                if (tail) {
                    tail.next = series;
                    series.prev = tail;
                }
                this._tail = series;
                return series;
            }
        }

        /**
         * 根据索引获取序列
         * 
         * @param {number} idx          索引号
         * @param {boolean} [reverse]   是否按时间顺序反取，默认为从前往后，即按时间的先后顺序取
         * @returns
         */
        public getByIndex(idx: number, reverse?: boolean) {
            let i = 0, tmp: PSeries;
            if (reverse) {
                tmp = this._tail;
                while (tmp && i++ < idx) {//防止链表出错
                    tmp = tmp.prev;
                }
            } else {
                tmp = this._head;
                while (tmp && i++ < idx) {
                    tmp = tmp.next;
                }
            }
            if (i == idx) return tmp;
        }

        /**
         * 
         * 获取序列
         * @param {PSeries[]} [output]  要输出的序列位置
         * @param {boolean} [reverse]   是否按时间顺序反取，默认为从前往后，即按时间的先后顺序取
         */
        public getSeries(output?: PSeries[], reverse?: boolean) {
            output = output || [];
            let i = 0, tmp: PSeries;
            let max = this._max;
            if (reverse) {//逆向播放
                tmp = this._tail;
                while (tmp && i++ < max) {//防止链表出错
                    output.push(tmp);
                    tmp = tmp.prev;
                }
            } else {
                tmp = this._head;
                while (tmp && i++ < max) {
                    output.push(tmp);
                    tmp = tmp.next;
                }
            }
        }

        public onRecycle() {
            let tmp = this._head;
            let max = this._max;
            let i = 0;
            while (tmp && i++ < max) {
                tmp.recycle();
            }
            this._head = undefined;
            this._tail = undefined;
        }
    }
}