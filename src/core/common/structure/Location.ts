module junyou {
    /**
     * 经纬度 定位信息
     * 
     * @export
     * @interface Location
     */
    export interface Location {
        /**维度*/
        latitude: number;
        /**精度*/
        longitude: number;
    }

    export interface LocationConstructor {
        /**
         * 根据两个经纬度获取距离(单位：米)
         * 
         * @param {Location} l1
         * @param {Location} l2 
         * @returns 距离(单位：米)
         */
        getDist(l1: Location, l2: Location): number
    }

    export var Location: LocationConstructor = {
        /**
         * 根据两个经纬度获取距离(单位：米)
         * 
         * @param {Location} l1
         * @param {Location} l2 
         * @returns 距离(单位：米)
         */
        getDist(l1: Location, l2: Location) {
            const dtr = Math.DEG_TO_RAD;
            let radlat1 = l1.latitude * dtr;
            let radlat2 = l2.latitude * dtr;
            let a = radlat1 - radlat2;
            let b = (l1.longitude - l2.longitude) * dtr;
            return Math.asin(Math.sqrt(Math.sin(a * .5) ** 2 + Math.cos(radlat1) * Math.cos(radlat2) * (Math.sin(b * .5) ** 2))) * 12756274;
        }
    }
}