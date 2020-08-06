// src/pages/billEdit/billEdit.js
import api from '../../api'

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
		debtorId: '',
		debtorNameList: [],
		billTime: '',
		billName: '',
		billMemo: '',
		mount: 0,
		singlePrice: 0,
		extralPrice: [0],
		settlementAmount: 10,
		proofing: false,
		dotName: '个',
		addDebtorName: '',
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
	onShow() {
		this.getDebtorList()
	},
	async getDebtorList() {
		const { result } = await api.debtor.list()
		this.setData({ debtorNameList: result })
	},
	onDebtorInput(e) {
		const {
			detail: { value },
		} = e
		this.setData({ addDebtorName: value })
	},
	async addDebtor() {
		if (!this.data.addDebtorName) {
			wx.showToast({
				title: '客户名称不能为空',
				icon: 'none',
			})
			return
		}
		await api.debtor.add({ debtorName: this.data.addDebtorName })
		this.getDebtorList()
		this.setData({ userDialogVisible: false, addDebtorName: '' })
	},
	setDebtorVisible() {
		this.setData({ userDialogVisible: true })
	},
	computedMoney(number) {
		var a = new Intl.NumberFormat('en-US')
		a.format(number)
	},
	proofingChange(e) {
		this.setData({ proofing: e.detail.value })
	},
	onBillNameInput(e) {
		this.setData({ billName: e.detail.value })
	},
	onBillMemoInput(e) {
		this.setData({ billMemo: e.detail.value })
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
		this.setData({ debtorId: value })
	},
	closeDialog() {
		this.setData({ userDialogVisible: false })
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
