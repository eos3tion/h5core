namespace jy {
    import Point = egret.Point;

    export class Triangle {

        readonly pA: Point;
        readonly pB: Point;
        readonly pC: Point;


        sides = [new Line, new Line, new Line];
        /**
         * 三角的中心x
         */
        readonly x = 0;
        /**
         * 三角的中心y
         */
        readonly y = 0;
        /**
         * 数据是否计算过
         */
        protected _calced = false;

        constructor(p1?: Point, p2?: Point, p3?: Point) {
            this.pA = p1 || new Point;
            this.pB = p2 || new Point;
            this.pC = p3 || new Point;
        }

        setPoints(p1: Point, p2: Point, p3: Point) {
            const { pA, pB, pC } = this;
            pA.copyFrom(p1);
            pB.copyFrom(p2);
            pC.copyFrom(p3);
            this._calced = false;
            return this;
        }

        calculateData() {
            if (!this._calced) {
                const { pA, pB, pC } = this;
                //@ts-ignore
                this.x = (pA.x + pB.x + pC.x) / 3;
                //@ts-ignore
                this.y = (pA.y + pB.y + pC.y) / 3;
                const sides = this.sides;
                sides[TrangleSideIndex.SideAB].setPoints(pA, pB); // line AB
                sides[TrangleSideIndex.SideBC].setPoints(pB, pC); // line BC
                sides[TrangleSideIndex.SideCA].setPoints(pC, pA); // line CA
                this._calced = true;
            }
        }

        /**
         * 检查点是否在三角形中间
         * @param testPoint 
         */
        isPointIn(testPoint: Point) {
            this.calculateData();
            // 点在所有边的右面或者线上
            return this.sides.every(
                side =>
                    side.classifyPoint(testPoint, jy.NavMeshConst.Epsilon) != jy.PointClassification.LeftSide
            );
        }
    }

    const distance = Point.distance;

    function getMidPoint(midPoint: Point, pA: Point, pB: Point) {
        midPoint.setTo((pA.x + pB.x) / 2, (pA.y + pB.y) / 2);
        return midPoint;
    }

    /**
      * 获得两个点的相邻的三角形
      * @param pA 
      * @param pB 
      * @param caller true 如果提供的两个点是caller的一个边
      */
    function requestLink(pA: Point, pB: Point, index: number, target: Cell) {
        const { pA: pointA, pB: pointB, pC: pointC, links } = target;
        if (pointA.equals(pA)) {
            if (pointB.equals(pB)) {
                links[TrangleSideIndex.SideAB] = index;
                return true;
            } else if (pointC.equals(pB)) {
                links[TrangleSideIndex.SideCA] = index;
                return true;
            }
        } else if (pointB.equals(pA)) {
            if (pointA.equals(pB)) {
                links[TrangleSideIndex.SideAB] = index;
                return true;
            } else if (pointC.equals(pB)) {
                links[TrangleSideIndex.SideBC] = index;
                return true;
            }
        } else if (pointC.equals(pA)) {
            if (pointA.equals(pB)) {
                links[TrangleSideIndex.SideCA] = index;
                return true;
            } else if (pointB.equals(pB)) {
                links[TrangleSideIndex.SideBC] = index;
                return true;
            }
        }
    }


    export class Cell extends Triangle {
        f = 0;
        h = 0;

        isOpen = false;

        parent: Cell = null;

        sessionId = 0;

        idx: number;

        links = [-1, -1, -1] as { [idx in TrangleSideIndex]: number };

        /**
         * 每边的中点
         */
        wallMidPt = [new Point, new Point, new Point] as { [idx in TrangleSideIndex]: Point };
        /**
         * 没边中点距离
         */
        wallDist = [0, 0, 0];

        /**
         * 通过墙的索引
         */
        wall = -1;


        init() {
            this.calculateData();
            const { wallMidPt: m_WallMidpoint, wallDist: m_WallDistance, pA, pB, pC } = this;
            let mAB = getMidPoint(m_WallMidpoint[TrangleSideIndex.SideAB], pA, pB);
            let mBC = getMidPoint(m_WallMidpoint[TrangleSideIndex.SideBC], pB, pC);
            let mCA = getMidPoint(m_WallMidpoint[TrangleSideIndex.SideCA], pC, pA);

            m_WallDistance[0] = distance(mAB, mBC);
            m_WallDistance[1] = distance(mCA, mBC);
            m_WallDistance[2] = distance(mAB, mCA);
        }

        /**
         * 检查并设置当前三角型与`cellB`的连接关系（方法会同时设置`cellB`与该三角型的连接）
         * @param cellB 
         */
        checkAndLink(cellB: Cell): void {
            const { pA, pB, pC, links, idx: index } = this;
            let idx = cellB.idx;
            if (links[TrangleSideIndex.SideAB] == -1 && requestLink(pA, pB, index, cellB)) {
                links[TrangleSideIndex.SideAB] = idx;
            } else if (links[TrangleSideIndex.SideBC] == -1 && requestLink(pB, pC, index, cellB)) {
                links[TrangleSideIndex.SideBC] = idx;
            } else if (links[TrangleSideIndex.SideCA] == -1 && requestLink(pC, pA, index, cellB)) {
                links[TrangleSideIndex.SideCA] = idx;
            }
        }
        /**
         * 记录路径从上一个节点进入该节点的边（如果从终点开始寻路即为穿出边）
         * @param index	路径上一个节点的索引
         */
        setWall(index: number) {
            let m_ArrivalWall = -1;
            const links = this.links;
            if (index == links[0]) {
                m_ArrivalWall = 0;
            } else if (index == links[1]) {
                m_ArrivalWall = 1;
            } else if (index == links[2]) {
                m_ArrivalWall = 2;
            }
            if (m_ArrivalWall != -1) {
                this.wall = m_ArrivalWall;
            }
            return m_ArrivalWall;
        }

    }
}