module junyou {

    /**
     * 获取多个点的几何中心点
     * 
     * @export
     * @param {{ x: number, y: number }[]} points 点集
     * @returns 点集的几何中心点
     * @author gushuai
     */
    export function getCenter(points: { x: number, y: number }[], result?: { x: number, y: number }) {
        result = result || {} as { x: number, y: number };
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
     * @param {{ x: number, y: number, width: number, height: number }} a   类矩形a
     * @param {{ x: number, y: number, width: number, height: number }} b   类矩形b
     * @return true     表示两个类似矩形的物体相交
     *         false    表示两个类似矩形的物体不相交
     */
    export function intersects(a: { x: number, y: number, width: number, height: number }, b: { x: number, y: number, width: number, height: number }): boolean {
        let aright = a.x + a.width;
        let abottom = a.y + a.height;
        let bright = b.x + b.width;
        let bbottom = b.y + b.height;
        return Math.max(a.x, b.x) <= Math.min(aright, bright)
            && Math.max(a.y, b.y) <= Math.min(abottom, bbottom);
    }

}