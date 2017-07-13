module junyou {

    /**
     * 处理链接地址
     * 如果是http:// 或者  https:// 获取//开头的地址，直接返回  
     * 否则拼接当前地址的 href
     * @export
     * @param {string} link 
     * @param {string} [origin] 
     * @returns 
     */
    export function solveLink(link: string, origin?: string) {
        origin = origin || location.href;
        if (!/^((http|https):)?\/\//.test(link)) {
            if (window.URL) {
                link = new URL(link, origin).href;
            } else {
                link = origin + "/" + link;
            }
        }
        return link;
    }
}