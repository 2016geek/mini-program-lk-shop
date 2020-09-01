// src/pages/bill/export/export.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		url: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const token = getApp().globalData.token;
		const { id } = options;
		this.setData({
			url: `https://www.hzliangke.com/accountbook/index.html?id=${id}`,
		});
	},
	onMessage(e) {
		const { detail: { data } } = e;
		wx.getFileSystemManager().writeFile({
			filePath: wx.env.USER_DATA_PATH + '/test1.png', // 这里先把文件写到临时目录里.
			data: data[0].slice(22), // 注意这里
			encoding: 'base64',
			success: (res) => {
				wx.saveImageToPhotosAlbum({
					filePath: wx.env.USER_DATA_PATH + '/test1.png', // 这是把临时文件 保存到 相册, 收工
					success: (res) => {
						wx.showToast({
							title: '保存成功！',
						});
					},
					fail: (error) => {
						console.log(error);
					},
				});
			},
			fail: (error) => {
				console.log(error);
			},
		});
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

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
});
