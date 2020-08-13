import { camelCase } from 'lodash'

App({
	onLaunch() {},
	globalData: {
		userInfo: null,
	},
	observe(obj, key, fun, caller) {
		var val = obj[key]
		Object.defineProperty(obj, key, {
			configurable: true,
			enumerable: true,
			set(value) {
				val = value
				fun.call(caller, value, val)
			},
			get() {
				return val
			},
		})
	},
	watch(data, watch, caller) {
		Object.keys(watch).forEach((v) => {
			this.observe(data, v, watch[v], caller)
		})
	},
})
