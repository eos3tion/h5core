module egret{
    export interface TextField{
        /**
         * 原始的文本数据
         * 
         * @type {junyou.TextData}
         * @memberof TextField
         */
        rawTextData:junyou.TextData;
    }
}
module junyou {

    export interface TextData extends Array<any> {
        /**
         * 
         * ["static", "dynamic", "input"]的索引
         * @type {number}
         * @memberof TextData
         */
        0: number;
    
        /**
         * 字体，0为默认字体
         * 
         * @type {(string | 0)}
         * @memberof TextData
         */
        1: string | 0;
    
        /**
         * align
         *  ["left", "center", "right", "justify"] 的索引值
         * @type {string}
         * @memberof TextData
         */
        2: number;
    
        /**
         * 文字颜色
         * 
         * @type {string}
         * @memberof TextData
         */
        3: string;
    
        /**
         * 字体大小
         * 
         * @type {number}
         * @memberof TextData
         */
        4: number;
    
        /**
         * 行间距
         * 
         * @type {number}
         * @memberof TextData
         */
        5: number;
    
        /**
         * 是否加粗
         * 
         * @type {number}
         * @memberof TextData
         */
        6: boolean;
    
        /**
         * 是否为斜体
         * 
         * @type {boolean}
         * @memberof TextData
         */
        7: boolean;
    
        /**
         * 描边数据
         * 0 表示没有描边
         * @type {(0 | TextStrokeData)}
         * @memberof TextData
         */
        8: 0 | TextStrokeData
    }
    
    export  interface TextStrokeData extends Array<any> {
        /**
         * 描边颜色值
         * 
         * @type {number | string}
         * @memberof TextStrokeData
         */
        0: number | string;
    
        /**
         * 描边宽度
         * 
         * @type {number}
         * @memberof TextStrokeData
         */
        1: number;
    }
    
	/**
	 * 文本框创建器
	 * @author 
	 *
	 */
    export class TextFieldCreator extends BaseCreator<egret.TextField> {
        static DefaultFonts: string = "";
        public constructor() {
            super();
        }

        public parseSelfData(data: TextData) {
            this._createT = () => {
                let tf = new egret.TextField();
                tf.rawTextData = data;
                this.initTextData(tf,data);
                return tf;
            }
        }

        public initTextData(tf:egret.TextField,data: TextData){
            //静态文本框按动态文本框处理
            let textType = ["dynamic", "dynamic", "input"][+data[0]];
            let face = data[1] || TextFieldCreator.DefaultFonts;
            let align = ["left", "center", "right", "justify"][+data[2]];
            let color = ColorUtil.getColorValue(data[3]);
            let size = data[4] || 12;//默认12px字
            let spacing = +data[5];
            let bold = !!data[6];
            let italic = !!data[7];
            let stroke = 0;
            let strokeColor:any = 0;
            let strokeDat = data[8];
            //            // blurX 作为描边宽度
            //            data[8] = [filter.color,filter.blurX];
            if (Array.isArray(strokeDat)) {
                strokeColor = strokeDat[0];
                if (typeof strokeColor == "string") {
                    strokeColor = ColorUtil.getColorValue(strokeColor);
                }
                stroke = strokeDat[1];
            }

            tf.type = textType;
            tf.fontFamily = face;
            tf.textAlign = align;
            tf.textColor = color;
            tf.size = size;
            tf.lineSpacing = spacing;
            tf.bold = bold;
            tf.italic = italic;
            tf.stroke = stroke;
            tf.strokeColor = strokeColor;
        }

    }
}
