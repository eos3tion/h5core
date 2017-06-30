module junyou {
    /**
     * 有`width` `height` 2个属性
     * 
     * @export
     * @interface Size
     */
    export interface Size {
        width: number;
        height: number;
    }

    /**
     * 有 `x` `y` 两个属性
     * 
     * @export
     * @interface Point
     */
    export interface Point {
        x: number;
        y: number;
    }

    /**
     * 有 `x` `y` `z` 3个属性
     * 
     * @export
     * @interface Point3D
     * @extends {Point}
     */
    export interface Point3D extends Point {
        z: number;
    }

    /**
     * 矩形
     * 有`x`,`y`,`width`,`height` 4个属性
     * 
     * @export
     * @interface Rect
     * @extends {Point}
     * @extends {Size}
     */
    export interface Rect extends Point, Size { };
}