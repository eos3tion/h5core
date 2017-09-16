module junyou {

    /**
     * @ author gushuai
     * 
     * @export
     * @class MessageChanel
     */
    export class MessageChanel {

        public MAX_MSG_COUNT = 5;

        private _messageRenderArr: Array<MessageRender>;


        private _waitList: any[];

        private _con: egret.DisplayObjectContainer;

        private isruning: boolean = false;

        private renderStyle: MessageRenderStyle;

        public constructor() {
            this._messageRenderArr = new Array<MessageRender>();
            this._waitList = [];
        }
        /**
         * 
         * 设置chanel基本信息
         * @ param con 容器
         * @ param count 显示的最大消息数目
         * 
         * @ param renderStyle MessageRender样式，参数key如下
         */
        public initBase(con: egret.DisplayObjectContainer, count: number, renderStyle: MessageRenderStyle) {
            this._con = con;
            this.MAX_MSG_COUNT = count;
            this.renderStyle = renderStyle;
        }

        /**
         * 添加一条或多条消息
         * 
         * @ param msgs string类型的数组
         */
        public addMessage(msgs: any[]) {
            msgs.appendTo(this._waitList);
            this.checkNext();
            if (this.isruning == false) {
                this.isruning = true;
                this._con.on(EgretEvent.ENTER_FRAME, this.tick, this);
            }
        }


        /**
         * 检测并初始化新的render并显示消息
         * 
         * @private
         */
        private checkandAddMsg() {

            let render: MessageRender;
            let len = this._waitList.length;
            for (let i = 0; i < len; i++) {
                render = this.getMessageRender(i);
                if (!render) {
                    break;
                }
                if (render.isrunning) {
                    if (render.checkShow()) {
                        render.showMsg(this._waitList.shift());
                    } else {
                        let mlen = this._messageRenderArr.length;
                        if (mlen < this.MAX_MSG_COUNT) {
                            render = this.getMessageRender(mlen);
                            if (render) {
                                render.y = render.index * render.height;
                                this._con.addChild(render);
                                render.showMsg(this._waitList.shift());
                            }
                        }
                        continue;
                    }
                } else {
                    render.y = render.index * render.height;
                    this._con.addChild(render);
                    render.showMsg(this._waitList.shift());
                }
            }
        }

        private getMessageRender(index: number) {
            if (index > this.MAX_MSG_COUNT - 1) {
                return;
            }
            let render = this._messageRenderArr[index];
            if (!render) {
                render = new MessageRender();
                render.setStyles(this.renderStyle);
                render.index = index;
                this._messageRenderArr[index] = render;
                render.on(EventConst.MsgRenderCheckEnd, this.checkEnd, this);
                render.on(EventConst.MsgRenderCheckNext, this.checkNext, this);
            }
            return render;
        }

        /**
         * 移除消息render
         * 
         * @private
         * @param {egret.Event} e (description)
         */
        private checkEnd(e: egret.Event) {
            let isruning = false;

            let render: MessageRender;
            let target = e.target;
            this._con.removeChild(target);
            let len = this._messageRenderArr.length;
            for (let i = 0; i < len; i++) {
                render = this._messageRenderArr[i];
                if (render.isrunning) {
                    isruning = true;
                    break;
                }
            }
            if (isruning == false) {
                this._con.off(EgretEvent.ENTER_FRAME, this.tick, this);
                this.isruning = false;
            }
        }

        /**
         * 寻找符合条件的render显示下一条消息
         * 
         * @private
         * @param {egret.Event} e (description)
         */
        private checkNext(e?: egret.Event) {
            if (this._waitList.length > 0) {
                let len = this._messageRenderArr.length;
                if (len > 0) {
                    let render: MessageRender;
                    for (let i = 0; i < len; i++) {
                        render = this._messageRenderArr[i];
                        if (this._waitList.length > 0) {
                            if (render.isrunning == false) {
                                render.showMsg(this._waitList.shift());
                                this._con.addChild(render);
                            } else {
                                if (render.checkShow()) {
                                    render.showMsg(this._waitList.shift());
                                } else {
                                    continue;
                                }
                            }
                        }

                    }
                    if (len < this.MAX_MSG_COUNT) {
                        this.checkandAddMsg();
                    }
                } else {
                    this.checkandAddMsg();
                }

                if (this.isruning == false) {
                    this.isruning = true;
                    this._con.on(EgretEvent.ENTER_FRAME, this.tick, this);
                }
            }
        }


        private tick(e: egret.Event) {

            let arr = this._messageRenderArr;
            let len = arr.length;
            let render: MessageRender;
            for (let i = 0; i < len; i++) {
                render = arr[i];
                if (render.cantick) {
                    render.tick();
                }

            }
        }
    }
}