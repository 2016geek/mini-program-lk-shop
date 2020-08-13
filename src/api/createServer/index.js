const host = 'https://www.hzliangke.com'
const createServer = (method, url) => {
	return (data) => {
		return new Promise((resolve, reject) => {
			if (method !== 'GET') {
				wx.showLoading({
					title: '请求中,请稍等',
				})
			}
			wx.request({
				url: host + url,
				method,
				data,
				header: {
					token:
						'eyJhbGciOiJIUzI1NiJ9.eyJVU0VSX0lEIjoxLCJpYXQiOjE1OTczMDUyNTIsImV4cCI6MTU5NzkxMDA1Mn0.VSjxdOw8v90qZSl5qXUgEMDdOpa8JAapN2olstqbZJk',
				},
				success(res) {
					wx.hideLoading()
					const {
						data,
						data: { statusCode, errorMsg },
					} = res
					if (statusCode === 0) {
						resolve(data)
					} else {
						wx.showToast({
							title: errorMsg,
							icon: 'none',
						})
						reject(Error(errorMsg))
					}
				},
				fail(e) {
					wx.hideLoading()
					reject(e)
				},
			})
		})
	}
}

export default createServer
