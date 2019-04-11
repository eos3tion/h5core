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

        setPoints(pA: Point, pB: Point) {
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

        signedDistance(point: Point) {
            this.computeNormal();
            let v2f = point.subtract(this.pA);
            return dot(this.m_Normal, v2f);
        }

        /**
         * 检查点的位置
         * @param point 要检查的点
         * @param epsilon 精度
         */
        classifyPoint(point: Point, epsilon = 0.000001) {
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

        intersection(other: Line, intersectPoint?: Point) {
            const { pA: { x: opAX, y: opAY }, pB: { x: opBX, y: opBY } } = other;
            const { pA: { x: pAX, y: pAY }, pB: { x: pBX, y: pBY } } = this;
            let denom = (opBY - opAY) * (pBX - pAX) -
                (opBX - opAX) * (pBY - pAY)
            let u0 = (opBX - opAX) * (pAY - opAY) -
                (opBY - opAY) * (pAX - opAX);
            let u1 = (opAX - pAX) * (pBY - pAY) -
                (opAY - pAY) * (pBX - pAX);
            if (denom == 0) {
                if (u0 == 0 && u1 == 0) {
                    return LineClassification.Collinear;
                } else {
                    return LineClassification.Paralell;
                }
            } else {
                u0 = u0 / denom;
                u1 = u1 / denom;
                let x = pAX + u0 * (pBX - pAX);
                let y = pAY + u0 * (pBY - pAY);
                if (intersectPoint) {
                    intersectPoint.setTo(x, y);
                }
                if ((u0 >= 0.0) && (u0 <= 1.0) && (u1 >= 0.0) && (u1 <= 1.0)) {
                    return LineClassification.SegmentsIntersect;
                }
                else if ((u1 >= 0.0) && (u1 <= 1.0)) {
                    return (LineClassification.ABisectB);
                }
                else if ((u0 >= 0.0) && (u0 <= 1.0)) {
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