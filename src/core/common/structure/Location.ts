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
            let radlat1 = l1.latitude * Math.DEG_TO_RAD;
            let radlat2 = l2.latitude * Math.DEG_TO_RAD;
            let a = radlat1 - radlat2;
            let b = (l1.longitude - l2.longitude) * Math.DEG_TO_RAD;
            let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.pow(Math.sin(b / 2), 2)));
            s = s * 6378137;
            s = s / 1000;
            return s;
        }
    }
}