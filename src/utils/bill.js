export const BillStatusMap = {
	1: {
		label: '待结算',
	},
	2: {
		label: '计题中',
	},
	3: {
		label: '已结算',
	},
}

export const extraLabel = (detail = '') => {
	const { singlePrice = '', mount = '', extralPrice = [] } =
		JSON.parse(detail) || {}
	return (
		`${+singlePrice}x${+mount}` +
		extralPrice
			.filter((i) => +i.value)
			.map((i) => `+${+i.value}`)
			.join('')
	)
}
