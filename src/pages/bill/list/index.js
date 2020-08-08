import { BillStatusMap } from '../../../utils/bill'

Page({
	data: {
		userInfo: {
			sum: '100.00',
			settle: '59.60',
			unsettle: '40.40',
		},
		billList: [
			{
				billAmount: 300000,
				billName: '张东升的账单',
				billPics: '',
				billTime: '2020.7.2',
				debtorName: '张东升',
				id: 1,
				settlementAmount: 12,
				status: 1,
			},
			{
				billAmount: 10130.2,
				billName: 'ZHENY的账单',
				billPics: '',
				billTime: '2020.7.1',
				debtorName: 'ZHENY',
				id: 2,
				settlementAmount: 9,
				status: 3,
			},
		],
	},
	onItemTap() {
		wx.navigateTo({
			url: '/pages/bill/account/list/index',
		})
	},
	onAddBill() {
		wx.navigateTo({
			url: '/pages/billEdit/billEdit',
		})
	},
	onSettingTap() {
		wx.navigateTo({
			url: '/pages/setting/setting',
		})
	},
})
