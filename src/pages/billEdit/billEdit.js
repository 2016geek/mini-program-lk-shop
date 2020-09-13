// src/pages/billEdit/billEdit.js
import api from '../../api';

const uploadImage = require('../../utils/oss/uploadAliyun.js');
const dayjs = require('../../vendor/dayjs');

const uploadImagePromise = (path, url) => {
	return new Promise((resolve, reject) => {
		uploadImage(
			path,
			url,
			function (res) {
				resolve(res);
			},
			function (res) {
				reject(res);
			},
		);
	});
};

const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
		billPics: [],
		addUserValue: '',
		currentExtraName: '附加费',
		extraDialogVisible: false,
		currentExtraIndex: 0,
		debtorId: '',
		debtorName: '',
		debtorNameList: [],
		billDetail: {
			singlePrice: 0,
			mount: 0,
			extralPrice: [{ name: '附加费', value: 0 }],
		},
		creator: {
			userId: '',
			protrait: '',
			nickname: '',
			phone: '',
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
		canEdit: true,
		keyboardOpen: false,
		switchColor: '#3432C1',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		app.watch(this.data, this.watch, this);

		this.setData({ userInfo: getApp().globalData.userInfo });
		if (options.review) {
			this.setData({ canEdit: false, switchColor: '#eee' });
		}
		if (!options.id) {
			this.setData({ billTime: dayjs().format('YYYY-MM-DD') });
			if (options.debtorId) {
				this.setData({ debtorId: options.debtorId });
			}
			if (wx.getStorageSync('extralPrice')) {
				this.setData({ billDetail: { ...this.data.billDetail, extralPrice: wx.getStorageSync('extralPrice') } });
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
				creator,
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
				creator: { ...creator, phone: `**${creator.phone.slice(-4)}` },
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
			const debtor =
				this.data.debtorNameList.find((v) => v.id == this.data.debtorId) || {};
			this.setData({ debtorName: debtor.debtorName });
		}
	},
	closeExtraDialog() {
		this.setData({
			extraDialogVisible: false,
		});
	},
	updateExtraName() {
		const arr = this.data.billDetail.extralPrice;
		arr[this.data.currentExtraIndex].name = this.data.currentExtraName;
		this.setData({
			billDetail: {
				...this.data.billDetail,
				extralPrice: arr,
			},
			extraDialogVisible: false,
			currentExtraIndex: '',
			currentExtraName: '',
		});
	},
	onTapImage(e) {
		const {
			currentTarget: {
				dataset: { index },
			},
		} = e;
		wx.previewImage({
			current: this.data.billPics[index], // 当前显示图片的http链接
			urls: this.data.billPics, // 需要预览的图片http链接列表
		});
	},
	onExtraNameInput(e) {
		const {
			detail: { value },
		} = e;
		this.setData({
			currentExtraName: value,
		});
	},
	onOpenExtraDialog(e) {
		const {
			target: {
				dataset: { index },
			},
		} = e;
		this.setData({
			currentExtraIndex: index,
			currentExtraName: this.data.billDetail.extralPrice[index].name,
			extraDialogVisible: true,
		});
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
				singlePrice: parseFloat(Number(value)).toFixed(2),
			},
		});
		this.computedTotalMoney();
	},
	onSinglePriceFocus(e) {
		const {
			detail: { value },
		} = e;
		if (value == 0) {
			this.setData({
				billDetail: {
					...this.data.billDetail,
					singlePrice: '',
				},
			});
		}
	},
	onExtraPriceFocus(e) {
		const {
			detail: { value },
			target: {
				dataset: { index },
			},
		} = e;
		const arr = [...this.data.billDetail.extralPrice];
		if (value == 0) {
			arr[index].value = '';
		}
		else {
			arr[index].value = parseFloat(Number(value)).toFixed(2);
		}
		this.setData({
			billDetail: { ...this.data.billDetail, extralPrice: arr },
		});
	},
	onTotalPriceFocus(e) {
		const {
			detail: { value },
		} = e;
		if (value == 0) {
			this.setData({
				billAmount: '',
			});
		}
	},
	onExtralPriceInput(e) {
		const {
			detail: { value },
			target: {
				dataset: { index },
			},
		} = e;
		const arr = [...this.data.billDetail.extralPrice];
		arr[index].value = parseFloat(Number(value)).toFixed(2);
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
		await this.getDebtorList();
		const debtor = this.data.debtorNameList.find(
			(v) => v.debtorName == this.data.addDebtorName,
		) || { debtorName: '', id: '' };
		this.setData({
			userDialogVisible: false,
			addDebtorName: '',
			debtorName: debtor.debtorName,
			debtorId: debtor.id,
		});
	},
	setDebtorVisible() {
		this.setData({ userDialogVisible: true });
	},
	computedTotalMoney() {
		const { singlePrice, mount, extralPrice } = this.data.billDetail;
		const result =
			singlePrice * mount +
			extralPrice.reduce((total, v) => {
				total += parseFloat(v.value);
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
			count: 3 - _this.data.billPics.length,
			success: async (res) => {
				const tempFilePaths = res.tempFilePaths;

				try {
					const results = await Promise.all(tempFilePaths.map((path) => uploadImagePromise(path, 'miniapp/userUpload/')));

					_this.setData({
						uploading: false,
						billPics: [..._this.data.billPics, ...results],
					});
				}
				catch (e) {
					wx.showToast({
						title: '图片上传失败，请重试',
						icon: 'none',
					});
					_this.setData({ uploading: false });
				}
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
						extralPrice: [
							...this.data.billDetail.extralPrice,
							{ name: '附加费', value: 0 },
						],
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
				label: '请设置总额',
				value: billAmount,
			},
		];
		return !requireList.some((v) => !this.validateEmpty(v, showToast));
	},
	onKeybordChange(e) {
		this.setData({
			keyboardOpen: true,
		});
	},
	onComputedAmoutInput(e) {
		const {
			detail: { value },
		} = e;
		if (value.split('.')[0].length > 9) {
			wx.showToast({
				title: '金额超出限制',
				icon: 'none',
			});
			this.setData({
				billAmount: 999999999,
			});
		}
		else {
			this.setData({
				billAmount: value,
			});
		}
	},
	onComputedAmoutBlur(e) {
		const {
			detail: { value },
		} = e;
		const { mount, extralPrice } = this.data.billDetail;
		const extralTotal = extralPrice.reduce((total, v) => {
			total += parseFloat(v.value);
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
		else if (result == 0 && extralTotal == 0) {
			this.setData({
				billAmount: result.toFixed(2),
				billDetail: {
					mount: 0,
					singlePrice: 0,
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
				billAmount: result.toFixed(2),
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
		wx.setStorage({
			key: 'extralPrice',
			data: this.data.billDetail.extralPrice.map((v) => { v.value = 0; return v; }),
		});
		wx.showToast({
			title: '账单创建成功',
			icon: 'success',
			success() {
				wx.navigateBack({});
			},
		});
	},
});
