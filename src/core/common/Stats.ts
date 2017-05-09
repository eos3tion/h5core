module junyou {
    /**
     * 用于像统计接口发送步骤信息
     * @author pb
     */
    export const Stats = (function () {
        let _actionUrl: string, _ip: string, _sign: string, _pid: string, _uid: string, _sid: string;
        return {
            setUrl(url: string) {
                if (url.charAt(url.length - 1) != "?") {
                    url += "?";
                }
                _actionUrl = url;
                return this;
            },
            setParams(params: ExternalParam) {
                _ip = getData(params.ip);
                _pid = getData(params.pid);
                _uid = getData(params.uid);
                _sid = getData(params.sid);
                return this;
            },
            setSign(sign: string) {
                _sign = getData(sign);
                return this;
            },
            postData(step: number) {
                sendToUrl(_actionUrl + this.getParamUrl(step));
            },
            getParamUrl(step: number) {
                return "step=" + getData(step) + "&ip=" + _ip
                    + "&sign=" + _sign + "&pid=" + _pid
                    + "&sid=" + _sid + "&uid=" + _uid
                    + "&client_time=" + Global.now;
            }
        };
        function getData(value: any) {
            return value === undefined ? "" : encodeURIComponent(value);
        }
    })();

}

