namespace jy {
    export interface CfgData {
        /**
         * 特效数据
         * 
         * @type {{ [index: string]: AniInfo }}
         * @memberOf CfgData
         */
        ani: { [index: string]: AniInfo };
    }
}
/**
 * 游戏的常量的接口定义
 * 子项目自身实现接口
 * @author 3tion
 */
namespace jy {
    export const enum ResPrefix {
        /**
         * 特效文件夹
         */
        Ani = "a/",
    }
}
