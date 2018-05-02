namespace jy {

    /**
     * @author gushuai
     * (description)
     * 
     * @export
     * @class Menu
     * @extends {egret.Sprite}
     */
    export class Menu extends egret.Sprite {

        private static dic: Map<SelectableComponents, Menu>;

        /**
         * 回调参数，第1位是绑定的target
         * 第2位是Menu
         * 
         * @static
         * @type {Function}
         */
        public menuinitFunc: { (target, menu: Menu) };

        private style: MenuStyle<MenuBaseRender<MenuBaseVO>>;

        private uiManager: SuiResManager;

        private maxRenderCount: number;

        private renders: MenuBaseRender<MenuBaseVO>[];


        /**
         * (description)
         * 
         * @static
         * @ param {egret.DisplayObject} target (Menu所在的父容器)
         * @ param {Menu} menu (menu实例)
         * @ param {Function} callBack (menu的displayMenuDatas具体实现函数（回调参数，第1位是绑定的target 第2位是Menu）)
         */
        public static bind(target: SelectableComponents, menu: Menu, menuinit: { (target, menu: Menu) }) {
            let dic = Menu.dic;
            if (!dic) {
                Menu.dic = dic = new Map<SelectableComponents, Menu>();
            }
            if (!dic.has(target)) {
                dic.set(target, menu);
            }
            menu.menuinitFunc = menuinit;
            target.on(EventConst.CHOOSE_STATE_CHANGE, Menu.onShowOrHideMenu, this);
        }

        public static unBind(target: SelectableComponents) {
            const dic = Menu.dic;
            if (!dic) return;
            if (dic.has(target)) {
                let dis: Menu = dic.get(target);
                dis.menuinitFunc = undefined;
                removeDisplay(dis);
                dic.delete(target);
            }
            target.off(EventConst.CHOOSE_STATE_CHANGE, Menu.onShowOrHideMenu, this);
        }

        /**
         * 当前显示的菜单项
         * 
         * @static
         * @type {SelectableComponents}
         * @memberOf Menu
         */
        public static currentShow: SelectableComponents;

        private static onShowOrHideMenu(e: egret.Event) {
            let target = <SelectableComponents>e.target;
            let b = target.selected;
            let dis = Menu.dic.get(target);
            let v = target.view;
            if (b) {
                if (v instanceof egret.DisplayObjectContainer) {
                    v.addChild(dis);
                    let init = dis.menuinitFunc;
                    if (init) {
                        init.call(target, target, dis);
                    }
                }
                this.currentShow = target;
            } else {
                removeDisplay(dis);
                this.currentShow = undefined;
            }
            target.dispatch(EventConst.Resize);
        }

        public constructor(style: MenuStyle<MenuBaseRender<MenuBaseVO>>, maxRendercount: number) {
            super();
            this.style = style;
            this.uiManager = singleton(SuiResManager);
            this.maxRenderCount = maxRendercount;
            this.bindComponent();
        }

        protected bindComponent() {
            let manager = this.uiManager;
            let uri = this.style.uikey;
            let rec = this.style.possize;
            let rendercls = this.style.renderClass;
            let bguri = this.style.scalebg;
            let bg = <ScaleBitmap>manager.createDisplayObject(uri, bguri);
            this.addChild(bg);
            bg.width = rec.width;
            bg.height = rec.height;
            this.renders = [];
            for (let i = 0; i < this.maxRenderCount; i++) {
                let render = new rendercls();
                this.renders[i] = render;
                this.addChild(render.view);
            }
        }

        /**
         * 显示菜单操作项
         */
        public displayMenuDatas(vos: MenuBaseVO[]) {
            let len = vos.length;
            let blen = this.renders.length;
            const style = this.style;
            let tmp: MenuBaseRender<MenuBaseVO>[] = []
            for (let i = 0; i < len; i++) {
                let render = this.renders[i];
                render.data = vos[i];
                this.addChild(render.view);
                tmp[i] = render;
            }
            if (len < blen) {
                for (let i = len; i < blen; i++) {
                    removeDisplay(this.renders[i].view);
                }
            }
            let rec = style.possize;
            let gap: number;
            let tmpSize = tmp[0].getSize();
            if (!style.align) {
                gap = (rec.width - rec.x * 2 - len * tmpSize.width) / (len - 1);
                for (let i = 0; i < len; i++) {
                    let render = tmp[i];
                    tmpSize = render.getSize();
                    let v = render.view;
                    v.x = ~~(rec.x + (gap + tmpSize.width) * i);
                    v.y = ~~rec.y;
                }
            }
            else {
                gap = (rec.height - rec.y * 2 - len * tmpSize.height) / (len - 1);
                for (let i = 0; i < len; i++) {
                    let render = tmp[i];
                    tmpSize = render.getSize();
                    let v = render.view;
                    v.x = ~~rec.x;
                    v.y = ~~(rec.y + (gap + tmpSize.height) * i);
                }
            }
        }

    }
}