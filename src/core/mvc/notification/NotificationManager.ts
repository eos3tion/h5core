module junyou {
    /**
     * 通知管理器
     * @author 3tion
     */
    export class NotificationManager {
        private _dict: { [index: string]: NotifyBin };
        private _listen: { [index: string]: BadgeInfo[] };
        private _badges: { [index: string]: BadgeInfo };
        private _list: NotifyBin[];
        private _needSort: boolean;
        /**
         * 检测总开关
         * 
         * @private
         * @type {boolean}
         * @memberOf NotificationManager
         */
        private _needCheck: boolean;

        constructor() {
            this._dict = {};
            this._listen = {};
            this._badges = {};
            this._list = [];
        }


        /**
         * 从dic中取出一个角标
         * 
         * param {(number | string)} id (标识)
         *param {{[index:number]:egret.Shape}} dic (存放角标的字典)
         *param {boolean} [create] (是否自动创建,如果要创建，dis参数必填)
         *param {egret.DisplayObjectContainer} [dis] (关联的那个按钮)
         *param {number} [x] (角标偏移X)
         *param {number} [y] (角标偏移Y)
         *returns shape
         */
        public static getJiaoBiaoShape(id: number | string, dic: { [index: number]: egret.Shape }, create?: boolean, dis?: egret.DisplayObjectContainer, offsetx: number = 0, offsety: number = 0) {
            let shape: egret.Shape = dic[id];
            if (!shape) {
                if (create) {
                    shape = new egret.Shape();
                    shape.graphics.beginFill(0xff0000);
                    shape.graphics.drawCircle(0, 0, 10);
                    shape.graphics.endFill();
                    if (dis) {
                        let con = dis.parent;
                        shape.x = dis.x + dis.width - shape.width * 0.5 + offsetx;
                        shape.y = dis.y + shape.height * 0.5 + offsety;
                        con.addChild(shape);
                        dic[id] = shape;
                    }
                }
            }
            return shape;
        }

        /**
         * 获取Badge数据
         * 
         * @param {Key} id
         * @returns
         */
        public getBadge(id: Key) {
            return this._badges[id];
        }
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
        public bind(checker: INCheck | { (): any }, mid: Key, parent?: Key, proirity?: number) {
            let bin = this._dict[mid];
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
                this.bindListner(mid, parent);
                this._list.push(bin);
                this._needSort = true;
            }
            this._dict[mid] = bin;
        }

        /**
         * 
         * 绑定关注对象
         * @param {Key} mid    有ncheck实现的标识
         * @param {Key} [lid]  关联的标识(上一级父模块id)，如果不填，则用主表示
         */
        public bindListner(mid: Key, lid?: Key) {
            // lid = lid === undefined ? mid : lid;
            let b = this._badges[mid];
            if (!b) {
                this._badges[mid] = b = <BadgeInfo>{};
                b.mid = mid;
            }
            if (lid && lid != mid) {
                let parent = this._badges[lid];
                if (!parent) {
                    this._badges[lid] = parent = <BadgeInfo>{};
                    parent.mid = lid;
                }
                b.parent = parent;
                let sons = parent.sons;
                if (!sons) {
                    parent.sons = sons = [];
                }
                sons.push(b);
            }

            let arr = this._listen[mid];
            // let arr = this._listen[lid];
            if (!arr) {
                // this._listen[lid] = arr = [];
                this._listen[mid] = arr = [];
                arr.push(b);
            } else {
                arr.pushOnce(b);
            }
            // this._listen[lid] = arr;
            this._listen[mid] = arr;
        }

        /**
         * 
         * 需要检查的关联标识
         * @param {string} id
         */
        public needCheck(id: Key) {
            this._needCheck = true;
            let bin = this._dict[id];
            if (bin) {
                bin.needCheck = true;
                //下一帧进行检查
                Global.callLater(this.check, 0, this);
            }
            let badge = this.getBadge(id);
            if (badge) {
                //先将当前badge置为false，然后检查与badge并行的badge，如果都为false，就往上递归，如果都是false，就
                //将顶部入口也置为false;
                if (badge.show) {
                    badge.show = false;
                    let parent = badge.parent;
                    while (parent) {
                        let sons = parent.sons;
                        if (sons) {
                            let allsonHide: boolean = true;
                            for (let i = 0; i < sons.length; i++) {
                                let son = sons[i];
                                if (son.show) {
                                    allsonHide = false;
                                    break;
                                }
                            }
                            if (allsonHide) {
                                parent.show = false;
                                parent = parent.parent;
                            } else {
                                parent = undefined;
                            }
                        }
                    }
                }

            }
        }

        /**
         * 检查
         */
        public check() {
            if (!this._needCheck) {
                return;
            }
            this._needCheck = false;
            if (this._needSort) {//需要重新排序
                this._list.doSort("proirity", true);
                this._needSort = false;
            }
            // let listen = this._listen;
            let changed: BadgeInfo[] = [];
            for (let bin of this._list) {
                if (bin.needCheck) {
                    let thisObj = bin.checker;
                    let handler = bin.checkHandler;
                    let msg = handler.call(thisObj);
                    let b = this.getBadge(bin.id);
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
                    // let larr = listen[bin.id];
                    // if (larr) {
                    //     for (let b of larr) {
                    //         if (changed.indexOf(b) == -1 || msg != b.msg) {
                    //             b.msg = msg;//记录高优先级的消息
                    //             changed.pushOnce(b);
                    //             if (!msg) {
                    //                 b.show = false;
                    //             } else {
                    //                 b.show = true;
                    //             }
                    //         }
                    //     }
                    // }
                    //已经检查过
                    bin.needCheck = false;
                }
            }
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

            if (hasListen(EventConst.Notification)) { //用于处理角标
                for (let b of changed) {
                    dispatch(EventConst.Notification, b);
                }
            }
        }
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
         * @type {Object}
         * @memberOf NotifyBin
         */
        checker: Object;
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
}
