module junyou{
    export class MessageRenderStyle{
        
        /**
         * 内容的显示坐标及宽高
         * 
         * @type {egret.Rectangle}
         */
        public contentSize:egret.Rectangle;
        
        /**
         * 内容文本字号
         * 
         * @type {number}
         */
        public fontSize:number=12;
        
        /**
         * 内容文本颜色
         * 
         * @type {number}
         */
        public fontColor:number=0;
        
        /**
         * 检测距离
         * 
         * @type {number}
         */
        public endpad:number=0;
        
        /**
         * 文本移动速度
         * 
         * @type {number}
         */
        public speed:number=0;
        
        /**
         * 背景
         * 
         * @type {junyou.ScaleBitmap}
         */
        public bg:junyou.ScaleBitmap;
        
        /**
         * 背景尺寸
         * 
         * @type {egret.Rectangle}
         */
        public bgSize:egret.Rectangle;
    }
}