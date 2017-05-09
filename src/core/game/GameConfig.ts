module junyou {
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
module junyou {
    /**
     * 资源前缀  
     * 用于配置文件夹  
     * 如果是/结尾  
     * 目前测试使用的  
     * Cloth为u/  
     * ANI为a/  
     */
    export var ResPrefix: ResPrefixConstructor;

    export interface ResPrefixConstructor {
        /**
         * 衣服/底图
         */
        Cloth: string;
        /**
         * 特效
         */
        ANI: string;
    }

}
