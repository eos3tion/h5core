module junyou {
    export const enum LayoutType {
        /**
         * 全屏
         */
        FullScreen = 0,
        /**
         * 垂直——上
         * 
         * @static
         * @type {number}
         */
        TOP = 0b0100,
        /**
         * 垂直——中
         * 
         * @static
         * @type {number}
         */
        MIDDLE = 0b1000,

        /**
         * 垂直——下
         * 
         * @static
         * @type {number}
         */
        BOTTOM = 0b1100,

        /**
         * 水平——左
         * 
         * @static
         * @type {number}
         */
        LEFT = 0b01,

        /**
         * 水平——中
         * 
         * @static
         * @type {number}
         */
        CENTER = 0b10,

        /**
         * 水平——右
         * 
         * @static
         * @type {number}
         */
        RIGHT = 0b11,

        /**
         * 垂直方向的位运算mask
         * 
         * @static
         * @type {number}
         */
        VERTICAL_MASK = 0b1100,

        /**
         * 水平方向位运算mask
         * 
         * @static
         * @type {number}
         */
        HORIZON_MASK = 0b11,

        /**
         * 左上
         */
        TOP_LEFT = TOP | LEFT,

        /**
         * 中上
         */
        TOP_CENTER = TOP | CENTER,

        /**
         * 右上
         */
        TOP_RIGHT = TOP | RIGHT,

        /**
         * 左中
         */
        MIDDLE_LEFT = MIDDLE | LEFT,

        /**
         * 中心
         */
        MIDDLE_CENTER = MIDDLE | CENTER,

        /**
         * 右中
         */
        MIDDLE_RIGHT = MIDDLE | RIGHT,

        /**
         * 左下
         */
        BOTTOM_LEFT = BOTTOM | LEFT,

        /**
         * 中下
         */
        BOTTOM_CENTER = BOTTOM | CENTER,

        /**
         * 右下
         */
        BOTTOM_RIGHT = BOTTOM | RIGHT
    }

    export const enum LayoutTypeVertical {
        TOP = LayoutType.TOP,
        MIDDLE = LayoutType.MIDDLE,
        BOTTOM = LayoutType.BOTTOM
    }
    export const enum LayoutTypeHorizon {
        LEFT = LayoutType.LEFT,
        CENTER = LayoutType.CENTER,
        RIGHT = LayoutType.RIGHT
    }
    export interface LayoutDisplay { x: number, y: number, width: number, height: number, parent?: LayoutDisplayParent }
    export interface LayoutDisplayParent extends Size { };
	/**
	 *
	 * @author 3tion
	 *
	 */
    export const Layout = {
        getParentSize(dis: LayoutDisplay, parent?: LayoutDisplayParent) {
            if (!parent) {
                parent = dis.parent;
            }
            if (!parent) {//还是没有parent则使用白鹭的Stage
                parent = egret.sys.$TempStage;
            }
            if (parent instanceof egret.Stage) {
                var parentWidth = parent.stageWidth;
                var parentHeight = parent.stageHeight;
            } else {
                parentWidth = parent.width;
                parentHeight = parent.height;
            }
            return [parentWidth, parentHeight]
        },
        /**
         * 对DisplayObject，基于父级进行排布
         * 
         * @static
         * @param {LayoutDisplay} dis 要布局的可视对象
         * @param {LayoutType} layout 布局方式
         * @param {number} hoffset 在原布局基础上，水平方向的再偏移量（内部运算是"+",向左传负）
         * @param {number} voffset 在原布局基础上，垂直方向的再偏移量（内部运算是"+",向上传负）
         * @param {boolean} [innerV=true] 垂直方向上基于父级内部
         * @param {boolean} [innerH=true] 水平方向上基于父级内部
         * @param {LayoutDisplayParent} [parent] 父级容器，默认取可视对象的父级
         */
        layout(dis: LayoutDisplay, layout: LayoutType, hoffset = 0, voffset = 0, innerV = true, innerH = true, parent?: LayoutDisplayParent) {
            let [parentWidth, parentHeight] = Layout.getParentSize(dis, parent);
            Layout.getLayoutPos(dis.width, dis.height, parentWidth, parentHeight, layout, dis, hoffset, voffset, innerV, innerH);
        },


        /**
         * 
         * 
         * @param {LayoutDisplay} dis  要布局的可视对象
         * @param {number} [top=0]    百分比数值 `0.2` dis的顶距游戏边界顶部 20%
         * @param {number} [left=0]    百分比数值 `0.2` dis的左边缘距游戏左边缘 20%
         * @param {LayoutDisplayParent} [parent] 父级容器，默认取可视对象的父级
         * @returns 
         */
        layoutPercent(dis: LayoutDisplay, top = 0, left = 0, parent?: LayoutDisplayParent) {
            let [parentWidth, parentHeight] = Layout.getParentSize(dis, parent);
            dis.x = Math.round((parentWidth - dis.width) * left);
            dis.y = Math.round((parentHeight - dis.height) * top);
            return dis;
        },
        getLayoutPos(disWidth: number, disHeight: number, parentWidth: number, parentHeight: number, layout: LayoutType, result?: { x: number, y: number }, hoffset = 0, voffset = 0, innerV = true, innerH = true) {
            result = result || {} as { x: number, y: number };
            let vertical = layout & LayoutType.VERTICAL_MASK;
            let horizon = layout & LayoutType.HORIZON_MASK;
            let y = 0, x = 0;
            switch (vertical) {
                case LayoutType.TOP:
                    if (innerV) {
                        y = 0;
                    } else {
                        y = -disHeight;
                    }
                    break;
                case LayoutType.MIDDLE: // 不支持非innerV
                    y = parentHeight - disHeight >> 1;
                    break;
                case LayoutType.BOTTOM:
                    if (innerV) {
                        y = parentHeight - disHeight;
                    } else {
                        y = parentHeight;
                    }
                    break;
            }
            switch (horizon) {
                case LayoutType.LEFT:
                    if (innerH) {
                        x = 0;
                    } else {
                        x = -disWidth;
                    }
                    break;
                case LayoutType.CENTER: // 不支持非innerH
                    x = parentWidth - disWidth >> 1;
                    break;
                case LayoutType.RIGHT:
                    if (innerH) {
                        x = parentWidth - disWidth;
                    }
                    else {
                        x = parentWidth;
                    }
                    break;
            }
            result.x = Math.round(x + hoffset);
            result.y = Math.round(y + voffset);
            return result;
        },
        /**
         * 基于鼠标位置的tip的布局方式
         * 
         * @param {LayoutDisplay} dis 要被布局的可视对象
         * @param {Point} point 传入的点
         * @param {{ x: number, y: number }} [result] 
         * @param {number} [padx=0] 间隔x
         * @param {number} [pady=0] 间隔y
         * @param {LayoutDisplayParent} [parent] 容器的大小
         */
        tipLayout(dis: LayoutDisplay, point: Point, result?: { x: number, y: number }, padx = 0, pady = 0, parent?: LayoutDisplayParent) {
            Layout.getTipLayoutPos(dis, point, dis, padx, pady, parent);
        },
        /**
         * 获取基于鼠标位置的tip的布局方式布局的坐标
         * 
         * @param {LayoutDisplay} dis 要被布局的可视对象
         * @param {Point} point 传入的点
         * @param {{ x: number, y: number }} [result] 
         * @param {number} [padx=0] 间隔x
         * @param {number} [pady=0] 间隔y
         * @param {LayoutDisplayParent} [parent] 容器的大小
         * @returns {Point} 计算后的坐标
         */
        getTipLayoutPos(dis: LayoutDisplay, point: Point, result?: { x: number, y: number }, padx = 0, pady = 0, parent?: LayoutDisplayParent) {
            let [parentWidth, parentHeight] = Layout.getParentSize(dis, parent);
            result = result || {} as { x: number, y: number };
            let mx = point.x;
            let my = point.y;
            let x = mx + padx;
            let y = my + pady;
            let func = dis["getTransformedBounds"];
            let rect: egret.Rectangle;
            if (func) {
                rect = func.call(dis, parent || egret.sys.$TempStage);
            } else {
                rect = new egret.Rectangle(dis.x, dis.y, dis.width, dis.height);
            }
            let w = rect.width;
            let h = rect.height;
            if (w + x + padx > parentWidth) {
                x = parentWidth - w - padx;
                if (x < mx) {
                    x = mx - w - padx;
                }
                if (x < 0) {
                    x = padx;
                }
            }
            if (h + my + pady > parentHeight) {
                y = parentHeight - h - pady;
                if (y < 0) {
                    y = pady;
                }
            }
            result.x = Math.round(x);
            result.y = Math.round(y);
            return result;
        },
    }
}