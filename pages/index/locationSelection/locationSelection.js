//获取应用实例
var app = getApp()

Page({
	data: {
		list: [{
			position: "福建龙岩XX区",
			lon: "117.107500",
			lat: "25.075100"
		}, {
			position: "福建龙岩XX区",
			lon: "117.107102",
			lat: "25.075120"
		}, {
			position: "福建龙岩新罗区",
			lon: "117.107537",
			lat: "25.075123"
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