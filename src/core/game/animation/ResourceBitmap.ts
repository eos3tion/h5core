namespace jy {

    /**
     * 资源显示用位图
     */
    export class ResourceBitmap extends egret.Bitmap implements IRecyclable, IDepth {
        public res: UnitResource;

        /**
         * z方向的坐标
         * 
         * @type {number}
         */
        public z: number = 0;

        public get depth(): number {
            return this.y + this.z;
        }

        /**
         * 当前资源是否成功渲染
         * 
         * @param {IDrawInfo} drawInfo 
         * @param {number} now 
         * @returns 
         * @memberof ResourceBitmap
         */
        public draw(drawInfo: IDrawInfo, now: number) {
            let res = this.res;
            if (res) {
                return res.draw(this, drawInfo, now);
            }
        }

        public onRecycle() {
            removeDisplay(this);
            this.removeAllListeners();
            this.res = undefined;
            this.rotation = 0;
            this.alpha = 1;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.anchorOffsetX = 0;
            this.anchorOffsetY = 0;
            this.texture = undefined;
        }
    }
}
