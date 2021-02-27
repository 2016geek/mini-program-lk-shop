import api from 'api';
import { intervalTime } from 'utils/util';

let time = null;

Page({
	data: {
		data: {},
		loading: true,
		timeLine: [
			{ text: '创建订单', status: 0, activeIcon: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/lk-shop-miniprogram/orderDetail/%F0%9F%94%B6%20Icon%402x.png' },
			{ text: '待服务', status: 2, activeIcon: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/lk-shop-miniprogram/orderDetail/%F0%9F%94%B6%20Icon%402x(4).png' },
			{ text: '合同签订', status: 3, icon: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/lk-shop-miniprogram/orderDetail/%F0%9F%94%B6%20Icon%402x(2).png', activeIcon: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/lk-shop-miniprogram/orderDetail/%F0%9F%94%B6%20Icon%402x%E7%9A%84%E5%89%AF%E6%9C%AC.png' },
			{ text: '制作交付', status: 4, icon: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/lk-shop-miniprogram/orderDetail/%F0%9F%94%B6%20Icon%402x(3).png', activeIcon: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/lk-shop-miniprogram/orderDetail/%F0%9F%94%B6%20Icon%402x%20(1).png' },
			{ text: '交付完成', status: 5, icon: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/lk-shop-miniprogram/orderDetail/%F0%9F%94%B6%20Icon%402x(1).png', activeIcon: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/lk-shop-miniprogram/orderDetail/%F0%9F%94%B6%20Icon%402x%20(2).png' },
		],
		minute: 0,
		second: 0,
		traceList: [],
	},
	onLoad: function (options = {}) {
		const { id } = options;
		if (id) {
			this.getOrderDetail(id);
		}
		else {
			wx.showModal({
				title: '提示',
				content: '订单ID错误',
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#3CC51F',
				success: (result) => {
					if (result.confirm) {
						wx.navigateBack({
							delta: 1,
						});
					}
				},
			});
		}
	},
	onHide() {
		time && clearInterval(time);
	},
	async getOrderDetail(id) {
		const res = await api.user.getOrderDetail(id)();
		this.setData({
			loading: false,
			data: res,
		});
		res.status === 2 && this.getCountDown(res.createTime);
		res.status >= 4 && this.getTraceList(id);
	},
	makePhone() {
		wx.makePhoneCall({
			phoneNumber: '15869017168',
		});
	},
	async getTraceList(id) {
		const res = await api.user.getTraceList(id)();
		this.setData({
			traceList: res,
		});
	},
	intervalCountDown() {
		time = setInterval(() => {
			const { minute, second } = this.data;
			if (minute === 0 && second === 0) {
				clearInterval(time);
				this.setData({
					minute: 0,
					second: 0,
				});
				return;
			}
			this.setData({
				minute: second - 1 < 0 ? minute - 1 : minute,
				second: second - 1 < 0 ? 59 : second - 1,
			});
		}, 1000);
	},
	getCountDown(time) {
		const deadlineTime = time + 30 * 60 * 1000;
		const nowTim = new Date().getTime();
		if (nowTim >= deadlineTime) return;
		const { minute, second } = intervalTime(nowTim, deadlineTime);
		this.setData({
			minute, second,
		}, () => this.intervalCountDown());
	},
	navigateToInfo() {
		wx.navigateTo({
			url: `/pages/mine/productInfo/productInfo?id=${this.data.data.orderId}`,
		});
	},
});
