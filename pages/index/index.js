//index.js
//获取应用实例
var app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
var bannerImg = "https://pipi.ihyou.cn/Street/images_home/1/"

Page({
	data: {
		homeUrl: "",
		bannerImg: [bannerImg + "0.jpg", bannerImg + "1.jpg", bannerImg + "2.jpg"],
		target: [],
		current: 0,
		latitude: 0,
		longitude: 0,
		openid: null,
		region: "定位中...",
		navUl: [{
			bgColor: ["#FA7070", "#77AFFE", "#9ADD55", "#FEAE47"],
			src: ["res/food.png", "res/clothing.png", "res/shop.png", "res/store.png"],
			text: ["美食", "服饰鞋包", "商超", "好店"]
		}, {
			bgColor: ["#FFAF48", "#77AFFE", "#FD9162", "#5FD3E0"],
			src: ["res/service.png", "res/job.png", "res/lease.png", "res/2hand.png"],
			text: ["生活服务", "招聘求职", "房屋售租", "二手买卖"]
		}]
	},
	onLoad: function(res) {
		var that = this

		this.setData({
			homeUrl: app.globalData.serviceUrl + "home",
		})

		// 获取经纬度
		wx.getLocation({
			type: "gcj02",
			success: function(res) {
				that.setData({
					latitude: res.latitude,
					longitude: res.longitude,
				})

				// 把经纬度返回全局
				app.globalData.lat = res.latitude
				app.globalData.lon = res.longitude

				// 登录
				wx.login({
					success: function(res) {
						if (res.code) {
              that.sendRequest(res.code)
						} else {
							console.log("用户登录获取失败" + res.errMsg)
						}

						//获取用户信息
						wx.getUserInfo({
							withCredentials: false,
							success: function(res) {
								var userInfo = res.userInfo

								app.globalData.nickName = userInfo.nickName
								app.globalData.avatarUrl = userInfo.avatarUrl
							},
							fail: function() {
								console.log("请求失败")
							}
						})
					}
				})
			},
			fail: function() {
				console.log("定位fail")
			}
		})
	},
	// 发送请求
	sendRequest: function(js_code) {
		var that = this

		// 给后台发送数据
		wx.request({
			url: that.data.homeUrl,
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: "POST",
			data: {
				lon: that.data.longitude,
				lat: that.data.latitude,
        js_code: js_code
			},
			success: function(res) {
        console.log(res.data)
        app.globalData.openid = res.data.user_id
				// 将json字符串转为json对象
				var img0 = JSON.parse(res.data.image_json0)
				var img1 = JSON.parse(res.data.image_json1)
				var img2 = JSON.parse(res.data.image_json2)
				that.setData({
          openid:res.data.user_id,
					region: res.data.area_name,
					bannerImg: [
						img0.path,
						img1.path,
						img2.path
					],
					target: [
						img0.target,
						img1.target,
						img2.target
					]
				})
				app.globalData.areaId = res.data.area_id

				var indexCnt = res.data.blank_content

				// 解析富文本编辑器的内容
				WxParse.wxParse('indexCnt', 'html', indexCnt, that, 5)
			},
			fail: function(res) {
				console.log("index请求失败" + res.errMsg)
			}
		})
	},
	showList: function(e) {
		var index = e.currentTarget.dataset.idx

		wx.navigateTo({
			url: '../index/show/show?id=' + index
		})
	},
	// 轮播图跳转
	bannerTap: function(e) {
		var index = e.currentTarget.dataset.idx

		// 设置缓存
		wx.setStorageSync('target', this.data.target)

		// console.log(index)
		wx.navigateTo({
			url: "banner/banner?id=" + index
		})
	},
	bannerChange: function(e) {
		this.setData({
			current: e.detail.current
		})
	},
	positionTap: function() {
		console.log("定位系统")
	},
	// 右上角转发
	onShareAppMessage: function() {
		console.log("转发")
	}
})