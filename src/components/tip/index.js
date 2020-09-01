Component({
	properties: {
		storageKey: {
			type: String,
			value: '',
		},
		value: {
			type: Number,
			value: 0,
		},
	},
	data: {
		showTip: false,
	},
	observers: {
		value(value) {
			this.getStorageValue(value);
		},
	},
	methods: {
		getStorageValue() {
			const { storageKey, value = 0 } = this.data;
			if (!storageKey) return value;
			try {
				const storageValue = wx.getStorageSync(storageKey);
				if (storageValue !== value) {
					this.setData({
						showTip: true,
					});
					this.setStorageValue(value);
				}
				return value;
			}
			catch (e) {
				return value;
			}
		},
		setStorageValue(value) {
			const { storageKey } = this.data;
			if (!storageKey) return;
			wx.setStorageSync(storageKey, value);
		},
	},
});

