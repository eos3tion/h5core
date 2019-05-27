namespace jy {

    export class Bin extends egret.Rectangle {
        /**
         * 是否旋转了90°
         */
        rot = false;

        clone() {
            return new Bin(this.x, this.y, this.width, this.height);
        }
    }

    export interface BinPacker {
        width: number;
        height: number;
        rot: boolean;

        usedRects: Bin[];

        freeRects: Bin[];
    }

    export interface ShortSideBinPacker extends BinPacker { }

    /**
     * 短边优先装箱  
     * 动态装箱，暂时只用短边优先的单一策略
     */
    export class ShortSideBinPacker {

        constructor(width: number, height: number, allowRotation?: boolean) {
            this.width = width;
            this.height = height;
            this.rot = !!allowRotation;
            this.usedRects = [];
            this.freeRects = [new Bin(0, 0, width, height)];
        }

        /**
         * 扩展大小，如果宽度或者高度比原先小，则返回false
         * @param width 
         * @param height 
         */
        extSize(width: number, height: number) {
            let { width: ow, height: oh } = this;
            if (width > ow && height > oh) {
                this.width = width;
                this.height = height;
                this.freeRects.push(
                    /**右侧增加一个高度和原本相同的 */new Bin(ow, 0, width - ow, oh),
                    /** 下方整块 */new Bin(0, oh, width, height - oh)
                )
                return true
            }
        }

        insert(width: number, height: number) {
            let bestShortSideFit = Infinity;
            let bestLongSideFit = 0;
            const { freeRects, rot: rotations } = this;
            const { min, max } = Math;
            let bestNode = new Bin;
            for (let i = 0, len = freeRects.length; i < len; i++) {
                let { width: rw, height: rh, x: rx, y: ry } = freeRects[i];
                // Try to place the Rect in upright (non-flipped) orientation.
                if (rw >= width && rh >= height) {
                    let leftoverHoriz = rw - width;
                    let leftoverVert = rh - height;
                    let shortSideFit = min(leftoverHoriz, leftoverVert);
                    let longSideFit = max(leftoverHoriz, leftoverVert);

                    if (shortSideFit < bestShortSideFit || (shortSideFit == bestShortSideFit && longSideFit < bestLongSideFit)) {
                        bestNode.x = rx;
                        bestNode.y = ry;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestShortSideFit = shortSideFit;
                        bestLongSideFit = longSideFit;
                    }
                }
                if (rotations && rw >= height && rh >= width) {
                    let flippedLeftoverHoriz = rw - height;
                    let flippedLeftoverVert = rh - width;
                    let flippedShortSideFit = min(flippedLeftoverHoriz, flippedLeftoverVert);
                    let flippedLongSideFit = max(flippedLeftoverHoriz, flippedLeftoverVert);

                    if (flippedShortSideFit < bestShortSideFit || (flippedShortSideFit == bestShortSideFit && flippedLongSideFit < bestLongSideFit)) {
                        bestNode.x = rx;
                        bestNode.y = ry;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestNode.rot = true;
                        bestShortSideFit = flippedShortSideFit;
                        bestLongSideFit = flippedLongSideFit;
                    }
                }
            }
            if (bestNode.height) {
                placeRect(bestNode, this);
                return bestNode;
            }
        }
    }

    function placeRect(node: Bin, packer: BinPacker): void {
        let { freeRects, usedRects } = packer;
        let fRectLen = freeRects.length;
        for (let i = 0; i < fRectLen; i++) {
            if (splitFreeNode(freeRects[i], node, packer)) {
                freeRects.splice(i, 1);
                i--;
                fRectLen--;
            }
        }


        //去重
        pruneFreeList(packer);

        usedRects.push(node);
    }

    function splitFreeNode(freeNode: Bin, usedNode: Bin, packer: BinPacker) {
        let freeRects = packer.freeRects;
        // Test with SAT if the Rects even intersect.
        let { x: usedNode_x, y: usedNode_y, right: usedNode_right, bottom: usedNode_bottom } = usedNode;
        let { x: freeNode_x, y: freeNode_y, right: freeNode_right, bottom: freeNode_bottom } = freeNode;
        if (usedNode_x >= freeNode_right || usedNode_right <= freeNode_x
            || usedNode_y >= freeNode_bottom || usedNode_bottom <= freeNode_y) return false;
        let newNode: Bin;
        if (usedNode_x < freeNode_right && usedNode_right > freeNode_x) {
            // New node at the top side of the used node.
            if (usedNode_y > freeNode_y && usedNode_y < freeNode_bottom) {
                newNode = freeNode.clone();
                newNode.height = usedNode_y - freeNode_y;
                freeRects.push(newNode);
            }

            // New node at the bottom side of the used node.
            if (usedNode_bottom < freeNode_bottom) {
                newNode = freeNode.clone();
                newNode.y = usedNode_bottom;
                newNode.height = freeNode_bottom - usedNode_bottom;
                freeRects.push(newNode);
            }
        }

        if (usedNode_y < freeNode_bottom && usedNode_bottom > freeNode_y) {
            // New node at the left side of the used node.
            if (usedNode_x > freeNode_x && usedNode_x < freeNode_right) {
                newNode = freeNode.clone();
                newNode.width = usedNode_x - freeNode_x;
                freeRects.push(newNode);
            }

            // New node at the right side of the used node.
            if (usedNode_right < freeNode_right) {
                newNode = freeNode.clone();
                newNode.x = usedNode_right;
                newNode.width = freeNode_right - usedNode_right;
                freeRects.push(newNode);
            }
        }

        return true;
    }

    function pruneFreeList(packer: BinPacker) {
        let { freeRects } = packer;
        for (let i = 0; i < freeRects.length; i++) {
            let a = freeRects[i];
            for (let j = i + 1; j < freeRects.length; j++) {
                let b = freeRects[j]
                if (b.containsRect(a)) {
                    freeRects.splice(i, 1);
                    i--;
                    break
                }
                if (a.containsRect(b)) {
                    freeRects.splice(j, 1);
                    j--;
                }
            }
        }
    }
}