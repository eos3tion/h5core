namespace jy {

    /**
     * 翻页的4个区域
     * ```
     *    TopLeft      │    TopRight
     *              ───┼───
     *   BottomLeft  │    BottomRight
     *   
     * ```
     * @export
     * @enum {number}
     */
    export const enum FlipCorner {
        TopLeft = 0b1,
        TopRight = 0b10,
        BottomLeft = 0b100,
        BottomRight = 0b1000,
    }

    /**
     * 左上的点
     */
    const tl = { x: 0, y: 0 };
    /**
     * 用于做翻页效果
     * 
     * @author 3tion
     * @export
     * @class Flip
     */
    export class Flip extends egret.Sprite {


        protected frontDis: egret.DisplayObject;

        protected backDis: egret.DisplayObject;

        protected frontCon = new egret.Sprite();

        protected backCon = new egret.Sprite();

        protected frontMask = new egret.Shape();

        protected backMask = new egret.Shape();

        protected barea: number;
        protected farea: number;

        protected size: Size;

        /**
         * 左下的点
         * 
         * @protected
         * @type {Point}
         */
        protected bl: Point;

        /**
         * 右下的点
         * 
         * @protected
         * @type {Point}
         */
        protected br: Point;
        /**
         * 右上的点
         * 
         * @protected
         * @type {Point}
         */
        protected tr: Point;

        /**
         * 当前正在拖拽的角
         * 
         * @protected
         * @type {FlipCorner}
         */
        protected cCorner: FlipCorner;

        /**
         * 正在拖拽的角的原始坐标X
         * 
         * @protected
         * @type {number}
         */
        protected oX: number;

        /**
         * 正在拖拽的角的原始坐标Y
         * 
         * @protected
         * @type {number}
         */
        protected oY: number;

        /**
         * 可拖拽的角
         * 
         * @protected
         * @type {number}
         */
        protected sCorner: number;

        protected backPoints = [] as Point[];
        protected frontPoints = [] as Point[];

        /**
         * 设置纹理
         * 
         * @param {(egret.Texture | egret.DisplayObject)} front 
         * @param {(egret.Texture | egret.DisplayObject)} [back] 
         * @param {any} [supportedCorner=FlipCorner.TopLeft | FlipCorner.BottomLeft] 
         * @param {Size} [size] 
         */
        init(front: egret.Texture | egret.DisplayObject, back?: egret.Texture | egret.DisplayObject, supportedCorner = FlipCorner.TopLeft | FlipCorner.BottomLeft, size?: Size) {
            let ftex = getTexture(front);
            let btex = back && back != front ? getTexture(back) : ftex;
            function getTexture(tester: egret.Texture | egret.DisplayObject) {
                if (tester instanceof egret.DisplayObject) {
                    let tex = new egret.RenderTexture();
                    tex.drawToTexture(tester);
                    return tex;
                } else {
                    return tester;
                }
            }
            let frontDis = new egret.Bitmap();
            let backDis = new egret.Bitmap();
            frontDis.texture = ftex;
            backDis.texture = btex;
            this.init2(frontDis, backDis, supportedCorner, size);
        }

        /**
         * 设置页面前后的可视对象
         * 
         * @param {(egret.DisplayObject)} front 正面纹理
         * @param {(egret.DisplayObject)} back 反面纹理
         * @param {any} [supportedCorner=FlipCorner.TopLeft | FlipCorner.BottomLeft] 支持拖拽的角
         * @param {Size} [size] 页面大小
         */
        init2(front: egret.DisplayObject, back: egret.DisplayObject, supportedCorner = FlipCorner.TopLeft | FlipCorner.BottomLeft, size?: Size) {
            let { frontCon, backCon, frontMask, backMask } = this;
            front.x = front.y = back.x = back.y = 0;
            this.frontDis = front;
            this.backDis = back;
            this.sCorner = supportedCorner;
            this.touchEnabled = true;
            frontCon.addChild(front);
            removeDisplay(frontMask);
            front.mask = null;
            backCon.addChild(back);
            back.mask = backMask;
            back.scaleX = -1;
            backMask.scaleX = -1;
            removeDisplay(backMask);
            this.addChild(frontCon);
            if (!size) {
                size = { width: front.width, height: front.height };
            }
            let { width, height } = size;
            this.bl = { x: 0, y: height };
            this.tr = { x: width, y: 0 };
            this.br = { x: width, y: height };
            this.size = size;
            this.on(EgretEvent.TOUCH_BEGIN, this.touchBegin, this);
        }

        protected touchBegin(e: egret.TouchEvent) {
            //检查鼠标点是在上半区还是下半区
            let { width, height } = this.size;
            let { x, y } = this.getLocal(e);
            let isTop = y < height >> 1;
            let isLeft = x < width >> 1;
            let corner = isTop ? (isLeft ? FlipCorner.TopLeft : FlipCorner.TopRight) : (isLeft ? FlipCorner.BottomLeft : FlipCorner.BottomRight);
            this.farea = 0;
            this.barea = 0;
            if (corner == (corner & this.sCorner)) {//支持这个角
                this.cCorner = corner;
                this.oX = isLeft ? 0 : width;
                this.oY = isTop ? 0 : height;
                let stage = this.stage;
                stage.on(EgretEvent.TOUCH_MOVE, this.touchMove, this);
                stage.on(EgretEvent.TOUCH_END, this.touchEnd, this);
                stage.on(EgretEvent.TOUCH_RELEASE_OUTSIDE, this.touchEnd, this);
                this.draw(x, y);
            }
        }

        protected touchMove(e: egret.TouchEvent) {
            let { x, y } = this.getLocal(e);
            this.draw(x, y);
        }

        protected getLocal(e: egret.TouchEvent) {
            let { stageX, stageY } = e;
            let pt = Temp.EgretPoint;
            this.globalToLocal(stageX, stageY, pt);
            return pt;
        }

        protected touchEnd(e: egret.TouchEvent) {
            // let { width, height } = this.size;
            // let { isLeft, isTop } = this.getCorner(e.localX, e.localY, width, height);
            // let cCorner = this.cCorner;
            // let ok = isLeft && (cCorner == FlipCorner.BottomRight || cCorner == FlipCorner.TopRight)//拖动右边的角，拖到左边，则认为翻页成功
            //     || !isLeft && (cCorner == FlipCorner.BottomLeft || cCorner == FlipCorner.TopLeft)//拖动左边的角，拖到右边，则认为翻页成功
            //     || isTop && (cCorner == FlipCorner.BottomLeft || cCorner == FlipCorner.BottomRight)//拖动下边的角，拖到上边，则认为翻页成功
            //     || !isTop && (cCorner == FlipCorner.TopLeft || cCorner == FlipCorner.TopRight);//拖动上边的角，拖到下边，则认为翻页成功
            let { farea } = this;
            this.dispatchEventWith(EventConst.FlipEnd as any, false, farea == 0 ? 1 : this.barea / farea);
            this.reset();
            this.clearEvents();
        }


        protected clearEvents() {
            let stage = egret.sys.$TempStage;
            stage.off(EgretEvent.TOUCH_MOVE, this.touchMove, this);
            stage.off(EgretEvent.TOUCH_END, this.touchEnd, this);
            stage.off(EgretEvent.TOUCH_RELEASE_OUTSIDE, this.touchEnd, this);
        }

        reset() {
            let { frontDis, backCon, frontMask } = this;
            frontDis.mask = null;
            removeDisplay(frontMask);
            removeDisplay(backCon);
        }

        private draw(x: number, y: number) {
            //计算折边
            //折边为  当前所在点 与原始点的连线的垂直中线
            let { oX, oY, size } = this;
            let { width, height } = size;
            let dx = x - oX;
            let dy = y - oY;
            if (dx == 0 || dy == 0) {
                this.reset();
                return;
            }
            let { cCorner, backMask, frontCon, backDis, frontDis, backCon, frontMask, backPoints, frontPoints } = this;
            let cX = oX + dx * 0.5;
            let cY = oY + dy * 0.5;
            let tan = dy / dx;
            let leftY = cY + cX / tan;
            let rightY = leftY - width / tan;
            let topX = cX + cY * tan;
            let bottomX = topX - height * tan;
            let p: Point;
            let { bl, br, tr } = this;
            let bi = 0;
            let fi = 0;
            //计算面积用         
            switch (cCorner) {
                case FlipCorner.TopLeft: {
                    if (topX.between(0, width)) {
                        p = { x: topX, y: 0 };
                        backPoints[bi++] = p;
                    } else {
                        p = { x: width, y: rightY };
                        backPoints[bi++] = p;
                        backPoints[bi++] = tr;
                    }
                    frontPoints[fi++] = p;
                    backPoints[bi++] = tl;
                    if (leftY.between(0, height)) {
                        p = { x: 0, y: leftY };
                        backPoints[bi++] = p;
                        frontPoints[fi++] = p;
                        frontPoints[fi++] = bl;

                    } else {
                        backPoints[bi++] = bl;
                        //检查下边线
                        p = { x: bottomX, y: height };
                        backPoints[bi++] = p;
                        frontPoints[fi++] = p;
                    }
                    frontPoints[fi++] = br;
                    frontPoints[fi++] = tr;

                    break;
                }
                case FlipCorner.BottomLeft:
                    {
                        if (leftY.between(0, height)) {
                            p = { x: 0, y: leftY };
                            backPoints[bi++] = p;
                        } else {
                            p = { x: topX, y: 0 };
                            backPoints[bi++] = p;
                            backPoints[bi++] = tl;
                        }
                        frontPoints[fi++] = p;
                        backPoints[bi++] = bl;

                        if (bottomX.between(0, width)) {
                            p = { x: bottomX, y: height };
                            backPoints[bi++] = p;
                            frontPoints[fi++] = p;
                            frontPoints[fi++] = br;
                        } else {
                            backPoints[bi++] = br;
                            p = { x: width, y: rightY };
                            backPoints[bi++] = p;
                            frontPoints[fi++] = p;
                        }
                        frontPoints[fi++] = tr;
                        frontPoints[fi++] = tl;
                        break;
                    }
                case FlipCorner.BottomRight:
                    {
                        if (bottomX.between(0, width)) {
                            p = { x: bottomX, y: height };
                            backPoints[bi++] = p;
                        } else {
                            p = { x: 0, y: leftY };
                            backPoints[bi++] = p;
                            backPoints[bi++] = bl;
                        }
                        frontPoints[fi++] = p;
                        backPoints[bi++] = br;

                        if (rightY.between(0, width)) {
                            p = { x: width, y: rightY };
                            backPoints[bi++] = p;
                            frontPoints[fi++] = p;
                            frontPoints[fi++] = tr;
                        } else {
                            backPoints[bi++] = tr;
                            p = { x: topX, y: 0 };
                            backPoints[bi++] = p;
                            frontPoints[fi++] = p;
                        }
                        frontPoints[fi++] = tl;
                        frontPoints[fi++] = bl;
                        break;
                    }
                case FlipCorner.TopRight:
                    {
                        if (rightY.between(0, height)) {
                            p = { x: width, y: rightY };
                            backPoints[bi++] = p;
                        } else {
                            p = { x: bottomX, y: height };
                            backPoints[bi++] = p;
                            backPoints[bi++] = br;
                        }
                        frontPoints[fi++] = p;
                        backPoints[bi++] = tr;
                        if (topX.between(0, width)) {
                            p = { x: topX, y: 0 };
                            backPoints[bi++] = p;
                            frontPoints[fi++] = p;
                            frontPoints[fi++] = tl;
                        } else {
                            backPoints[bi++] = tl;
                            p = { x: 0, y: leftY };
                            backPoints[bi++] = p;
                            frontPoints[fi++] = p;
                        }
                        frontPoints[fi++] = bl;
                        frontPoints[fi++] = br;
                        break;
                    }
            }
            //绘制遮罩
            this.farea = calculateAndDraw(frontPoints, frontMask, fi);
            this.barea = calculateAndDraw(backPoints, backMask, bi);
            frontDis.mask = frontMask;
            frontCon.addChild(frontMask);
            backCon.addChild(backMask);
            backCon.anchorOffsetX = -topX;
            backCon.x = topX;
            backCon.rotation = (Math.PI - 2 * Math.atan2(dx, dy)) * Math.RAD_TO_DEG;
            this.addChild(backCon);

            /**
             * 绘制遮罩并计算面积
             * 
             * @param {Point[]} points 
             * @param {egret.Shape} mask 
             * @param {number} length 
             * @returns 
             */
            function calculateAndDraw(points: Point[], mask: egret.Shape, length: number) {
                //面积计算公式
                // S=（（X2-X1）*  (Y2+Y1)+（X2-X2）*  (Y3+Y2)+（X4-X3）*  (Y4+Y3)+……+（Xn-Xn-1）*  (Yn+Yn-1)+（X1-Xn）*  (Y1+Yn)）/2
                let g = mask.graphics;
                //points的length一定为3或者4，所以不做检测
                g.clear();
                let p0 = points[0];
                g.beginFill(0);
                g.moveTo(p0.x, p0.y);
                let s = 0;
                let last = p0;
                for (let i = 1; i < length; i++) {
                    let p = points[i];
                    g.lineTo(p.x, p.y);
                    s += (p.x - last.x) * (p.y + last.y);
                    last = p;
                }
                s += (p0.x - last.x) * (p0.y + last.y);
                g.lineTo(p0.x, p0.y);
                g.endFill();
                return s * 0.5;
            }
        }
    }
}