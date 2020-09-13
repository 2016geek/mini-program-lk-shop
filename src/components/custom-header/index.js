import { getSystemInfo } from '../../utils/util';

Component({
	properties: {
		useBack: {
			type: Boolean,
			value: false,
		},
		useSetting: {
			type: Boolean,
			value: false,
		},
		useClose: {
			type: Boolean,
			value: false,
		},
		/** 是否需要占位 */
		usePlace: {
			type: Boolean,
			value: false,
		},
		background: {
			type: String,
			value: '',
		},
	},
	data: {
		titleBarHeight: 0,
		statusBarHeight: 0,
		quitVisible: false,
	},
	created() {
		wx.nextTick(() => {
			const { titleBarHeight, statusBarHeight } = getSystemInfo();
			this.setData({ titleBarHeight, statusBarHeight });
		});
	},
	methods: {
		onSettingTap() {
			wx.navigateTo({
				url: '/pages/setting/setting',
			});
		},
		onBackTap() {
			wx.navigateBack();
		},
		onCloseTap() {
			this.setData({ quitVisible: true });
		},
		onQuitConfirm() {
			this.setData({ quitVisible: false });
			getApp().globalData.requestHeaders = {};
			getApp().globalData.isCooperate = false;
			wx.navigateTo({
				url: '/pages/bill/list/index',
			});
		},
		onQuitCancel() {
			this.setData({ quitVisible: false });
		},
	},
});

