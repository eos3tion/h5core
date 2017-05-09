module junyou {
    export interface Size {
        width: number;
        height: number;
    }

    export interface Point {
        x: number;
        y: number;
    }

    export interface Point3D extends Point {
        z: number;
    }
}