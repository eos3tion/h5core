namespace jy {
    let _texture: egret.RenderTexture;
    export const DataUrlUtils = {
        /**
         * 根据dataUrl获取 base64字符串
         * 
         * @param {string} dataUrl 
         * @returns 
         */
        getBase64,
        /**
         * 根据dataUrl获取Uint8Array
         * 
         * @param {string} dataUrl 
         * @returns 
         */
        getBytes,
        /**
         * 获取白鹭可视对象的dataUrl
         * 
         * @param {egret.DisplayObject} dis 
         * @param {string} type 
         * @param {egret.Rectangle} [rect] 
         * @param {any} [encodeOptions] 
         * @returns 
         */
        getDisplayDataURL,
        /**
         * 获取可视对象的Base64字符串
         * 
         * @param {egret.DisplayObject} dis 
         * @param {string} type 
         * @param {egret.Rectangle} [rect] 
         * @param {any} [encodeOptions] 
         * @returns 
         */
        getDisplayBase64(dis: egret.DisplayObject, type: string, rect?: egret.Rectangle, encodeOptions?, scale?: number) {
            return getBase64(getDisplayDataURL(dis, type, rect, encodeOptions, scale));
        },
        /**
         * 获取可视对象的Uint8字节流
         * 
         * @param {egret.DisplayObject} dis 
         * @param {string} type 
         * @param {egret.Rectangle} [rect] 
         * @param {any} [encodeOptions] 
         * @returns 
         */
        getDisplayBytes(dis: egret.DisplayObject, type: string, rect?: egret.Rectangle, encodeOptions?, scale?: number) {
            return getBytes(getDisplayDataURL(dis, type, rect, encodeOptions, scale))
        }
    }
    function getDisplayDataURL(dis: egret.DisplayObject, type: string, rect?: egret.Rectangle, encodeOptions?, scale?: number) {
        if (!_texture) {
            _texture = new egret.RenderTexture;
        }
        rect = rect || dis.getBounds();
        _texture.drawToTexture(dis, rect, scale);
        return _texture.toDataURL(type, null, encodeOptions);
    }

    function getBase64(dataUrl: string) {
        return dataUrl.substr(dataUrl.indexOf(",") + 1);
    }

    function getBytes(dataUrl: string) {
        let b64 = this.getBase64(dataUrl);
        let binaryString = window.atob(b64)
        let len = binaryString.length
        let bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        return bytes;
    }
}