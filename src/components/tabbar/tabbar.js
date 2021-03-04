Component({
	properties: {
		selectIndex: {
			type: Number,
			value: 0,
		},
	},
	data: {
		data: {
			"color": "#7E80A3",
			"selectedColor": "#3432C1",
			"borderStyle": "white",
			"backgroundColor": "#FFFFFF",
			"list": [{
				"pagePath": "/pages/tabs/customMade/customMade",
				"text": "定制",
				"iconPath": "/images/tabs/home-icon.png",
				"selectedIconPath": "/images/tabs/home-active-icon.png"
			},
			{
				"pagePath": "/pages/tabs/mine/mine",
				"text": "我的",
				"iconPath": "/images/tabs/mine-icon.png",
				"selectedIconPath": "/images/tabs/mine-active-icon.png"
			}
			]
		}
	},
	methods: {
		changeTabbarSelect(e) {
			const { index } = e.currentTarget.dataset;
			const pagePath = this.data.data.list[index].pagePath;
			wx.switchTab({ url: pagePath });
		}
	},
});
