namespace jy {

	function toNumber(low?: number, high?: number) {
		return (high | 0) * _2_32 + (low >>> 0);
	}

	/**
	 * 项目中不使用long类型，此值暂时只用于存储Protobuff中的int64 sint64
	 * @author 
	 *
	 */
	export class Int64 {
		/**
		 * 高位
		 */
		public high: number;
		/**
		 * 低位
		 */
		public low: number;

		public constructor(low?: number, high?: number) {
			this.set(low, high);
		}

		set(low?: number, high?: number) {
			this.low = low | 0;
			this.high = high | 0;
			return this;
		}

		public toNumber() {
			return toNumber(this.low, this.high);
		}

		public static toNumber = toNumber;

		public static fromNumber(value: number): Int64 {
			if (isNaN(value) || !isFinite(value)) {
				return ZERO;
			}

			if (value <= -_2_63) {
				return MIN_VALUE;
			}
			if (value + 1 >= _2_63) {
				return MAX_VALUE;
			}

			if (value < 0) {
				let v = Int64.fromNumber(-value);
				if (v.high === MIN_VALUE.high && v.low === MIN_VALUE.low) {
					return MIN_VALUE;
				}
				v.low = ~v.low;
				v.high = ~v.high;
				return v.add(ONE);
			} else {
				return new Int64((value % _2_32) | 0, (value / _2_32) | 0);
			}
		}

		public add(addend: Int64) {
			let a48 = this.high >>> 16;
			let a32 = this.high & 0xFFFF;
			let a16 = this.low >>> 16;
			let a00 = this.low & 0xFFFF;

			let b48 = addend.high >>> 16;
			let b32 = addend.high & 0xFFFF;
			let b16 = addend.low >>> 16;
			let b00 = addend.low & 0xFFFF;

			let c48 = 0, c32 = 0, c16 = 0, c00 = 0;
			c00 += a00 + b00;
			c16 += c00 >>> 16;
			c00 &= 0xFFFF;
			c16 += a16 + b16;
			c32 += c16 >>> 16;
			c16 &= 0xFFFF;
			c32 += a32 + b32;
			c48 += c32 >>> 16;
			c32 &= 0xFFFF;
			c48 += a48 + b48;
			c48 &= 0xFFFF;
			return new Int64((c16 << 16) | c00, (c48 << 16) | c32);
		}

		zigzag() {
			const { low, high } = this;
			const mask = high >> 31;
			this.high = ((high << 1 | low >>> 31) ^ mask) >>> 0;
			this.low = (low << 1 ^ mask) >>> 0;
			return this;
		}

		zigzagDecode() {
			const { low, high } = this;
			const mask = -(low & 1);
			this.low = ((low >>> 1 | high << 31) ^ mask) >>> 0;
			this.high = (high >>> 1 ^ mask) >>> 0;
			return this;
		}

	}

	/**
	 * 2的16次方
	 */
	const _2_16 = 1 << 16;
	/**
	 * 2的32次方
	 */
	const _2_32 = _2_16 * _2_16;
	/**
	 * 2的64次方
	 */
	const _2_64 = _2_32 * _2_32;
	/**
	 * 2的63次方
	 */
	const _2_63 = _2_64 / 2;

	const ZERO = new Int64();
	const MAX_VALUE = new Int64(-1, 0x7FFFFFFF);
	const MIN_VALUE = new Int64(0, -2147483648);
	const ONE = new Int64(1);

}