import { emailValidate } from '../../utils/util';
import api from '../../api';

const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		billChecked: false,
		emailChecked: false,
		email: '',
	},
	onShow: async function () {
		this.setData({ billChecked: app.globalData.isFinishedPaid });
		const { mailAddress, receiveMail } = await api.setting.getEmail();
		this.setData({ emailChecked: !!receiveMail, email: mailAddress });
	},
	onShare() {
		wx.navigateTo({
			url: '/pages/setting/share/share',
		});
	},
	onBillChanged(event) {
		const {
			detail: { value },
		} = event;
		this.setData({ billChecked: value });
		app.setIsFinishedPaid(value);
	},
	onEmailChanged(event) {
		this.setData({ emailChecked: event.detail.value });
	},
	onEmailInput(event) {
		this.setData({ email: event.detail.value });
	},
	onEmailConfirm() {
		console.log('fsd');
		if (this.data.email) {
			if (this.validate()) {
				api.setting.setEmail({
					mailAddress: this.data.email,
					receiveMail: +this.data.emailChecked,
				});
				wx.showToast({
					title: '邮箱修改成功',
					icon: 'success',
				});
			}
			else {
				wx.showToast({
					title: '邮箱格式不符合要求',
					icon: 'none',
				});
			}
		}
	},
	validate() {
		return emailValidate(this.data.email);
	},
});
