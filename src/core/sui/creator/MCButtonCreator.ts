namespace jy {
    /**
     * 
     * 新版使用MC的按钮，减少制作按钮的难度  
     * 
     * 
     * @export
     * @class MCButton
     * @extends {Button}
     */
    export class MCButton extends Button {
        mc: MovieClip;


        constructor(mc?: MovieClip) {
            super();
            if (mc) {
                this.setSkin(mc)
            }
        }

        setSkin(mc: MovieClip) {
            //检查是否有文本框
            this.txtLabel = (mc as any).tf;
            this.mc = mc;
            this.addChild(mc, false);
            this.refresh();
        }

        refresh() {
            //停在指定帧
            let mc = this.mc;
            if (mc) {
                mc.stop(this.$getBtnFrame());
            }
        }

        dispose() {
            super.dispose();
            let mc = this.mc;
            if (mc) {
                mc.dispose();
            }
        }
    }
    MCButton.prototype.addChild = Component.prototype.addChild;


    /**
     * MC按钮创建器
     * 
     * @export
     * @class MCButtonCreator
     * @extends {BaseCreator<MCButton>}
     */
    export class MCButtonCreator extends BaseCreator<MCButton> {
        public parseSelfData(data: any) {
            let suiData = this._suiData;
            let framesData = MovieClipCreator.prototype.$getFramesData(data);
            this._createT = () => new MCButton(new MovieClip(data, framesData, suiData));
        }
    }
}