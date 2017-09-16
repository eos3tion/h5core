module junyou {

    /**
     *  尝试启用本地资源缓存
     * @author 3tion(https://github.com/eos3tion/)
     * @export
     * @param {number} [version=1] 
     * @returns 
     */
    export function tryLocalRes(version = 1) {
        if (egret.Capabilities.supportVersion != "Unknown") {//不处理native的情况
            return;
        }
        //检查浏览器是否支持IndexedDB
        let w = window as any;
        w.indexedDB = w.indexedDB ||
            w.mozIndexedDB ||
            w.webkitIndexedDB ||
            w.msIndexedDB;
        if (!w.indexedDB) {
            //不支持indexedDB，不对白鹭的RES做任何调整，直接return
            return;
        }
        w.IDBTransaction = w.IDBTransaction ||
            w.webkitIDBTransaction ||
            w.msIDBTransaction;
        w.IDBKeyRange = w.IDBKeyRange ||
            w.webkitIDBKeyRange ||
            w.msIDBKeyRange;

        w.URL = window.URL || w.webkitURL;
        //当前ios10还不支持IndexedDB的Blob存储，所以如果是ios，则此值为false
        const canUseBlob = egret.Capabilities.os == "iOS" ? false : !!(window.Blob && window.URL);
        /**
         * 本地数据库操作
         */
        const db = (function (version: number) {
            const keyPath = "url";
            const RW = "readwrite";
            const R = "readonly";
            const storeName = 'res';
            return {
                /**
                 * 存储资源
                 * 
                 * @param {RES.ResourceItem} data 
                 * @param {(this: IDBRequest, ev: Event) => any} callback 存储资源执行完成后的回调
                 */
                save(data: RES.ResourceItem, callback?: (this: IDBRequest, ev: Event) => any) {
                    open(result => {
                        let store = getObjectStore(result, RW);
                        let request = data.url ? store.put(data) : store.add(data);
                        request.onsuccess = callback;
                    });
                },

                /**
                 * 获取资源
                 * 
                 * @param {string} url 
                 * @param {{ (data: RES.ResourceItem) }} callback 
                 */
                get(url: string, callback: { (data: RES.ResourceItem) }) {
                    open(result => {
                        let store = getObjectStore(result, R);
                        let request = store.get(url);
                        request.onsuccess = function (e: Event) {
                            callback((e.target as IDBRequest).result);
                        };
                    }, e => { callback(null) });
                },
                /**
                 * 删除指定资源
                 * 
                 * @param {string} url 
                 * @param {{ (this: IDBRequest, ev: Event) }} callback 删除指定资源执行完成后的回调
                 */
                delete(url: string, callback: { (this: IDBRequest, ev: Event) }) {
                    open(result => {
                        let store = getObjectStore(result, RW);
                        let request = store.delete(url);
                        request.onsuccess = callback;
                    });
                },
                /**
                 * 删除全部资源
                 * 
                 * @param {{ (this: IDBRequest, ev: Event) }} callback 删除全部资源执行完成后的回调
                 */
                clear(callback: { (this: IDBRequest, ev: Event) }) {
                    open(result => {
                        let store = getObjectStore(result, RW);
                        let request = store.clear();
                        request.onsuccess = callback;
                    });
                }
            }
            function open(callback: { (result: IDBDatabase) }, onError?: { (e: Error) }) {
                try {
                    var request = indexedDB.open(storeName, version);
                } catch (e) {
                    ThrowError(`indexedDB error`, e);
                    return onError && onError(e);
                }
                request.onerror = (e: ErrorEvent) => {
                    onError && onError(e.error);
                    errorHandler(e);
                }
                request.onupgradeneeded = e => {
                    let _db = (e.target as IDBOpenDBRequest).result as IDBDatabase;
                    let names = _db.objectStoreNames;
                    if (!names.contains(storeName)) {
                        _db.createObjectStore(storeName, { keyPath: keyPath });
                    }
                };
                request.onsuccess = function (e: Event) {
                    let result = request.result as IDBDatabase;
                    result.onerror = errorHandler;
                    callback(result);
                };
            }

            function getObjectStore(result: IDBDatabase, mode: IDBTransactionMode) {
                return result.transaction(storeName, mode).objectStore(storeName);
            }

            function errorHandler(ev: ErrorEvent) {
                ThrowError(`indexedDB error`, ev.error);
            }
        })(version);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        //注入
        class ImageAnalyzer extends RES.ImageAnalyzer {
            loadFile(resItem: RES.ResourceItem, compFunc: Function, thisObject: any): void {
                // 检查内存中是否有本地资源
                if (this.fileDic[resItem.name]) {
                    compFunc.call(thisObject, resItem);
                    return;
                }
                let url = RES.$getVirtualUrl(resItem.url);
                db.get(url, data => {
                    let loader = (this as any).getLoader() as egret.ImageLoader;
                    this.resItemDic[loader.$hashCode] = { item: resItem, func: compFunc, thisObject: thisObject };
                    if (data) {//有数据
                        let rawData = data.local;
                        if (rawData instanceof Blob) {
                            url = URL.createObjectURL(rawData);
                        } else if (typeof rawData === "string") {//DataURL的情况
                            url = rawData;
                        } else {
                            if (DEBUG) {//其他情况不处理
                                ThrowError("出现ImageAnalyzer本地缓存不支持的情况");
                            }
                        }
                        resItem.local = rawData;
                    }
                    loader.load(url);//走原流程
                })
            }

            protected onLoadFinish(event: egret.Event): void {
                let request = event.$target as egret.ImageLoader;
                let data = this.resItemDic[request.$hashCode];
                delete this.resItemDic[request.$hashCode];
                let item = data.item as RES.ResourceItem;
                let local = item.local;
                if (!local) {
                    let url = item.url;
                    let req = (request as any).request;
                    if (req && req._url == url) {// 正常情况是blob
                        let type = req.responseType;
                        if (type == "blob") {//是blob
                            // 将数据存到本地缓存
                            local = req.response as Blob;
                        }
                    } else {
                        // 普通图片
                        // 尝试转换成DataURL，此方法为同步方法，可能会影响性能
                        let dat = request.data as egret.BitmapData;
                        if (dat instanceof egret.BitmapData) {
                            let img = dat.source as HTMLImageElement;
                            let w = img.width;
                            let h = img.height;
                            let type = "image/" + url.substring(url.lastIndexOf(".") + 1);
                            canvas.width = w;
                            canvas.height = h;
                            context.clearRect(0, 0, w, h);
                            context.drawImage(img, 0, 0);
                            try {
                                if (canUseBlob && url.indexOf("wxLocalResource:") != 0) {//微信专用不能使用 blob
                                    canvas.toBlob(blob => {
                                        item.local = blob;
                                        //存储数据
                                        db.save(item);
                                    }, type);
                                } else {
                                    local = canvas.toDataURL(type);
                                }
                            } catch (e) {
                                //一般跨域并且没有权限的时候，会参数错误
                            }
                        }
                    }
                    if (local) {
                        if (!canUseBlob && typeof local !== "string") {
                            let a = new FileReader();
                            a.onload = function (this, e) {
                                item.local = this.result;
                                //存储数据
                                db.save(item);
                            };
                            a.readAsDataURL(local);
                        } else {
                            item.local = local;
                            //存储数据
                            db.save(item);
                        }
                    }
                }
                item.loaded = (event.$type == EgretEvent.COMPLETE);
                if (item.loaded) {
                    let texture: egret.Texture = new egret.Texture();
                    texture._setBitmapData(request.data);
                    this.analyzeData(item, texture)
                }
                delete (request as any).request
                this.recycler.push(request);
                return data.func.call(data.thisObject, item);
            }
        }
        RES.registerAnalyzer(EgretResType.TYPE_IMAGE, ImageAnalyzer);
        return db;
    }
}

namespace RES {
    export interface ResourceItem {
        /**
         * 本地缓存的数据
         * 
         * @type {boolean}
         * @memberOf ResourceItem
         */
        local?: any;
    }
}