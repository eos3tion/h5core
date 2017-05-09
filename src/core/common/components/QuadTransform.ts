module junyou {
    /**
     * 基于4个顶点变形的纹理
     * 
     * @export
     * @class QuadTransform
     */
    export class QuadTransform {

        private _tex: egret.RenderTexture;
        private _canvas: HTMLCanvasElement;

        private _content: CanvasRenderingContext2D;

        constructor() {
            this._tex = new egret.RenderTexture();
            this._canvas = document.createElement("canvas");
            this._content = this._canvas.getContext("2d");
        }

        /**
         * 绘制白鹭的可视对象，并且进行变形
         * 
         * @param {egret.DisplayObject} display 
         * @param {{ x: number, y: number }} ptl 
         * @param {{ x: number, y: number }} ptr 
         * @param {{ x: number, y: number }} pbl 
         * @param {{ x: number, y: number }} pbr 
         * 
         * @memberOf QuadTransform
         */
        public drawDisplay(display: egret.DisplayObject, ptl?: QuadTransformPoint, ptr?: QuadTransformPoint, pbl?: QuadTransformPoint, pbr?: QuadTransformPoint) {
            let rawWidth = display.width;
            let rawHeight = display.height;
            ptl = ptl || { x: 0, y: 0 };
            ptr = ptr || { x: rawWidth, y: 0 };
            pbl = pbl || { x: 0, y: rawHeight };
            pbr = pbr || { x: rawWidth, y: rawHeight };
            //获取新的位图大小
            let ptlx = ptl.x,
                ptly = ptl.y,
                ptrx = ptr.x,
                ptry = ptr.y,
                pblx = pbl.x,
                pbly = pbl.y,
                pbrx = pbr.x,
                pbry = pbr.y;
            let minX = Math.min(ptlx, ptrx, pblx, pbrx);
            let maxX = Math.max(ptlx, ptrx, pblx, pbrx);
            let minY = Math.min(ptly, ptry, pbly, pbry);
            let maxY = Math.max(ptly, ptry, pbly, pbry);
            let width = maxX - minX;
            let height = maxY - minY;
            // let bytes = new Uint8ClampedArray(width * height * 4);
            let canvas = this._canvas;
            canvas.width = width;
            canvas.height = height;
            let content = this._content;
            let imgData = content.createImageData(width, height);
            let bytes = imgData.data;
            //获取原始位图数据
            let tex = this._tex;
            tex.drawToTexture(display);

            let source = tex.getPixels(0, 0, rawWidth, rawHeight);

            // top left
            ptl.Rx = ptl.Rx || 0;
            ptl.Ry = ptl.Ry || 0;

            //top right
            ptr.Rx = ptr.Rx || rawWidth;
            ptr.Ry = ptr.Ry || 0;

            //bottom right
            pbr.Rx = pbr.Rx || rawWidth;
            pbr.Ry = pbr.Ry || rawHeight;

            //bottom left
            pbl.Rx = pbl.Rx || 0;
            pbl.Ry = pbl.Ry || rawHeight;


            //使用 向辉 寿标《真实感图像的颜色插值及其应用》计算机世界月刊，1992年10月 的方案进行计算
            let dict = [] as EdgeList[];
            let edges = 0;
            edges += makeEdge(ptl, ptr, dict);
            edges += makeEdge(ptr, pbr, dict);
            edges += makeEdge(pbr, pbl, dict);
            edges += makeEdge(pbl, ptl, dict);
            if (edges > 0) {
                let ael = [] as Edge[];
                let tael = [] as Edge[];
                for (let y = 0; y < maxY; y++) {
                    let edges = dict[y];
                    if (edges && edges.length) {
                        edges.appendTo(ael);
                        ael.doSort("dx");
                    }
                    let len = ael.length - 1;
                    if (len > 0) {

                        for (let i = 0; i < len; i++) {
                            let edgeA = ael[i];
                            let xLeft = edgeA.x;
                            //let pLeft = { x: xLeft, y };
                            let lRx = edgeA.Rx;
                            let lRy = edgeA.Ry;
                            let edgeB = ael[i + 1];
                            //得到区段
                            let xRight = edgeB.x;
                            let rRx = edgeB.Rx;
                            let rRy = edgeB.Ry;
                            let xWidth = xLeft - xRight;
                            let dRxx = 0, dRyx = 0;
                            if (xWidth) {
                                dRxx = (lRx - rRx) / xWidth;
                                dRyx = (lRy - rRy) / xWidth;
                            }
                            for (let x = xLeft; x <= xRight; x++) {
                                let ix = lRx | 0;
                                let u = lRx - ix;
                                let iy = lRy | 0;
                                let v = lRy - iy;

                                //得到像素，做双线性插值
                                let pos00 = (iy * rawWidth + ix) * 4;
                                let r00 = source[pos00];
                                let g00 = source[pos00 + 1];
                                let b00 = source[pos00 + 2];
                                let a00 = source[pos00 + 3];

                                let pos10 = pos00 + 4;
                                let r10 = source[pos10];
                                let g10 = source[pos10 + 1];
                                let b10 = source[pos10 + 2];
                                let a10 = source[pos10 + 3];

                                let pos01 = ((iy + 1) * rawWidth + ix) * 4;
                                let r01 = source[pos01];
                                let g01 = source[pos01 + 1];
                                let b01 = source[pos01 + 2];
                                let a01 = source[pos01 + 3];

                                let pos11 = pos01 + 4;
                                let r11 = source[pos11];
                                let g11 = source[pos11 + 1];
                                let b11 = source[pos11 + 2];
                                let a11 = source[pos11 + 3];
                                let u1 = 1 - u;
                                let v1 = 1 - v;
                                let pm00 = u1 * v1;
                                let pm10 = u * v1;
                                let pm01 = u1 * v;
                                let pm11 = u * v;
                                let pos = (y * width + x) * 4;
                                bytes[pos] = r00 * pm00 + r10 * pm10 + r01 * pm01 + r11 * pm11;
                                bytes[pos + 1] = g00 * pm00 + g10 * pm10 + g01 * pm01 + g11 * pm11;
                                bytes[pos + 2] = b00 * pm00 + b10 * pm10 + b01 * pm01 + b11 * pm11;
                                bytes[pos + 3] = a00 * pm00 + a10 * pm10 + a01 * pm01 + a11 * pm11;
                                lRx += dRxx;
                                lRy += dRyx;
                            }
                        }
                        let l = 0;
                        for (let i = 0; i <= len; i++) {
                            l = edgeCheckAndInc(ael[i], tael, l, y);
                        }
                        tael.length = l;
                        let tmp = ael;
                        ael = tael;
                        tael = tmp;
                    }
                }
            }
            content.putImageData(imgData, 0, 0);
            return egret.BitmapData.create("base64", canvas.toDataURL())
            function edgeCheckAndInc(edge: Edge, list: Edge[], l: number, y: number) {
                if (edge.ymax > y) {
                    list[l++] = edge;
                    edge.Rx += edge.dRx;
                    edge.Ry += edge.dRy;
                    edge.x = Math.round(edge.x + edge.dx);
                }
                return l;
            }
            function makeEdge(p0: QuadTransformPoint, p1: QuadTransformPoint, dict: { [index: number]: EdgeList }) {
                let x: number, Rx: number, Ry: number, ymax: number, ymin: number;
                if (p0.y == p1.y) {//水平边
                    return 0;
                }
                if (p0.y < p1.y) {
                    x = p0.x;
                    Rx = p0.Rx;
                    Ry = p0.Ry;
                    ymax = p1.y;
                    ymin = p0.y;
                } else {
                    x = p1.x;
                    Rx = p1.Rx;
                    Ry = p1.Ry;
                    ymax = p0.y;
                    ymin = p1.y;
                }
                let deltaY = p0.y - p1.y;
                let dx = (p0.x - p1.x) / deltaY;
                let dRx = (p0.Rx - p1.Rx) / deltaY;
                let dRy = (p0.Ry - p1.Ry) / deltaY;
                let edges = dict[ymin];
                if (!edges) {
                    dict[ymin] = edges = [] as EdgeList;
                    edges.minY = ymin;
                }
                edges.push({ x, Rx, Ry, ymax, dx, dRx, dRy });
                return 1;
            }
        }

    }

    interface EdgeList extends Array<Edge> {
        /**
         * 最小的y值
         * 
         * @type {number}
         * @memberOf EdgeList
         */
        minY: number;
    }

    export interface QuadTransformPoint extends Point {
        Rx?: number;
        Ry?: number;
    }

    interface Edge {
        /**
         * 在边的分类表ET中表示边的下端点的x坐标；在边的活化链表AEL中则表示边与扫描线的交点的x坐标
         * 
         * @type {number}
         * @memberOf Edge
         */
        x: number;
        /**
         * 边的斜率的倒数；即沿扫描线间方向X的增量值
         * 
         * @type {number}
         * @memberOf Edge
         */
        dx: number;

        /**
         * 边的上端点的y坐标
         * 
         * @type {number}
         * @memberOf Edge
         */
        ymax: number;

        /**
         * 在ET中表示变的下端点
         * 
         * @type {number}
         * @memberOf Edge
         */
        Rx: number;

        /**
         * 在AEL中则表示边与扫描线交点的反变换坐标
         * 
         * @type {number}
         * @memberOf Edge
         */
        Ry: number;
        dRx: number;
        dRy: number;

        // next: Edge;
    }

}