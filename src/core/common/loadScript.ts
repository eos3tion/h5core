module junyou {
    /**
      * 加载脚本
      * @param url
      * @param callback
      * @param thisObj
      * @param args
      */
    export function loadScript(url: string, callback: Function, thisObj?: any, ...args) {
        if (!url) {
            return;
        }
        var script: any = document.createElement("script");
        script.type = "text/javascript";
        //检测客户端类型
        if (script.readyState) {//IE
            script.onreadystatechange = () => {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    callback.apply(thisObj, args);
                }
            }
        } else {//其他浏览器
            script.onload = () => {
                callback.apply(thisObj, args);
            }
        }
        script.src = url;
        // 调整为放到文档最后
        document.documentElement.appendChild(script);
    }
}