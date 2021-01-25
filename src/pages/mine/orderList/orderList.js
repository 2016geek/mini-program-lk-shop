import api from 'api';
import dayjs from 'vendor/dayjs';
var appInst =  getApp();

Page({
	data: {
		tabs: [{
			id: 0,
			text: '全部'
		}, {
			id: 2,
			text: '待服务'
		}, {
			id: 3,
			text: '合同中'
		}, {
			id: 4,
			text: '生产中'
		}, {
			id: 5,
			text: '已完成'
		}],
		tabActive: 0,
		pageNum: 1,
		list: [],
		totalCount: 0,
		loading: true,
		refresherStatus: false
	},
	onLoad: function (options) {
		this.getList();
	},
	async getList(pageNum = this.data.pageNum, status = this.data.tabActive) {
		let arr = [...this.data.list];
		if (pageNum === 1) arr = [];
		const res = await api.user.getOrderList({ pageNum, pageSize: appInst.globalData.pageSize, status });
		arr.push(...res.responses.map(v => ({ ...v, createTime: dayjs(v.createTime).format("YYYY/MM/DD") })));
		this.setData({
			list: arr,
			totalCount: res.totalCount,
			loading: false,
			pageNum,
			refresherStatus: false
		})
	},
	handleBtnTap(e) {
		const { status, id } = e.currentTarget.dataset;
		if (status === 1) {
			// 继续编辑
		} else {
			wx.navigateTo({
				url: `/pages/mine/orderDetail/orderDetail?id=${id}`
			});
		}
	},
	refresherrefresh() {
		this.setData({ refresherStatus: true });
		this.getList(1);
	},
	bindscrolltolower() {
		const { pageNum, totalCount } = this.data;
		if (pageNum * appInst.globalData.pageSize < totalCount) {
			this.getList(pageNum + 1);
		}
	},
	changeTabsActive(e) {
		const { id } = e.currentTarget.dataset;
		this.getList(1, id);
		this.setData({ tabActive: id });
	}
})
