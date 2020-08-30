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
	},
});

