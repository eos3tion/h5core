module junyou {

    /**
    * GameLayer
    * 用于后期扩展
    */
    export class GameLayer extends egret.Sprite {

        /**
         * 层id
         */
        public id: number;

        constructor(id: number) {
            super();
            this.id = id;
        }
    }


    /**
     * 需要对子对象排序的层
     */
    export class SortedLayer extends GameLayer {

        $doAddChild(child: egret.DisplayObject, index: number, notifyListeners: boolean = true): egret.DisplayObject {
            if ("depth" in child) {
                GameEngine.invalidateSort();
                return super.$doAddChild(child, index, notifyListeners);
            }
            else {
                throw new Error(`Only IDepth can be added to this LayerID(${this.id})`);
            }
        }

        /**
         * 进行排序
         */
        public sort() {
            //对子集排序
            (<(IDepth & egret.DisplayObject)[]>this.$children).doSort("depth");
        }

    }
}