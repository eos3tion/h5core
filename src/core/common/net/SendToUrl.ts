interface Window {
    Image: { new(width?: number, height?: number): HTMLImageElement };
}
module junyou {
    const _unSendList = [];
    const img = new window.Image();//使用Image，在https下，不会因为最终请求地址为http，导致浏览器将请求拦截，详情参考 https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content
    let _requestState = junyou.RequestState.UNREQUEST;
    img.crossOrigin = "anonymous";
    img.onerror = callBack(RequestState.FAILED);
    img.onload = callBack(RequestState.COMPLETE);
    /**
    * 
    * 发起可以不需要回调响应的跨域get请求
    * @param {string} url          发起请求的地址
    * @param {boolean} [always]    是否总是发起请求  
    *                              false（默认） 请求已经在列队中，则不会重复发起请求  
    *                              true 不管相同地址的请求之前是否已经发起，继续发起请求
    */
    export function sendToUrl(url: string, always?: boolean) {
        if (_requestState == RequestState.REQUESTING) {
            if (always) {
                _unSendList.push(url);
            } else {
                _unSendList.pushOnce(url);
            }
            return;
        }
        _requestState = RequestState.REQUESTING;
        img.src = url;
    };

    function callBack(state: RequestState) {
        return () => {
            _requestState = state;
            if (DEBUG) {
                console.log(img.src, "callBack:", state);
            }
            if (_unSendList.length > 0) {
                return sendToUrl(_unSendList.shift());
            }
        }
    }
}