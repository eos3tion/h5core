module junyou {

    /**
     * 
     * 发起可以不需要回调响应的跨域get请求
     * @param {string} url          发起请求的地址
     * @param {boolean} [always]    是否总是发起请求  
     *                              false（默认） 请求已经在列队中，则不会重复发起请求  
     *                              true 不管相同地址的请求之前是否已经发起，继续发起请求
     */
    export const sendToUrl = (function () {
        const _unSendList = [];
        const req = new egret.HttpRequest;
        req.on(egret.Event.COMPLETE, callBack(RequestState.COMPLETE));
        req.on(egret.IOErrorEvent.IO_ERROR, callBack(RequestState.FAILED));
        let _requestState = RequestState.UNREQUEST;
        if (DEBUG) {
            var _url: string;
        }

        return function (url: string, always?: boolean) {
            if (_requestState == RequestState.REQUESTING) {
                if (always) {
                    _unSendList.push(url);
                } else {
                    _unSendList.pushOnce(url);
                }
                return;
            }
            _requestState = RequestState.REQUESTING;
            req.open(url, "GET");
            req.send();
            if (DEBUG) {
                _url = url;
                console.log(_url, "send");
            }
        };

        function callBack(state: RequestState) {
            return () => {
                _requestState = state;
                if (DEBUG) {
                    console.log(_url, "callBack:", state);
                }
                if (_unSendList.length > 0) {
                    return sendToUrl(_unSendList.shift());
                }
            }
        }
    })();

}