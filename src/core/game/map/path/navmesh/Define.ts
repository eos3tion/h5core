namespace jy {
    export const enum NavMeshConst {
        /**
         * 精度
         */
        Epsilon = 1e-6,

    }

    export const enum TrangleSideIndex {
        SideAB = 0,
        SideBC = 1,
        SideCA = 2
    }

    /**
     * 点所在的位置
     */
    export const enum PointClassification {
        /**
         * 点离在线上，或者离得非常非常近（低于精度）
         */
        OnLine = 0,
        /**
         * 按端点A->端点B，点在线的左边
         */
        LeftSide = 1,
        /**
         * 按端点A->端点B，点在线的右边
         */
        RightSide = 2
    }

    /**
     * 线段位置情况的定义
     */
    export const enum LineClassification {
        /**
         * 共线
         */
        Collinear = 0,
        /**
         * 线段不相交，线段所在直线相交
         */
        LinesIntersect = 1,
        /**
         * 两条线段相交
         */
        SegmentsIntersect = 2,
        /**
         * 线段不想交，线段所在直线相交，交点在传入检查的线段上
         */
        ABisectB = 3,
        /**
         * 线段不想交，线段所在直线相交，交点在当前线上
         */
        BBisectA = 4,
        /**
         * 平行
         */
        Paralell = 5

    }
}