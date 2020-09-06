// src/pages/setting/share/share.js
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isOpen: true,
		dayList: [
			{
				label: '1天',
				value: 1,
			},
			{
				label: '7天',
				value: 7,
			},
			{
				label: '30天',
				value: 30,
			},
		],
		choseDay: 1,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},
	onOpenChanged(event) {
		const {
			detail: { value },
		} = event;
		this.setData({ isOpen: value });
	},
	onChoseDay(e) {
		const { currentTarget: { dataset: { value } } } = e;
		this.setData({
			choseDay: value,
		});
	},
	onShareAppMessage: function () {
		const { userId, nickname, portrait } = app.globalData.userInfo;
		return {
			path: `/pages/bill/list/index?userId=${userId}&nickname=${nickname}&portrait=${portrait}&shareTime=${new Date().getTime()}`,
			imageUrl: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/miniapp/local/setting/sharePIc%402x.jpg',
			title: `邀请您协作账本，有效期${this.data.dayList.find((v) => v.value === this.data.choseDay).label}`,
		};
	},
});
