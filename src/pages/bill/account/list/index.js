import api from '../../../../api';
import dayjs from 'dayjs';
import { timeLabel } from '../../../../utils/util';

const extraLabel = (detail = '') => {
	const { singlePrice = '', mount = '', extralPrice = [] } = JSON.parse(detail) || {};
	return `${+singlePrice}x${+mount}` + extralPrice.filter((i) => +i).map((i) => `+${+i}`).join('');
};

Page({
	data: {
		debtorId: '',
		userInfo: {
			debtorName: '',
			totalBillAmount: 0,
			totalSettlementAmount: 0,
			total: 0,
			settle: 0,
			unSettle: 0,
		},
		monthList: [],
		list: [],
		packages: [],
		pageSize: 10,
		pageNum: 0,
		loading: false,
		packagePageSize: 10,
		packagePageNum: 0,
		packageLoading: false,
		expands: [false, false, false],
		packageExpands: [false, false, false],
		current: 'list',
		statusMap: {
			1: '未结',
			2: '部分',
			3: '结清',
			4: '部分',
		},
		packageConfirmVisible: false,
		settleDialogVisible: false,
		settleValue: '',
		settleId: '',
	},

	onLoad(params) {
		const { debtorId = '' } = params;
		this.setData({ debtorId });
	},

	async onShow() {
		this.getDebtorInfo();
		this.resetList();
		this.resetPackages();
		await this.getMonthList();
		this.getListForTab();
	},

	resetInfo() {
		this.setData({
			userInfo: {
				debtorName: '',
				totalBillAmount: 0,
				totalSettlementAmount: 0,
				total: 0,
				settle: 0,
				unSettle: 0,
			},
		});
	},

	resetList() {
		this.setData({
			list: [],
			pageNum: 0,
		});
	},

	resetPackages() {
		this.setData({
			packages: [],
			packagePageNum: 0,
		});
	},

	async getListForTab() {
		const { current } = this.data;
		if (current === 'list') {
			this.getList();
		}
		else {
			this.getPackageList();
		}
	},

	async getDebtorInfo() {
		const { debtorId } = this.data;
		const res = await api.bill.debtorAmount({}, { debtorId });
		const userInfo = {
			...res,
			total: res.totalBillAmount,
			settle: res.totalSettlementAmount,
			unSettle: res.totalBillAmount - res.totalSettlementAmount,
		};
		this.setData({ userInfo });
	},

	async getMonthList() {
		const { debtorId } = this.data;
		const res = await api.bill.debtorMonthList({ debtorId });
		this.setData({ monthList: res || [] });
	},

	async getList() {
		const { debtorId, monthList = [], list = [], pageSize, pageNum } = this.data;
		const startIndex = pageNum * pageSize;
		const endIndex = (pageNum + 1) * pageSize;
		if (startIndex >= monthList.length) return;
		const billMonthList = monthList.slice(startIndex, endIndex);
		const billDate = billMonthList.map((i) => i.monthDate);
		try {
			this.setData({ loading: true });
			const res = await api.bill.debtorList({ debtorId, billDate });
			const newList = billMonthList.map((item) => {
				const { totalBillAmount = 0, monthDate = '' } = item;
				return {
					...item,
					time: timeLabel(monthDate, 'year'),
					total: totalBillAmount,
					items: res
						.filter((i) => dayjs(monthDate).month() === dayjs(i.billTime).month())
						.map((i) => ({
							image: (JSON.parse(i.billPics || '[]') || [])[0],
							title: i.billName,
							total: i.billAmount,
							time: timeLabel(i.billTime, 'month'),
							detail: extraLabel(i.billDetail),
							...i,
						})),
				};
			});
			this.setData({
				pageNum: pageNum + 1,
				list: list.concat(newList),
			});
		}
		finally {
			this.setData({ loading: false });
		}
	},

	async getPackageList() {
		const { debtorId, packagePageSize, packagePageNum, packages = [] } = this.data;
		const currentLength = packages.length;
		const nextLength = packagePageNum * packagePageSize;
		const hasNextPage = currentLength >= nextLength;
		if (!hasNextPage) return;
		try {
			this.setData({ packageLoading: true });
			const res = await api.bill.debtorAccrual({ debtorId, pageSize: packagePageSize, pageNum: packagePageNum + 1 });
			const packageList = res.map((item) => {
				const { userBillDTOList = [] } = item || {};
				const items = userBillDTOList.map((i) => ({
					...i,
					image: (JSON.parse(i.billPics || '[]') || [])[0],
					detail: extraLabel(i.billDetail),
					timeLabel: timeLabel(i.billTime, 'month'),
				}));
				return {
					...item,
					timeLabel: timeLabel(item.accrualTime, 'year'),
					total: item.totalBillAmount,
					settle: item.totalSettlementAmount,
					unSettle: item.totalBillAmount - item.totalSettlementAmount,
					items,
				};
			});
			this.setData({
				packagePageNum: packagePageNum + 1,
				packages: packages.concat(packageList || []),
			});
		}
		finally {
			this.setData({ packageLoading: false });
		}
	},

	async onTab(e) {
		const current = e.currentTarget.dataset.current;
		this.setData({
			current,
		});
		if (current === 'list') {
			this.resetList();
			await this.getMonthList();
		}
		else {
			this.resetPackages();
		}
		this.getListForTab();
	},

	onExpand(e) {
		const index = e.currentTarget.dataset.index;
		const { expands = [] } = this.data;
		this.setData({
			expands: expands.map((item, i) => (i === index ? !item : item)),
		});
	},

	onPackageExpand(e) {
		const index = e.currentTarget.dataset.index;
		const { packageExpands = [] } = this.data;
		this.setData({
			packageExpands: packageExpands.map((item, i) =>
				i === index ? !item : item,
			),
		});
	},
	onAddBill() {
		const { debtorId } = this.data;
		wx.navigateTo({
			url: `/pages/billEdit/billEdit?debtorId=${debtorId}`,
		});
	},
	onAddPackage() {
		console.log('onAddPackage');
		this.setData({ packageConfirmVisible: true });
	},
	async onPackageConfirm() {
		const { debtorId } = this.data;
		const res = await api.bill.addPackage({ debtorId });
		console.log(res);
		this.setData({ packageConfirmVisible: false });
		this.resetList();
		this.resetPackages();
		await this.getMonthList();
		this.getListForTab();
	},
	onPackageCancel() {
		this.setData({ packageConfirmVisible: false });
	},
	onSettleInput(e) {
		const { value } = e.detail;
		this.setData({ settleValue: value });
	},
	async onSettleTap(e) {
		const { item } = e.currentTarget.dataset;
		const { totalBillAmount = 0, totalSettlementAmount = 0, id } = item;
		this.setData({
			settleId: id,
			settleDialogVisible: true,
			settleValue: totalBillAmount - totalSettlementAmount,
		});
	},
	onSettleClose() {
		this.setData({
			settleDialogVisible: false,
			settleId: '',
			settleValue: '',
		});
	},
	async onSettleConfirm() {
		const { debtorId, settleValue, settleId } = this.data;
		await api.bill.settle({ accrualId: settleId, debtorId, amount: settleValue });
		this.getDebtorInfo();
		this.resetList();
		this.resetPackages();
		await this.getMonthList();
		this.getListForTab();
		this.onSettleClose();
	},
	onItemTap(e) {
		const { id } = e.currentTarget.dataset;
		console.log(e);
		wx.navigateTo({
			url: `/pages/billEdit/billEdit?id=${id}`,
		});
	},

	onReachBottom() {
		console.log('onReachBottom');
		this.getListForTab();
	},
});
