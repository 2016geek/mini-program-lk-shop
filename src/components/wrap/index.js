const defaultInfo = {
	statusBarHeight: 20,
	titleBarHeight: 44,
	totalTopHeight: 64,
	windowWidth: 375,
	windowHeight: 650,
	pixelRatio: 2,
};

Component({
	properties: {
		customTitleBar: {
			type: Boolean,
			value: false,
		},
		useBack: {
			type: Boolean,
			value: false,
		},
	},
	methods: {
		getMenuButtonInfo() {
			const defaultValue = {
				top: 28,
				height: 32,
				width: 87,
				bottom: 58,
				left: 278,
				right: 365,
			};
			if (!getApp().menuButtonInfo) {
				try {
					getApp().menuButtonInfo = wx.getMenuButtonBoundingClientRect();
					// 即使调用成功，数据返回仍然可能存在问题
					const keysList = Object.keys(getApp().menuButtonInfo);
					if (keysList.length) {
						keysList.forEach((key) => {
							if (!getApp().menuButtonInfo[key] && defaultValue[key]) {
								getApp().menuButtonInfo[key] = defaultValue[key];
							}
						});
					}
					else {
						getApp().menuButtonInfo = null;
					}
				}
				catch (e) {
					getApp().menuButtonInfo = null;
				}
			}
			return getApp().menuButtonInfo || defaultValue;
		},
		getSystemInfo() {
			if (!getApp()) {
				return defaultInfo;
			}
			if (getApp().titleBarInfo) {
				return getApp().titleBarInfo;
			}
			try {
				const systemInfo = (wx && wx.getSystemInfoSync()) || {};
				const {
					statusBarHeight, model, version, system, pixelRatio,
					windowWidth, windowHeight, brand, screenWidth, environment,
				} = systemInfo;
				let isIphoneX = false;
				const isCustomTitle = version && version.slice(0, 5) >= '6.6.0';
				if (model.indexOf('iPhone X') !== -1) {
					isIphoneX = true;
				}
				const { height } = this.getMenuButtonInfo();
				const titleBarHeight = height ? height + 12 : 46;
				getApp().titleBarInfo = {
					...systemInfo,
					statusBarHeight,
					titleBarHeight,
					searchBarHeight: 40,
					totalTopHeight: titleBarHeight + statusBarHeight,
					isIphoneX,
					pixelRatio,
					isCustomTitle, // 是否可以自定义标题
					isIos: system.includes('iOS'),
					windowWidth,
					windowHeight,
					screenWidth,
					brand: brand && brand.toLowerCase(),
					environment,
				};
				return getApp().titleBarInfo;
			}
			catch (e) {
				return defaultInfo;
			}
		},
	},
});

