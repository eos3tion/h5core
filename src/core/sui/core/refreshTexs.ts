module junyou {
    /**
     * 给ArtText和ArtWord刷新纹理使用
     * 
     * @export
     * @param {SuiData} suiData
     * @param {{ refreshBMD?: { (): void } }} thisObj
     */
    export function refreshTexs(suiData: SuiData, thisObj: { refreshBMD?: { (): void } }) {
        let bmds = suiData.pngbmd;
        // let bmdState = bmds.bmdState;
        if (!("refreshBMD" in thisObj)) {//对thisObj附加refreshBMD方法
            thisObj.refreshBMD = function () {
                //刷新纹理中的数据
                const txs = this._txs;
                let bmd = bmds.bmd;
                for (var key in txs) {
                    txs[key]._bitmapData = bmd;
                }
            }
        }
        suiData.checkRefreshBmp(thisObj as SuiBmdCallback);
    }
}