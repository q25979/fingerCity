Page({
	data: {
		commodityImg: "../../../resource/shoplist_03.jpg"
	},
	commodityImg: function(){
		var that = this

		wx.chooseImage({
			count: 1,
			sourceType: "album",
			success: function(res){
				that.setData({
					commodityImg: res.tempFilePaths,
				})
			}
		})
	}
})