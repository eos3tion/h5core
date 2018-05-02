namespace jy {
	/**
	 * 模块配置数据
	 * @author 3tion
	 *
	 */
	export interface IModuleCfg {
        /**
         *id
         */
		id: string | number;
        /**
         * 模块对应面板，放置的容器标识
         */
		containerID: number;
        /**
         * 当前显示状态
         */
		showState: ModuleShowState;
		/**
		 * 服务器认为此功能开放
		 */
		serverOpen: boolean;
		/**
		 * 显示类型
		 */
		showtype: number;
		/**
		 * 显示限制数据
		 */
		showlimits: any[];
		/**
		 * 功能使用限制
		 */
		limittype: number;
		/**
		 * 使用限制数据
		 */
		limits: any[];
		/**
		 *执行类型
		 */
		type: number;
		/**
		 *参数1
		 */
		data1: any;
		/**
		 *参数2
		 */
		data2: any;
		/**
		 *参数3
		 */
		data3: any;
		/**
		 *参数4
		 */
		data4: any;
		/**
		 *模块名字
		 */
		name: string;
		/**
		 * 描述
		 */
		des: string;
		/**
		 * 是否关闭此功能（不开放）  
		 * 0/不填 正常开放  
		 * 1 暂未开放  
		 * 2 不开放/不显示按钮  
		 *   
		 */
		close: ModuleCloseState;

		/**
		 * 当模块开启时绑定的回调函数
		 */
		onOpen?: $CallbackInfo[];

		/**
		 * 当模块显示时绑定的回调函数
		 */
		onShow?: $CallbackInfo[];
	}

	export const enum ModuleCloseState {
		/**
		 * 正常开放
		 */
		Open = 0,
		/**
		 * 即将开放
		 */
		ComingSoon = 1,
		/**
		 * 关闭的
		 */
		Closed = 2
	}

	/**
	 * 模块tip状态
	 * 
	 * @export
	 * @enum {number}
	 */
	export const enum ModuleTipState {
		/**
		 * 即将开放
		 */
		ComingSoon = 1,
		/**
		 * 关闭的
		 */
		Closed = 2
	}
}
