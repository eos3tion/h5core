module junyou {

    export const enum LocalResConst {
        /**
         * hash资源存储的key
         */
        ResHashKey = "$$hash$$",
    }

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
            const keyPath = "uri";
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
                        let request = data.uri ? store.put(data) : store.add(data);
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
                },
            }
            function open(callback: { (result: IDBDatabase) }, onError?: { (e: Error) }) {
                try {
                    var request = indexedDB.open(storeName, version);
                } catch (e) {
                    DEBUG && ThrowError(`indexedDB error`, e);
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
        let BAPt = RES.BinAnalyzer.prototype as any;
        BAPt.loadFile = function (resItem: RES.ResourceItem, compFunc: Function, thisObject: any): void {
            let name = resItem.name;
            if (this.fileDic[name]) {
                return compFunc.call(thisObject, resItem);
            }
            let url = resItem.url;
            let uri = ConfigUtils.getResUri(url);
            if (uri) {
                resItem.uri = uri;
                return db.get(uri, (data: RES.ResourceItem) => {
                    if (data) {//有数据
                        let local = data.local;
                        if (local) {
                            let ver = ConfigUtils.getResVer(data.uri);
                            if (ver == data.version) {
                                resItem.data = local;
                                resItem.loaded = true;
                                this.fileDic[name] = local;
                                return compFunc.call(thisObject, resItem);
                            }
                        }
                    }
                    this.tryLoad(url, resItem, compFunc, thisObject);
                });
            } else {
                this.tryLoad(url, resItem, compFunc, thisObject);
            }
        }

        BAPt.tryLoad = function (url: string, resItem: RES.ResourceItem, compFunc: Function, thisObject: any) {
            let request: egret.HttpRequest = this.getRequest();
            this.resItemDic[request.hashCode] = { item: resItem, func: compFunc, thisObject: thisObject };
            request.open(url);
            request.send();
        }

        BAPt.onLoadFinish = function (event: egret.Event) {
            let req: egret.HttpRequest = event.target;
            let hashCode = req.hashCode;
            let resItemDic = this.resItemDic;
            let data: any = resItemDic[hashCode];
            delete resItemDic[hashCode];
            let item = data.item as RES.ResourceItem;
            let local = item.local;
            let loaded = event.type == EgretEvent.COMPLETE;
            if (loaded) {
                this.analyzeData(item, req.response);
            }
            item.loaded = loaded;
            let uri = item.uri;
            if (!local && uri) {
                local = this.fileDic[item.name];
                if (local) {
                    item.local = local;
                    item.version = ConfigUtils.getResVer(uri);
                    //存储数据
                    db.save(item);
                }
            }

            this.recycler.push(req);
            return data.func.call(data.thisObject, item);
        }

        //注入
        let IApt = RES.ImageAnalyzer.prototype as any;
        IApt.loadFile = function (resItem: RES.ResourceItem, compFunc: Function, thisObject: any) {
            // 检查内存中是否有本地资源
            if (this.fileDic[resItem.name]) {
                return compFunc.call(thisObject, resItem);
            }
            let url = resItem.url;
            let uri = ConfigUtils.getResUri(url);
            if (uri) {
                resItem.uri = uri;
                db.get(uri, data => {
                    if (data) {//有数据
                        let ver = ConfigUtils.getResVer(data.uri);
                        if (ver == data.version) {
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
                        } else {
                            //清除原始数据
                            resItem.local = undefined;
                        }
                    }
                    this.tryLoad(url, resItem, compFunc, thisObject);
                });
            } else {
                this.tryLoad(url, resItem, compFunc, thisObject);
            }
        }

        IApt.tryLoad = function (url: string, resItem: RES.ResourceItem, compFunc: Function, thisObject: any) {
            let loader = (this as any).getLoader() as egret.ImageLoader;
            this.resItemDic[loader.$hashCode] = { item: resItem, func: compFunc, thisObject: thisObject };
            loader.load(url);//走原流程
        }

        IApt.onLoadFinish = function (event: egret.Event) {
            let request = event.$target as egret.ImageLoader;
            let hashCode = request.$hashCode;
            let resItemDic = this.resItemDic;
            let data = resItemDic[hashCode];
            delete resItemDic[hashCode];
            let item = data.item as RES.ResourceItem;
            let local = item.local;
            let uri = item.uri;
            if (!local && uri) {
                let url = item.url;
                item.version = ConfigUtils.getResVer(item.uri);
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
                if (!local) {
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
        uri?: string;
        /**
         * 版本号
         */
        version?: number;
    }
}