namespace jy {
	/**
	 * 基础创建器
	 * @author 3tion
	 *
	 */
    export class BaseCreator<T extends egret.DisplayObject> {



        protected _suiData: SuiData;

        public get suiData() {
            return this._suiData;
        }

        protected _baseData: BaseData;

        protected _createT: () => T;

        protected _parsed: boolean;

        public size: Readonly<egret.Rectangle>;

        public bindSuiData(suiData: SuiData) {
            this._suiData = suiData;
        }


        public parseData(data: ComponentData, suiData: SuiData) {
            if (!this._parsed) {
                this._parsed = true;
                this.bindSuiData(suiData);
                if (data) {
                    this.setBaseData(data[1]);
                    this.parseSelfData(data[2]);
                }
            }
        }

        /**
         * 处理尺寸
         * 
         * @param {SizeData} data
         * 
         * @memberOf BaseCreator
         */
        public parseSize(data: SizeData) {
            if (data) {
                this.size = new egret.Rectangle(data[0], data[1], data[2], data[3]);
            }
        }

        /**
         * 处理元素数据
         * 对应 https://github.com/eos3tion/ExportUIFromFlash  项目中
         * Solution.ts -> getElementData的元素数据的解析
         * @param {ComponentData} data 长度为4的数组
         * 0 导出类型
         * 1 基础数据 @see Solution.getEleBaseData
         * 2 对象数据 不同类型，数据不同
         * 3 引用的库 0 当前库  1 lib  字符串 库名字
         * @memberOf BaseCreator
         */
        public createElement(data: ComponentData) {
            return singleton(SuiResManager).getElement(this._suiData, data);
        }

        public setBaseData(data: BaseData) {
            this._baseData = data;
        }

        public parseSelfData(data: any) {

        }


        /**
         * 获取实例
         */
        public get(): T {
            var t = this._createT();
            t.suiRawRect = this.size;
            if (t instanceof Component) {
                t.init(this);
            }
            if (this._baseData) {
                SuiResManager.initBaseData(t, this._baseData);
            }
            return t;
        }

    }
}
