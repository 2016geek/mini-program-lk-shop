const host = 'http://www.hzliangke.com:8081'
const createServer = (method, url) => {
	return (data) => {
		return new Promise((resolve, reject) => {
			wx.request({
				url: host + url,
				method,
				data,
				header: {
					token:
						'eyJhbGciOiJIUzI1NiJ9.eyJVU0VSX0lEIjoxLCJpYXQiOjE1OTY2MTUwMDksImV4cCI6MTU5NzIxOTgwOX0.gpf9XsNhi4kiKn44ySrSJNHOl4ejpkvxkQbY2Aus-c4',
				},
				success(res) {
					resolve(res.data)
				},
				fail(e) {
					reject(e)
				},
			})
		})
	}
}

export default createServer
