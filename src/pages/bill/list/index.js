import { BillStatusMap } from '../../../utils/bill';
import api from '../../../api';
import { numberLabel, timeLabel } from '../../../utils/util';

Page({
	data: {
		userInfo: {
			debtorName: '',
			totalBillAmount: 0,
			totalSettlementAmount: 0,
		},
		billList: [],
		pageSize: 10,
		pageNum: 0,
		loading: false,
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
			const list = await api.bill.list({ pageSize, pageNum: pageNum + 1, status });
			const newBillList = list.map((i) => ({
				...i,
				billAmountLabel: numberLabel(i.billAmount),
			}));
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
	onSettingTap() {
		wx.navigateTo({
			url: '/pages/setting/setting',
		});
	},

	onReachBottom() {
		console.log('onReachBottom');
		this.getBillList();
	},
});
