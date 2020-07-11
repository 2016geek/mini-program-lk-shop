// Component Object
Component({
	properties: {
		max: {
			type: Number,
			value: 'baseInput Component',
		},
		placeholder: {
			type: String,
			value: '请输入',
		},
		type: {
			type: String,
			value: 'text',
		},
		value: {
			type: String,
			value: '',
		},
	},
	data: {
		result: '',
	},
	methods: {
		onInput(value) {
			this.setData({ result: value.detail.value })
			this.triggerEvent('inputChange', value.detail.value)
		},
	},
	created: function () {
		this.setData({ result: this.properties.value })
	},
	attached: function () {},
	ready: function () {},
	moved: function () {},
	detached: function () {},
})
