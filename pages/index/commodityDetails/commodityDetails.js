//导入富文本js文件
var WxParse = require('../../../wxParse/wxParse.js')

Page({
	data: {
		src: "../../../resource/shoplist_03.jpg",
		title: "商品名称",
		price: "0",
		num: "0",
		detailsContent: "这商品详情,这商品详情这商品详情这商品详情",
		commodityList: {
			sumPrice: 0,
			sumNum: 0
		}
	},
	// 右上角转发
	onShareAppMessage: function() {},
	// 页面加载时
	onLoad: function(e) {
		var that = this
			// 读取同步本地缓存intro
		var intro = wx.getStorageSync('intro')
		if (intro) {
			console.log(intro)
		}

		// 判断图片是否存在
		var img = (e.image == "") ? this.data.src : e.image

		this.setData({
			price: e.cur_price,
			goods_id: e.goods_id,
			title: e.goods_name,
			src: img,
			num: e.num,
			"commodityList.sumNum": e.sum,
			"commodityList.sumPrice": e.sum_price
		})

		// 解析富文本编辑器的内容
		WxParse.wxParse('intro', 'html', intro, that, 0)
			// 移出缓存
		wx.removeStorageSync('intro')
	},
	// commodityNum: function(ident) {
	// 	var num = parseInt(this.data.num)

	// 	// if传的值是0就 add
	// 	if (ident == 0) {
	// 		num++
	// 	} else {
	// 		num--
	// 	}
	// 	if (num < 0) return false;

	// 	this.setData({
	// 		num: num
	// 	})
	// },
	// minusTap: function(e) {
	// 	this.commodityNum(1)
	// },
	// addTap: function(e) {
	// 	this.commodityNum(0)
	// },
	cartTap: function() {
		wx.navigateTo({
			url: "../carts/carts"
		})
	}
})