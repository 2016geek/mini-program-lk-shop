App({
	onLaunch() {
		const res = wx.getStorageSync('isFinishedPaid');
		wx.setStorageSync('isFinishedPaid', !!res);
		this.globalData.isFinishedPaid = !!res;
	},
	globalData: {
		userInfo: null,
		isFinishedPaid: false,
	},
	setIsFinishedPaid(value) {
		wx.setStorageSync('isFinishedPaid', !!value);
		this.globalData.isFinishedPaid = !!value;
	},
	observe(obj, key, fun, caller) {
		var val = obj[key];
		Object.defineProperty(obj, key, {
			configurable: true,
			enumerable: true,
			set(value) {
				val = value;
				fun.call(caller, value, val);
			},
			get() {
				return val;
			},
		});
	},
	watch(data, watch, caller) {
		Object.keys(watch).forEach((v) => {
			this.observe(data, v, watch[v], caller);
		});
	},
});
