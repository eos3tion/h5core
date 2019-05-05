namespace jy {

    /**
     * 获取多个点的几何中心点
     * 
     * @export
     * @param {Point[]} points 点集
     * @param {Point} result 结果
     * @returns {Point} 点集的几何中心点
     * @author gushuai
     */
    export function getCenter(points: Point[], result?: Point) {
        result = result || {} as Point;
        let len = points.length;
        let x = 0;
        let y = 0;
        for (let i = 0; i < len; i++) {
            let point = points[i];
            x += point.x;
            y += point.y;
        }
        result.x = x / len;
        result.y = y / len;
        return result;
    }

    /**
     * 检查类矩形 a 和 b 是否相交
     * @export
     * @param {Rect} a   类矩形a
     * @param {Rect} b   类矩形b
     * @returns {boolean} true     表示两个类似矩形的物体相交
     *         false    表示两个类似矩形的物体不相交
     */
    export function intersects(a: Rect, b: Rect): boolean {
        let aright = a.x + a.width;
        let abottom = a.y + a.height;
        let bright = b.x + b.width;
        let bbottom = b.y + b.height;
        return Math.max(a.x, b.x) <= Math.min(aright, bright)
            && Math.max(a.y, b.y) <= Math.min(abottom, bbottom);
    }

    /**
     * 获取点集围成的区域的面积
     * S=（（X2-X1）*  (Y2+Y1)+（X2-X2）*  (Y3+Y2)+（X4-X3）*  (Y4+Y3)+……+（Xn-Xn-1）*  (Yn+Yn-1)+（X1-Xn）*  (Y1+Yn)）/2
     * @export
     * @param {Point[]} points 点集
     * @returns {number}
     */
    export function getArea(points: Point[]) {
        let p0 = points[0];
        let s = 0;
        let last = p0;
        for (let i = 1, length = points.length; i < length; i++) {
            let p = points[i];
            s += (p.x - last.x) * (p.y + last.y);
            last = p;
        }
        s += (p0.x - last.x) * (p0.y + last.y);
        return s * .5;
    }

}