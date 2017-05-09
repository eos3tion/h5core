module junyou {
    /**
     * 绘图数据
     * 
     * @interface IDrawInfo
     */
    export interface IDrawInfo {
        /**原始动作索引 */
        a: number;
        /**原始方向索引 */
        d: number;
        /**原始帧数索引 */
        f: number;
    }

    /**
     * 帧数据
     * 
     * @interface FrameInfo
     * @extends {IDrawInfo}
     */
    export interface FrameInfo extends IDrawInfo {
        /**和下一帧间隔索引 */
        t: number;
        /**事件 */
        e?: string;
    }


    /**
     * 动作数据
     * 
     * @interface ActionInfo
     */
    export interface ActionInfo {
        /**
         * 动作标识
         */
        key: number;
        /**
         * 帧列表信息
         * 
         * @type {FrameInfo[]}
         */
        frames: FrameInfo[];
        /**
         * 是否为循环动作
         */
        isCircle?: boolean;
        /**
         * 动画默认的总时间
         */
        totalTime: number;
    }

    /**
     * Ani播放状态
     * 
     * @enum {number}
     * @author 3tion
     */
    export const enum AniPlayState {
        /**
         * 待机
         */
        Standby,
        /**
         * 播放中
         */
        Playing,
        /**
         * 播放完毕
         */
        Completed,
        /**
         * 已回收
         */
        Recycled
    }

    /**
     * AniRender的回收策略
     * 
     * @export
     * @enum {number}
     */
    export const enum AniRecyclePolicy {
        /**
         * 都不回收
         */
        None = 0,
        /**
         * 回收显示对象
         */
        RecycleDisplay = 0b1,
        /**
         * 回收Render
         */
        RecycleRender = 0b10,
        /**
         * 全部回收
         */
        RecycleAll = RecycleDisplay | RecycleRender
    }

    /**
     * 获取帧数据
     * 为数组的顺序："a", "f", "t", "e", "d"
     * @param {*} data 如果无法获取对应属性的数据，会使用默认值代替  a: 0, d: -1, f: 0, t: 100 
     * @returns
     */
    export function getFrameInfo(data: any): FrameInfo {
        const def = { a: 0, d: -1, f: 0, t: 100 };
        const keys = ["a", "f", "t", "e", "d"];
        if (!Array.isArray(data)) {
            if (typeof data === "object") {
                for (let i = 0; i < 5; i++) {
                    let key = keys[i];
                    if (data[key] == undefined) {
                        data[key] = def[key];
                    }
                }
                return data;

            } else {
                return def;
            }
        }
        let f: FrameInfo = DataParseUtil.getData(data, keys, def);
        if (+f.e == 0) {
            f.e = undefined;
        }
        return f;
    }

    /**
     * 获取动作数据
     * 
     * @param {any} data
     * @param {number} key
     * @returns
     */
    export function getActionInfo(data, key: number) {
        let aInfo = <ActionInfo>{};
        aInfo.key = key;
        let d: any[] = data[0];//放数组0号位的原因是历史遗留，之前AS3项目的结构有这个数组，做h5项目的时候忘记修改
        let totalTime = 0;
        let j = 0;
        d.forEach((item) => {
            let f = getFrameInfo(item);
            totalTime += f.t;
            d[j++] = f;// 防止有些错误的空数据
        });
        aInfo.frames = d;
        aInfo.totalTime = totalTime;
        aInfo.isCircle = !!data[1];
        return aInfo;
    }

    /**
     * 获取自定义动作
     * 如果无法获取对应属性的数据，会使用默认值代替  
     * a: 0, d: -1, f: 0, t: 100 
     * @static
     * @param {any[]} actions 动作序列  如果无法获取对应属性的数据，会使用默认值代替  a: 0, d: -1, f: 0, t: 100 
     * @param {number} [key] 动作标识，需要使用整数
     * @return {CustomAction}   自定义动作
     */
    export const getCustomAction = (function () {
        let _key: number = -0.5;// 使用0.5 防止和手动加的key重复
        return function (actions: any[], key?: number): ActionInfo {
            key = key || _key--;
            let frames = [];
            let totalTime = 0;
            for (let i = 0; i < actions.length; i++) {
                let frame = getFrameInfo(actions[i]);
                frames[i++] = frame;
                totalTime += frame.t;
            }
            return { key, frames, totalTime };
        }
    })();
}