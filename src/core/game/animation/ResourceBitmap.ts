module junyou {

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

        public draw(drawInfo: IDrawInfo, now: number) {
            if (!this.res) return;
            this.res.draw(this, drawInfo, now);
        }

        public set rotation(value: number) {
            super.$setRotation(value);
        }

        public onRecycle() {
            removeDisplay(this);
            this.removeAllListeners();
            this.res = undefined;
            this.rotation = 0;
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
