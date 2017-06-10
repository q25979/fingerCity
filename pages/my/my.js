//获取应用实例
var app = getApp()
Page({
	data: {
		tel: "138878545",
		animationData: {}, // 创建动画
		my: {
			msg: true,
			headPortrait: "../../resource/shoplist_03.jpg",
			nickname: "登录",
			li: [{
				src: "../../resource/msg.png",
				text: "消息"
			}, {
				src: "../../resource/carts.png",
				text: "购物车"
			}, {
				src: "../../resource/addr.png",
				text: "收货地址"
			}, {
				src: "../../resource/service.png",
				text: "联系客服"
			}, {
				src: "../../resource/enter.png",
				text: "申请入驻",
				myShow: true
			}, {
				src: "../../resource/manage.png",
				text: "管理店铺",
				myShow: false
			}]
		},
		showBtn: true
	},
	onLoad: function() {
		var that = this
    this.sendJudgeRequest()
		// 获取屏幕高度
		var systemInfo = wx.getSystemInfoSync()
		var wH

		wH = (750 * systemInfo.screenHeight) / systemInfo.screenWidth

		that.setData({
			"my.nickname": app.globalData.nickName,
			"my.headPortrait": app.globalData.avatarUrl,
			wH: wH
		})

		if (app.globalData.nickName == null) {
			that.setData({
				"my.nickname": "登录",
				"my.headPortrait": "../../resource/shoplist_03.jpg"
			})
		}
	},
	onShow: function() {
		// 判断是否开过店
		this.sendJudgeRequest()
	},

	// 发送请求看看是否开过店
	sendJudgeRequest: function() {
		var that = this
		wx.request({
			url: app.globalData.serviceUrl + "user_home",
			data: {
				"user_id": app.globalData.openid
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: "POST",
			success: function(res) {
        console.log(res.data)
				// 判断是否开过店 返回的长度大于2表示开过店
				if (JSON.stringify(res.data).length > 2) {
					that.setData({
						"my.li[4].myShow": false,
						"my.li[5].myShow": true,
						"shopData": res.data
					})
				}
				console.log(res.data)
			},
			fail: function(res) {
				console.log("请求失败" + res.errMsg)
			}
		})
	},
	loginTap: function() {
		var that = this

		wx.getUserInfo({
			fail: function() {
				console.log("登录失败")
			},
			success: function(res) {
				console.log(res)
				that.setData({
					"my.nickname": res.userInfo.nickName,
					"my.headPortrait": res.userInfo.avatarUrl
				})
			}
		})
	},
	// 页面隐藏时
	onHide: function() {
		this.animationFn(0)
	},
	myTap: function(e) {
		var index = e.currentTarget.dataset.idx
		var that = this
		var data = that.data.shopData

		this.animationFn(0)
		switch (index) {
			case 0: // 消息
				news()
				break;
			case 1: // 购物车
				carts()
				break;
			case 2: // 收货地址
				addr()
				break;
			case 3: // 联系客服
				service()
				break;
			case 4: // 申请入驻
				enter()
				break;
			case 5: // 管理店铺
				cart()
				break;
		}

		// 购物车
		function carts() {
			wx.navigateTo({
				url: "../index/carts/carts"
			})
		}

		// 消息
		function news() {
			/*wx.showModal({
				title: "暂无消息"
			})*/
			wx.navigateTo({
				url: "message/message"
			})
		}

		// 申请入驻
		function enter() {
			wx.navigateTo({
				url: "merchantsSettled/merchantsSettled"
			})
		}

		// 收货地址
		function addr() {
			wx.chooseAddress({
				fail: function(res) {
					console.log("失败" + res.Msg)
				},
				success: function(res) {
					console.log(res.userName) // 姓名
					console.log(res.postalCode) //邮编
					console.log(res.detailInfo) //详细地址
					console.log(res.telNumber) //电话号码
				}
			})
		}

		// 管理店铺
		function cart() {
			wx.navigateTo({
				url: "shopManagement/shopManagement?address=" + data.address + "&business_category=" + data.business_category + "&detaile_address=" + data.detaile_address + "&expired_days=" + data.expired_days + "&name=" + data.name + "&tel=" + data.tel + "&type=" + data.type + "&wechat=" + data.wechat
			})
		}

		// 联系客服
		function service() {
			that.animationFn(300 + "rpx")
			that.setData({
				showBtn: false
			})
		}
	},
	// 设置客服动画
	animationFn: function(value) {
		var that = this
			// 创建动画
		var animation = wx.createAnimation({
			duration: 400,
			timingFunction: "ease"
		})

		that.animation = animation

		animation.height(value).step()

		that.setData({
			animationData: animation.export()
		})
	},
	// 右上角转发
	onShareAppMessage: function() {
		console.log("转发")
	},
	// 对话框
	dialogTap: function(e) {
		var idx = e.currentTarget.dataset.idx
		var that = this

		switch (idx) {
			case "0": // 联系电话
				contactTel()
				break;
			case "1": // 联系微信
				wxMsg()
				break;
			case "2": // 取消对话框
				cancel()
				break;
		}

		// 联系电话
		function contactTel() {
			wx.makePhoneCall({
				phoneNumber: that.data.tel,
			})
		}

		// 联系微信
		function wxMsg() {}

		// 取消
		function cancel() {
			that.animationFn(0)
			setTimeout(function() {
				that.setData({
					showBtn: true
				})
			}, 400)
		}
	},
	backgroundTap: function() {
		var that = this

		that.animationFn(0)
		setTimeout(function() {
			that.setData({
				showBtn: true
			})
		}, 400)
	}
})