module junyou {

    /**
     * 按钮形式的菜单
     * @author gushuai
     * (description)
     * 
     * @export
     * @class SkillItemMenuRender
     * @extends {MenuBaseRender<MenuBaseVO>}
     */
    export class ButtonMenuRender<T extends MenuBaseVO> extends MenuBaseRender<T>{

        protected btn: Button;

        public constructor(key = "lib", className = "ui.btn.MenuBtn") {
            super();
            let btn: Button = <Button>singleton(SuiResManager).createDisplayObject(key, className);
            this.skin = btn;
            this.btn = btn;
        }

        protected $setData(val: T) {
            super.$setData(val);
            this.btn.label = val.label;
        }
    }
}