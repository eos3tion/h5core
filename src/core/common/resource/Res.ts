namespace jy.Res {

    const enum Const {
        /**
         * 默认的失败超时时间
         */
        FailedExpiredTime = 10000,

        /**
         * 默认的单个资源，不做延迟重试的最大重试次数
         */
        MaxRetry = 3,
        /**
         * 默认的最大加载线程数
         */
        MaxThread = 6,
    }

    /**
     *  失败的超时时间
     */
    let failedExpiredTime = Const.FailedExpiredTime;
    /**
     * 设置失败的过期时间  
     * 失败次数超过`maxRetry`
     * @export
     * @param {number} second
     */
    export function setFailedExpired(second: number) {
        let time = ~~second * Time.ONE_SECOND;
        if (time <= 0) {//如果为小于0的时间，则将时间设置为1分钟过期
            time = Const.FailedExpiredTime;
        }
        failedExpiredTime = time;
    }


    /**
     * 最大重试次数
     */
    let maxRetry = Const.MaxRetry;
    /**
     * 设置单个资源，不做延迟重试的最大重试次数，默认为3
     * @param val 
     */
    export function setMaxRetry(val: number) {
        maxRetry = val;
    }

    /**
     * 最大加载数量
     * 目前所有主流浏览器针对 http 1.1 单域名最大加载数均为6个  
     * http2 基本无限制
     */
    let maxThread = Const.MaxThread;
    /**
     * 设置最大加载线程  默认为 6
     * @param val 
     */
    export function setMaxThread(val: number) {
        maxThread = val;
    }

    /**
     * 资源类型
     */
    export const enum ResItemType {
        Binary = 0,
        Text,
        Image,
        Json,
    }


    /**
     * 资源加载的回调
     */
    export declare type ResCallback = CallbackInfo<{ (resItem: ResItem, ...args) }>;

    export interface ResBase {

        /**
         * 资源标识
         */
        uri: string;
        /**
         * 资源路径
         */
        url: string;
        /**
         * 数据
         */
        data?: any;
        version?: number;
    }

    export interface ResItem extends ResBase {
        /**
         * 资源类型
         */
        type?: ResItemType;
        /**
         * 是否已存储本地缓存
         */
        local?: boolean;

        /**
         * 不使用本地缓存
         */
        noLocal?: boolean;
        /**
         * 资源正在加载时所在的组  
         * 加载完成后清理此值
         */
        qid?: ResQueueID;

        /**
         * 失败重试次数
         */
        retry?: number;
        /**
         * 资源加载状态  
         * 默认为 UnRequest
         */
        state?: RequestState;

        /**
         * 上次失败的过期时间  
         * 网络有时候不稳定，这次连续加载不到，但是后面可能能加载到
         *
         * @type {number}
         * @memberof ResItem
         */
        ft?: number;

        /**
         * 是否被移除
         */
        removed?: boolean;

        /**
         * 分组标识  
         * 用于对资源进行区分
         */
        group?: Key;

        /**
         * 资源回调列队
         */
        callbacks?: ResCallback[];
    }

    /**
     * 扩展名和类型的绑定字典
     */
    const extTypeDict: { [ext: string]: ResItemType } = {
        [Ext.JPG]: ResItemType.Image,
        [Ext.PNG]: ResItemType.Image,
        [Ext.WEBP]: ResItemType.Image,
        [Ext.JSON]: ResItemType.Json,
        [Ext.BIN]: ResItemType.Binary,
    }



    export const enum QueueLoadType {
        /**
         * 先入后出
         */
        FILO,
        /**
         * 先入先出
         */
        FIFO,

    }

    /**
     * 资源分组
     */
    export interface ResQueue {
        /**
         * 分组名称
         */
        id: Key;

        /**
         * 分组优先级
         */
        priority?: number;

        /**
         * 分组中的列表
         */
        list: ResItem[];

        /**
         * 加载类型
         */
        type: QueueLoadType;
    }

    /**
     * 内置的资源分组
     */
    export const enum ResQueueID {
        /**
         * 常规资源，使用 FIFO
         * 适合当前地图块，普通怪物资源，特效资源等
         */
        Normal,
        /**
         * 后台加载资源，使用 FILO
         * 用于后台加载，最低优先级
         */
        Backgroud,
        /**
         * 高优先级资源
         * FIFO
         */
        Highway,
    }



    /**
     * 资源加载完成的回调
     */
    export declare type ResLoadCallback = CallbackInfo<{ (item: ResItem, ...args: any[]) }>;

    export interface ResLoader {
        /**
         * 加载完成的回调
         */
        loadFile(resItem: ResItem, callback: ResLoadCallback);
    }

    /** 
     * 内部实现的ResLoader
     */
    interface InternalResLoader extends ResLoader {

        /**
         * 加载完成的回调
         */
        onLoadFinish(e: egret.Event);
    }

    export interface ResRequest extends egret.EventDispatcher {
        item?: ResItem;
        resCB?: ResLoadCallback
    }
    export declare type ResHttpRequest = Recyclable<egret.HttpRequest & ResRequest>;

    function checkItemState(item: ResItem, event: egret.Event) {
        let state = item.state;
        if (!item.removed) {
            state = event.type == EgretEvent.COMPLETE ? RequestState.COMPLETE : RequestState.FAILED;
        }
        item.state = state;
        return state;
    }

    function bindRequest(loader: InternalResLoader, request: Recyclable<ResRequest>, item: ResItem, callback: ResLoadCallback) {
        request.on(EgretEvent.COMPLETE, loader.onLoadFinish, loader);
        request.on(EgretEvent.IO_ERROR, loader.onLoadFinish, loader);
        request.item = item;
        request.resCB = callback;
    }

    function looseRequest(loader: InternalResLoader, request: Recyclable<ResRequest>) {
        request.off(EgretEvent.COMPLETE, loader.onLoadFinish, loader);
        request.off(EgretEvent.IO_ERROR, loader.onLoadFinish, loader);
        request.item = undefined;
        request.resCB = undefined;
        request.recycle();
    }

    export class BinLoader implements ResLoader {
        type: XMLHttpRequestResponseType;
        constructor(type: XMLHttpRequestResponseType = "arraybuffer") {
            this.type = type;
        }
        loadFile(resItem: ResItem, callback: ResLoadCallback) {
            let request = recyclable(egret.HttpRequest) as ResHttpRequest;
            bindRequest(this, request, resItem, callback);
            request.responseType = this.type;
            request.open(resItem.url);
            request.send();
        }

        onLoadFinish(event: egret.Event): void {
            let request = event.target as ResHttpRequest;
            let { item, resCB, response } = request;
            looseRequest(this, request);
            let state = checkItemState(item, event);
            if (state == RequestState.COMPLETE) {
                item.data = response;
            }
            resCB.callAndRecycle(item);
        }
    }

    export declare type ResImgRequest = Recyclable<egret.ImageLoader & ResRequest>;

    export class ImageLoader implements ResLoader {
        loadFile(resItem: ResItem, callback: ResLoadCallback) {
            let request = recyclable(egret.ImageLoader) as ResImgRequest;
            bindRequest(this, request, resItem, callback);
            request.load(resItem.url);
        }

        onLoadFinish(event: egret.Event): void {
            let request = event.target as ResImgRequest;
            let { item, resCB, data } = request;
            looseRequest(this, request);
            let state = checkItemState(item, event);
            if (state == RequestState.COMPLETE) {
                let texture = new egret.Texture();
                texture._setBitmapData(data);
                item.data = texture;
            }
            resCB.callAndRecycle(item);
        }
    }


    const binLoader = new BinLoader();

    /**
     * 资源字典  
     * Key {Key} 资源标识  
     * Value {ResItem} 资源
     * 
     */
    const resDict: { [resID: string]: ResItem } = {};

    /**
     * 加载器字典  
     * Key {number}             加载器类型
     * Value {ResAnalyzer}      加载器
     */
    const loaderMap: { [type: number]: ResLoader } = {
        [ResItemType.Binary]: binLoader,
        [ResItemType.Text]: new BinLoader("text"),
        [ResItemType.Json]: new BinLoader("json"),
        [ResItemType.Image]: new ImageLoader,
    };



    /**
     * 加载列队的总数
     */
    const queues: { [groupID: string]: ResQueue } = {};

    /**
     * 失败的资源加载列队
     */
    const failedList: ResItem[] = [];


    /**
    * 获取资源的扩展名
    * @param url 
    */
    export function getExt(url: string) {
        let hash = url.lastIndexOf("?");
        hash == -1 && (hash = undefined);
        let ext = url.substring(url.lastIndexOf("."), hash);
        return ext.toLocaleLowerCase();
    }

    /**
     * 内联绑定
     * @param ext 扩展名
     * @param type 类型
     */
    export function bindExtType(ext: string, type: ResItemType) {
        extTypeDict[ext] = type;
    }

    /**
     * 注册资源分析器
     * @param type 分析器类型
     * @param analyzer 分析器
     */
    export function regAnalyzer(type: ResItemType, analyzer: ResLoader) {
        loaderMap[type] = analyzer;
    }

    /**
     * 根据 url 获取资源的处理类型
     * @param url 
     */
    function getType(url: string) {
        let ext = getExt(url);
        return ~~extTypeDict[ext];//默认使用binary类型
    }

    /**
     * 获取或创建一个加载列队
     * @param queueID 
     * @param list 
     * @param priority 
     */
    function getOrCreateQueue(queueID: Key, type = QueueLoadType.FIFO, priority?: number, list?: ResItem[]) {
        let old = queues[queueID];
        if (old) {//已经存在
            if (list) {
                list.appendTo(old.list);
            }
            return old;
        }
        list = list || [];
        priority = ~~priority;
        let queue = { id: queueID, list, priority, type };
        queues[queueID] = queue;
        return queue;
    }

    //创建内置分组
    getOrCreateQueue(ResQueueID.Highway, QueueLoadType.FIFO, 9999);
    getOrCreateQueue(ResQueueID.Normal);
    getOrCreateQueue(ResQueueID.Backgroud, QueueLoadType.FILO, -9999);

    /**
     * addRes方法的返回值
     */
    const addResResult = [] as [ResItem, boolean];

    /**
     * 添加资源的结果  
     * 0 号为返回值
     *
     * @export
     * @interface AddResResult
     * @extends {Array<any>}
     */
    export interface AddResResult extends Array<any> {
        readonly 0: ResItem;
        readonly 1: boolean;
        length: 2;
    }

    /**
     * 添加资源
     * @param {ResItem} resItem 
     * @param {ResQueueID} [queueID=ResQueueID.Normal]
     * @returns {ResItem}
     */
    export function addRes(resItem: ResItem, queueID = ResQueueID.Normal): AddResResult {
        let uri = resItem.uri;
        let old = resDict[uri];
        addResResult[1] = false;
        if (old) {
            if (old != resItem && old.url != resItem.url) {
                DEBUG && ThrowError(`资源[${uri}]重名，加载路径分布为[${old.url}]和[${resItem.url}]`);
            } else {//资源和加载路径完全相同
                let state = old.state;
                if (state >= RequestState.REQUESTING) { //正在处理的资源和已经加载完毕的资源，无需添加到任何列队
                    addResResult[0] = old;
                    return addResResult;
                }
            }
            resItem = old;
        } else {
            resDict[uri] = resItem;
        }
        addResResult[0] = resItem;
        let oQID = resItem.qid;
        if (oQID != queueID) {
            let oQueue = queues[oQID];
            if (oQueue) {//从旧列表中移除
                oQueue.list.remove(resItem);
            }
            //更新列表
            resItem.qid = queueID;
            let queue = getOrCreateQueue(queueID);
            queue.list.pushOnce(resItem);
            addResResult[1] = true;
        }
        return addResResult;
    }

    /**
     * 加载资源
     * @param {string} uri 资源标识
     * @param {ResCallback} callback 加载完成的回调
     * @param {string} [url] 资源路径
     * @param {ResQueueID} [queueID=ResQueueID.Normal]
     */
    export function load(uri: string, url?: string, callback?: ResCallback, queueID = ResQueueID.Normal) {
        //检查是否已经有资源
        let item = resDict[uri];
        if (!item) {
            if (!url) {
                url = ConfigUtils.getResUrl(uri);
            }
            item = { uri, url, type: getType(url) }
        }
        loadRes(item, callback, queueID);
    }

    export interface LoadResListOption {

        callback: CallbackInfo<{ (flag: boolean, ...args) }>;
        group: Key;
        onProgress?: CallbackInfo<{ (item: Res.ResItem) }>;
    }

    interface LoadResListParam extends LoadResListOption {
        /**
         * 加载进度
         */
        current: number;
        /**
         * 总量
         */
        total: number;
    }
    export function loadList(list: ResItem[], opt: LoadResListOption, queueID = ResQueueID.Normal) {
        let total = list.length;
        let group = opt.group;
        (opt as LoadResListParam).current = 0;
        (opt as LoadResListParam).total = total;
        for (let i = 0; i < total; i++) {
            let item = list[i];
            item.group = group;
            loadRes(item, CallbackInfo.get(doLoadList, null, opt), queueID);
        }
    }

    function doLoadList(item: ResItem, param: LoadResListParam) {
        let { group, callback, onProgress } = param;
        if (item.group == group) {
            if (item.state == RequestState.FAILED) {
                callback.callAndRecycle(false);
            } else {
                param.current++;
                onProgress && onProgress.call(item);
                if (param.current >= param.total) {
                    callback.callAndRecycle(true);
                    onProgress && onProgress.recycle();
                }
            }
        }
    }

    /**
     * 同步获取某个资源，如果资源未加载完成，则返回空
     * @param uri 资源标识
     */
    export function get(uri: string) {
        let item = resDict[uri];
        if (item && item.state == RequestState.COMPLETE) {
            return item.data;
        }
    }

    export function set(uri: string, item: ResItem) {
        if (!resDict[uri]) {
            resDict[uri] = item;
            return true;
        }
    }

    /**
     * 移除某个资源
     * @param uri 
     */
    export function remove(uri: string) {
        let item = resDict[uri];
        if (item) {
            delete resDict[uri];
            let qid = item.qid;
            let queue = queues[qid];
            if (queue) {
                queue.list.remove(item);
            }
            item.removed = true;
        }
    }

    /**
     * 阻止尝试某个资源加载，目前是还未加载的资源，从列队中做移除，其他状态不处理
     * @param uri 
     */
    export function cancel(uri: string) {
        let item = resDict[uri];
        if (item) {
            if (item.state == RequestState.UNREQUEST) {
                let qid = item.qid;
                let queue = queues[qid];
                if (queue) {
                    queue.list.remove(item);
                }
                doCallback(item);
            }
        }
    }

    /**
     * 加载资源
     * @param {ResItem} resItem 
     * @param {ResQueueID} [queueID=ResQueueID.Normal]
     */
    export function loadRes(resItem: ResItem, callback?: ResCallback, queueID = ResQueueID.Normal) {
        [resItem] = addRes(resItem, queueID);
        let state = resItem.state;
        if (state == RequestState.COMPLETE || (state == RequestState.FAILED && resItem.retry > maxRetry && Global.now < ~~resItem.ft)) {//已经加载完成的资源，直接在下一帧回调
            return callback && Global.nextTick(callback.callAndRecycle, callback, resItem);// callback.callAndRecycle(resItem);
        }
        resItem.removed = false;
        if (callback) {
            let list = resItem.callbacks;
            if (!list) {
                resItem.callbacks = list = [];
            }
            list.push(callback);
        }
        return next();
    }

    /**
     * 获取下一个要加载的资源
     */
    function getNext() {
        let next: ResItem;
        //得到优先级最大并且
        let high = -Infinity;
        let highQueue: ResQueue;
        for (let key in queues) {//同优先级的列队，基于hash规则加载，一般来说只用内置的3个列队即可解决常规问题
            let queue = queues[key];
            if (queue.list.length) {
                let priority = queue.priority;
                if (priority > high) {
                    high = priority;
                    highQueue = queue;
                }
            }
        }
        if (highQueue) {
            //检查列队类型
            let list = highQueue.list;
            switch (highQueue.type) {
                case QueueLoadType.FIFO:
                    next = list.shift();
                    break;
                case QueueLoadType.FILO:
                    next = list.pop();
                    break;
            }
        }

        if (!next) {
            if (failedList.length > 0) {//失败列队最后加载
                next = failedList.shift();
            }
        }

        return next;
    }

    /**
     * 正在加载的资源列队
     */
    const loading: ResItem[] = [];

    function next() {
        while (loading.length < maxThread) {
            let item = getNext();
            if (!item) break;
            loading.pushOnce(item);
            let state = ~~item.state;
            if (state == RequestState.FAILED && item.ft < Global.now) {//如果失败时间已经超过了失败过期时间，则重新加载
                state = RequestState.UNREQUEST;
            }
            switch (state) {
                case RequestState.FAILED:
                case RequestState.COMPLETE:
                    onItemComplete(item);
                    break;
                case RequestState.UNREQUEST://其他情况不处理
                    let type = item.type;
                    if (type == undefined) {
                        type = getType(item.url);
                    }
                    let loader = loaderMap[type];
                    if (!loader) {
                        loader = binLoader;
                    }
                    //标记为加载中
                    item.state = RequestState.REQUESTING;
                    loader.loadFile(item, CallbackInfo.get(onItemComplete));
                    break;
            }
        }
    }

    /**
     * 资源加载结束，执行item的回调
     * @param item 
     */
    function doCallback(item: ResItem) {
        let callbacks = item.callbacks;
        if (callbacks) {//执行回调列队
            item.callbacks = undefined;
            for (let i = 0; i < callbacks.length; i++) {
                let cb = callbacks[i];
                cb.callAndRecycle(item);
            }
        }
    }

    function onItemComplete(item: ResItem) {
        loading.remove(item);
        item.qid = undefined;
        let state = ~~item.state;
        if (state == RequestState.FAILED) {
            let retry = item.retry || 1;
            if (retry > maxRetry) {
                let now = Global.now;
                let ft = ~~item.ft;
                if (now > ft) {
                    item.ft = failedExpiredTime * (retry - maxRetry) + now;
                }
                doCallback(item);
                return dispatch(EventConst.ResLoadFailed, item);
            }
            item.retry = retry + 1;
            item.state = RequestState.UNREQUEST;
            failedList.push(item);
        } else if (state == RequestState.COMPLETE) {
            //加载成功，清零retry
            item.retry = 0;
            //检查资源是否被加入到列队中
            doCallback(item);
            dispatch(EventConst.ResLoadSuccess, item);
        }
        return next();
    }

    export function getLocalDB(version: number, keyPath: string, storeName: string) {
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
        try {
            indexedDB.open(storeName, version);
        } catch (e) {
            DEBUG && ThrowError(`无法开启 indexedDB,error:`, e);
            return;
        }
        const RW = "readwrite";
        const R = "readonly";
        return {
            /**
             * 存储资源
             * 
             * @param {ResItem} data 
             * @param {(this: IDBRequest, ev: Event) => any} callback 存储资源执行完成后的回调
             */
            save(data: ResItem, callback?: { (ev: Event | Error) }) {
                open(result => {
                    try {
                        let store = getObjectStore(result, RW);
                        let request = data.uri ? store.put(data) : store.add(data);
                        if (callback) {
                            request.onsuccess = callback;
                            request.onerror = callback;
                        }
                    } catch (e) {
                        return callback && callback(e);
                    }
                }, e => { callback && callback(e) });
            },

            /**
             * 获取资源
             * 
             * @param {string} url 
             * @param {{ (data: ResItem) }} callback 
             */
            get(url: string, callback: { (data: ResItem, url?: string) }) {
                open(result => {
                    try {
                        let store = getObjectStore(result, R);
                        let request = store.get(url);
                        request.onsuccess = function (e: Event) {
                            callback((e.target as IDBRequest).result, url);
                        };
                        request.onerror = () => {
                            callback(null, url);
                        }
                    } catch (e) {
                        DEBUG && ThrowError(`indexedDB error`, e);
                        callback(null, url);
                    }
                }, e => { callback(null, url) });
            },
            /**
             * 删除指定资源
             * 
             * @param {string} url 
             * @param {{ (this: IDBRequest, ev: Event) }} callback 删除指定资源执行完成后的回调
             */
            delete(url: string, callback?: { (url: string, ev: Event | Error) }) {
                open(result => {
                    try {
                        let store = getObjectStore(result, RW);
                        let request = store.delete(url);
                        if (callback) {
                            request.onerror = request.onsuccess = e => { callback(url, e) };
                        }
                    } catch (e) {
                        return callback && callback(url, e);
                    }
                }, e => { callback && callback(url, e) });
            },
            /**
             * 删除全部资源
             * 
             * @param {{ (this: IDBRequest, ev: Event) }} callback 删除全部资源执行完成后的回调
             */
            clear(callback?: { (ev: Event | Error) }) {
                open(result => {
                    try {
                        let store = getObjectStore(result, RW);
                        let request = store.clear();
                        if (callback) {
                            request.onsuccess = callback;
                            request.onerror = callback;
                        }
                    } catch (e) {
                        return callback(e);
                    }
                }, callback);
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
            return result.transaction([storeName], mode).objectStore(storeName);
        }

        function errorHandler(ev: ErrorEvent) {
            ThrowError(`indexedDB error`, ev.error);
        }
    }

    declare type LocalResImgRequest = ResImgRequest & { blob?: Blob };
    /**
     *  尝试启用本地资源缓存
     * @author 3tion(https://github.com/eos3tion/)
     * @export
     * @param {number} [version=1] 
     * @returns 
     */
    export function tryLocal(version = 1, keyPath = "uri", storeName = "res") {
        if (egret.Capabilities.runtimeType != egret.RuntimeType.WEB) {//不处理native的情况
            return;
        }
        const db = getLocalDB(version, keyPath, storeName);
        //尝试
        if (!db) {//无法开启 indexedDB，不做后续注入操作
            return;
        }

        let w = window as any;
        w.URL = window.URL || w.webkitURL;
        //当前ios10还不支持IndexedDB的Blob存储，所以如果是ios，则此值为false
        const canUseBlob = egret.Capabilities.os == "iOS" ? false : !!(window.Blob && window.URL);

        function saveLocal(item: ResItem, data: any) {
            item.local = true;
            let uri = item.uri;
            let local = { data, version: ConfigUtils.getResVer(uri), uri, url: item.url };
            //存储数据
            db.save(local);
        }

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        let BApt = BinLoader.prototype;
        let BAptLoadFile = BApt.loadFile;
        BApt.loadFile = function (this: BinLoader, resItem: ResItem, callback: ResLoadCallback): void {
            if (resItem.noLocal) {
                BAptLoadFile.call(this, resItem, callback);
            } else {
                return db.get(resItem.uri, (data: ResBase) => {
                    if (data) {//有数据
                        let local = data.data;
                        if (local) {
                            let ver = ConfigUtils.getResVer(data.uri);
                            if (ver == data.version) {
                                resItem.data = local;
                                resItem.state = RequestState.COMPLETE;
                                resItem.local = true;
                                return callback.call(resItem);
                            }
                        }
                    }
                    BAptLoadFile.call(this, resItem, callback);
                });
            }
        }

        BApt.onLoadFinish = function (event: egret.Event) {
            let request = event.target as ResHttpRequest;
            let { item, resCB, response } = request;
            looseRequest(this, request);
            let state = checkItemState(item, event);
            let data;
            if (state == RequestState.COMPLETE) {
                data = response;
            }
            let uri = item.uri;
            if (data && !item.local && uri) {
                //存储数据
                saveLocal(item, data);
            }
            item.data = data;
            resCB.callAndRecycle(item);
        }


        let eWeb = (egret as any).web;
        if (eWeb) {
            let WILpt = eWeb.WebImageLoader.prototype;
            let obl = WILpt.onBlobLoaded;
            WILpt.onBlobLoaded = function (e: egret.Event) {
                this.blob = this.request.response;
                obl.call(this, e);
            }
        }

        //注入
        let IApt = ImageLoader.prototype
        let IAptLoadFile = IApt.loadFile;
        IApt.loadFile = function (resItem: ResItem, callback: ResLoadCallback) {
            let { uri, url, noLocal } = resItem;
            if (noLocal) {
                IAptLoadFile.call(this, resItem, callback);
            } else {
                db.get(uri, (data: ResBase) => {
                    if (data) {//有数据
                        let ver = ConfigUtils.getResVer(uri);
                        if (ver == data.version) {
                            let rawData = data.data;
                            if (rawData instanceof Blob) {
                                url = URL.createObjectURL(rawData);
                            } else if (typeof rawData === "string") {//DataURL的情况
                                url = rawData;
                            } else {
                                if (DEBUG) {//其他情况不处理
                                    ThrowError("出现ImageAnalyzer本地缓存不支持的情况");
                                }
                            }
                            resItem.local = true;
                        }
                    }
                    resItem.url = url;
                    IAptLoadFile.call(this, resItem, callback);
                });
            }
        }

        IApt.onLoadFinish = function (event: egret.Event) {
            let request = event.target as LocalResImgRequest;
            let { item, resCB, blob, data: dat } = request;
            request.blob = undefined;
            looseRequest(this, request);
            let uri = item.uri;
            if (!item.local) {
                item.local = true;
                let url = item.url;
                let local: any = blob;
                if (!local) {
                    // 普通图片
                    // 尝试转换成DataURL，此方法为同步方法，可能会影响性能
                    if (dat instanceof egret.BitmapData) {
                        let img = dat.source as HTMLImageElement;
                        if (!img) {
                            return;
                        }
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
                                    saveLocal(item, blob);
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
                        a.onload = function (this: FileReader, e) {
                            saveLocal(item, this.result);
                        };
                        a.readAsDataURL(local);
                    } else {
                        saveLocal(item, local);
                    }
                }
            }
            let state = checkItemState(item, event);
            if (state == RequestState.COMPLETE) {
                let texture = new egret.Texture();
                texture._setBitmapData(dat);
                item.data = texture;
            }
            resCB.callAndRecycle(item);
        }
        return db;
    }

}