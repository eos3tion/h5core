namespace jy {

    function defaultCompare(a, b) {
        return a - b;
    }

    /**
     * 固定大小的堆栈数据
     */
    export class Heap<T>{
        /**
         * 原始数据
         */
        readonly heap: T[];

        readonly maxSize: number;
        private _count: number;
        readonly compare: (a: T, b: T) => number;

        constructor(size: number, compare: { (a: T, b: T): number } = defaultCompare) {
            let maxSize = size + 1;
            this.heap = new Array<T>(maxSize);
            this.maxSize = maxSize;
            this.compare = compare;
            this._count = 0;
        }

        /**
         * 获取堆中，第一个元素
         */
        peek() {
            return this.heap[1];
        }

        put(obj: T) {
            let { _count, maxSize, heap, compare } = this;
            _count++;
            if (_count < maxSize) {
                heap[_count] = obj;
                let i = _count;
                let parent = i >> 1;
                let tmp = heap[i];
                while (parent > 0) {
                    let v = heap[parent];
                    if (compare(tmp, v) > 0) {
                        heap[i] = v;
                        i = parent;
                        parent >>= 1;
                    } else break;
                }
                heap[i] = tmp;
                this._count = _count;
                return true;
            }
        }

        pop() {
            let { _count, heap, compare } = this;
            if (_count >= 1) {
                let o = heap[1];
                heap[1] = heap[_count];
                heap[_count] = undefined;
                let i = 1;
                let child = 2;
                let tmp = heap[i];
                let _count_1 = _count - 1;
                while (child < _count) {
                    if (child < _count_1 && compare(heap[child], heap[child + 1]) < 0) {
                        child++;
                    }
                    let v = heap[child];
                    if (compare(tmp, v) < 0) {
                        heap[i] = v;
                        i = child;
                        child <<= 1;
                    }
                    else break;
                }
                this._count = _count - 1;
                return o;
            }
        }

        clear(newSize?: number) {
            const heap = this.heap;
            heap.length = 0;
            let maxSize = this.maxSize;
            if (newSize > 0) {
                maxSize = newSize + 1;
                //@ts-ignore
                this.maxSize = maxSize;
            }
            heap.length = maxSize;
            this._count = 0;
        }

        get size() {
            return this._count;
        }

        toArray() {
            return this.heap.slice(1, this._count + 1);
        }

        /**
         * 遍历堆中元素
         * @param callbackfn 回调函数，如果返回true，停止遍历
         * @param thisArg 回调函数的 this 指针
         */
        forEach(callbackfn: (value: T, cursor: number, heap: Heap<T>) => boolean, thisArg?: any) {
            let { heap, _count } = this;
            _count++;
            for (let i = 1; i < _count; i++) {
                let v = heap[i];
                if (v != undefined && callbackfn.call(thisArg, v, i, this)) {
                    break;
                }
            }
        }
    }

}