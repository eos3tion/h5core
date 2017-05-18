module junyou {
    export const enum CooldownState {
        /*停止*/
        STOP = 0,
        /*运行中*/
        RUN = 1
    }
    /**
     * 时间冷却
     * @author pb
     */
    export class Cooldown {

        /*cd接口*/
        public icd: ICooldown;

        /**
		 * 状态
		 */
        public state: number;

        /**
        * 已经持续的时间
        */
        private _duration: number;

        /*显示对象集合*/
        private _icdDisArr: ICooldownDisplay[] = [];

        public constructor(){
            this._duration = 0;
        }

        /**
		 * 增加一个视图对象
		 * @param ICooldownDisplay
		 *
		 */
        public addICDDisplay(icdDis: ICooldownDisplay): void {
            this._icdDisArr.pushOnce(icdDis);
        }

        /**
		 * 删除一个视图对象
		 * @param ICooldownDisplay
		 *
		 */
        public removeICDDisplay(icdDis: ICooldownDisplay): void {
            icdDis.remove();
            this._icdDisArr.remove(icdDis);
        }

        /**
		 * 启动
		 *
		 */
        public start(): void {
            this.state = CooldownState.RUN;
            this._duration = 0;
            this.icd.isCooling = true;
            this.updateICDDisplay(CooldownState.RUN);
        }

        /**
		 * 停止
		 *
		 */
        public stop(): void {
            this.state = CooldownState.STOP;
            this.icd.isCooling = false;
            this.updateICDDisplay(CooldownState.STOP);
        }

        /*更新显示状态*/
        private updateICDDisplay(state: CooldownState): void {
            this._icdDisArr.forEach(icdDis => {
                if (icdDis) {
                    if (state == CooldownState.RUN)
                        icdDis.add(this.icd.cd);
                    else
                        icdDis.remove();
                }
            });
        }

        /*数据处理*/
        public doData(delta: number): void {
            this._duration += delta;
            let remain = this.icd.cd - this._duration;
            if (remain <= 0) {
                this.stop();
            }
        }

        /*渲染处理*/
        public doRender(delta: number): void {
            if(this.state!=CooldownState.RUN){
                return;
            }
            this._duration += delta;
            let remain = this.icd.cd - this._duration;
            if (remain <= 0) {
                this.stop();
            }
            else {
                this._icdDisArr.forEach(icdDis => {
                    icdDis.doRender(delta);
                });
            }
        }

        /**
		 * 销毁
		 *
		 */
        public dispose(): void {
            this.state = CooldownState.STOP;
            this.icd.isCooling = false;
            this._icdDisArr.forEach(icdDis => {
                icdDis.dispose();
            });
            this._icdDisArr.length = 0;
        }
    }
}