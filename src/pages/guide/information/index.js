Page({
	data: {
		info: {
			title: '您所属的行业？',
			desc: '请选择您的行业，以便获得最佳体验',
		},
		selections: [
			{ value: '1', label: '烫金' },
			{ value: '2', label: 'UV' },
			{ value: '3', label: '丝网印' },
			{ value: '4', label: '对裱' },
			{ value: '5', label: '盖光' },
			{ value: '6', label: '上光' },
			{ value: '7', label: '糊袋' },
			{ value: '8', label: '糊信封' },
			{ value: '9', label: '其他' },
		],
	},
	onTapSelectItem(e) {
		const { selections = [] } = this.data
		const { item = {} } = e.currentTarget.dataset
		this.setData({
			selections: selections.map((i) => {
				const isSet = i.value === item.value
				return isSet ? { ...i, selected: !i.selected } : i
			}),
		})
	},
	onUse() {
		wx.navigateTo({
			url: '/pages/bill/list/index',
		})
	},
})
