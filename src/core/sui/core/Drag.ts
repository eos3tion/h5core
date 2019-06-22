module egret {
    export interface TouchEvent {
        /** 
         * 和上一帧的 X偏移量
         */
        deltaX?: number;
        /**
         * 和上一帧的 Y偏移量
         */
        deltaY?: number;

        /**
         * 和上一帧的 时间差值
         */
        deltaTime?: number;
    }
}
namespace jy {
    import TouchEvent = egret.TouchEvent;
    import Event = egret.Event;
    const key = "$__$Drag";

    const dragStartDict = {} as { [pointer: number]: boolean };

    function dispatchTouchEvent(target: egret.DisplayObject, type: any, e: egret.TouchEvent, deltaX?: number, deltaY?: number, deltaTime?: number) {
        if (!target.hasListen(type)) {
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

    export interface DragDele {
        host: egret.DisplayObject;
        lt?: number;
        lx?: number;
        ly?: number;
        dragId?: number;
        isCon: boolean;
        /**
         * 最大拖拽时间
         */
        minDragTime: number;
        /**
         * 最小拖拽距离的平方
         */
        minSqDist: number;

        /**
         * 调用了EndDrag的时间  
         * 用于判断是不是同一帧
         */
        et?: number;
    }
    let stage: egret.Stage;

    function onStart(this: DragDele, e: TouchEvent) {
        this.lt = Date.now();
        this.lx = e.stageX;
        this.ly = e.stageY;
        this.dragId = e.touchPointID;
        stage.on(EgretEvent.TOUCH_MOVE, onMove, this);
        stage.on(EgretEvent.TOUCH_END, onEnd, this);
    }
    function onMove(this: DragDele, e: TouchEvent) {
        if (this.et == Global.now) {
            return
        }
        if (!e.touchDown) {
            return onEnd.call(this, e);
        }
        let nx = e.stageX;
        let ny = e.stageY;
        let dx = nx - this.lx;
        let dy = ny - this.ly;
        let now = Date.now();
        let delta = now - this.lt;
        let { dragId, host } = this;
        let dragStart = dragStartDict[dragId];
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
            dragStartDict[dragId] = dragStart;
        }
        if (dragStart) {
            this.lx = nx;
            this.ly = ny;
            this.lt = now;
        }
    }
    function onEnd(this: DragDele, e: egret.TouchEvent) {
        if (this.et == Global.now) {
            return
        }
        let dragId = this.dragId;
        if (dragId != null && dragStartDict[dragId]) {
            e.preventDefault();//阻止普通点击事件发生
            e.stopImmediatePropagation();
            let host = this.host;
            dispatchTouchEvent(host, EventConst.DragEnd, e);
        }
        dragEnd(this);
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
        return dele;
    }

    /**
     * 停止指定id的拖拽
     * @param pointId 
     */
    export function stopDrag(host: egret.DisplayObject) {
        let dele = host[key];
        if (dele) {
            dragStartDict[dele.pointId] = false;
            dragEnd(dele);
        }
    }

    function dragEnd(dele: DragDele) {
        dele.et = Global.now;
        dragStartDict[dele.dragId] = false;
        dele.dragId = null;
        if (dele.isCon) {
            (dele.host as egret.DisplayObjectContainer).touchChildren = true;
        }
        stage.off(EgretEvent.TOUCH_MOVE, onMove, dele);
        stage.off(EgretEvent.TOUCH_END, onEnd, dele);
    }

    export function looseDrag(host: egret.DisplayObject) {
        let dele = host[key];
        if (dele) {
            dragEnd(dele);
            dele.host.off(EgretEvent.TOUCH_BEGIN, onStart, dele);
            if (dele.isCon) {
                (host as egret.DisplayObjectContainer).touchChildren = true;
            }
            delete host[key];
        }
    }
}