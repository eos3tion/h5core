module junyou {
    /**
     * 时间冷却接口
     * @author pb
     */
    export interface ICooldown {

        /*cd时间*/
        cd: number;

        /*技能id*/
        id: number;

        /*是否冷却中*/
        isCooling?: boolean;

    }
}