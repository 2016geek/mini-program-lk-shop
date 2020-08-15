const host = 'https://www.hzliangke.com';
const createServer = (method, url) => {
	return (data, routerParams) => {
		const reg = new RegExp('\{(((?!\}).)*)\}', 'g');
		const newUrl = url.replace(reg, (match) => {
			return routerParams[match.replace(/[{}]/g, '')] || match;
		});
		return new Promise((resolve, reject) => {
			if (method !== 'GET') {
				wx.showLoading({
					title: '请求中,请稍等',
				});
			}
			wx.request({
				url: host + newUrl,
				method,
				data,
				header: {
					token:
						'eyJhbGciOiJIUzI1NiJ9.eyJVU0VSX0lEIjoxLCJpYXQiOjE1OTczMDUyNTIsImV4cCI6MTU5NzkxMDA1Mn0.VSjxdOw8v90qZSl5qXUgEMDdOpa8JAapN2olstqbZJk',
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
