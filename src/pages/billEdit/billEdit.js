// src/pages/billEdit/billEdit.js
import api from '../../api';

const uploadImage = require('../../utils/oss/uploadAliyun.js');
const dayjs = require('../../vendor/dayjs')
	;

const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		billPics: [],
		addUserValue: '',
		debtorId: '',
		debtorName: '',
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
	onLoad: async function (options) {
		app.watch(this.data, this.watch, this);
		if (!options.id) {
			this.setData({ billTime: dayjs().format('YYYY-MM-DD') });
			if (options.debtorId) {
				this.setData({ debtorId: options.debtorId });
			}
		}
		else {
			const res = await api.bill.getDetail(
				{ id: options.id },
				{ id: options.id },
			);
			const {
				billAmount,
				billDetail,
				billMemo,
				billName,
				billPics,
				billTime,
				debtorId,
				debtorName,
				id,
				proofing,
			} = res;
			this.setData({
				billAmount,
				billMemo,
				billName,
				billPics: JSON.parse(billPics),
				billTime,
				debtorId,
				debtorName,
				id,
				proofing: !!proofing,
				billDetail: JSON.parse(billDetail),
				valid: true,
			});
		}
	},
	watch: {
		billAmount(val, old) {
			this.judgeValid();
		},
		billPics(val, old) {
			this.judgeValid();
		},
		debtorId(val, old) {
			this.judgeValid();
		},
		billTime(val, old) {
			this.judgeValid();
		},
		billName(val, old) {
			this.judgeValid();
		},
	},
	judgeValid() {
		if (this.validate(false)) {
			this.setData({ valid: true });
		}
		else {
			this.setData({ valid: false });
		}
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	async onShow() {
		await this.getDebtorList();
		if (this.data.debtorId) {
			const debtor = this.data.debtorNameList.find((v) => v.id == this.data.debtorId) || {};
			this.setData({ debtorName: debtor.debtorName });
		}
	},
	onDel() {
		this.setData({ confirmVisible: true });
	},
	async onDelConfirm() {
		const id = this.data.id;
		await api.bill.del({}, { id });
		wx.showToast({
			title: '删除成功',
			icon: 'success',
			success() {
				wx.navigateBack({});
			},
		});
		this.setData({ confirmVisible: false });
	},
	onDelCancel() {
		this.setData({ confirmVisible: false });
	},
	async getDebtorList() {
		const result = await api.debtor.list();
		this.setData({ debtorNameList: result });
	},
	onDebtorInput(e) {
		const {
			detail: { value },
		} = e;
		this.setData({ addDebtorName: value });
	},
	onMountInput(e) {
		const {
			detail: { value },
		} = e;
		this.setData({
			billDetail: { ...this.data.billDetail, mount: Number(value) },
		});
		this.computedTotalMoney();
	},

	onSinglePriceBlur(e) {
		const {
			detail: { value },
		} = e;
		this.setData({
			billDetail: {
				...this.data.billDetail,
				singlePrice: parseFloat(value).toFixed(2),
			},
		});
		this.computedTotalMoney();
	},
	onExtralPriceInput(e) {
		const {
			detail: { value },
			target: {
				dataset: { index },
			},
		} = e;
		const arr = [...this.data.billDetail.extralPrice];
		arr[index] = parseFloat(value).toFixed(2);
		this.setData({
			billDetail: { ...this.data.billDetail, extralPrice: arr },
		});
		this.computedTotalMoney();
	},
	async addDebtor() {
		if (!this.data.addDebtorName) {
			wx.showToast({
				title: '客户名称不能为空',
				icon: 'none',
			});
			return;
		}
		await api.debtor.add({ debtorName: this.data.addDebtorName });
		this.getDebtorList();
		this.setData({ userDialogVisible: false, addDebtorName: '' });
	},
	setDebtorVisible() {
		this.setData({ userDialogVisible: true });
	},
	computedTotalMoney() {
		const { singlePrice, mount, extralPrice } = this.data.billDetail;
		const result =
			singlePrice * mount +
			extralPrice.reduce((total, v) => {
				total += parseFloat(v);
				return total;
			}, 0);
		this.setData({ billAmount: parseFloat(result).toFixed(2) });
	},
	proofingChange(e) {
		this.setData({ proofing: e.detail.value });
	},
	onBillNameInput(e) {
		this.setData({ billName: e.detail.value });
	},
	onBillMemoInput(e) {
		this.setData({ billMemo: e.detail.value });
	},
	bindDateChange(e) {
		const {
			detail: { value },
		} = e;
		this.setData({ billTime: value });
	},
	choseDebtor(e) {
		const {
			target: {
				dataset: { value, name },
			},
		} = e;
		this.setData({ debtorId: value, debtorName: name });
	},
	closeDialog() {
		this.setData({ userDialogVisible: false });
	},
	delImg(e) {
		const {
			target: {
				dataset: { index },
			},
		} = e;
		const temp = [...this.data.billPics];
		temp.splice(index, 1);
		this.setData({
			billPics: [...temp],
		});
	},
	addImg(e) {
		let _this = this;
		this.setData({ uploading: true });
		wx.chooseImage({
			success(res) {
				const tempFilePaths = res.tempFilePaths;
				uploadImage(
					tempFilePaths[0],
					'miniapp/userUpload/',
					function (res) {
						_this.setData({
							uploading: false,
							billPics: [..._this.data.billPics, res],
						});
					},
					function (res) {
						wx.showToast({
							title: '图片上传失败，请重试',
							icon: 'none',
						});
						_this.setData({ uploading: false });
					},
				);
			},
		});
	},
	onBillAmountInput(e) {
		const {
			detail: { value },
		} = e;

		this.setData({ billAmount: value });
	},
	onExtralPriceTap(e) {
		const {
			target: {
				dataset: { index },
			},
		} = e;
		if (index == 0) {
			if (this.data.billDetail.extralPrice.length >= 3) {
				wx.showToast({
					title: '最多只能添加3个附加费',
					icon: 'none',
				});
			}
			else {
				this.setData({
					billDetail: {
						...this.data.billDetail,
						extralPrice: [...this.data.billDetail.extralPrice, 0],
					},
				});
			}
		}
		else {
			const arr = this.data.billDetail.extralPrice;
			arr.splice(index, 1);
			this.setData({
				billDetail: { ...this.data.billDetail, extralPrice: [...arr] },
			});
			this.computedTotalMoney();
		}
	},
	validateEmpty({ value, label }, showToast = true) {
		if (Array.isArray(value)) {
			if (!value.length) {
				showToast &&
					wx.showToast({
						title: `${label}`,
						icon: 'none',
					});
				return false;
			}
			return true;
		}
		else {
			if (!value) {
				showToast &&
					wx.showToast({
						title: `${label}`,
						icon: 'none',
					});
				return false;
			}
			return true;
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
		} = this.data;
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
		];
		return !requireList.some((v) => !this.validateEmpty(v, showToast));
	},
	onComputedAmoutBlur(e) {
		const {
			detail: { value },
		} = e;
		const { mount, extralPrice } = this.data.billDetail;
		const extralTotal = extralPrice.reduce((total, v) => {
			total += parseFloat(v);
			return total;
		}, 0);
		let result = Number(value);
		if (result < extralTotal) {
			wx.showToast({
				title: '总金额不能低于附加费',
				icon: 'none',
			});
			this.setData({
				billAmount: extralTotal.toFixed(2),
				billDetail: {
					singlePrice: 0,
					mount: 0,
					extralPrice,
				},
			});
		}
		else {
			let resultMount = 1;
			if (!mount) {
				resultMount = 1;
			}
			else {
				resultMount = mount;
			}
			const resultSinglePrice = (result - extralTotal) / resultMount;
			this.setData({
				billAmount: value,
				billDetail: {
					mount: resultMount,
					singlePrice: resultSinglePrice.toFixed(2),
					extralPrice,
				},
			});
		}
	},
	async submit() {
		if (!this.validate()) {
			return;
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
			debtorName,
		} = this.data;
		const form = {
			billAmount,
			billMemo,
			billName,
			billPics: JSON.stringify(billPics),
			billTime,
			debtorId,
			billDetail: JSON.stringify(billDetail),
			proofing: +proofing,
			debtorName,
		};
		if (this.data.id) {
			await api.bill.update({ ...form }, { id: this.data.id });
		}
		else {
			await api.bill.add({
				...form,
			});
		}
		wx.showToast({
			title: '账单创建成功',
			icon: 'success',
			success() {
				wx.navigateBack({});
			},
		});
	},
});
