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


    function dispatchTouchEvent(target: egret.DisplayObject, type: any, e: egret.TouchEvent, deltaX?: number, deltaY?: number, deltaTime?: number) {
        if (!target.hasListen(type)) {
            return true;
        }
        let event: TouchEvent = Event.create(TouchEvent, type, false, true);
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

    export interface DragOption {
        /**
         * 最大拖拽时间
         */
        minDragTime?: number;
        /**
         * 最小拖拽距离的平方
         */
        minSqDist?: number;
        /**
         * 是否阻止子控件的touch事件
         */
        stopChildren?: boolean;
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
    let currentDragger: egret.DisplayObject = null;

    function onMove(this: DragDele, e: TouchEvent) {
        const host = this.host;
        if (currentDragger && currentDragger != host) {
            return
        }
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
        if (currentDragger) {
            if (this.isCon) {
                (currentDragger as egret.DisplayObjectContainer).touchChildren = false;
            }
            dispatchTouchEvent(currentDragger, EventConst.DragMove, e, dx, dy, delta);
        } else {
            let dragStart = false;
            if (delta > this.minDragTime) {
                dragStart = true;
            } else {
                let dist = dx * dx + dy * dy;
                if (dist > this.minSqDist) {
                    dragStart = true;
                }
            }
            if (dragStart) {
                currentDragger = host;
                dispatchTouchEvent(currentDragger, EventConst.DragStart, e, dx, dy, delta);
            }
        }
        if (currentDragger) {
            this.lx = nx;
            this.ly = ny;
            this.lt = now;
        }
    }
    function onEnd(this: DragDele, e: egret.TouchEvent) {
        if (this.et == Global.now) {
            return
        }
        if (currentDragger) {
            e.preventDefault();//阻止普通点击事件发生
            e.stopImmediatePropagation();
            dispatchTouchEvent(currentDragger, EventConst.DragEnd, e);
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
    export function bindDrag(host: egret.DisplayObject, opt?: DragOption) {
        const { stopChildren = true, minDragTime = 200, minSqDist = 225 } = opt || Temp.EmptyObject as DragOption;
        stage = stage || egret.sys.$TempStage;
        const isCon = stopChildren && host instanceof egret.DisplayObjectContainer;
        host.touchEnabled = true;
        if (host instanceof egret.DisplayObjectContainer) {
            host.isOpaque = true;
        }
        let dele: DragDele = { host, isCon, minDragTime, minSqDist };
        host.on(EgretEvent.TOUCH_BEGIN, checkStart, dele);
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
            dragEnd(dele);
        }
    }

    function checkStart(this: DragDele, e: TouchEvent) {
        if (currentDragger) {
            return
        }
        let x = e.stageX;
        let y = e.stageY;
        this.lt = Date.now();
        this.lx = x;
        this.ly = y;
        this.dragId = e.touchPointID;
        stage.on(EgretEvent.TOUCH_MOVE, onMove, this);
        stage.on(EgretEvent.TOUCH_END, onEnd, this);
    }

    function dragEnd(dele: DragDele) {
        dele.et = Global.now;
        if (dele.isCon) {
            if (currentDragger) {
                (currentDragger as egret.DisplayObjectContainer).touchChildren = true;
            }
        }
        stage.off(EgretEvent.TOUCH_MOVE, onMove, dele);
        stage.off(EgretEvent.TOUCH_END, onEnd, dele);
        currentDragger = null;
    }

    export function looseDrag(host: egret.DisplayObject) {
        let dele = host[key];
        if (dele) {
            host.off(EgretEvent.TOUCH_BEGIN, checkStart, dele);
            if (dele.isCon) {
                (host as egret.DisplayObjectContainer).touchChildren = true;
            }
            if (host instanceof egret.DisplayObjectContainer) {
                host.isOpaque = false;
            }
            delete host[key];
        }
    }
}