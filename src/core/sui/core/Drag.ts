module egret {
    export interface TouchEvent {
        deltaX?: number;
        deltaY?: number;

        /**
         * 时间差值
         */
        deltaTime?: number;
    }
}
module junyou {
    import TouchEvent = egret.TouchEvent;
    import Event = egret.Event;
    const key = "$__$Drag";
    function dispatchTouchEvent(target: egret.DisplayObject, type: any, e: egret.TouchEvent, deltaX?: number, deltaY?: number, deltaTime?: number) {
        if (!target.hasEventListener(type)) {
            return true;
        }
        let event: TouchEvent = Event.create(TouchEvent, type, true, true);
        event.$initTo(e.stageX, e.stageY, e.touchPointID);
        event.touchDown = e.touchDown;
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaTime = deltaTime;
        let result = target.dispatchEvent(event);
        Event.release(event);
        event.deltaX = undefined;
        event.deltaY = undefined;
        event.deltaTime = undefined;
        return result;
    }

    interface DragDele {
        host: egret.DisplayObject;
        lt?: number;
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
        this.lt = Date.now();
        this.lx = e.stageX;
        this.ly = e.stageY;
        stage.on(EgretEvent.TOUCH_MOVE, onMove, this);
        stage.on(EgretEvent.TOUCH_END, onEnd, this);
    }
    function onMove(this: DragDele, e: TouchEvent) {
        if (!e.touchDown) {
            return onEnd.call(this, e);
        }
        let nx = e.stageX;
        let ny = e.stageY;
        let dx = nx - this.lx;
        let dy = ny - this.ly;
        let now = Date.now();
        let delta = now - this.lt;
        let { dragStart, host } = this;
        if (dragStart) {
            if (this.isCon) {
                (host as egret.DisplayObjectContainer).touchChildren = false;
            }
            dispatchTouchEvent(host, EventConst.DragMove, e, dx, dy, delta);
        } else {
            if (delta > this.minDragTime) {
                dragStart = true;
            } else {
                let dist = dx * dx + dy * dy;
                if (dist > this.minSqDist) {
                    dragStart = true;
                }
            }
            if (dragStart) {
                dispatchTouchEvent(host, EventConst.DragStart, e, dx, dy, delta);
            }
            this.dragStart = dragStart;
        }
        if (dragStart) {
            this.lx = nx;
            this.ly = ny;
            this.lt = now;
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