// src/pages/guide/welcome/welcome.js
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		checked: true,
	},
	options: {
		addGlobalClass: true,
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

	checked() {
		this.setData({ checked: true })
	},
	unChecked() {
		this.setData({ checked: false })
	},
	next() {
		if (!this.data.checked) {
			wx.showToast({
				title: '请同意《良刻管家用户协议》',
				icon: 'none',
			})
		} else {
			wx.navigateTo({
				url: '/pages/guide/information/index',
			})
		}
	},
})
