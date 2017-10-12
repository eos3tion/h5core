module junyou {
	/**
	 * 导出类型，需要和导出工具的ExportType对应
	 * @author 
	 *
	 */
        export const enum ExportType {
                /**图片**/
                Image = 0,
                /**文本框*/
                Text = 1,
                /**复合容器**/
                Container = 2,
                /**按钮 */
                Button = 3,

                /**九宫图片*/
                ScaleBitmap = 5,

                ShapeNumber = 6,

                NumericStepper = 7,

                Slider = 8,

                ScrollBar = 9,

                /**进度条**/
                ProgressBar = 10,

                SlotBg = 11,

                ShareBmp = 12,

                Slot = 13,

                Rectangle = 14,
                /**
                 * 字库
                 */
                ArtWord = 15,

                /**
                 * 空容器，可带大小
                 */
                Sprite = 16,

                /**
                 * 图片加载器
                 */
                ImageLoader = 17,

                /**
                 * 会导出的复合容器
                 */
                ExportedContainer = 18,

                /**
                 * 影片剪辑
                 */
                MovieClip = 19,

                /**
                 * MC按钮
                 */
                MCButton = 20,

                /**
                 * MC版的进度条
                 */
                MCProgress = 21
        }
}
