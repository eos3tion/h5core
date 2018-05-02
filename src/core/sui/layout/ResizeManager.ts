namespace jy {

    export interface ResizeBin {
        layout: LayoutType;
        hoffset?: number;
        voffset?: number;
        container?: egret.DisplayObjectContainer;
    }

    export declare type ResizeDisplay = egret.DisplayObject & { $_resize?: ResizeBin };
    export class ResizeManager {
        protected _stage: egret.Stage;

        protected _list: ResizeDisplay[] = [];


        public init(stage?: egret.Stage) {
            this._stage = stage || egret.sys.$TempStage;
            this._stage.on(EgretEvent.RESIZE, this.onResize, this);
        }


        /**
         * 
         * 添加一个元件，相对于container的布局
         * @param {ResizeDisplay} dis 
         * @param {number} layout 
         * @param {number} [hoffset] 
         * @param {number} [voffset] 
         * @param {egret.DisplayObjectContainer} [container] 默认使用stage
         * 
         * @memberOf ResizeManager
         */
        public add(dis: ResizeDisplay, layout: number, hoffset?: number, voffset?: number, container?: egret.DisplayObjectContainer) {
            const list = this._list;
            dis.$_resize = { layout, hoffset, voffset, container };
            list.pushOnce(dis);
            if (dis.stage) {
                this.resize(dis);
            } else {
                dis.once(EgretEvent.ADDED_TO_STAGE, this.onAdded, this);
            }
        }

        /**
         * 移除元件
         * 
         * @param {egret.DisplayObject} dis (description)
         * @returns (description)
         */
        public remove(dis: ResizeDisplay) {
            this._list.remove(dis);
            dis.off(EgretEvent.ADDED_TO_STAGE, this.onAdded, this);
            if (dis.$_resize) {
                dis.$_resize = undefined;
            }
        }

        protected onAdded(e: egret.Event) {
            let dis = e.target as ResizeDisplay;
            let index = this._list.indexOf(dis);
            if (index < 0) return;
            this.resize(dis);
        }

        protected resize(dis: ResizeDisplay) {
            let info = dis.$_resize;
            let container = info.container || egret.sys.$TempStage;
            Layout.layout(dis, info.layout, info.hoffset, info.voffset, false, false, container);
        }

        protected onResize() {
            const list = this._list;
            let len = list.length;
            for (let i = 0; i < len; i++) {
                this.resize(list[i]);
            }
        }

        public dispose() {
            this._stage.off(EgretEvent.ADDED_TO_STAGE, this.onAdded, this);
            this._list.length = 0;
        }
    }
}