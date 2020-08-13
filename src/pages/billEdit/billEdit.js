// src/pages/billEdit/billEdit.js
import api from '../../api'

const uploadImage = require('../../utils/oss/uploadAliyun.js')
const dayjs = require('../../vendor/dayjs')
const app = getApp()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		billPics: [],
		addUserValue: '',
		debtorId: '',
		debtorNameList: [],
		billDetail: {
			singlePrice: 0,
			mount: 0,
			extralPrice: [0],
		},
		billTime: '',
		billName: '',
		billMemo: '',
		billAmount: 0,
		dotName: '个',
		addDebtorName: '',
		proofing: false,
		confirmVisible: false,
		userDialogVisible: false,
		uploading: false,
		id: '',
		valid: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		app.watch(this.data, this.watch, this)
		if (!options.id) {
			this.setData({ billTime: dayjs().format('YYYY-MM-DD') })
		} else {
			this.setData({ id: options.id })
		}
	},
	watch: {
		billAmount(val, old) {
			if (this.validate(false)) {
				this.setData({ valid: true })
			}
		},
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
	onDel() {
		this.setData({ confirmVisible: true })
	},
	onDelConfirm() {
		this.setData({ confirmVisible: false })
	},
	onDelCancel() {
		this.setData({ confirmVisible: false })
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
	onMountInput(e) {
		const {
			detail: { value },
		} = e
		this.setData({
			billDetail: { ...this.data.billDetail, mount: Number(value) },
		})
		this.computedTotalMoney()
	},
	onSinglePriceInput(e) {
		const {
			detail: { value },
		} = e
		this.setData({
			billDetail: { ...this.data.billDetail, singlePrice: Number(value) },
		})
		this.computedTotalMoney()
	},
	onExtralPriceInput(e) {
		const {
			detail: { value },
			target: {
				dataset: { index },
			},
		} = e
		const arr = [...this.data.billDetail.extralPrice]
		arr[index] = Number(value)
		this.setData({
			billDetail: { ...this.data.billDetail, extralPrice: arr },
		})
		this.computedTotalMoney()
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
	computedTotalMoney() {
		const { singlePrice, mount, extralPrice } = this.data.billDetail
		const result =
			singlePrice * mount +
			extralPrice.reduce((total, v) => {
				total += v
				return total
			}, 0)
		this.setData({ billAmount: result })
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
		this.setData({ uploading: true })
		wx.chooseImage({
			success(res) {
				const tempFilePaths = res.tempFilePaths
				uploadImage(
					tempFilePaths[0],
					'miniapp/userUpload/',
					function (res) {
						_this.setData({
							uploading: false,
							billPics: [..._this.data.billPics, res],
						})
					},
					function (res) {
						wx.showToast({
							title: '图片上传失败，请重试',
							icon: 'none',
						})
						_this.setData({ uploading: false })
					}
				)
			},
		})
	},
	onBillAmountInput(e) {
		const {
			detail: { value },
		} = e
		this.setData({ billAmount: value })
	},
	onExtralPriceTap(e) {
		const {
			target: {
				dataset: { index },
			},
		} = e
		if (index == 0) {
			if (this.data.billDetail.extralPrice.length >= 3) {
				wx.showToast({
					title: '最多只能添加3个附加费',
					icon: 'none',
				})
			} else {
				this.setData({
					billDetail: {
						...this.data.billDetail,
						extralPrice: [...this.data.billDetail.extralPrice, 0],
					},
				})
			}
		} else {
			const arr = this.data.billDetail.extralPrice
			arr.splice(index, 1)
			this.setData({
				billDetail: { ...this.data.billDetail, extralPrice: [...arr] },
			})
		}
	},
	onBillAmountChange(e) {
		const {
			detail: { value },
		} = e
	},
	validateEmpty({ value, label }, showToast = true) {
		if (Array.isArray(value)) {
			if (!value.length) {
				showToast &&
					wx.showToast({
						title: `${label}`,
						icon: 'none',
					})
				return false
			}
			return true
		} else {
			if (!value) {
				showToast &&
					wx.showToast({
						title: `${label}`,
						icon: 'none',
					})
				return false
			}
			return true
		}
	},
	validate(showToast = true) {
		const {
			billAmount,
			billMemo,
			billName,
			billPics,
			billTime,
			debtorId,
			proofing,
		} = this.data
		const requireList = [
			{
				label: '请上传照片',
				value: billPics,
			},
			{
				label: '请选择客户',
				value: debtorId,
			},
			{
				label: '请填写项目名称',
				value: billName,
			},
			{
				label: '请设置总额',
				value: billAmount,
			},
		]
		return !requireList.some((v) => !this.validateEmpty(v, showToast))
	},
	async submit() {
		if (!this.validate()) {
			return
		}
		const {
			billAmount,
			billMemo,
			billName,
			billPics,
			billTime,
			debtorId,
			proofing,
			billDetail,
		} = this.data
		const form = {
			billAmount,
			billMemo,
			billName,
			billPics: JSON.stringify(billPics),
			billTime,
			debtorId,
			billDetail: JSON.stringify(billDetail),
			proofing: +proofing,
		}
		await api.bill.add({
			data: {
				...form,
			},
		})
		wx.showToast({
			title: '账单创建成功',
			icon: 'success',
		})
	},
})
