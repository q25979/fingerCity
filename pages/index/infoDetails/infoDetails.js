Page({
	data: {
		images: [{
			"image": '../../../resource/shoplist_03.jpg'
		}],
		title: "",
		tel: "",
		data: "",
		content: "",
		btn: "立即联系"
	},
	// 右上角转发
	onShareAppMessage: function() {},
	onLoad: function(e) {
		var img
		var that = this

		// 判断图片是否存在
		img = (e.images == "undefined") ? this.data.images : JSON.parse(e.images)

		this.setData({
			title: e.title,
			tel: e.tel,
			data: e.data,
			content: e.content,
			images: img
		})
	},
	// 立即联系
	btnTap: function() {
		var tel = this.data.tel
		wx.makePhoneCall({
			phoneNumber: tel
		})
	}
})