module junyou {
    let fun: { (link: string, origin?: string): string } = window.URL ? (link, origin) => {
        origin = origin || location.href;
        return new URL(link, origin).href;
    } : (link, origin) => {
        if (!origin) {
            origin = location.href;
            if (location.href != location.origin) {
                origin = origin.substr(0, origin.lastIndexOf("/"));
            }
        }
        return origin + "/" + link;//这个为项目中的简易实现，实现一个完整的URL需要实现太多规则  如 "/" 开头  "//"开头  http://caniuse.com/#search=URL 目前URL的支持状况，后续将屏蔽 此实现
    };
    /**
     * 处理链接地址
     * 如果是http:// 或者  https:// 获取//开头的地址，直接返回  
     * 否则拼接当前地址的 href
     * @export
     * @param {string} link 
     * @param {string} [origin] 
     * @returns 
     */
    export function solveLink(link: string, origin?: string): string {
        if (!/^((http|https):)?\/\//.test(link)) {
            link = fun(link, origin);
        }
        return link;
    }
}