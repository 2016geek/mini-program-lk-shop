Component({
	options: {
		addGlobalClass: true, // 使组件内部样式可以被全局样式覆盖 (2.2.3 以上)
	},
	properties: {
		type: {
			type: Number,
			value: 2,
		},
	},
	data: {
		typeMap: {
			1: {
				class: 'type1',
				num: 12,
			},
			2: {
				class: 'type2',
				num: 4,
			},
			3: {
				class: 'type3',
				num: 8,
			},
			4: {
				class: 'type4',
				num: 2,
			},
		},
	},
});
