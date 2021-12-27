namespace jy {

    export interface SliderSkinDele {
        bar: egret.DisplayObject;
        bg: egret.DisplayObject;
        thumb: egret.DisplayObject;
    }

    export interface SliderTip extends egret.DisplayObject {
        /**
         * tip常驻显示
         */
        alwaysShow?: boolean;
        setLabel(value: string);
    }

    export class Slider extends Component {

        private _width: number;


        private _value: number;

        /***滑块 */
        public thumb: egret.DisplayObject;
        /****底 */
        public bg: egret.DisplayObject;

        private _lastThumbX: number;

        private _max: number;

        private _min: number;

        private _step: number;

        /**每步step需要的像素 */
        private _perStepPixel: number;

        /*使不使用底条点击直接设值 */
        private _bgClickEnabled: boolean;
        bar?: egret.DisplayObject;
        tip?: SliderTip;
        _skin: SliderSkinDele;


        public constructor() {
            super();
        }

        bindTip(tip: SliderTip) {
            this.tip = tip;
        }

        set skin(skin: SliderSkinDele) {
            this._skin = skin;
            const { bg, bar, thumb } = skin;
            this.bg = bg;
            this._width = bg.width;
            this.bar = bar;
            this.thumb = thumb;
            TouchDown.loose(thumb);
            thumb.anchorOffsetX = thumb.width >> 1;
            this.touchEnabled = this.touchChildren = true;
            thumb.on(EgretEvent.TOUCH_BEGIN, this.onThumbBegin, this);
            this.on(EgretEvent.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        private onAddToStage() {
            if (this._bgClickEnabled) {
                this.stage.on(EgretEvent.TOUCH_END, this.bgOut, this);
            }
        }
        /*使不使用底条点击直接设值 */
        public set bgClickEnable(value: boolean) {
            this._bgClickEnabled = value;
            const { bg, stage } = this;
            if (value) {
                bg.on(EgretEvent.TOUCH_BEGIN, this.bgClick, this);
                if (stage) {
                    stage.on(EgretEvent.TOUCH_END, this.bgOut, this);
                }
            }
            else {
                bg.off(EgretEvent.TOUCH_BEGIN, this.bgClick, this);
                if (stage) {
                    bg.off(EgretEvent.TOUCH_END, this.bgOut, this);
                }

            }
        }

        bgClick(e: egret.TouchEvent) {
            let currentX = this.getX(e);
            this.calculatevalue(currentX);
            let tip = this.tip;
            if (tip) {
                tip.visible = true;
            }
        }

        private bgOut() {
            this.tip.visible = false;
        }

        private onThumbBegin(e: egret.TouchEvent) {
            let { thumb, stage, tip } = this;
            this._lastThumbX = this.getX(e);
            stage.on(EgretEvent.TOUCH_MOVE, this.mouseMove, this)
            thumb.on(EgretEvent.TOUCH_END, this.onThumbEnd, this);
            thumb.on(EgretEvent.TOUCH_RELEASE_OUTSIDE, this.onThumbEnd, this);
            if (tip) {
                tip.visible = true;
            }
        }



        private onThumbEnd() {
            let { stage, thumb, mouseMove, onThumbEnd } = this;
            stage.off(EgretEvent.TOUCH_MOVE, mouseMove, this);
            thumb.off(EgretEvent.TOUCH_END, onThumbEnd, this);
            thumb.off(EgretEvent.TOUCH_RELEASE_OUTSIDE, onThumbEnd, this);
        }

        private mouseMove(e: egret.TouchEvent) {
            this.calculatevalue(this.getX(e));
        }

        private calculatevalue(currentX: number) {
            let sub = currentX - this._lastThumbX;
            let steps: number;
            let value: number;
            let { _perStepPixel, _min, _max, _value, _step } = this;
            if (Math.abs(sub) >= _perStepPixel) {
                steps = sub / _perStepPixel;
                steps = Math.round(steps);

                value = _value + steps * _step;
                if (value <= _min) {
                    value = _min;
                }
                if (value >= _max) {
                    value = _max;
                }

                this.value = value;
                this._lastThumbX = currentX;
                let tip = this.tip;
                if (tip) {
                    checkTip(this, tip)
                }
            }
        }

        private getX(e: egret.TouchEvent) {
            const pt = Temp.SharedPoint1;
            const parent = this.thumb.parent;
            if (parent) {
                parent.globalToLocal(e.stageX, e.stageY, pt);
                return pt.x
            }
        }

        public set value(val: number) {
            this.setValue(val, true);
        }

        protected setValue(val: number, showTip?: boolean) {
            let { _min, _max, _step, _perStepPixel } = this;
            val = Math.clamp(val, _min, _max)
            if (this._value != val) {
                this._value = val;
                this.dispatch(EventConst.VALUE_CHANGE);
                let x = _perStepPixel ? ((val - _min) / _step) * _perStepPixel : this._width;
                this.thumb.x = x;
                let bar = this.bar;
                if (bar) {
                    bar.width = x;
                }
                if (showTip) {
                    let tip = this.tip;
                    if (tip && tip.alwaysShow) {
                        checkTip(this, tip)
                    }
                }
            }
        }

        public get value() {
            return this._value;
        }

        /**
         * 设置底条宽度
         */
        $setWidth(value: number) {
            if (this._width != value) {
                this._width = value;
                let { bg } = this;
                if (bg) {
                    bg.width = value;
                }
            }
        }

        $getWidth(): number {
            return this._width;
        }

        setMinMax(min: number, max: number, step = 1) {
            if (min > max) {
                min = max;
            }
            this._max = max;
            this._min = min;
            this._step = step;
            this._perStepPixel = min == max ? 0 : this._width * step / (max - min);
        }
    }

    function checkTip(slider: Slider, tip: SliderTip) {
        let stage = tip.stage;
        if (stage) {
            let { thumb, value } = slider;
            let rect = Temp.EgretRectangle;
            thumb.getTransformedBounds(tip.parent, rect);
            tip.x = rect.x;
            tip.setLabel(value + "");
        }
    }

    export class SliderCreator extends BaseCreator<Slider>{

        public parseSelfData(data: any) {
            let suiData = this._suiData;
            let framesData = MovieClipCreator.prototype.$getFramesData(data);
            this._createT = () => {
                let mc = new MovieClip(data, framesData, suiData) as any;
                let bar = new Slider();
                bar.skin = mc;
                bar.addChild(mc);
                return bar;
            }
        }


    }
}