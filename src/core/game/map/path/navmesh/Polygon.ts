namespace jy {
    import Point = egret.Point;
    /**
     * 多边形
     */
    export class Polygon {
        /**
         * 顶点列表
         */
        points: Point[];
        /**
         * 边
         */
        sides: Line[];

        /**
         * 边对应的三角形索引
         */
        links?: number[];
        /**
         * 是否包含点
         * @param pt 
         */
        contain(pt: Point) {
            let { x, y } = pt;
            let inside = false;
            let vs = this.points;
            for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                let { x: xi, y: yi } = vs[i];
                let { x: xj, y: yj } = vs[j];
                let intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        }

    }
}