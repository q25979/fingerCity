// 导入
var WxParse = require('../../../wxParse/wxParse.js')
var app = getApp()

Page({
    data: {},
    // 右上角转发
    onShareAppMessage: function() {
        console.log("转发")
    },
    // 加载
    onLoad: function(e) {
        this.setData({
            idx: e.id,
            requestUrl: app.globalData.serviceUrl + "get_blankspace_release"
        })
    },
    // 加载之后
    onShow: function() {
        var index = this.data.idx
        var that = this

        // 商家列表顶部公告
        if (index == "00") {
            notice("top_b_food")
            return false
        }
        if (index == "01") {
            notice("top_b_clothes")
            return false
        }
        if (index == "02") {
            notice("top_b_market")
            return false
        }
        if (index == "03") {
            notice("top_b_store")
            return false
        }
        if (index == "10") {
            notice("top_s_life")
            return false
        }
        if (index == "11") {
            notice("top_s_recruitment")
            return false
        }
        if (index == "12") {
            notice("top_s_houserent")
            return false
        }
        if (index == "13") {
            notice("top_s_secondhand")
            return false
        }

        // 公告
        function notice(type) {
            wx.request({
                url: that.data.requestUrl,
                data: {
                    content_type: type
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                method: "POST",
                success: function(res) {
                    // 公告借用轮播名字
                    console.log(res.data)
                    var bannerCnt = res.data.content

                    // 解析富文本编辑器的内容
                    WxParse.wxParse('bannerCnt', 'html', bannerCnt, that, 0)
                }
            })
        }

        // 获取缓存
        var value = wx.getStorageSync('target')
        var bannerCnt = value[index]

        // 解析富文本编辑器的内容
        WxParse.wxParse('bannerCnt', 'html', bannerCnt, that, 0)

        // 删除缓存
        wx.removeStorageSync('target')
    }
})