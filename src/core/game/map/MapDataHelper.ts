namespace jy {
    /**
     * 单data，最多支持256种数据
     */
    export function getMapDataHelper(columns: number, rows: number, bitDataCount: MapDataBitCount, rawData?: Uint8Array) {
        let total = Math.ceil(rows * columns * bitDataCount / 8);
        const mapData = rawData && rawData.length == total ? new Uint8Array(rawData) : new Uint8Array(Math.ceil(rows * columns * bitDataCount / 8));
        let dataMask = (1 << bitDataCount) - 1;
        return {
            get(x: number, y: number) {
                const [byteCount, bitCount] = getPos(x, y);
                return mapData[byteCount] >> bitCount & dataMask;
            },
            set(x: number, y: number, value: number) {
                const [byteCount, bitCount] = getPos(x, y);
                mapData[byteCount] = setByte(mapData[byteCount], value, bitCount);
            },
            data: mapData as Readonly<Uint8Array>
        }
        function getPos(x: number, y: number) {
            let position = (y * columns + x) * bitDataCount;
            let byteCount = position >> 3;
            let bitCount = position - (byteCount << 3);
            return [byteCount, bitCount];
        }

        function setByte(byte: number, value: number, bitStartIdx: number) {
            let left = getLeftValue(byte, bitStartIdx);
            value = value << bitStartIdx;
            let bitEndIdx = bitStartIdx + bitDataCount;
            let right = getRightValue(byte, bitEndIdx);
            return left | value | right;
        }

        function getLeftValue(value: number, bitIdx: number) {
            return value & ((1 << bitIdx) - 1)
        }

        function getRightValue(value: number, bitIdx: number) {
            return value >> bitIdx << bitIdx;
        }
    }

    /**
     * 用于辅助处理格子的数据
     */
    export type MapDataHelper = ReturnType<typeof getMapDataHelper>;
}