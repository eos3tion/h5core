namespace jy {
    import Point = egret.Point;

    function getDirection(pA: Point, pB: Point) {
        let pt = pB.subtract(pA);
        let direction = new Point(pt.x, pt.y);
        direction.normalize(1);
        return direction;
    }

    function dot(pA: Point, pB: Point) {
        return pA.x * pB.x + pA.y * pB.y;
    }

    let tmpPt = new Point;
    export class Line {
        pA = new Point as Readonly<Point>

        pB = new Point as Readonly<Point>

        /**
         * 是否计算过法线
         */
        private calcedNormal: boolean;
        /**
         * 法线
         */
        m_Normal: Point;

        setPA(pt: jy.Point) {
            let pa = this.pA;
            pa.setTo(pt.x, pt.y);
            this.calcedNormal = false;
            return this;
        }

        setPB(pt: jy.Point) {
            this.pB.copyFrom(pt);
            this.calcedNormal = false;
            return this;
        }

        setPoints(pA: jy.Point, pB: jy.Point) {
            this.pA.copyFrom(pA);
            this.pB.copyFrom(pB);
            this.calcedNormal = false;
            return this;
        }
        computeNormal() {
            if (!this.calcedNormal) {
                // Get Normailized direction from A to B
                let m_Normal = getDirection(this.pA, this.pB);

                // Rotate by -90 degrees to get normal of line
                // Rotate by +90 degrees to get normal of line
                let oldYValue = m_Normal.y;
                m_Normal.y = m_Normal.x;
                m_Normal.x = -oldYValue;
                this.m_Normal = m_Normal;
                this.calcedNormal = true;
            }
        }

        signedDistance(point: jy.Point) {
            this.computeNormal();
            tmpPt.copyFrom(point);
            let v2f = tmpPt.subtract(this.pA);
            return dot(this.m_Normal, v2f);
        }

        /**
         * 检查点的位置
         * @param point 要检查的点
         * @param epsilon 精度
         */
        classifyPoint(point: jy.Point, epsilon = NavMeshConst.Epsilon) {
            let result = PointClassification.OnLine;
            let distance = this.signedDistance(point);
            if (distance > epsilon) {
                result = PointClassification.RightSide;
            }
            else if (distance < -epsilon) {
                result = PointClassification.LeftSide;
            }
            return result;
        }

        intersection(other: Line, intersectPoint?: jy.Point) {
            const { pA: { x: opAX, y: opAY }, pB: { x: opBX, y: opBY } } = other;
            const { pA: { x: pAX, y: pAY }, pB: { x: pBX, y: pBY } } = this;
            const doY = opBY - opAY;
            const doX = opBX - opAX;
            const dtY = pBY - pAY;
            const dtX = pBX - pAX;
            const dx = opAX - pAX;
            const dy = opAY - pAY;
            const denom = doY * dtX - doX * dtY;
            let u0 = dx * doY - dy * doX;
            let u1 = dx * dtY - dy * dtX;
            if (denom == 0) {
                if (u0 == 0 && u1 == 0) {
                    return LineClassification.Collinear;
                } else {
                    return LineClassification.Paralell;
                }
            } else {
                u0 = u0 / denom;
                u1 = u1 / denom;
                let x = pAX + u0 * dtX;
                let y = pAY + u0 * dtY;
                if (intersectPoint) {
                    intersectPoint.x = x;
                    intersectPoint.y = y;
                }
                if ((u0 >= 0) && (u0 <= 1) && (u1 >= 0) && (u1 <= 1)) {
                    return LineClassification.SegmentsIntersect;
                }
                else if ((u1 >= 0) && (u1 <= 1)) {
                    return (LineClassification.ABisectB);
                }
                else if ((u0 >= 0) && (u0 <= 1)) {
                    return (LineClassification.BBisectA);
                }
                return LineClassification.LinesIntersect;
            }
        }

        equals(line: Line) {
            const { pA, pB } = this;
            const { pA: lpA, pB: lpB } = line;
            return pA.equals(lpA) && pB.equals(lpB) || pA.equals(lpB) && pB.equals(lpA);
        }
    }
}