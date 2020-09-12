// src/pages/setting/share/share.js
import api from '../../../api';

const app = getApp();;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isOpen: true,
		dayList: [
			{
				label: '1天',
				value: '1',
			},
			{
				label: '7天',
				value: '7',
			},
			{
				label: '30天',
				value: '30',
			},
		],
		choseDay: '1',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
		const result = await api.setting.getSetting();
		const isOpenObj = result.find((v) => v.settingKey === 'COLLABORATION_SWITCH') || { settingKey: 'COLLABORATION_SWITCH', settingValue: 'Y' };
		const daysObj = result.find((v) => v.key === 'COLLABORATION_VALIDITY') || { settingKey: 'COLLABORATION_VALIDITY', settingValue: 1 };
		this.setData({
			isOpen: isOpenObj.settingValue === 'Y',
			choseDay: daysObj.settingValue,
		});
	},
	onOpenChanged(event) {
		const {
			detail: { value },
		} = event;
		this.setData({ isOpen: value });
		api.setting.setSetting({ settingKey: 'COLLABORATION_SWITCH', settingValue: value ? 'Y' : 'N' });
	},
	onChoseDay(e) {
		const { currentTarget: { dataset: { value } } } = e;
		this.setData({
			choseDay: value,
		});
		api.setting.setSetting({ settingKey: 'COLLABORATION_VALIDITY', settingValue: value });
	},
	onShareAppMessage: function () {
		const { userId, nickname, portrait } = app.globalData.userInfo;
		return {
			path: `/pages/bill/list/index?userId=${userId}&nickname=${nickname}&portrait=${portrait}&shareTime=${new Date().getTime()}`,
			imageUrl: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/miniapp/local/setting/sharePIc%402x.jpg',
			title: `邀请您协作账本，有效期${this.data.dayList.find((v) => v.value === this.data.choseDay).label}`,
		};
	},
});
