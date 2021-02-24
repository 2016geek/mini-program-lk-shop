import api from '../../../api'

Page({
	data: {
		list: [{
			icon: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/lk-shop-miniprogram/mine/%E8%B4%A6%E5%8D%95_%E8%AF%A6%E6%83%85%402x.png',
			iconClass: 'order-icon',
			text: '我的订单',
			path: '/pages/mine/orderList/orderList',
			isHide: false
		}, {
			icon: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/lk-shop-miniprogram/mine/%E8%B7%AF%E5%BE%84%402x(1).png',
			iconClass: 'account-icon',
			text: '账号管理',
			path: '',
			isHide: true
		}, {
			icon: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/lk-shop-miniprogram/mine/%E5%BD%A2%E7%8A%B6%402x.png',
			iconClass: 'question-icon',
			text: '如何使用',
			path: '',
			isHide: false
		}, {
			icon: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/lk-shop-miniprogram/mine/%E5%BD%A2%E7%8A%B6%402x(1).png',
			iconClass: 'must-icon',
			text: '用户须知',
			path: '',
			isHide: false
		}],
		userInfo: {},
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		const res = await api.user.getUserInfo();
		this.setData({ userInfo: res });
	},
	navigatePage(e) {
		const { path } = e.currentTarget.dataset;
		wx.navigateTo({
			url: path
		});
	}
})
