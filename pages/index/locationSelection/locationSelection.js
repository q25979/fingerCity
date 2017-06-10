//获取应用实例
var app = getApp()

Page({
	data: {
		list: [{
			position: "福建厦门",
			lon: "54.301412",
			lat: "24.112012"
		}, {
			position: "福建福州",
			lon: "23.412012",
			lat: "15.212410"
		}, {
			position: "福建龙岩",
			lon: "45.301210",
			lat: "23.501215"
		}]
	},

	// 右上角转发
	onShareAppMessage: function() {},

	// 选择定位
	selectionTap: function(e) {
		var index = e.currentTarget.dataset.index

		app.globalData.lon = this.data.list[index].lon
		app.globalData.lat = this.data.list[index].lat

		wx.switchTab({
			url: '/pages/index/index'
		})
	}
})