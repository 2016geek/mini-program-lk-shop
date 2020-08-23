import api from '../../../api';

Page({
	data: {
		userInfo: {
			debtorName: '',
			totalBillAmount: 0,
			totalSettlementAmount: 0,
			total: 0,
			settle: 0,
			unSettle: 0,
		},
		billList: [],
		pageSize: 10,
		pageNum: 0,
		infoLoading: true,
		loading: true,
		isFirst: true,
		backgroundImgs: ['', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((i) => `https://hzliangke.oss-cn-hangzhou.aliyuncs.com/miniapp/local/rule/矩形备份${i ? ' ' + i : ''}@2x.png`),
	},
	async onShow() {
		this.getUserInfo();
		this.getBillList(true);
	},
	async getUserInfo() {
		try {
			this.setData({ infoLoading: true });
			const res = await api.bill.amount();
			const userInfo = {
				...res,
				total: res.totalBillAmount,
				settle: res.totalSettlementAmount,
				unSettle: res.totalBillAmount - res.totalSettlementAmount,
			};
			console.log('获取用户信息', userInfo);
			this.setData({ userInfo, infoLoading: false });
		}
		finally {
			this.setData({ infoLoading: false });
		}
	},
	async getBillList(reset = false) {
		if (reset) {
			this.resetBillList();
		}
		const { pageSize, pageNum, billList = [] } = this.data;
		const currentLength = billList.length;
		const nextLength = pageNum * pageSize;
		const hasNextPage = currentLength >= nextLength;
		if (!hasNextPage) return;
		this.setData({ loading: true });
		try {
			const status = getApp().globalData.isFinishedPaid ? [1, 2, 4] : [1, 2, 3, 4];
			const list = await api.bill.list({ pageSize, pageNum: pageNum + 1, status });
			const newBillList = list.map((i) => ({
				...i,
				billAmountLabel: i.status == 3 ? i.totalSettlementAmount : i.billAmount - i.totalSettlementAmount,
			}));
			this.setData({
				billList: billList.concat(newBillList),
				pageNum: pageNum + 1,
				loading: false,
			});
		}
		finally {
			this.setData({ loading: false });
		}
	},
	resetBillList(cb) {
		this.setData({
			billList: [],
			pageSize: 10,
			pageNum: 0,
			loading: false,
		}, () => {
			cb && cb();
		});
	},
	onItemTap(e) {
		const { item = {} } = e.currentTarget.dataset;
		wx.navigateTo({
			url: `/pages/bill/account/list/index?debtorId=${item.debtorId}`,
		});
	},
	onAddBill() {
		wx.navigateTo({
			url: '/pages/billEdit/billEdit',
		});
	},

	onReachBottom() {
		console.log('onReachBottom');
		this.getBillList();
	},
});
