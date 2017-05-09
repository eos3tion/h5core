var $nl_nc;
const enum Sex {
	/**
	 * 男
	 */
	Male = 1,
	/**
	 * 女
	 */
	Female = 2,
	Nan = Male,
	Nv = Female
}
module junyou {
	/**
	 * 姓 集合
	 * 对应配置中 姓 列
	 */
	let A = [];
	/**
	 * 符号 集合
	 * 对应配置中 符号 列
	 */
	let B = [];
	/**
	 * 名 集合
	 * 对应配置中 男名，女名 列
	 * index（0：男名，1：女名）
	 */
	let C = [, [], []];
	export class NameUtils {

		private _random: Function;
		/**
		 *
		 * @param randomFunc	随机算法
		 *
		 */
		public constructor(randomFunc?: Function) {
			this.setRandomFunc(randomFunc);
		}

		public static loadNameLib(url: string) {
			loadScript(url, () => {
				if ($nl_nc) {
					//a：姓,b:符号,c1:男名,c2:女名
					const {a, b, c1, c2} = $nl_nc;
					let split = ";";
					a && (A = a.split(split));
					b && (B = b.split(split));
					c1 && (C[Sex.Male] = c1.split(split));
					c2 && (C[Sex.Female] = c2.split(split));
					$nl_nc = undefined;
				}
			})
		}

		/**
		 * 设置随机算法
		 * @param randomFunc
		 *
		 */
		public setRandomFunc(randomFunc: Function) {
			if (randomFunc != null) {
				this._random = randomFunc;
			}
			else {
				this._random = Math.random;
			}
		}

		/**
		 * 获取名字
		 * @param sex 1 男  2 女
		 * @return
		 *
		 */
		public getName(sex = Sex.Male) {
			let name = "";
			let SC = C[sex];
			if (!SC) {
				if (DEBUG) {
					ThrowError("性别必须为1或者2");
				}
				return;
			}
			let aLen = A.length;
			let bLen = B.length;
			let cLen = SC.length;
			let random = this._random;
			if (aLen) name += A[aLen * random() >> 0];
			if (bLen) name += (Date.now() & 1) ? "" : B[bLen * random() >> 0];
			if (cLen) name += SC[cLen * random() >> 0];
			return name;
		}

		public dispose() {
			this._random = null;
		}
	}
}