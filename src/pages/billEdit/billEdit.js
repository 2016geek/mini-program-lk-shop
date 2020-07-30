// src/pages/billEdit/billEdit.js
const uploadImage = require('../../utils/oss/uploadAliyun.js')

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		imgList: [],
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
	addImg(e) {
		let _this = this
		wx.chooseImage({
			success(res) {
				const tempFilePaths = res.tempFilePaths

				uploadImage(
					tempFilePaths[0],
					'miniapp/userUpload/',
					function (res) {
						_this.setData({ imgList: [..._this.data.imgList, res] })
						console.log(res)
					},
					function (res) {
						console.log('上传失败')
						console.log(res)
					}
				)
			},
		})
	},
})
