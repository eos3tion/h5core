module junyou {
    let fun: { (link: string, origin?: string): string }
    if (window.URL) {
        fun = (link, origin) => {
            origin = origin || location.href;
            if (!/^((http|https):)?\/\//.test(link)) {
                link = new URL(link, origin).href;
            }
            return link;
        }
    } else {
        fun = (link, origin) => {
            origin = origin || location.href;
            if (!/^((http|https):)?\/\//.test(link)) {
                link = origin + "/" + link;
            }
            return link;
        }
    }
    /**
     * 处理链接地址
     * 如果是http:// 或者  https:// 获取//开头的地址，直接返回  
     * 否则拼接当前地址的 href
     * @export
     * @param {string} link 
     * @param {string} [origin] 
     * @returns 
     */
    export var solveLink: { (link: string, origin?: string): string } = fun;
}