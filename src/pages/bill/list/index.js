import { BillStatusMap } from '../../../utils/bill';
import api from '../../../api';
import { numberLabel, timeLabel } from '../../../utils/util';

Page({
	data: {
		userInfo: {
			debtorName: '',
			totalBillAmount: 0,
			totalSettlementAmount: 0,
			total: '0.00',
			settle: '0.00',
			unSettle: '0.00',
		},
		billList: [],
		pageSize: 10,
		pageNum: 0,
		loading: false,
		backgroundImgs: ['', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((i) => `https://hzliangke.oss-cn-hangzhou.aliyuncs.com/miniapp/local/rule/矩形备份${i ? ' ' + i : ''}@2x.png`),
	},
	async onShow() {
		this.resetData();
		this.getUserInfo();
		this.getBillList();
	},
	async getUserInfo() {
		const res = await api.bill.amount();
		const userInfo = {
			...res,
			total: numberLabel(res.totalBillAmount),
			settle: numberLabel(res.totalSettlementAmount),
			unSettle: numberLabel(res.totalBillAmount - res.totalSettlementAmount),
		};
		console.log('获取用户信息', userInfo);
		this.setData({ userInfo });
	},
	async getBillList() {
		const { pageSize, pageNum, billList = [] } = this.data;
		const currentLength = billList.length;
		const nextLength = pageNum * pageSize;
		const hasNextPage = currentLength >= nextLength;
		if (!hasNextPage) return;
		this.setData({ loading: true });
		try {
			const status = getApp().globalData.isFinishedPaid ? [1, 2, 4] : [1, 2, 3, 4];
			console.log('status', status);
			const list = await api.bill.list({ pageSize, pageNum: pageNum + 1, status });
			console.log('request end', list);
			const newBillList = list.map((i) => ({
				...i,
				billAmountLabel: i.status == 3 ? numberLabel(i.totalSettlementAmount) : numberLabel(i.billAmount - i.totalSettlementAmount),
			}));
			console.log('获取账单', newBillList);
			this.setData({
				billList: billList.concat(newBillList),
				pageNum: pageNum + 1,
			});
		}
		finally {
			this.setData({ loading: false });
		}
	},
	resetData() {
		this.setData({
			userInfo: {
				debtorName: '',
				totalBillAmount: 0,
				totalSettlementAmount: 0,
				total: '0.00',
				settle: '0.00',
				unSettle: '0.00',
			},
			billList: [],
			pageSize: 10,
			pageNum: 0,
			loading: false,
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
