module junyou {
    export interface LangUtilInterface {
        /**
         * 获取显示的信息
         * 
         * @static
         * @param {(number | string)} code code码
         * @param {any} args 其他参数  替换字符串中{0}{1}{2}{a} {b}这样的数据，用obj对应key替换，或者是数组中对应key的数据替换
         * @returns 显示信息
         */
        getMsg(code: number | string, ...args): string;
        /**
         * 
         * 注册语言字典
         * @param {{ [index: string]: string }} data 
         * @memberof LangUtilInterface
         */
        regMsgDict(data: { [index: string]: string }): void;

        /**
         * 检查语言包中，是否有对应的code码
         * 
         * @param {Key} code 
         * @returns {boolean} 
         * @memberof LangUtilInterface
         */
        has(code: Key): boolean;
    }

    let _msgDict: { [index: string]: string } = (window as any).$lang || {};
    /**
     * 用于处理语言/文字显示
     */
    export const LangUtil: LangUtilInterface = {
        /**
         * 获取显示的信息
         * 
         * @static
         * @param {Key} code code码
         * @param {any} args 其他参数  替换字符串中{0}{1}{2}{a} {b}这样的数据，用obj对应key替换，或者是数组中对应key的数据替换
         * @returns 显示信息
         */
        getMsg(code: Key, ...args) {
            if (code in _msgDict) {
                return _msgDict[code].substitute(args)
            }
            return typeof code === "string" ? code.substitute(...args) : code + "";
        },
        has(code: Key) {
            return code in _msgDict;
        },
        /**
         * 
         * 注册语言字典
         * @static
         * @param { { [index: string]: string }} data
         */
        regMsgDict(data: { [index: string]: string }) {
            _msgDict = data;
        }
    }

}