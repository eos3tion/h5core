module junyou {
	/**
	 * 进度条创建
	 * @pb 
	 *
	 */
	export class ProgressBarCreator extends BaseCreator<ProgressBar>{

		private _suiManager: SuiResManager;

		private _txtCreator: TextFieldCreator;

		private _sData: any[];

		public constructor() {
			super();
		}

		public parseSelfData(data: any) {
			this._sData = data;
			this._suiManager = singleton(SuiResManager);
			this._txtCreator = new TextFieldCreator();
			this._createT = this.createProgressBar;
		}

		private createProgressBar(): ProgressBar {
			let progressBar: ProgressBar = new ProgressBar();
			let sData = this._sData;
			let len = sData.length;
			let item;
			for (let i = 0; i < len; i++) {
				item = sData[i];
				if (item) {
					let dis = this.createElement(item);
					if (i == 0) {
						progressBar.tf = <egret.TextField>dis;
					} else if (i == 1) {
						progressBar.bar = <egret.Bitmap>dis;
					} else if (i == 2) {
						progressBar.bg = <egret.Bitmap>dis;
					}
				}
			}
			return progressBar;
		}
	}
}
