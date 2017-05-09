module junyou {

	/**
     * 用于SortedLayer排序
     */
    export interface IDepth {
        depth: number;
    }

    export class DSprite extends egret.Sprite implements IDepth {
        public depth: number = 0;
    }

}
