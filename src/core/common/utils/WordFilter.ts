/**
 * 脏字内容
 */
var $dirty: string;
module junyou {
    /**
     * 文字过滤
     * @author 3tion
     */
    export class WordFilter {

        /**
         * 由于脏字文件使用ajax读取，可能存在跨域问题，所以在H5中使用javascript方式加载
         */
        public static loadDirtyWord(url: string) {
            loadScript(url, () => {
                if ($dirty) {
                    WordFilter.initFilterstring($dirty, ";");
                    // 清理脏字原始数据
                    $dirty = undefined;
                }
            })
        }

        /**
         * 初始化屏蔽字
         * @param str   使用特定符号分隔的脏字列表
         * @param split 分隔符
         *
         */
        public static initFilterstring(str: string, split: string): void {
            let arr = str.split(split);
            let _len = arr.length;
            WordFilter._len = _len;
            //每个正则，至少会增加 (?: )|，如果出现  \/*().?|+\-$\^=:!@| 这些字符，还会增加[]，如果出现\还会增加更多
            //按每个长度  5 + 2来处理
            let guessedLength = str.length + _len * 7;
            let p = /([\/*().?|+\-$\^=:!@])/g;
            let p2 = /([\\\[\]])/g;
            let t: string, i: number;
            if (guessedLength < 32768) {//正则字符串的长度一定大于原始字符串长度，正则字符串不能超过32768
                let l = _len - 1;
                let s = "(?:"; //必须加?:作为非捕获分组，否则分组会超过99个上限，最终导致无法replace
                for (i = 0; i < l; i++) {
                    t = arr[i];
                    if (t) {
                        t = t.replace(p2, "[\\$1]");
                        t = t.replace(p, "[$1]");
                        s += t + ")|(?:";
                    }
                }
                t = arr[l];
                t = t.replace(p2, "[\\$1]");
                t = t.replace(p, "[$1]");
                s += t + ")|[|]";
                if (s.length < 32768) {//正则字符串的实际长度
                    WordFilter.filterWords = new RegExp(s, "g");
                    return;
                }
            } //超过长度的采用方案2
            WordFilter._filterList = new Array<RegExp>(_len + 1);
            let _filterList = WordFilter._filterList;
            for (i = 0; i < _len; i++) {
                t = arr[i];
                t = t.replace(p2, "[\\$1]");
                t = t.replace(p, "[$1]");
                _filterList[i] = new RegExp(t, "g");
            }
            //| 一般我们特殊用途，也加入屏蔽字符
            _filterList[i] = new RegExp("[|]", "g");
            _len = _len + 1;
        }

        /**
         * 昵称的过滤数组，没有加载到数据时使用
         */
        public static filterWords = /卐|妓|婊|尻|屄|屌|睾|肏|[|]/g;

        /**
         * 如果超过正则表达式长度，使用的数组
         */
        private static _filterList: RegExp[];

        /**
         * 长度
         */
        private static _len: number;

        /**
         * 将敏感词替换为**
         * @param msg	要检测的文字
         * @return
         *
         */
        public static wordCensor(msg: string): string {
            let _filterList = WordFilter._filterList;
            let _len = WordFilter._len;
            let replaceDirty = WordFilter.replaceDirty;
            if (_filterList) {
                for (let i: number = 0; i < _len; i++) {
                    msg = msg.replace(_filterList[i], replaceDirty);
                }
                return msg;
            }
            //正常版
            return msg.replace(WordFilter.filterWords, replaceDirty);
        }

        /**
         * 将字符替换成*
         * @param substring 子字符串
         * @return
         *
         */
        public static replaceDirty = substring => {
            let len: number = substring.length;
            let result: string = "";
            while (len--) {
                result += "*";
            }
            return result;
        }

        /**
         * 是否有敏感词
         * @param msg	要检测的文字
         * @return 		true为有敏感词，false为没有敏感词
         *
         */
        public static checkWord(msg: string) {
            let _filterList = WordFilter._filterList;
            if (_filterList) {
                let _len = WordFilter._len;

                for (let i: number = 0; i < _len; i++) {
                    _filterList[i].lastIndex = 0;
                    if (_filterList[i].test(msg)) {
                        return true;
                    }
                }
                return false;
            }
            let filterWords = WordFilter.filterWords;
            filterWords.lastIndex = 0;
            //正常版
            return filterWords.test(msg);
        }
    }
}