// src/pages/bill/export/list/list.js
import api from '../../../../api';
import dayjs from '../../../../vendor/dayjs';
import { numberLabel, mountFont } from '../../../../utils/util'
	;
import { extraLabel } from '../../../../utils/bill';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		id: '',
		list: [],
		debtorName: '',
		accrualTime: '',
		totalBillAmount: '',
		fileUrl: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.hideShareMenu({
			menus: ['shareAppMessage', 'shareTimeline'],
		});
		const { id } = options;
		this.setData({
			id,
		});
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
		const result = await api.bill.getAccrualDetail({}, {
			id: this.data.id,
		});
		const { userBillDTOList, debtorName, accrualTime, totalBillAmount, fileUrl } = result;
		const filterList = userBillDTOList.map((v) => {
			v.billPics = JSON.parse(v.billPics);
			v.billAmountStyle = mountFont(v.billAmount);
			v.billAmount = numberLabel(v.billAmount);
			v.billTime = dayjs(v.billTime).format('M[月]D[日]');
			v.billDetail = extraLabel(v.billDetail);
			return v;
		});
		this.setData({
			list: filterList,
			fileUrl,
			debtorName,
			accrualTime: dayjs(accrualTime).format('M[月]D[日]'),
			totalBillAmount: numberLabel(totalBillAmount),
		});
	},
	onTapImage(e) {
		const { currentTarget: { dataset: { index } } } = e;
		wx.previewImage({
			current: this.data.list[index].billPics[0], // 当前显示图片的http链接
			urls: this.data.list[index].billPics, // 需要预览的图片http链接列表
		});
	},
	copyTable() {
		console.log(this.data.fileUrl);
		wx.downloadFile({
			url: 'https://hzliangke.oss-cn-hangzhou.aliyuncs.com/bill_accrual/%E5%AE%A2%E6%88%B7%E8%B4%A6%E5%8D%95%E6%98%8E%E7%BB%862020-09-01_202009012111272515.xlsx',
			success: function (res) {
				const filePath = res.tempFilePath;
				wx.openDocument({
					filePath: filePath,
					fileType: 'xlsx',
					success: function (res) {
					},
				});
			},
		});
	},
	savePic() {
		wx.navigateTo({
			url: '/pages/bill/export/webview/webview?id=' + this.data.id,
		});
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
});
