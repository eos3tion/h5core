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

    export var Location = {
        /**
         * 根据两个经纬度获取距离
         * 
         * @param {Location} l1 
         * @param {Location} l2 
         * @returns 
         */
        getDist(l1: Location, l2: Location) {
            const dtr = Math.DEG_TO_RAD;
            let radlat1 = l1.latitude * dtr;
            let radlat2 = l2.latitude * dtr;
            let a = radlat1 - radlat2;
            let b = (l1.longitude - l2.longitude) * dtr;
            return Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.pow(Math.sin(b / 2), 2))) * 12756.274;// 12756.274= 2 * 6378137 / 1000;
        }
    }
}