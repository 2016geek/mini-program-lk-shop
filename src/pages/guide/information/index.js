import api from '../../../api';
import { clearPromise } from '../../../api/createServer/index'
	;

const app = getApp();

Page({
	data: {
		info: {
			title: '您所属的行业？',
			desc: '请选择您的行业，以便获得最佳体验',
		},
		selections: [
			{ value: '1', label: '烫金' },
			{ value: '2', label: 'UV' },
			{ value: '3', label: '丝网印' },
			{ value: '4', label: '对裱' },
			{ value: '5', label: '盖光' },
			{ value: '6', label: '上光' },
			{ value: '7', label: '糊袋' },
			{ value: '8', label: '糊信封' },
			{ value: '9', label: '其他' },
		],
		selected: false,
	},
	onTapSelectItem(e) {
		const { selections = [] } = this.data;
		const { item = {} } = e.currentTarget.dataset;
		const newSelections = selections.map((i) => {
			const isSet = i.value === item.value;
			return isSet ? { ...i, selected: !i.selected } : i;
		});
		this.setData({
			selections: newSelections,
			selected: newSelections.some((v) => v.selected),
		});
	},
	onUse() {
		if (!this.data.selected) {
			wx.showToast({
				title: '您需要至少选择一个行业',
				icon: 'none',
			});
		}
	},
	async login(data) {
		let _this = this;
		if (!data.detail.iv || !data.detail.encryptedData) {
			wx.showToast({
				title: '您需要先授权才能访问',
				icon: 'none',
			});
			return;
		}
		wx.login({
			async success(res) {
				if (res.code) {
					try {
						const { detail: {
							encryptedData,
							iv,
						} } = data;
						const { token, ...useInfo } = await api.user.login({
							encryptedData,
							iv,
							code: res.code,
							labels: JSON.stringify(_this.data.selections),
						});
						app.globalData.token = token;
						app.globalData.userInfo = useInfo;
						console.log('userInfo', useInfo);
						clearPromise();
						wx.reLaunch({
							url: '/pages/bill/list/index',
						});
					}
					catch (data) {
						console.log(data);
						// wx.navigateTo({
						// 	url: '/pages/guide/welcome/welcome',
						// });
					}
				}
			},
		});

	},
});
