/**
 * @author 3tion
 */
namespace jy {

    /**
     * 偶数方向的方向工具  
     * 方向0为面朝正下方，逆时针旋转  
     */
    export interface FaceUtil {
        /**
         * 总面数
         */
        readonly total: number;
        /**
         * face0的弧度
         */
        readonly face0Rad: number;
        /**
         * face0的角度
         */
        readonly face0Deg: number;
        /**
         * 根据起点和终点获取朝向  
         * 
         * @param fx 
         * @param fy 
         * @param tx 
         * @param ty 
         */
        getFace(fx: number, fy: number, tx: number, ty: number): number;

        /**
         * 获取对立方向
         */
        getOpps(faceTo: number): number;

        /**
         * 获取方向对应角度
         * @param faceTo 
         */
        getDeg(faceTo: number): number;

        /**
         * 获取方向对应弧度
         * @param faceTo 
         */
        getRad(faceTo: number): number;

        /**
         * 获取方向对应的弧度的sin  
         * 常用于计算y
         * @param faceTo 
         */
        getRadSin(faceTo: number): number;

        /**
         * 获取方向对应的弧度cos
         * 常用于计算x
         * @param faceTo 
         */
        getRadCos(faceTo: number): number;
    }

    const faceUtilCache = {} as { [totalFace: number]: FaceUtil }

    /**
     * 获取`朝向工具` 此方法只做偶数方向，即每个角度相同的  
     * 方向0为面朝正下方
     * @param total 朝向总数 
     */
    export function getFaceUtil(total: number) {
        if (total < 2 || total & 1) {
            DEBUG && ThrowError(`此工具不支持非正偶数方向`)
            return;
        }
        let util = faceUtilCache[total];
        if (!util) {
            const hTotal = total >> 1;
            const hTotal_1 = hTotal + 1;
            const list = [];
            for (let i = hTotal - 1; i >= 0; i--) {
                list.push(Math.tan(Math.PI / total * hTotal_1 + Math.PI / hTotal * i));
            }

            //生成对立点
            const opps = new Array(total);
            for (let i = 0; i < hTotal; i++) {
                opps[i] = hTotal + i;
                opps[hTotal + i] = i;
            }

            //生成角度，弧度
            const degs = new Array(total);
            const rads = new Array(total);
            const sinRads = new Array(total);
            const cosRads = new Array(total);
            let startDeg = 180;//方向0，↓，为180°
            let deltaDeg = 360 / total;
            let startRad = Math.PI;
            let deltaRad = Math.PI2 / total;
            const { sin, cos } = Math;
            for (let i = 0; i < total; i++) {
                degs[i] = startDeg - i * deltaDeg;
                let rad = startRad - i * deltaRad;
                rads[i] = rad;
                sinRads[i] = sin(rad);
                cosRads[i] = cos(rad);
            }

            util = {
                face0Deg: startDeg,
                face0Rad: startRad,
                total,
                getFace(fx: number, fy: number, tx: number, ty: number) {
                    let d = (ty - fy) / (tx - fx);
                    let face = hTotal;
                    if (fx <= tx) {
                        for (let i = 0; i < hTotal; i++) {
                            if (d > list[i]) {
                                face = i;
                                break;
                            }
                        }
                    }
                    else {
                        for (let i = hTotal; i >= 0; i--) {
                            if (d <= list[i]) {
                                face = hTotal + i + 1;
                                break;
                            }
                        }
                        if (face == total) {
                            face = 0;
                        }
                    }
                    return face;
                },
                getOpps(faceTo: number) {
                    return opps[faceTo];
                },
                getDeg(faceTo: number) {
                    return degs[faceTo];
                },
                getRad(faceTo: number) {
                    return rads[faceTo];
                },
                getRadSin(faceTo: number) {
                    return sinRads[faceTo];
                },
                getRadCos(faceTo: number) {
                    return cosRads[faceTo];
                }
            }
        }
        return util;
    }
}
