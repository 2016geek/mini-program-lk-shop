// Component Object
Component({
	properties: {
		max: {
			type: Number,
			value: -1,
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
	externalClasses: ['my-class'],
	data: {
		result: '',
		extralClass: '',
	},
	methods: {
		onInput(event) {
			this.setData({ result: event.detail.value })
			this.triggerEvent('Input', { value: event.detail.value })
		},
		onBlur(event) {
			this.triggerEvent('Blur')
		},
		onFocus(event) {
			this.setData({ extralClass: 'active' })
			this.triggerEvent('Focus')
		},
		onComfirm(event) {
			this.triggerEvent('Comfirm')
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
