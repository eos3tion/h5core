module junyou {
    import TouchEvent = egret.TouchEvent;
    const key = "$__$Drag";
    function dispatchTouchEvent(target: egret.DisplayObject, type: any, e: egret.TouchEvent) {
        TouchEvent.dispatchTouchEvent(target, type, true, true, e.stageX, e.stageY, e.touchPointID, e.touchDown);
    }

    interface DragDele {
        host: egret.DisplayObject;
        st?: number;
        lx?: number;
        ly?: number;
        dragStart?: boolean;
        isCon: boolean;
        /**
         * 最大拖拽时间
         */
        minDragTime: number;
        /**
         * 最小拖拽距离的平方
         */
        minSqDist: number;
    }
    let stage: egret.Stage;

    function onStart(this: DragDele, e: TouchEvent) {
        this.st = Date.now();
        this.lx = e.stageX;
        this.ly = e.stageY;
        stage.on(EgretEvent.TOUCH_MOVE, onMove, this);
        stage.on(EgretEvent.TOUCH_END, onEnd, this);
    }
    function onMove(this: DragDele, e: TouchEvent) {

        if (!e.touchDown) {
            return onEnd.call(this, e);
        }
        let { dragStart, host } = this;
        if (dragStart) {
            if (this.isCon) {
                (host as egret.DisplayObjectContainer).touchChildren = false;
            }
            dispatchTouchEvent(host, EventConst.DragMove, e);
        } else {
            let nx = e.stageX;
            let ny = e.stageY;
            let delta = Date.now() - this.st;
            if (delta > this.minDragTime) {
                dragStart = true;
            } else {
                let dx = nx - this.lx;
                let dy = ny - this.ly;
                let dist = dx * dx + dy * dy;
                if (dist > this.minSqDist) {
                    dragStart = true;
                }
            }
            if (dragStart) {
                dispatchTouchEvent(host, EventConst.DragStart, e);
            }
            this.dragStart = dragStart;
        }
    }
    function onEnd(this: DragDele, e: egret.TouchEvent) {
        if (this.dragStart) {
            e.preventDefault();//阻止普通点击事件发生
            e.stopImmediatePropagation();
            let host = this.host;
            if (this.isCon) {
                (host as egret.DisplayObjectContainer).touchChildren = true;
            }
            dispatchTouchEvent(host, EventConst.DragEnd, e);
        }
        this.dragStart = false;
        stage.off(EgretEvent.TOUCH_MOVE, onMove, this);
        stage.off(EgretEvent.TOUCH_END, onEnd, this);
    }

    /**
     * 
     * @param {egret.DisplayObject} host 要被拖拽的对象
     * @param {boolean} [stopChildren=true] 是否屏蔽子控件的
     * @param {number} [minDragTime=300] 最小拖拽事件 
     * @param {number} [minSqDist=400] 最小 
     */
    export function bindDrag(host: egret.DisplayObject, stopChildren = true, minDragTime = 300, minSqDist = 400) {
        stage = stage || egret.sys.$TempStage;
        const isCon = stopChildren && host instanceof egret.DisplayObjectContainer;
        host.touchEnabled = true;
        let dele: DragDele = { host, isCon, minDragTime, minSqDist };
        host.on(EgretEvent.TOUCH_BEGIN, onStart, dele);
        host[key] = dele;
    }

    export function looseDrag(host: egret.DisplayObject) {
        let dele = host[key];
        if (dele) {
            stage.off(EgretEvent.TOUCH_MOVE, onMove, dele);
            stage.off(EgretEvent.TOUCH_END, onEnd, dele);
            dele.host.off(EgretEvent.TOUCH_BEGIN, onStart, dele);
            if (dele.isCon) {
                (host as egret.DisplayObjectContainer).touchChildren = true;
            }
            delete host[key];
        }
    }
}