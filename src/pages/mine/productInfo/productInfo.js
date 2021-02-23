import api from 'api';
import dayjs from 'vendor/dayjs';
import { computedCraft, computedRope } from '../../../utils/order';

Page({
	data: {
		data: {},
		loading: true,
	},
	onLoad: function (options = {}) {
		const { id } = options;
		if (id) {
			this.getOrderDetail(id);
		} else {
			wx.showModal({
				title: '提示',
				content: '订单ID错误',
				showCancel: false,
				confirmText: '确定',
				confirmColor: '#3CC51F',
				success: (result) => {
					if (result.confirm) {
						wx.navigateBack({
							delta: 1
						});
					}
				}
			});
		}
	},
	async getOrderDetail(id) {
		const res = await api.user.getOrderDetail(id)();
		res.createTime = dayjs(res.createTime).format("YYYY-MM-DD");
		res.weight = res.weight / 1000;
		res.extraCraft = res.extraCraft ? computedCraft(JSON.parse(res.extraCraft)) : "--";
		res.rope = res.rope ? computedRope(JSON.parse(res.rope)) : '--';
		this.setData({
			loading: false,
			data: res
		})
	},
})
