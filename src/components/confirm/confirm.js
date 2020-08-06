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
				this.setData({ title: v })
			},
		},
		desc: {
			type: String,
			value: '',
			observer: function (v) {
				this.setData({ desc: v })
			},
		},
		confirmText: {
			type: String,
			value: '',
			observer: function (v) {
				this.setData({ confirmText: v })
			},
		},
		cancelText: {
			type: String,
			value: '',
			observer: function (v) {
				this.setData({ cancelText: v })
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
		onConfirm() {
			this.triggerEvent('Confirm')
		},
		onCancel() {
			this.triggerEvent('Cancel')
		},
	},
})
