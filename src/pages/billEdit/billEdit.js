// src/pages/billEdit/billEdit.js
const uploadImage = require('../../utils/oss/uploadAliyun.js')
const dayjs = require('../../vendor/dayjs')
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		imgList: [],
		userDialogVisible: false,
		addUserValue: '',
		debtorName: '',
		debtorNameList: ['张东升'],
		billTime: '',
		billName: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (!options.id) {
			this.setData({ billTime: dayjs().format('YYYY-MM-DD') })
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},
	onBillNameInput(e) {
		this.setData({ billName: e.detail.value })
	},
	bindDateChange(e) {
		const {
			detail: { value },
		} = e
		this.setData({ billTime: value })
	},
	choseDebtor(e) {
		const {
			target: {
				dataset: { value },
			},
		} = e
		this.setData({ debtorName: value })
	},
	closeDialog() {
		this.setData({ userDialogVisible: false })
	},
	confirmAddUser() {
		if (this.data.addUserValue) {
			this.setData({ debtorName: this.data.addUserValue })
		}
	},
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
