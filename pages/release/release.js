//获取应用实例
var WxParse = require('../../wxParse/wxParse.js')
var app = getApp()
Page({
	data: {
		tab: {
			currentTab: 0,
			title: ["普通发布", "商家发布"],
			btn: ["发布公告", "添加产品"],
			src: ["../res/shfw.png", "../res/qzzp.png", "../res/fwcz.png", "../res/esmm.png"],
			li: ["生活服务", "招聘求职", "房屋租售", "二手买卖"]
		}
	},
	// 加载
	onLoad: function() {
		// app.globalData.serviceUrl
		this.setData({
			requestUrl: app.globalData.serviceUrl + "get_blankspace_release"
		})
	},
	// 加载之后的
	onShow: function() {
		var that = this

		wx.request({
			url: this.data.requestUrl,
			data: {
				content_type: "release"
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: "POST",
			success: function(res) {
        console.log(res.data)
				var releaseCnt = res.data.content

				// 解析富文本编辑器的内容
				WxParse.wxParse('releaseCnt', 'html', releaseCnt, that, 0)
			}
		})
	},
	// 点击切换
	swichTab: function(e) {
		var that = this
		var index = e.currentTarget.dataset.current
		console.log(index)

		if (this.data.currentTab === index) {
			return false
		} else {
			that.setData({
				"tab.currentTab": index
			})
		}
	},
	// 滑动却换
	swichChange: function(e) {
		var that = this
		var index = e.detail.current

		that.setData({
			"tab.currentTab": index
		})
	},
	// 普通发布
	releaseTap: function(e) {
		var idx = e.currentTarget.dataset.idx

		wx.navigateTo({
			url: 'generalRelease/generalRelease?idx=' + idx
		})
	},
	// 商家发布
	releaseProduct: function() {
		wx.navigateTo({
			url: '../my/manageCommodity/manageCommodity'
		})
	},
	// 右上角转发
	onShareAppMessage: function() {
		console.log("转发")
	}
})