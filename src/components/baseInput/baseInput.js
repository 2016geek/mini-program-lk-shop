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
		showConfirmBtn: {
			type: Boolean,
			value: false,
		},
	},
	externalClasses: ['my-class'],
	data: {
		result: '',
		extralClass: '',
		value: '',
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
		onConfirm(event) {
			this.triggerEvent('Confirm')
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
