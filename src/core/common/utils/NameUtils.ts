namespace jy {
	export const enum Sex {
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

	let inited: boolean;

	function setLib(data: { a?: string, b?: string, c1?: string, c2?: string }) {
		const { a, b, c1, c2 } = data;
		let split = ";";
		a && (A = a.split(split));
		b && (B = b.split(split));
		c1 && (C[Sex.Male] = c1.split(split));
		c2 && (C[Sex.Female] = c2.split(split));
		inited = true;
	}

	export class NameUtils {

		private _random: Function;
		/**
		 *
		 * @param randomFunc	随机算法
		 *
		 */
		constructor(randomFunc?: Function) {
			this.setRandom(randomFunc);
		}

		/**
		 * 设置名字库的数据
		 *
		 * @static
		 * @memberof NameUtils
		 */
		static setLib = setLib;

		/**
		 * 设置名字库的数据
		 * @param a 
		 * @param b 
		 * @param c1 
		 * @param c2 
		 */
		static setLib2(a: string[], b?: string[], c1?: string[], c2?: string[]) {
			let isArray = Array.isArray;
			isArray(a) && (A = a);
			isArray(b) && (B = b);
			isArray(c1) && (C[Sex.Male] = c1);
			isArray(c2) && (C[Sex.Female] = c2);
		}

		/**
		 * 加载名字库
		 * @param url 
		 * @param callback 
		 */
		static loadNameLib(url: string, callback?: $CallbackInfo) {
			if (inited) {
				return callback && callback.execute();
			}
			Res.loadRes({ uri: "$nameLib", url, type: Res.ResItemType.Json }, CallbackInfo.get(item => {
				let $nl_nc = item.data;
				if ($nl_nc) {
					setLib($nl_nc);
					inited = true;
					return callback && callback.execute();
				}
			}));
		}

		/**
		 * 设置随机算法
		 * @param randomFunc
		 *
		 */
		setRandom(randomFunc: Function) {
			if (randomFunc != null) {
				this._random = randomFunc;
			} else {
				this._random = Math.random;
			}
		}

		/**
		 * 获取名字
		 * @param sex 1 男  2 女
		 * @return
		 *
		 */
		getName(sex = Sex.Male) {
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

		dispose() {
			this._random = null;
		}
	}
}