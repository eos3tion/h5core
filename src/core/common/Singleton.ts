module junyou {
    /**
     * 单例工具
     * @param clazz 要做单例的类型
     */
    export function singleton<T>(clazz: { new (): T; _instance?: T }): T {
        let instance = clazz._instance;
        if (!instance) {
            instance = new clazz;
            Object.defineProperty(clazz, "_instance", {
                value: instance
            })
        }
        return instance;
    }
}