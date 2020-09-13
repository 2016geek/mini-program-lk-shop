const host = 'https://www.hzliangke.com';
let tempLoginPromise = null;
export const clearPromise = () => {
	tempLoginPromise = null;
};
const login = () => {
	return new Promise((resolve, reject) => {
		wx.login({
			async success(res) {
				const app = getApp();
				if (res.code) {
					try {
						app.globalData.code = res.code;
						wx.request({
							url: host + '/accountbook/rest/user/v1/login',
							method: 'POST',
							data: {
								code: res.code,
							},
							success(res) {
								const {
									data: { result },
								} = res;
								const { token } = result || {};
								if (!token) {
									wx.navigateTo({
										url: '/pages/guide/welcome/welcome',
									});
									reject(res);
									return;
								}
								app.globalData.token = token;
								app.globalData.userInfo = result;
								resolve(token);
							},
							fail(e) {
								wx.navigateTo({
									url: '/pages/guide/welcome/welcome',
								});
								reject(e);
							},
						});
					}
					catch (data) {
						reject(data);
					}
				}
			},
		});
	});
};
const createLogin = () => {
	if (tempLoginPromise) return tempLoginPromise;
	tempLoginPromise = (async () => {
		const res = await login();
		return res;
	})();
	return tempLoginPromise;
};
const createServer = (method, url, isNeedLogin = true, showToast = true) => {
	return async (data, routerParams) => {
		const reg = new RegExp('{(((?!}).)*)}', 'g');
		const newUrl = url.replace(reg, (match) => {
			return routerParams[match.replace(/[{}]/g, '')] || match;
		});
		if (isNeedLogin) {
			await createLogin();
		}
		return new Promise((resolve, reject) => {
			if (method !== 'GET' && showToast) {
				wx.showLoading({
					title: '请求中,请稍等',
				});
			}
			const requestHeaders = getApp().globalData.requestHeaders;
			const allData = {
				shareUserId: requestHeaders.userId,
				shareTime: requestHeaders.shareTime,
				...data,
			};
			wx.request({
				url: host + newUrl,
				method,
				data: getApp().globalData.isCooperate ? allData : data,
				header: {
					token: getApp().globalData.token,
				},
				success(res) {
					wx.hideLoading();
					const { data } = res || {};
					const { statusCode, errorMsg, result } = data;
					if (statusCode === 0) {
						resolve(result);
					}
					else {
						wx.showToast({
							title: errorMsg,
							icon: 'none',
						});
						reject(data);
					}
				},
				fail(e) {
					wx.hideLoading();
					reject(e);
				},
			});
		});
	};
};

export default createServer;
