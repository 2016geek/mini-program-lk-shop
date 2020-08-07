Page({
	data: {
		userInfo: {
			sum: '100.00',
			settle: '59.60',
			unsettle: '40.40',
		},
		list: [
			{
				time: '2020年7月',
				total: 123300,
				items: [
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
				],
			},
			{
				time: '2020年7月',
				total: 123300,
				items: [
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
				],
			},
			{
				time: '2020年7月',
				total: 123300,
				items: [
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
				],
			},
		],
		packages: [
			{
				time: '2020年7月计提',
				total: 123300,
				pay: 5000,
				status: 1,
				items: [
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
				],
			},
			{
				time: '2020年7月计提',
				total: 123300,
				pay: 5000,
				status: 2,
				items: [
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
				],
			},
			{
				time: '2020年7月计提',
				total: 123300,
				pay: 5000,
				status: 3,
				items: [
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
					{
						image: '',
						title: '卡套压痕',
						total: 10000,
						time: '7月24日',
						detail: '2600*0.2+200+100+100',
					},
				],
			},
		],
		expands: [false, false, false],
		packageExpands: [false, false, false],
		current: 'list',
		statusMap: {
			1: '未结',
			2: '部分',
			3: '结清',
		},
	},

	onLoad(parmas) {
		console.log(parmas);
	},

	onTab(e) {
		const current = e.currentTarget.dataset.current;
		this.setData({
			current,
		});
	},

	onExpand(e) {
		const index = e.currentTarget.dataset.index;
		const { expands = [] } = this.data;
		this.setData({
			expands: expands.map((item, i) => i === index ? !item : item),
		});
	},

	onPackageExpand(e) {
		const index = e.currentTarget.dataset.index;
		const { packageExpands = [] } = this.data;
		this.setData({
			packageExpands: packageExpands.map((item, i) => i === index ? !item : item),
		});
	},
});
