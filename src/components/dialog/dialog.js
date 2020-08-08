// Component Object
Component({
	properties: {
		title: {
			type: String,
			value: '',
			observer: function (v) {
				this.setData({ title: v })
			},
		},
		visible: {
			type: Boolean,
			value: false,
			observer: function (v) {
				this.setData({ visible: v })
			},
		},
	},
	data: {
		title: '标题',
		visible: false,
	},
	methods: {
		onClose() {
			this.triggerEvent('Close')
		},
		onConfirm() {
			this.triggerEvent('Confirm')
		},
	},
	created: function () {},
	attached: function () {},
	ready: function () {},
	moved: function () {},
	detached: function () {},
})
