import { emailValidate } from '../../utils/util'

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		billChecked: true,
		emailChecked: true,
		email: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
	onBillChanged(event) {
		this.setData({ billChecked: event.detail.value })
	},
	onEmailChanged(event) {
		this.setData({ emailChecked: event.detail.value })
	},
	onEmailInput(event) {
		this.setData({ email: event.detail.value })
	},
	onEmailBlur() {
		if (this.data.email) {
			if (this.validate()) {
				// todo 发请求
			} else {
				wx.showToast({
					title: '邮箱格式不符合要求',
					icon: 'none',
				})
			}
		}
	},
	validate() {
		return emailValidate(this.data.email)
	},
})
