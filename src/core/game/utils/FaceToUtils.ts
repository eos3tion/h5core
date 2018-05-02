/**
 * @author 3tion
 */
namespace jy {
    /**
     * 任务朝向
     * 
     * @enum {number}
     */
    export const enum FaceTo {
        /**
       * 人物方向 ↓
       */
        face0 = 0,
        /**
         * 人物方向 ↘
         */
        face1 = 1,
        /**
         * 人物方向 →
         */
        face2 = 2,
        /**
         * 人物方向 ↗
         */
        face3 = 3,
        /**
         * 人物方向 ↑
         */
        face4 = 4,
        /**
         * 人物方向 ↖
         */
        face5 = 5,
        /**
         * 人物方向 ←
         */
        face6 = 6,
        /**
         * 人物方向 ↙
         */
        face7 = 7
    }
	/**
	 * 朝向工具，用于处理斜45°人物朝向
	 * @author 3tion
	 *
	 */
    export const FaceToUtils = {
    	/**
		 * 朝向对应坐标偏移量
		 */
        FacePos: [
			/*0*/[0, 1],
			/*1*/[1, 1],
			/*2*/[1, 0],
			/*3*/[1, -1],
			/*4*/[0, -1],
			/*5*/[-1, -1],
			/*6*/[-1, 0],
			/*7*/[-1, 1]],

        /**
         * 获取朝向的弧度值
         * @param direction
         * @return
         *
         */
        FaceToRad: [
			/*0*/1.5707963267948966,
			/*1*/0.7853981633974483,
			/*2*/0,
			/*3*/-0.7853981633974483,
			/*4*/-1.5707963267948966,
			/*5*/-2.356194490192345,
			/*6*/3.141592653589793,
            /*7*/2.356194490192345],
        /**
         * 获取朝向对应的角度
         */
        FaceToDeg: [
            /*0*/90,
            /*1*/60,
            /*2*/45,
            /*3*/30,
            /*4*/0,
            /*5*/-30,
            /*6*/-45,
            /*7*/-60
        ],
        /**
         * 获取朝向的弧度值的Sin
         * @param direction
         * @return
         *
         */
        FaceToRadSin: [
            /*0*/1,
            /*1*/0.7071067811865475,
            /*2*/0,
            /*3*/-0.7071067811865475,
            /*4*/-1,
            /*5*/-0.7071067811865476,
            /*6*/1.2246467991473532e-16,
            /*7*/0.7071067811865476
        ],
        /**
         * 获取朝向的弧度值的Cos
         * @param direction
         * @return
         *
         */
        FaceToRadCos: [
            /*0*/6.123233995736766e-17,
            /*1*/0.7071067811865476,
            /*2*/1,
            /*3*/0.7071067811865476,
            /*4*/6.123233995736766e-17,
            /*5*/-0.7071067811865475,
            /*6*/-1,
            /*7*/-0.7071067811865475
        ],
		/**
		 * 方向的对立方向数组
		 */
        OPPS: [
			/*0*/4,
			/*1*/5,
			/*2*/6,
			/*3*/7,
			/*4*/0,
			/*5*/1,
			/*6*/2,
			/*7*/3],



		/**
		 * 根据弧度取的朝向值
		 * @param rad		-π~+π
		 * @return
		 *
		 */
        getFaceTo: function (rad: number): number {
            if (rad < -2.748893571891069) {
                return 6;
            }
            else if (rad < -1.9634954084936207) {
                return 5;
            }
            else if (rad < -1.1780972450961724) {
                return 4;
            }
            else if (rad < -0.39269908169872414) {
                return 3;
            }
            else if (rad < 0.39269908169872414) {
                return 2;
            }
            else if (rad < 1.1780972450961724) {
                return 1;
            }
            else if (rad < 1.9634954084936207) {
                return 0;
            }
            else if (rad < 2.748893571891069) {
                return 7;
            }
            else {
                return 6;
            }
        },

        /**
		 * 根据起点到终点取的朝向值
		 * @param fx
		 * @param fy
		 * @param tx
		 * @param ty
		 * @return
		 *
		 */
        getFaceTo8: function (fx: number, fy: number, tx: number, ty: number): number {
            let d = (ty - fy) / (tx - fx);
            if (fx <= tx) {
                if (d > 1.2071067811865472) {
                    return 0;
                }
                else if (d > 0.20710678118654754) {
                    return 1;
                }
                else if (d > -0.20710678118654754) {
                    return 2;
                }
                else if (d > -1.2071067811865472) {
                    return 3;
                }
                else {
                    return 4;
                }
            }
            else {
                if (d <= -1.2071067811865472) {
                    return 0;
                }
                else if (d <= -0.20710678118654754) {
                    return 7;
                }
                else if (d <= 0.20710678118654754) {
                    return 6;
                }
                else if (d <= 1.2071067811865472) {
                    return 5;
                }
                else {
                    return 4;
                }
            }
        },

        /**
		 * 根据起点到终点取得屏幕朝向值
		 * @param fx
		 * @param fy
		 * @param tx
		 * @param ty
		 * @return
		 *
		 */
        getMouseFaceTo8: function (fx: number, fy: number, tx: number, ty: number): number {
            let d = (ty - fy) / (tx - fx);
            if (fx <= tx) {
                if (d > 2.414213562373095) {
                    return 0;
                }
                else if (d > 0.41421356237309503) {
                    return 1;
                }
                else if (d > -0.41421356237309503) {
                    return 2;
                }
                else if (d > -2.414213562373095) {
                    return 3;
                }
                else {
                    return 4;
                }
            }
            else {
                if (d <= -2.414213562373095) {
                    return 0;
                }
                else if (d <= -0.41421356237309503) {
                    return 7;
                }
                else if (d <= 0.41421356237309503) {
                    return 6;
                }
                else if (d <= 2.414213562373095) {
                    return 5;
                }
                else {
                    return 4;
                }
            }
        }
    }
}
