namespace jy {
    export const enum ByteArraySize {
        SIZE_OF_UINT32 = 4,
        SIZE_OF_FIX64 = 8,
        SIZE_OF_INT64 = 8,
        SIZE_OF_DOUBLE = 8,
        SIZE_OF_FLOAT = 4,
        SIZE_OF_FIX32 = 4,
        SIZE_OF_SFIX32 = 4,

        SIZE_OF_UINT16 = 2,
        SIZE_OF_INT16 = 2
    }
    /**
     * 方便后续调整
     * 加入ProtoBuf的varint支持
     * @author 3tion
     *
     */
    export class ByteArray extends egret.ByteArray {

        public $endian: egret.EndianConst;

        public constructor(buffer?: ArrayBuffer, ext?: number) {
            super(buffer, ext);
        }

        /**
         * 替换缓冲区
         * 
         * @param {ArrayBuffer} value 
         */
        public replaceBuffer(value: ArrayBuffer) {
            this.write_position = value.byteLength;
            this._bytes = new Uint8Array(value);
            this.data = new DataView(value);
        }

        /**
         * 
         * 读取指定长度的Buffer
         * @param {number} length       指定的长度
         * @returns {Buffer}
         */
        public readBuffer(length: number): ArrayBuffer {
            if (!this.validate(length)) return;
            let start = this.position;
            this.position += length;
            return this.buffer.slice(start, this.position);
        }

        public readInt64() {
            if (this.validate(ByteArraySize.SIZE_OF_INT64)) {
                let low: number, high: number;
                let flag = this.$endian == egret.EndianConst.LITTLE_ENDIAN;
                let data = this.data;
                let pos = this._position;
                if (flag) {
                    low = data.getUint32(pos, flag);
                    high = data.getUint32(pos + ByteArraySize.SIZE_OF_UINT32, flag);
                } else {
                    high = data.getUint32(pos, flag);
                    low = data.getUint32(pos + ByteArraySize.SIZE_OF_UINT32, flag);
                }
                this.position = pos + ByteArraySize.SIZE_OF_INT64;
                return Int64.toNumber(low, high);
            }
        }

        public writeInt64(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_INT64);
            let i64 = Int64.fromNumber(value);
            let { high, low } = i64;
            let flag = this.$endian == egret.EndianConst.LITTLE_ENDIAN;
            let data = this.data;
            let pos = this._position;
            if (flag) {
                data.setUint32(pos, low, flag);
                data.setUint32(pos + ByteArraySize.SIZE_OF_UINT32, high, flag);
            } else {
                data.setUint32(pos, high, flag);
                data.setUint32(pos + ByteArraySize.SIZE_OF_UINT32, low, flag);
            }
            this.position = pos + ByteArraySize.SIZE_OF_INT64;
        }

        /**
         * 读取ProtoBuf的`Double`
         * protobuf封装是使用littleEndian的，不受Endian影响
         */
        public readPBDouble() {
            if (this.validate(ByteArraySize.SIZE_OF_DOUBLE)) {
                let value = this.data.getFloat64(this._position, true);
                this.position += ByteArraySize.SIZE_OF_DOUBLE;
                return value;
            }
        }

        /**
         * 写入ProtoBuf的`Double`
         * protobuf封装是使用littleEndian的，不受Endian影响
         * @param value 
         */
        public writePBDouble(value: number) {
            this.validateBuffer(ByteArraySize.SIZE_OF_DOUBLE);
            this.data.setFloat64(this._position, value, true);
            this.position += ByteArraySize.SIZE_OF_DOUBLE;
        }

        /**
         * 读取ProtoBuf的`Float`
         * protobuf封装是使用littleEndian的，不受Endian影响
         */
        public readPBFloat() {
            if (this.validate(ByteArraySize.SIZE_OF_FLOAT)) {
                let value = this.data.getFloat32(this._position, true);
                this.position += ByteArraySize.SIZE_OF_FLOAT;
                return value;
            }
        }

        /**
          * 写入ProtoBuf的`Float`
          * protobuf封装是使用littleEndian的，不受Endian影响
          * @param value 
          */
        public writePBFloat(value: number) {
            this.validateBuffer(ByteArraySize.SIZE_OF_FLOAT);
            this.data.setFloat32(this._position, value, true);
            this.position += ByteArraySize.SIZE_OF_FLOAT;
        }

        public readFix32() {
            if (this.validate(ByteArraySize.SIZE_OF_FIX32)) {
                let value = this.data.getUint32(this._position, true);
                this.position += ByteArraySize.SIZE_OF_UINT32;
                return value;
            }
        }

        public writeFix32(value: number) {
            this.validateBuffer(ByteArraySize.SIZE_OF_FIX32);
            this.data.setUint32(this._position, value, true);
            this.position += ByteArraySize.SIZE_OF_FIX32;
        }

        public readSFix32() {
            if (this.validate(ByteArraySize.SIZE_OF_SFIX32)) {
                let value = this.data.getInt32(this._position, true);
                this.position += ByteArraySize.SIZE_OF_SFIX32;
                return value;
            }
        }

        public writeSFix32(value: number) {
            this.validateBuffer(ByteArraySize.SIZE_OF_SFIX32);
            this.data.setInt32(this._position, value, true);
            this.position += ByteArraySize.SIZE_OF_SFIX32;
        }

        public readFix64() {
            if (this.validate(ByteArraySize.SIZE_OF_FIX64)) {
                let pos = this._position;
                let data = this.data;
                let low = data.getUint32(pos, true);
                let high = data.getUint32(pos + ByteArraySize.SIZE_OF_UINT32, true);
                this.position = pos + ByteArraySize.SIZE_OF_FIX64;
                return Int64.toNumber(low, high);
            }
        }

        public writeFix64(value: number) {
            let i64 = Int64.fromNumber(value);
            this.validateBuffer(ByteArraySize.SIZE_OF_FIX64);
            let pos = this._position;
            let data = this.data;
            data.setUint32(pos, i64.low, true);
            data.setUint32(pos + ByteArraySize.SIZE_OF_UINT32, i64.high, true);
            this.position = pos + ByteArraySize.SIZE_OF_FIX64;
        }

        /**
         * 
         * 读取指定长度的ByteArray
         * @param {number} length       指定的长度
         * @param {number} [ext=0]      ByteArray扩展长度参数
         * @returns {ByteArray}
         */
        public readByteArray(length: number, ext = 0): ByteArray {
            let ba = new jy.ByteArray(this.readBuffer(length), ext);
            ba.$endian = this.$endian;
            return ba;
        }
        /**
         * 向字节流中写入64位的可变长度的整数(Protobuf)
         */
        public writeVarint64(value: number): void {
            let i64 = Int64.fromNumber(value);
            var high = i64.high;
            var low = i64.low;
            if (high == 0) {
                this.writeVarint(low >>> 0);
            }
            else {
                for (var i: number = 0; i < 4; ++i) {
                    this.writeByte((low & 0x7F) | 0x80);
                    low >>>= 7;
                }
                if ((high & (0xFFFFFFF << 3)) == 0) {
                    this.writeByte((high << 4) | low);
                }
                else {
                    this.writeByte((((high << 4) | low) & 0x7F) | 0x80);
                    this.writeVarint(high >>> 3);
                }
            }
        }

        /**
         * 向字节流中写入32位的可变长度的整数(Protobuf)
         */
        public writeVarint(value: number): void {
            for (; ;) {
                if (value < 0x80) {
                    this.writeByte(value);
                    return;
                }
                else {
                    this.writeByte((value & 0x7F) | 0x80);
                    value >>>= 7;
                }
            }
        }

        /**
         * 读取字节流中的32位变长整数(Protobuf)
         */
        public readVarint(): number {
            var result = 0
            for (var i = 0; ; i += 7) {
                if (i < 32) {
                    let b = this.readUnsignedByte();
                    if (b >= 0x80) {
                        result |= ((b & 0x7f) << i);
                    }
                    else {
                        result |= (b << i);
                        break
                    }
                } else {
                    while (this.readUnsignedByte() >= 0x80) { }
                    break
                }
            }
            return result;
        }

        /**
          * 读取字节流中的32位变长整数(Protobuf)
          */
        public readVarint64(): number {
            let b: number, low: number, high: number, i = 0;
            for (; ; i += 7) {
                b = this.readUnsignedByte();
                if (i == 28) {
                    break;
                }
                else {
                    if (b >= 0x80) {
                        low |= ((b & 0x7f) << i);
                    }
                    else {
                        low |= (b << i);
                        return Int64.toNumber(low, high);
                    }
                }
            }
            if (b >= 0x80) {
                b &= 0x7f;
                low |= (b << i);
                high = b >>> 4;
            }
            else {
                low |= (b << i);
                high = b >>> 4;
                return Int64.toNumber(low, high);
            }
            for (i = 3; ; i += 7) {
                b = this.readUnsignedByte();
                if (i < 32) {
                    if (b >= 0x80) {
                        high |= ((b & 0x7f) << i);
                    }
                    else {
                        high |= (b << i);
                        break
                    }
                }
            }
            return Int64.toNumber(low, high);
        }

        /**
         * 获取写入的字节
         * 此方法不会新建 ArrayBuffer
         * @readonly
         * @memberof ByteArray
         */
        public get outBytes() {
            return new Uint8Array(this._bytes.buffer, 0, this.write_position);
        }

        /**
         * 重置索引
         * 
         * @memberof ByteArray
         */
        public reset() {
            this.write_position = this.position = 0;
        }
    }
}
