// Component Object
Component({
	options: {
		addGlobalClass: true,
	},
	properties: {
		title: {
			type: String,
			value: '',
			observer: function (v) {
				this.setData({ title: v });
			},
		},
		desc: {
			type: String,
			value: '',
			observer: function (v) {
				this.setData({ desc: v });
			},
		},
		confirmText: {
			type: String,
			value: '',
			observer: function (v) {
				this.setData({ confirmText: v });
			},
		},
		confirmType: {
			type: String,
			value: '',
			observer: function (v) {
				this.setData({ confirmType: v });
			},
		},
		cancelText: {
			type: String,
			value: '',
			observer: function (v) {
				this.setData({ cancelText: v });
			},
		},
	},
	data: {
		title: '',
		desc: '',
		confirmText: '',
		cancelText: '',
	},
	methods: {
		onConfirm(e) {
			this.triggerEvent('Confirm', e);
		},
		onCancel() {
			this.triggerEvent('Cancel');
		},
	},
});
