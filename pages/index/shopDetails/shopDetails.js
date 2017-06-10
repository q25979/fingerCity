//获取应用实例
var app = getApp()

Page({
    data: {
        logoSrc: "../../../resource/shoplist_03.jpg",
        noImg: "../../../resource/shoplist_03.jpg",
        shopTitle: "商家名称",
        shopTel: "15125485452",
        wechat: "q15466",
        shopAddr: "中山公路185号中山公路185号中山公路185号",
        announcement: "这是商家公告的内容这是商家公告的内容这是商家公告的内容",
        business_id: -1,
        business_categroy: "business_goods",
        showNavUl: {
            wH: "1000rpx",
            currentNavList: 0,
            navList: ["全部", "新品", "促销", "活动"]
        },
        commodityList: {
            wH: "1000rpx",
            sumPrice: "0",
            sumNum: 0,
            li: []
        }
    },
    // 右上角转发
    onShareAppMessage: function() {},
    // 发送请求
    sendRequest: function(reqUrl, businessId, businessCategroy) {
        var that = this
        wx.request({
            url: reqUrl,
            data: {
                business_id: businessId,
                business_categroy: businessCategroy,
            },
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                // 判断图片是否存在
                var logo = (res.data.logo == "") ? that.data.noImg : res.data.logo

                // 保存数据
                that.setData({
                    "commodityList.li": res.data.goods,
                    logoSrc: logo,
                    shopTitle: res.data.business_name,
                    shopTel: res.data.tel,
                    shopAddr: res.data.address,
                    wechat: res.data.wechat,
                    announcement: res.data.announcement,
                })
                console.log(res.data)

                var oImg = that.data.commodityList.li
                for (var i = 0; i < oImg.length; i++) {
                    if (oImg[i].image == "") {
                        oImg[i].image = that.data.noImg
                    }
                }
                that.setData({
                    "commodityList.li": oImg
                })

                cacheGoods()
            },
            fail: function(res) {
                console.log(res.errMsg)
            }
        })

        // 读商品购物的缓存
        function cacheGoods() {
            // 获取商品数据
            var value = wx.getStorageSync(that.data.key)
            var oldGoods = that.data.commodityList.li
            var num

            // 判断已经缓存的数据,然后保存
            if (value) {
                for (var j = 0; j < value.goods.length; j++) {
                    for (var i = 0; i < oldGoods.length; i++) {
                        num = 0 // 初始化num
                        if (oldGoods[i].goods_id == value.goods[j].goods_id) {
                            num = value.goods[j].num
                            console.log(num)
                            oldGoods[i].num = num
                        }
                    }
                }
            }

            console.log(oldGoods)

            // 写回返回的数据
            that.setData({
                "commodityList.li": oldGoods
            })
            sumNum()
        }

        // 商家商品数量写回数据
        function sumNum() {
            var total = 0 // 汇总价格
            var sumNum = 0 // 商品总数

            var commodityNum = that.data.commodityList.li

            for (var i = 0; i < commodityNum.length; i++) {
                if (commodityNum[i].num != 0) {
                    total += commodityNum[i].num * commodityNum[i].cur_price;
                    sumNum += parseInt(commodityNum[i].num)
                }
            }

            that.setData({
                "commodityList.sumPrice": total,
                "commodityList.sumNum": sumNum
            })
        }
    },
    // 刷新
    onPullDownRefresh: function() {
        var that = this
        wx.showLoading({
            title: "加载中...",
            success: function() {
                // 数据储存
                that.setData({
                    business_id: that.data.business_id,
                    business_categroy: that.data.business_categroy,
                });
                // 刷新数据
                that.sendRequest(that.data.shopDetailsUrl, that.data.business_id, that.data.business_categroy)
                setTimeout(function() {
                    wx.stopPullDownRefresh()
                    if (that.data.business_categroy != "") {
                        wx.hideLoading()
                    }
                }, 300)
            }
        })

        // 每次刷新数据后都要判断是哪个类型
        this.navListTap
    },
    onLoad: function(e) {
        var systemInfo = wx.getSystemInfoSync()
        var wH

        wH = (750 * systemInfo.windowHeight) / systemInfo.windowWidth

        this.setData({
            "showNavUl.wH": (wH - 420) + "rpx",
            "commodityList.wH": (wH - 420) + "rpx", //385
            shopDetailsUrl: app.globalData.serviceUrl + "get_bussiness_detail",
            business_id: e.business_id,
            business_categroy: e.business_categroy,
            key: e.business_categroy + e.business_id
        })

        // this.onPullDownRefresh()
    },
    onShow: function() {
        var that = this

        this.onPullDownRefresh()
    },
    // 左侧选项卡切换
    navListTap: function(e) {
        var index = e.currentTarget.dataset.idx
        var that = this

        this.setData({
            "showNavUl.currentNavList": index
        })

        // 设置左侧分类选项
        var navType = this.data.commodityList.li

        for (var i = 0; i < navType.length; i++) {
            navType[i].current = true
        }

        if (index == 1) {
            hiddenCommodity()
        }

        if (index == 2) {
            hiddenCommodity()
        }

        if (index == 4) {
            hiddenCommodity()
        }

        // 更新数据
        this.setData({
            "commodityList.li": navType
        })

        // 判断那个商品隐藏函数
        function hiddenCommodity() {
            for (i = 0; i < navType.length; i++) {
                if (parseInt(navType[i].type) != index) {
                    navType[i].current = false
                }
            }
        }
    },
    // 商品详情
    commodityLiTap: function(e) {
        var index = e.currentTarget.dataset.idx
        var data = this.data.commodityList.li[index]

        wx.setStorageSync('intro', data.intro)

        wx.navigateTo({
            url: '../commodityDetails/commodityDetails?goods_id=' + data.goods_id + '&cur_price=' + data.cur_price + '&image=' + data.image + '&goods_name=' + data.goods_name + '&num=' + data.num + '&sum=' + this.data.commodityList.sumNum + '&sum_price=' + this.data.commodityList.sumPrice
        })
    },
    // 商品数据缓存
    cacheGoods: function() {
        var that = this
        var keyName = this.data.business_categroy + (this.data.business_id).toString()
        var sumData = this.data.commodityList
        var goods = []

        // this.data.commodityList.li的值,商品信息
        for (var i = 0; i < sumData.li.length; i++) {
            if (parseInt(sumData.li[i].num) != 0) {
                goods.push(sumData.li[i])
            }
        }

        // 设置缓存
        wx.setStorage({
            key: keyName,
            data: {
                sumPrice: sumData.sumPrice,
                sumNum: sumData.sumNum,
                goods: goods,
            },
            success: function(res) {
                console.log(keyName + ":数据存储成功!")
            }
        })
    },
    // 进入其它页面时.购物车用的
    onHide: function() {
        this.cacheGoods()
    },
    // 返回时.购物车用的
    onUnload: function() {
        this.cacheGoods()
    },
    commodityNum: function(e, ident) {
        var idx = e.currentTarget.dataset.idx
        var num = parseInt(this.data.commodityList.li[idx].num)
        var price = parseInt(this.data.commodityList.li[idx].cur_price)
        var total = 0 // 汇总价格
        var sumNum = 0 // 商品总数

        // if传的值是0就 add
        if (ident == 0) {
            num++
        } else {
            num--
            if (num < 0) return false
        }

        var commodityNum = this.data.commodityList.li
        commodityNum[idx].num = num

        for (var i = 0; i < commodityNum.length; i++) {
            total += commodityNum[i].num * commodityNum[i].cur_price;
            sumNum += parseInt(commodityNum[i].num)
        }

        this.setData({
            "commodityList.li": commodityNum,
            "commodityList.sumPrice": total,
            "commodityList.sumNum": sumNum
        })
    },
    // 减
    minusTap: function(e) {
        this.commodityNum(e, 1)
    },
    // 加
    addTap: function(e) {
        this.commodityNum(e, 0)
    },
    // 购物车
    cartTap: function() {
        wx.navigateTo({
            url: "../carts/carts"
        })
    },
    // 拨打电话
    phoneTap: function() {
        var that = this

        wx.showModal({
            title: "拨打电话",
            content: "是否联系商家",
            success: function(res) {
                if (res.confirm) {
                    wx.makePhoneCall({
                        phoneNumber: that.data.shopTel
                    })
                }
            }
        })
    },
    // 复制微信号
    wechatTap: function() {
        var that = this

        wx.setClipboardData({
            data: that.data.wechat,
            success: function() {
                wx.showToast({
                    title: "复制微信号成功",
                    icon: "success",
                    duration: 2000
                })
            },
            fail: function() {}
        })
    }
})