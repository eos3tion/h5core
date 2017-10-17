module junyou {

    /**
     * 用于对通知进行检查
     * @author 3tion
     */
    export interface INCheck {
        /**
         * 
         * 对通知进行检查，如果是父级，可以直接检查子集
         * @returns {any}    返回改变的消息
         */
        ncheck(): any;
    }
    /**
     * 角标信息
     * @author 3tion
     */
    export interface BadgeInfo {
        /**
         * 
         * 模块标识
         * @type {string}
         */
        mid: string | number;
        /**
         * 
         * 改变的消息
         * @type {any}  存储角标支持数据
         */
        msg: any;

        show?: boolean;

        parent?: BadgeInfo;

        sons?: BadgeInfo[];
    }


    interface NotifyBin {

        /**
         * 
         * 执行优先级
         * @type {number}
         */
        proirity: number;

        /**
         * 检查器代码
         * 
         * @type {{ (): any }}
         * @memberOf NotifyBin
         */
        checkHandler: { (): any };

        /**
         * 检查器对象
         * 
         * @type {any}
         * @memberOf NotifyBin
         */
        checker: any;
        /**
         * 
         * 标识
         * @type {string}
         */
        id: string | number;

        /**
         * 
         * 需要发生改变
         * @type {boolean}
         */
        needCheck: boolean;
    }

    const _dict: { [index: string]: NotifyBin } = {};
    const _listen: { [index: string]: BadgeInfo[] } = {};
    const _badges: { [index: string]: BadgeInfo } = {};
    const _list: NotifyBin[] = [];
    let _needSort = false;

    /**
     * 检测总开关
     * 
     * @private
     * @type {boolean}
     * @memberOf NotificationManager
     */
    let _needCheck = false;



    /**
     * 
     * 绑定关注对象
     * @param {Key} mid    有ncheck实现的标识
     * @param {Key} [lid]  关联的标识(上一级父模块id)，如果不填，则用主表示
     */
    function bindListner(mid: Key, lid?: Key) {
        // lid = lid === undefined ? mid : lid;
        let b = _badges[mid];
        if (!b) {
            _badges[mid] = b = <BadgeInfo>{};
            b.mid = mid;
        }
        if (lid && lid != mid) {
            let parent = _badges[lid];
            if (!parent) {
                _badges[lid] = parent = <BadgeInfo>{};
                parent.mid = lid;
            }
            b.parent = parent;
            let sons = parent.sons;
            if (!sons) {
                parent.sons = sons = [];
            }
            sons.push(b);
        }

        let arr = _listen[mid];
        if (!arr) {
            _listen[mid] = arr = [];
            arr.push(b);
        } else {
            arr.pushOnce(b);
        }
        _listen[mid] = arr;
    }


    const temp: BadgeInfo[] = [];


    export interface BadgeInstance {
        /**
         * 获取Badge数据
         *
         * @param {Key} id
         * @returns
         */
        get(id: Key): BadgeInfo;
        /**
         *
         * 绑定检查器和标识
         * 一般用于注册子模块
         * ```
         *       [父模块1]             [父模块2]
         *  ┌────────┼────────┐          |
         *  子　　　　子       子         子
         *  模　　　　模       模         模
         *  块　　　　块       块         块
         *  a　　　　 b        c          d
         *
         * ```
         * 不是所有的标识都需要绑定检查器
         * 可以只需要绑定关注对象
         * 如上图所示，有`父模块1`，`父模块2`，一般对应主界面的按钮进行打开
         * `父模块1`下有3个子模块（`a`,`b`,`c`），一般对应父模块1的面板的3个页签
         * 常见的业务流程：任意子模块（`a`,`b`,`c`)有角标以后，父模块显示角标
         * 而子模块的角标一般会对应特定的检查代码
         *
         * 这种情况下，可以不对父模块1注册，只需注册子模块即可
         *
         * @param {INCheck|{(): any }} checker      检查器，或者检查器的函数
         * @param {string|number} mid               标识  绑定检查器的标识
         * @param {number} [proirity=0]             执行优先级
         */
        bind(checker: INCheck | {
            (): any;
        }, mid: Key, parent?: Key, proirity?: number): void;
        /**
         *
         * 绑定关注对象
         * @param {Key} mid    有ncheck实现的标识
         * @param {Key} [lid]  关联的标识(上一级父模块id)，如果不填，则用主表示
         */
        bindListner(mid: Key, lid?: Key): void;
        /**
         *
         * 需要检查的关联标识
         * @param {string} id
         */
        needCheck(id: Key): void;
        /**
         * 检查
         */
        check(): void;
    }

    function checkForBin(bin: NotifyBin, changed: BadgeInfo[]) {
        if (bin.needCheck) {
            let thisObj = bin.checker;
            let handler = bin.checkHandler;
            let msg = handler.call(thisObj);
            let b = _badges[bin.id];
            if (b) {
                if (changed.indexOf(b) == -1 || msg != b.msg) {
                    b.msg = msg;//记录高优先级的消息
                    changed.pushOnce(b);
                    if (!msg) {
                        b.show = false;
                    } else {
                        b.show = true;
                    }
                    let parent = b.parent;
                    while (parent) {
                        changed.pushOnce(parent);
                        parent = parent.parent;
                    }
                }
            }
            //已经检查过
            bin.needCheck = false;
        }
    }

    /**
     * 通知管理器
     * @author 3tion
     */
    export const Badge = {

        /**
         * 获取Badge数据
         * 
         * @param {Key} id
         * @returns
         */
        get(id: Key) {
            return _badges[id];
        },
        /**
         * 
         * 绑定检查器和标识  
         * 一般用于注册子模块  
         * ```
         *       [父模块1]             [父模块2]
         *  ┌────────┼────────┐          |
         *  子　　　　子       子         子
         *  模　　　　模       模         模
         *  块　　　　块       块         块
         *  a　　　　 b        c          d
         * 
         * ```
         * 不是所有的标识都需要绑定检查器  
         * 可以只需要绑定关注对象  
         * 如上图所示，有`父模块1`，`父模块2`，一般对应主界面的按钮进行打开  
         * `父模块1`下有3个子模块（`a`,`b`,`c`），一般对应父模块1的面板的3个页签  
         * 常见的业务流程：任意子模块（`a`,`b`,`c`)有角标以后，父模块显示角标  
         * 而子模块的角标一般会对应特定的检查代码  
         *   
         * 这种情况下，可以不对父模块1注册，只需注册子模块即可
         * 
         * @param {INCheck|{(): any }} checker      检查器，或者检查器的函数
         * @param {string|number} mid               标识  绑定检查器的标识
         * @param {number} [proirity=0]             执行优先级
         */
        bind(checker: INCheck | { (): any }, mid: Key, parent?: Key, proirity?: number) {
            let bin = _dict[mid];
            if (!bin) {
                bin = <NotifyBin>{};
                if (typeof (checker as INCheck).ncheck === "function") {
                    bin.checker = checker;
                    bin.checkHandler = (checker as INCheck).ncheck;
                } else {
                    bin.checkHandler = checker as { (): any };
                }
                bin.id = mid;
                bin.proirity = ~~proirity;
                bin.needCheck = false;
                if (!parent) {
                    parent = mid;
                }
                bindListner(mid, parent);
                _list.push(bin);
                _needSort = true;
            }
            _dict[mid] = bin;
        },
        bindListner,
        /**
         * 
         * 需要检查的关联标识
         * @param {string} id
         */
        needCheck(id: Key) {
            _needCheck = true;
            let bin = _dict[id];
            if (bin) {
                bin.needCheck = true;
            }
        },
        checkForBin,
        /**
         * 检查全部
         */
        checkAll() {
            if (!_needCheck) {
                return;
            }
            _needCheck = false;
            if (_needSort) {//需要重新排序
                _list.doSort("proirity", true);
                _needSort = false;
            }
            let changed = temp;
            changed.length = 0;
            for (let i = 0; i < _list.length; i++) {
                let bin = _list[i];
                checkForBin(bin, changed);
            }
            this.checkChanged(changed, true);
        },
        checkChanged(changed: BadgeInfo[], fire?: boolean) {
            for (let i = 0; i < changed.length; i++) {
                let badge = changed[i];
                if (badge.show) {
                    let parent = badge.parent;
                    while (parent) {
                        parent.show = badge.show
                        parent = parent.parent;
                    }
                } else {
                    let sons = badge.sons;
                    if (sons) {
                        for (let j = 0; j < sons.length; j++) {
                            let son = sons[j];
                            if (son.show) {
                                badge.show = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (fire && hasListen(EventConst.Notification)) { //用于处理角标
                for (let b of changed) {
                    dispatch(EventConst.Notification, b);
                }
            }
        }
    }
}
