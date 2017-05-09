module junyou {
    /**
     * 获取XMLHttpRequest对象
     * 
     * @export
     * @returns 
     */
    export function getXHR(): XMLHttpRequest {
        junyou.getXHR = window.XMLHttpRequest ? () => new XMLHttpRequest : () => new ActiveXObject("MSXML2.XMLHTTP");
        return junyou.getXHR();
    }
}

interface Window {
    XMLHttpRequest?: XMLHttpRequest;
}

// interface ActiveXObject {
//     new (key: "MSXML2.XMLHTTP"): XMLHttpRequest
// }
// declare const ActiveXObject: ActiveXObject;