module junyou {
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

        public parseSelfData(data: any) {
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
            let strokeColor = 0;
            let strokeDat = data[8];
            //            // blurX 作为描边宽度
            //            data[8] = [filter.color,filter.blurX];
            if (Array.isArray(strokeDat)) {
                strokeColor = strokeDat[0];
                stroke = strokeDat[1];
            }
            this._createT = () => {
                let tf = new egret.TextField();
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
                return tf;
            }
        }

    }
}
