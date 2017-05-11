module junyou {
    export class AdapterLayOut {
        private disList: LayOutBin[] = [];

        private stage: egret.Stage;

        private listChanged: boolean;

        private minSize: egret.Rectangle;

        private maxSize: egret.Rectangle;

        private currentSize: egret.Rectangle;

        public constructor() {
            let stage = egret.sys.$TempStage;
            this.stage = stage;
            stage.on(egret.Event.RESIZE, this.onStageResize, this);
            this.minSize = new egret.Rectangle(0, 0, 400, 240);
            this.maxSize = new egret.Rectangle(0, 0, 1152, 648);
            this.currentSize = new egret.Rectangle(0, 0, stage.width, stage.height);
        }
        public setMinSize(width: number, height: number) {
            let min = this.minSize;
            let max = this.maxSize;
            min.width = width;
            min.height = height;
            if (max.width < width) {
                max.width = width;
            }
            if (max.height < height) {
                max.height = height;
            }
            this.refreshCurrentSize();
        }

        public setMaxSize(width: number, height: number) {
            let min = this.minSize;
            let max = this.maxSize;
            max.width = width;
            max.height = height;
            if (min.width > width) {
                min.width = width;
            }
            if (min.height > height) {
                min.height = height;
            }
            this.refreshCurrentSize();
        }

        private refreshCurrentSize() {
            let min = this.minSize;
            let max = this.maxSize;
            let cur = this.currentSize;
            cur.width = Math.min(max.width, Math.max(min.width, cur.width));
            cur.height = Math.min(max.height, Math.max(min.height, cur.height));
        }
        /**为某显示对象添加自动布局策略
         * @param disobj 显示对象
         * @param normalMode 当游戏界面在minsize maxsize大小范围内的布局方式
         * @param minMode 当游戏界面小于minsize时的策略，如果传空，默认noscale
         * @param maxMode 当游戏界面大于maxsize时的策略，如果传空，当超出尺寸时，就是UI的效果图，默认按fla中的坐标还原,
         */
        public addLayout(disobj: egret.DisplayObject, normalMode: AdapScaleMode, minMode?: AdapScaleMode, maxMode?: AdapScaleMode) {
            let list = this.disList;
            let len = list.length;
            let bin = <LayOutBin>{ normalMode, minMode, maxMode, disHeight: disobj.height, disWidth: disobj.width, disobj, ox: disobj.x, oy: disobj.y };
            list.pushOnce(bin);
            if (len != list.length) {
                this.listChanged = true;
            }
            let stage: egret.Stage = disobj.stage;
            if (!stage) {
                disobj.on(egret.Event.ADDED_TO_STAGE, this.ondisAddtoStage, this);
            }
            if (this.listChanged) {
                this.stage.on(egret.Event.ENTER_FRAME, this.onListChanged, this);
            }
        }

        private onListChanged() {
            this.stage.off(egret.Event.ENTER_FRAME, this.onListChanged, this);
            this.listChanged = false;
            this.onStageResize();
        }

        private onStageResize() {
            let cur = this.currentSize;
            cur.width = this.stage.stageWidth;
            cur.height = this.stage.stageHeight;
            this.refreshCurrentSize();
            let bins = this.disList;
            let len = bins.length;
            for (let i = 0; i < len; i++) {
                this.reLayOut(bins[i]);
            }
        }

        private reLayOut(bin: LayOutBin) {
            const { disobj, disHeight, disWidth, normalMode, minMode, maxMode } = bin;
            let stage = this.stage;
            let cur = this.currentSize;
            let min = this.minSize;
            let max = this.maxSize;

            let contentWidth = stage.stageWidth;
            let contentHeight = stage.stageHeight;

            let minWidth = min.width;
            let minHeight = min.height;

            let maxWidth = max.width;
            let maxHeight = max.height;

            let currentMode: AdapScaleMode;
            let scaleMode = ScaleMode.NO_SCALE;
            let screenWidth: number;
            let screenHeight: number;
            if (contentWidth >= minWidth && contentWidth < maxWidth && contentHeight >= minHeight && contentWidth < maxWidth) {
                //正常尺寸内
                currentMode = normalMode;
                screenWidth = maxWidth;
                screenHeight = maxHeight;
            } else if (contentHeight >= maxHeight || contentWidth >= maxWidth) {
                //最大尺寸外
                currentMode = maxMode;
                if (!maxMode) {
                    scaleMode = ScaleMode.NO_MORE_SCALE;
                }
                screenWidth = maxWidth;
                screenHeight = maxHeight;
            } else if (contentHeight < minHeight || contentWidth < minWidth) {
                //最小尺寸内
                currentMode = minMode;
                if (!minMode) {
                    scaleMode = ScaleMode.NO_MORE_SCALE;
                }
                screenWidth = minWidth;
                screenHeight = minHeight;
            }
            if (currentMode) {
                let { top, left, absolute, x, y, scaleMode, layoutType} = currentMode;
                let scalex = 1;
                let scaley = 1;
                if (scaleMode != ScaleMode.NO_MORE_SCALE) {
                    let [dw, dh] = this.calculateStageSize(scaleMode, contentWidth, contentHeight, screenWidth, screenHeight, maxWidth, maxHeight);
                    scalex = dw / contentWidth;
                    scaley = dh / contentHeight
                    disobj.scaleX = scalex;
                    disobj.scaleY = scaley;
                }
                if (absolute) {
                    if (x !== undefined) {
                        disobj.x = x;
                    }
                    if (y !== undefined) {
                        disobj.y = y;
                    }
                } else {
                    if (!top && !left) {
                        if (layoutType !== undefined) {
                            Layout.getLayoutPos(disWidth * scalex, disHeight * scaley, cur.width, cur.height, layoutType, disobj);
                        }
                    } else {
                        Layout.layoutPercent(disobj, top, left, cur);
                    }
                }
            }
        }

        private ondisAddtoStage(e: egret.Event) {
            let dis = e.target;
            let bins = this.disList;
            for (let i = 0; i < bins.length; i++) {
                let bin = bins[i];
                if (bin.disobj === dis) {
                    this.reLayOut(bin);
                    break;
                }
            }
        }
        /**默认保持原始dis的宽高比 */
        private calculateStageSize(scaleMode: ScaleMode, disWidth: number, disHeight: number,
            screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number) {
            let displayWidth = disWidth;
            let displayHeight = disHeight;
            let scaleX = (disWidth / screenWidth) || 0;
            let scaleY = (disHeight / screenHeight) || 0;
            switch (scaleMode) {
                case ScaleMode.EXACT_FIT:
                    displayWidth = screenWidth;
                    displayHeight = screenHeight;
                    break;
                case ScaleMode.FIXED_HEIGHT:
                    //将显示对象的高度调整至screenHeight，宽度按显示对象对象原始比例进行缩放
                    displayHeight = screenHeight;
                    displayWidth = Math.round(disWidth * (screenHeight / disHeight));
                    break;
                case ScaleMode.FIXED_WIDTH:
                    //将显示对象的宽度调整至screenWidth，高度按显示对象对象原始比例进行缩放
                    displayWidth = screenWidth;
                    displayHeight = Math.round(disHeight * (screenWidth / disWidth));
                    break;
                case ScaleMode.NO_BORDER:
                    //
                    if (scaleX > scaleY) {
                        displayHeight = Math.round(screenHeight * scaleX);
                        displayWidth = Math.round(disWidth * (displayHeight / disHeight));
                    }
                    else {
                        displayWidth = Math.round(screenWidth * scaleY);
                        displayHeight = Math.round(disHeight * (displayWidth / disWidth));
                    }
                    break;
                case ScaleMode.SHOW_ALL:
                    if (scaleX > scaleY) {
                        displayHeight = Math.round(disHeight * scaleY);
                        displayWidth = Math.round(disWidth * (displayHeight / disHeight));
                    } else {
                        displayWidth = Math.round(disWidth * scaleX);
                        displayHeight = Math.round(disHeight * (displayWidth / disWidth));
                    }
                    break;
                case ScaleMode.FIXED_NARROW:
                    if (scaleX > scaleY) {
                        displayWidth = Math.round(screenWidth / scaleY);
                        displayHeight = Math.round(disHeight * (displayWidth / disWidth));
                    }
                    else {
                        displayHeight = Math.round(screenHeight / scaleX);
                        displayWidth = Math.round(disWidth * (displayHeight / disHeight));
                    }
                    break;
                case ScaleMode.FIXED_WIDE:
                    if (scaleX > scaleY) {
                        displayHeight = Math.round(screenHeight / scaleX);
                        displayWidth = Math.round(disWidth * (displayHeight / disHeight));
                    }
                    else {
                        displayWidth = Math.round(screenWidth / scaleY);
                        displayHeight = Math.round(disHeight * (displayWidth / disWidth));
                    }
                    break;
                case ScaleMode.FIT_TO_SCREEN:
                    displayWidth = Math.round(disWidth * screenWidth / contentWidth);
                    displayHeight = Math.round(disHeight * screenHeight / contentHeight);
                    break;
                default:
                    displayWidth = disWidth;
                    displayHeight = disHeight;
                    break;
            }
            //宽高不是2的整数倍会导致图片绘制出现问题
            if (displayWidth & 1) {
                displayWidth += 1;
            }
            if (displayHeight & 1) {
                displayHeight += 1;
            }
            return [displayWidth, displayHeight];
        }
    }
    interface LayOutBin {
        normalMode: AdapScaleMode;
        minMode?: AdapScaleMode;
        maxMode?: AdapScaleMode;
        disobj: egret.DisplayObject;
        /**原始宽度 */
        disWidth: number;
        /**原始高度 */
        disHeight: number;
        /**原始坐标x */
        ox: number;
        /**原始坐标y */
        oy: number;

    }

    export const enum ScaleMode {
        /**
         * Do not scale application content. Even when you change the player viewport size, it remains unchanged. If the player is smaller than the viewport content, possibly with some cropping.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) always with the player viewport size consistent.
         * @language en_US
         */
        /**
         * 不缩放应用程序内容。即使在更改播放器视口大小时，它仍然保持不变。如果播放器视口比内容小，则可能进行一些裁切。<br/>
         * 在此模式下，舞台尺寸（Stage.stageWidth,Stage.stageHeight）始终跟播放器视口大小保持一致。
         * @language zh_CN
         */
        NO_SCALE,
        /**
         * Keep the original aspect ratio scaling application content, after scaling a wide directions application content to fill the viewport players on both sides in the other direction may not be wide enough and left black bars.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the initialization incoming external application content size.
         * @language en_US
         */
        /**
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容的较宽方向填满播放器视口，另一个方向的两侧可能会不够宽而留有黑边。<br/>
         * 在此模式下，舞台尺寸(Stage.stageWidth,Stage.stageHeight)始终等于初始化时外部传入的应用程序内容尺寸。
         * @language zh_CN
         */
        SHOW_ALL,
        /**
         * Keep the original aspect ratio scaling application content, after scaling a narrow direction of application content to fill the viewport players on both sides in the other direction may exceed the viewport and the player is cut.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the initialization incoming external application content size.
         * @language en_US
         */
        /**
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容的较窄方向填满播放器视口，另一个方向的两侧可能会超出播放器视口而被裁切。<br/>
         * 在此模式下，舞台尺寸(Stage.stageWidth,Stage.stageHeight)始终等于初始化时外部传入的应用程序内容尺寸。
         * @language zh_CN
         */
        NO_BORDER,
        /**
         * Do not keep the original aspect ratio scaling application content, after scaling application content just fill the player viewport.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the initialization incoming external application content size.
         * @language en_US
         */
        /**
         * 不保持原始宽高比缩放应用程序内容，缩放后应用程序内容正好填满播放器视口。<br/>
         * 在此模式下，舞台尺寸(Stage.stageWidth,Stage.stageHeight)始终等于初始化时外部传入的应用程序内容尺寸。
         * @language zh_CN
         */
        EXACT_FIT,

        /**
         * 将显示对象的宽度调整至screenWidth，高度按显示对象对象原始比例进行缩放
         */
        FIXED_WIDTH,
        /**
            将显示对象的高度调整至screenHeight，宽度按显示对象对象原始比例进行缩放
         */
        FIXED_HEIGHT,

        /**
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player,a narrow direction may not be wide enough and fill.<br/>
         * In this mode, the stage height (Stage.stageHeight) and the stage width (Stage.stageWidth) by the current scale with the player viewport size.
         * @language en_US
         */
        /**
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，应用程序内容的较窄方向可能会不够宽而填充。<br/>
         * 在此模式下，舞台高度(Stage.stageHeight)和舞台宽度(Stage.stageWidth)由当前的缩放比例与播放器视口宽高决定。
         * @language zh_CN
         */
        FIXED_NARROW,

        /**
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, a wide direction may exceed the viewport and the player is cut.<br/>
         * In this mode, the stage height (Stage.stageHeight) and the stage width (Stage.stageWidth) by the current scale with the player viewport size.
         * @language en_US
         */
        /**
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，应用程序内容的较宽方向的两侧可能会超出播放器视口而被裁切。<br/>
         * 在此模式下，舞台高度(Stage.stageHeight)和舞台宽度(Stage.stageWidth)由当前的缩放比例与播放器视口宽高决定。
         * @language zh_CN
         */
        FIXED_WIDE,

        /** 不保持纵横比缩放显示对象 */
        FIT_TO_SCREEN,
        /**不再进行缩放了 */
        NO_MORE_SCALE
    }

    export interface AdapScaleMode {
        /**ScaleMode */
        scaleMode: ScaleMode;

        /**用绝对坐标还是相对坐标 */
        absolute?: boolean;

        layoutType?: LayoutType

        /**距父容器或者父类的顶边缘的百分比距离 相对布局时用*/
        top?: number;
        /**距父容器或者父类的左边缘的百分比距离 相对布局时用*/
        left?: number;
        /** 绝对时为绝对坐标*/
        x?: number;
        /** 绝对时为绝对坐标*/
        y?: number;

        hoffset?: number;

        voffset?: number
    }
}


