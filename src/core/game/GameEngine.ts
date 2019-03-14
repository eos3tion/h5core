namespace jy {



	/**
	 * 2d游戏的引擎管理游戏层级关系<br/>
	 * @author 3tion
	 *
	 */
    export class GameEngine extends egret.EventDispatcher {
        protected static layerConfigs: { [index: number]: LayerConfig } = {};
        static instance: GameEngine;

        static init(stage: egret.Stage, ref?: { new(stage: egret.Stage): GameEngine }) {
            ref = ref || GameEngine;
            GameEngine.instance = new ref(stage);
        }

        static addLayerConfig(id: number, parentid: number = 0, ref?: new (id: number) => GameLayer) {
            let lc = <LayerConfig>{};
            lc.id = id;
            lc.parentid = parentid;
            lc.ref = ref || BaseLayer;
            GameEngine.layerConfigs[id] = lc;
        }

        /**
          * 单位坐标发生变化时调用
          */
        static invalidateSort() {
            GameEngine.instance.invalidateSort();
        }

        /**
         * 摄像机，用于处理镜头坐标相关
         */
        public camera: Camera;

        protected _viewRect: egret.Rectangle;

        /**
         * 单位的排序是否发生改变
         */
        protected _sortDirty: Boolean;

        /**
         * 单位坐标发生变化时调用
         */
        public invalidateSort() {
            this._sortDirty = true;
        }

        public get viewRect(): egret.Rectangle {
            return this._viewRect;
        }

        protected _stage: egret.Stage;

        protected _layers: GameLayer[] = [];

        /**
         * 排序层
         */
        protected _sortedLayers: SortedLayer[] = [];

        /**
         * 获取或创建容器
         */
        public getLayer(id: GameLayerID): GameLayer {
            let layers = this._layers;
            let layer = layers[id];
            if (!layer) {
                let cfg = GameEngine.layerConfigs[id];
                if (!cfg) {
                    return;
                }
                let ref = cfg.ref;
                layer = new ref(id);
                this.addLayer(layer, cfg);
                layers[id] = layer;
                if (layer instanceof SortedLayer) {
                    this._sortedLayers.push(layer);
                }
            }
            return layer;
        }

        /**
         * 
         * @param {GameLayer} layer 要调整的层级
         * @param {number} newid 新的层级id
         * @param {boolean} [awake=true] 是否执行一次awake
         */
        changeId(layer: GameLayer, newid: number, awake = true) {
            let id = layer.id;
            if (id != newid) {
                let layers = this._layers;
                if (layers[id] == layer) {//清理旧的id数据
                    layers[id] = undefined;
                }
                layers[newid] = layer;
                layer.id = newid;
            }
            awake && this.awakeLayer(newid);
        }

        /**
         * 将指定
         * 
         * @param {GameLayerID} layerID 
         * 
         * @memberOf GameEngine
         */
        public sleepLayer(layerID: GameLayerID) {
            let layer = this._layers[layerID];
            removeDisplay(layer);
        }

        public awakeLayer(layerID: GameLayerID) {
            let layer = this._layers[layerID];
            let cfg = GameEngine.layerConfigs[layerID];
            if (layer) {
                this.addLayer(layer, cfg);
            }
        }

        protected addLayer(layer: GameLayer, cfg?: LayerConfig) {
            if (cfg && cfg.parentid) {
                let parent = this.getLayer(cfg.parentid);
                if (parent instanceof egret.DisplayObjectContainer) {
                    this.addLayerToContainer(layer, parent);
                }
            } else {
                this.addLayerToContainer(layer, this._stage);
            }
        }


        protected addLayerToContainer(layer: GameLayer, container: egret.DisplayObjectContainer): void {
            let children = container.$children;
            let id = layer.id;
            let j = 0;
            for (let i = 0, len = children.length; i < len; i++) {
                let child = children[i];
                if (layer != child) {
                    let childLayer = <GameLayer>child;
                    if (childLayer.id > id) {
                        break;
                    }
                    j++;
                }
            }
            container.addChildAt(layer, j);
        }

        constructor(stage: egret.Stage) {
            super();
            this._stage = stage;
            this.init();
        }

        protected init(): void {

        }

    }


    /**
     * 游戏中层级标识
     */
    export const enum GameLayerID {
        /**
         * Tip层
         * 用于放alert等最高层级
         * 不进行滚轴
         */
        Tip = 9000,
        /**
         * UI层
         * 用于放各种UI
         * 不进行滚轴
         * 在菜单和头像下面，属最底层
         */
        UI = 8000,

        /**
         * 游戏层
         * 人物死亡如果进行颜色变灰，则基于此容器变灰
         */
        Game = 1000,
        /**
         * 游戏蒙版层   
         * 用于放流血效果，迷雾效果之类的容器
         * 无鼠标事件
         * 不进行滚轴
         **/
        Mask = 1900,
        /**
         * 相机特效层   
         * 用于处理飘雪，飘雨类似效果 
         * 无鼠标事件
         * 不进行滚轴
         **/
        TopEffect = 1800,
        /**
         * 游戏滚轴层
         * 下级容器参与滚轴
         */
        GameScene = 1700,
        /**
         * 顶部场景特效
         * 用于放云朵等特效
         * 无鼠标事件
         * 不排序
         */
        CeilEffect = 1790,
        /**
         * 用于放置跟随单位一起的UI，角色血条，角色名字，头衔等
         */
        SortedUI = 1780,
        /**
         * 游戏特效层，
         * 一般盖在人身上的特效放于此层
         * 无鼠标事件
         * 不排序
         */
        GameEffect = 1770,

        /**
         * 参与排序的单位的容器
         * 放人，怪物，会进行排序
         */
        Sorted = 1760,
        /**
         * 底层
         * 放置尸体，光环
         * 会排序
         */
        Bottom = 1750,
        /**
         * 底部场景特效层
         */
        BottomEffect = 1740,

        /**
         * 地图渲染层
         */
        Background = 1730,

        /**
         * 地图预览图
         */
        Mini = 1710
    }

    /**
     * 层级配置
     */
    export interface LayerConfig {
        id: number;

        parentid: number;

        ref: new (id: number) => GameLayer;
    }
}