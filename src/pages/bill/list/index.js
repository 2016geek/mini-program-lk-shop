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
		hasPhone: false,
		billList: [],
		pageSize: 10,
		pageNum: 0,
		infoLoading: true,
		loading: true,
		isFirst: true,
		backgroundImgs: ['', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((i) => `https://hzliangke.oss-cn-hangzhou.aliyuncs.com/miniapp/local/rule/矩形备份${i ? ' ' + i : ''}@2x.png`),
		code: '',
		isCooperate: false,
		cooperateInfo: {},
	},
	onLoad(params) {
		const { userId } = params;
		if (userId) {
			this.setData({
				isCooperate: true,
				cooperateInfo: {
					...params,
					title: `${params.nickname.length > 11 ? params.nickname.slice(0, 11) + '...' : params.nickname}的协作账本`,
				},
			});
			getApp().globalData.isCooperate = true;
			getApp().globalData.requestHeaders = params;
			// if (getApp().globalData.userInfo.userId == getApp().globalData.userInfo.userId) {
			// 	this.setData({ isCooperate: false });
			// 	getApp().globalData.isCooperate = false;
			// 	getApp().globalData.requestHeaders = {};
			// }
		}
	},
	async onShow() {
		await this.getUserInfo();
		await this.getBillList(true);
		this.getCode();
	},
	getCode() {
		const _this = this;
		this.setData({
			hasPhone: !!getApp().globalData.userInfo.phone,
		});
		wx.login({
			async success(res) {
				_this.setData({ code: res.code });
			},
		});
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
	async onGetPhone(e) {
		const { detail } = e;
		const res = await api.user.bindPhone({ ...detail, code: this.data.code });
		getApp().globalData.userInfo = res;
		this.onAddBill();
	},
	onReachBottom() {
		console.log('onReachBottom');
		this.getBillList();
	},
});
