import dayjs from 'dayjs';

const defaultInfo = {
	statusBarHeight: 20,
	titleBarHeight: 44,
	totalTopHeight: 64,
	windowWidth: 375,
	windowHeight: 650,
	pixelRatio: 2,
};

export function emailValidate(value) {
	return /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/.test(
		value,
	);
}
export function mountFont(money) {
	const length = money.toString().length;
	if (length < 7) {
		return 'font-size:48rpx;';
	}
	else {
		return 'font-size:' + (48 - (length - 6) * 6) + 'rpx';
	}
}
export const numberLabel = (num = 0) => {
	// const NUMBER = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	// return NUMBER.format(num);
	function addFloatPoint(number) {
		const [_, float] = number.toFixed(2).split('.');
		return `.${float}`;
	}
	function addThousands(number) {
		let num = parseInt(number);
		let result = '';
		let counter = 0;
		num = (num || 0).toString();
		for (var i = num.length - 1; i >= 0; i--) {
			counter++;
			result = num.charAt(i) + result;
			if (!(counter % 3) && i != 0) {
				result = ',' + result;

			}
		}
		return result;
	}
	return addThousands(num) + addFloatPoint(num);
};

export const timeLabel = (time, type = 'year', custom = '') => {
	if (type === 'year') return dayjs(time).format('YYYY年MM月DD日');
	else if (type === 'month') return dayjs(time).format('YYYY年MM月');
	else if (type === 'day') return dayjs(time).format('YYYY.MM.DD');
	else if (type === 'custom') return dayjs(time).format(custom);
};

export function getMenuButtonInfo() {
	const defaultValue = {
		top: 28,
		height: 32,
		width: 87,
		bottom: 58,
		left: 278,
		right: 365,
	};
	if (!getApp().menuButtonInfo) {
		try {
			getApp().menuButtonInfo = wx.getMenuButtonBoundingClientRect();
			// 即使调用成功，数据返回仍然可能存在问题
			const keysList = Object.keys(getApp().menuButtonInfo);
			if (keysList.length) {
				keysList.forEach((key) => {
					if (!getApp().menuButtonInfo[key] && defaultValue[key]) {
						getApp().menuButtonInfo[key] = defaultValue[key];
					}
				});
			}
			else {
				getApp().menuButtonInfo = null;
			}
		}
		catch (e) {
			getApp().menuButtonInfo = null;
		}
	}
	return getApp().menuButtonInfo || defaultValue;
};

export function getSystemInfo() {
	if (!getApp()) {
		return defaultInfo;
	}
	if (getApp().titleBarInfo) {
		return getApp().titleBarInfo;
	}
	try {
		const systemInfo = (wx && wx.getSystemInfoSync()) || {};
		const {
			statusBarHeight, model, version, system, pixelRatio,
			windowWidth, windowHeight, brand, screenWidth, environment,
		} = systemInfo;
		let isIphoneX = false;
		const isCustomTitle = version && version.slice(0, 5) >= '6.6.0';
		if (model.indexOf('iPhone X') !== -1) {
			isIphoneX = true;
		}
		const { height } = getMenuButtonInfo();
		const titleBarHeight = height ? height + 12 : 46;
		getApp().titleBarInfo = {
			...systemInfo,
			statusBarHeight,
			titleBarHeight,
			searchBarHeight: 40,
			totalTopHeight: titleBarHeight + statusBarHeight,
			isIphoneX,
			pixelRatio,
			isCustomTitle, // 是否可以自定义标题
			isIos: system.includes('iOS'),
			windowWidth,
			windowHeight,
			screenWidth,
			brand: brand && brand.toLowerCase(),
			environment,
		};
		return getApp().titleBarInfo;
	}
	catch (e) {
		return defaultInfo;
	}
}

export const createCountDown = () => {
	let currentKey = null;
	return (toDo, time = 1000) => {
		const countDown = (key) => {
			const timer = setTimeout(() => {
				const res = toDo && toDo();
				clearTimeout(timer);
				if (res === false) return;
				if (key !== currentKey) return;
				countDown(key);
			}, time);
		};
		const key = Symbol('countDown');
		currentKey = key;
		countDown(key);
	};
};
