namespace jy {
    /**
     * 
     * 
     * @export
     * @class UModel
     * @extends {egret.DisplayObjectContainer}
     * @author 3tion
     */
    export class UModel extends egret.DisplayObjectContainer {
        /**
         * 独立使用时，用于排序深度
         * 
         * @type {number}
         */
        public depth?: number;

        /**
         * 检查/重置资源列表
         * 
         * @param {Key[]} resOrder 部位的排列顺序
         * @param {{ [index: string]: UnitResource }} resDict 部位和资源的字典
         */
        public checkResList(resOrder: Key[], resDict: { [index: string]: UnitResource }) {
            let children = this.$children;
            let i = 0;
            let len = children.length;
            let part: Recyclable<ResourceBitmap>;
            for (let key of resOrder) {
                let res = resDict[key];
                if (res) {
                    if (i < len) {
                        part = <Recyclable<ResourceBitmap>>children[i++];
                    } else {
                        part = recyclable(ResourceBitmap);
                        this.addChild(part);
                    }
                    part.res = res;
                }
            }
            //移除多余子对象
            for (let j = len - 1; j >= i; j--) {
                part = <Recyclable<ResourceBitmap>>this.$doRemoveChild(j);
                part.recycle();
            }
        }

        /**
         * 渲染指定帧
         * 
         * @param {FrameInfo} frame 
         * @param {number} now 
         * @param {number} face 
         * @param {IDrawInfo} info 
         * @returns {boolean} true 表示此帧所有资源都正常完成渲染
         *                    其他情况表示有些帧或者数据未加载，未完全渲染
         * @memberof UModel
         */
        renderFrame(frame: FrameInfo, now: number, face: number, info: IDrawInfo) {
            let d: number;
            if (frame) {
                d = frame.d;
                if (d == -1) {
                    d = face
                }
                info.f = frame.f;
                info.a = frame.a;
            } else {
                d = face;
            }
            let scale = 1;
            if (d > 4) {
                scale = -1;
                d = 8 - d;
            }
            info.d = d;
            this.scaleX = scale;
            return this.draw(info, now);
        }

        draw(info: IDrawInfo, now: number) {
            let flag = true;
            //渲染
            for (let res of <ResourceBitmap[]>this.$children) {
                flag = res.draw(info, now) && flag;
            }
            return flag;
        }

        clear() {
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.alpha = 1;
            this.x = 0;
            this.y = 0;
            let list = this.$children as Recyclable<ResourceBitmap>[];
            for (let bmp of list) {
                bmp.recycle();
            }
        }

        onRecycle() {
            removeDisplay(this);
            this.clear();
        }
    }
}