var imgCount = 0
var imgSrc = []

var app = getApp()
Page({
	data: {
		img: [],
		infoType: "",
		type: 0,
		area_id: 0,
		url: "",
		user_id: "",
	},
	// 右上角转发
	onShareAppMessage: function() {},
	onLoad: function(e) {
    console.log(app.globalData)
		console.log(e)
		this.setData({
			infoType: e.idx,
			type: e.type,
			area_id: app.globalData.areaId,
			url: app.globalData.serviceUrl,
			user_id: app.globalData.openid,
			imgUrl: app.globalData.serviceUrl + "serve_uploadimage"
		})
	},
	removePic: function(e) {
		// console.log(e.target.id)
		var img = this.data.img
			// console.log(img)
		img.splice(e.target.id, 1)
		this.setData({
			img: img
		})
	},
	upload: function() {
		var that = this
		var imgCount = 0
		var imgSrc = []
		var img = this.data.img
		console.log(img)
		var length = img.length
		if (length == 0) {} else {
			imgSrc = img
			imgCount = length
		}
		// 选择图片
		wx.chooseImage({
			success: function(res) {
        var length = res.tempFilePaths.length
        if(length == 1){
				var tempFilePaths = res.tempFilePaths
				imgSrc[imgCount++] = tempFilePaths[0]
        }else
        {
          for(var i = 0;i<length;i++)
          {
            imgSrc[imgCount++] = res.tempFilePaths[i]
          }
        }
        console.log(imgSrc)
        that.setData({
          img: imgSrc
        })
			},
			fail: function() {
				console.log("上传失败")
			}
		})
	},
	// 清除图片
	delImg: function() {
		imgSrc = []
		imgCount = 0
		this.setData({
			img: []
		})
	},
	// 清空数据
	resetTap: function(res) {
		this.delImg()
	},
	// 发送请求
	sendRequest: function(url, e) {
		var that = this
		var val = e.detail.value

		wx.showLoading({
			title: "发布中..."
		})

		wx.request({
			url: url,
			data: {
				"area_id": that.data.area_id, // 区域id
				"serve_category": that.data.infoType, // 发送信息服务类别
				"type": that.data.type, // 列表键
				"user_id": that.data.user_id, // 用户id
				"title": val.title, // 发送的标题
				"content": val.content, // 发送的内容
				"tel": val.tel, // 发送的电话
			},
			method: "POST",
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: function(res) {
        console.log(res.data)
				var img = that.data.img
        console.log(img)
				var length = img.length
				for (var i = 0; i < length; i++) {
					//这种方式采用循环上传的方式。
					wx.uploadFile({
						url: that.data.imgUrl,
						filePath: img[i],
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						formData: {
							"id": res.data, //此处ID取用户ID，后台在接收图片的时候多接这个值，用于区分是哪个用户发布的图片
							"serve_category": that.data.infoType
						},
						name: 'image', //后台接收的键值
						success: function(res) {
							var data = res.data
							console.log("sucess:" + data)
								//do something
						}
					})
				}

				wx.hideLoading()
				wx.showToast({
					title: "发布成功",
					success: function() {
						setTimeout(function() {
							wx.navigateBack()
								// 清除数据
							that.resetTap()
						}, 1000)
					}
				})

				// console.log("数据发送成功")
			},
			fail: function(res) {
				console.log("请求失败")
			}
		})
	},
	// 发送数据
	formSubmit: function(e) {
		var that = this
		var val = e.detail.value

		// 进行表单验证
		// 标题
		if (val.title == "") {
			noAdopt("标题不能为空")
			return false
		}
		if (val.tel == "") {
			noAdopt("电话号码不能为空")
			return false
		}
		if (val.content == "") {
			noAdopt("发送内容不能为空")
			return false
		}
		if (that.data.img.length > 9) {
			noAdopt("发送的图片不能大于9张")
			return false
		}

		// 表单验证不通过
		function noAdopt(title) {
			wx.showToast({
				title: title,
				image: "../../res/warning.png",
				duration: 1200,
				mask: true
			})
		}

		// console.log(e.detail.value)
		// console.log(this.data)

		// 发送请求
		that.sendRequest(that.data.url + "release_serve", e)
			// that.sendImg(that.data.url + "release_serve")
	}
})