/**
 * 脏字内容
 */
var $dirty: string;
module junyou {

    /**
     * 初始化屏蔽字
     * @param str   使用特定符号分隔的脏字列表
     * @param split 分隔符
     *
     */
    function initFilterstring(str: string, split: string): void {
        let arr = str.split(split);
        _len = arr.length;
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
                filterWords = new RegExp(s, "g");
                WordFilter.wordCensor = wordCensor1;
                WordFilter.checkWord = checkWord1;
                return;
            }
        } //超过长度的采用方案2
        _filterList = new Array<RegExp>(_len + 1);
        for (i = 0; i < _len; i++) {
            t = arr[i];
            t = t.replace(p2, "[\\$1]");
            t = t.replace(p, "[$1]");
            _filterList[i] = new RegExp(t, "g");
        }
        //| 一般我们特殊用途，也加入屏蔽字符
        _filterList[i] = new RegExp("[|]", "g");
        _len = _len + 1;
        WordFilter.wordCensor = wordCensor2;
        WordFilter.checkWord = checkWord2;
    }

    //正常版
    function wordCensor1(msg: string) {
        return msg.replace(filterWords, replaceDirty);
    }
    function checkWord1(msg: string) {
        return filterWords.test(msg);
    }

    //_filterList 版
    function wordCensor2(msg: string) {
        for (let i = 0; i < _len; i++) {
            msg = msg.replace(_filterList[i], replaceDirty);
        }
        return msg;
    }

    function checkWord2(msg: string) {
        for (let i = 0; i < _len; i++) {
            _filterList[i].lastIndex = 0;
            if (_filterList[i].test(msg)) {
                return true;
            }
        }
    }

    /**
     * 将字符替换成*
     * @param substring 子字符串
     * @return
     *
     */
    let replaceDirty = function (substring: string) {
        let len = substring.length;
        let result = "";
        while (len--) {
            result += "*";
        }
        return result;
    }

    /**
     * 如果超过正则表达式长度，使用的数组
     */
    let _filterList: RegExp[];

    /**
     * 昵称的过滤数组，没有加载到数据时使用
     */
    let filterWords = /卐|妓|婊|尻|屄|屌|睾|肏|[|]/g;

    /**
     * 长度
     */
    let _len: number;

    /**
     * 文字过滤
     * @author 3tion
     */
    export const WordFilter = {

        /**
         * 由于脏字文件使用ajax读取，可能存在跨域问题，所以在H5中使用javascript方式加载
         */
        loadDirtyWord(url: string, split = ";") {
            loadScript(url, function () {
                if ($dirty) {
                    initFilterstring($dirty, split);
                    // 清理脏字原始数据
                    $dirty = undefined;
                }
            })
        },
        /**
         * 初始化屏蔽字
         * @param str   使用特定符号分隔的脏字列表
         * @param split 分隔符
         *
         */
        initFilterstring,
        /**
         * 将敏感词替换为**
         * @param msg	要检测的文字
         * @return
         *
         */
        wordCensor: wordCensor1,
        /**
         * 设置 将字符替换成* 的函数
         * @param substring 子字符串
         * @return
         *
         */
        setDirtyHandler(handler: { (substring: string): string }) {
            replaceDirty = handler;
        },

        /**
         * 是否有敏感词
         * @param msg	要检测的文字
         * @return 		true为有敏感词，false为没有敏感词
         *
         */
        checkWord: checkWord1,
    }
}