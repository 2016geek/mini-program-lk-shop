import api from '../../../api'
	;

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		const res = await api.user.getUserInfo();
		this.setData({ userInfo: res });
	},
	onClickDetail() {
		const app = getApp();
		wx.navigateTo({
			url: `/pages/progress/webview/webview?token=${app.globalData.token}`,
		});
	},
});
