//获取应用实例
var app = getApp()

Page({
  data: {
    showNotice: '这是公告标题',
    idxSUrl: "",
    shopUrl: "",
    areaId: 0,
    animationData: {},
    current: 0,
    type: 0,
    images: "",
    img: "../../../resource/shoplist_03.jpg",
    showNavUl: {
      wH: "1000rpx",
      currentNavList: 0,
      navList: ["饭店", "蛋糕房", "水果屋"]
    },
    id: "00",
    shopList: {
      wH: "1000rpx",
      li: []
    },
    infoList: {
      wH: "1000rpx",
      li: []
    }
  },
  // 右上角转发
  onShareAppMessage: function () { },
  // 顶部公告
  noticeTap: function () {
    wx.navigateTo({
      url: "../banner/banner?id=" + this.data.id
    })
  },
  // 发送请求
  sendRequest: function (reqUrl, service, type, fn) {
    var jsonData = this.data
    wx.request({
      url: reqUrl,
      data: {
        serve_category: service,
        business_categroy: service,
        type: type, //这个是里面的列表,一开始传0
        area_id: jsonData.areaId
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // 回调函数
        fn(res)
        console.log(res.data)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  // 发送数据给服务器，并接受
  sendDataRe: function () {
    var that = this

    switch (this.data.id) {
      case "00":
        shopRequest('businessmen_food')
        break;
      case "01":
        shopRequest('businessmen_clothes')
        break;
      case "02":
        shopRequest('businessmen_market')
        break;
      case "03":
        shopRequest('businessmen_store')
        break;

      case "10":
        infoRequest('serve_life')
        break;
      case "11":
        infoRequest('serve_recruitment')
        break;
      case "12":
        infoRequest('serve_houserent')
        break;
      case "13":
        infoRequest('serve_secondhand')
        break;
    }

    // 信息类的数据请求
    function infoRequest(life) {
      that.sendRequest(that.data.idxSUrl, life, that.data.type, function (res) {
        that.setData({
          "infoList.li": res.data,
        });
        let exceInfo = that.data.infoList.li;
        // 字符剪切
        for (var i = 0; i < exceInfo.length; i++) {
          exceInfo[i].showContent = that.checkString(exceInfo[i].content, 18)
        }
        that.setData({
          "infoList.li": exceInfo, //字符剪切
        })
      })
    }

    // 商家类的数据请求
    function shopRequest(life) {
      that.sendRequest(that.data.shopUrl, life, that.data.type, function (res) {
        that.setData({
          "shopList.li": res.data
        })

        var oImg = that.data.shopList.li
        for (var i = 0; i < oImg.length; i++) {
          if (oImg[i].img == "") {
            oImg[i].img = that.data.img
          }
        }
        that.setData({
          "shopList.li": oImg
        })
      })
    }
  },
  // 加载
  onLoad: function (e) {
    var that = this
    var idx = e.id
    var neirong = null
    var data = this.data
    if (idx == "00") {
      neirong = "top_b_food"
    } else if (idx == "01") {
      neirong = "top_b_clothes"
    } else if (idx == "02") {
      neirong = "top_b_market"
    } else if (idx == "03") {
      neirong = "top_b_store"
      return false
    } else if (idx == "10") {
      neirong = "top_s_life"
    } else if (idx == "11") {
      neirong = "top_s_recruitment"
    } else if (idx == "12") {
      neirong = "top_s_houserent"
    } else {
      neirong = "top_s_secondhand"
    }
    console.log(neirong)
    var systemInfo = wx.getSystemInfoSync()
    var wH;
    wx.request({
      url: app.globalData.serviceUrl + "get_blankspace_release",
      data: {
        content_type: neirong
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        console.log(app.globalData.serviceUrl + "get_blankspace_release")
        console.log(res.data)
        var bannerCnt = res.data.title
        that.setData({
          showNotice: bannerCnt
        })
      }
    })
    // 刷新数据
    this.onPullDownRefresh()

    wH = (750 * systemInfo.windowHeight) / systemInfo.windowWidth

    switch (idx) {
      case "00":
        foot()
        break;
      case "01":
        clothing()
        break;
      case "02":
        superMarket()
        break;
      case "03":
        goodShop()
        break;

      case "10":
        service()
        break;
      case "11":
        job()
        break;
      case "12":
        houseForRent()
        break;
      case "13":
        secondHand()
        break;
    }
    // 数据储存
    that.setData({
      idxSUrl: app.globalData.serviceUrl + "get_serve",
      shopUrl: app.globalData.serviceUrl + "get_bussiness",
      areaId: app.globalData.areaId,
      "showNavUl.wH": (wH - 80) + "rpx",
      "shopList.wH": (wH - 80) + "rpx",
      "infoList.wH": (wH - 80) + "rpx",
      id: e.id
    })

    // 美食
    function foot() {
      that.setData({
        "id": idx,
        "showNavUl.navList": ["饭店", "快餐小吃", "蛋糕房",
          "汉堡披萨", "甜点饮品", "水果屋"
        ]
      })
      wx.setNavigationBarTitle({
        title: '美食'
      })
    }

    // 服装
    function clothing() {
      that.setData({
        "id": idx,
        "showNavUl.navList": ["服装", "饰品", "鞋子", "箱包"]
      })
      wx.setNavigationBarTitle({
        title: '服装鞋包'
      })
    }

    // 商超
    function superMarket() {
      that.setData({
        "id": idx,
        "showNavUl.navList": ["全部"]
      })
      wx.setNavigationBarTitle({
        title: '商超'
      })
    }

    // 好店
    function goodShop() {
      that.setData({
        "id": idx,
        "showNavUl.navList": [
          "房地产", "汽车", "电动车", "娱乐健身",
          "丽妆美容", "家电家具", "手机数码", "电脑办公",
          "饮品酒茶", "宾馆酒店", "摄影婚庆", "装修建材",
          "孕婴用品", "教育培训", "儿童玩具",
          "水产副食", "旅游出行", "鱼缸绿植", "微店", "其它"
        ]
      })
      wx.setNavigationBarTitle({
        title: '好店'
      })
    }

    // 生活服务
    function service() {
      that.setData({
        "id": idx,
        "showNavUl.navList": [
          "手机维修", "电脑维修", "家电维修", "配送跑腿",
          "搬家", "生意转让", "商务服务", "快递", "货运物流",
          "保姆月嫂", "房屋装修", "开换修锁", "干洗保洁", "管道疏通",
          "二手回收", "婚姻交友", "殡葬", "其它"
        ]
      })
      wx.setNavigationBarTitle({
        title: '生活服务'
      })
    }

    // 求职招聘
    function job() {
      that.setData({
        "id": idx,
        "showNavUl.navList": [
          "招聘", "求职"
        ]
      })
      wx.setNavigationBarTitle({
        title: '求职招聘'
      })
    }

    // 房屋出租
    function houseForRent() {
      that.setData({
        "id": idx,
        "showNavUl.navList": [
          "出租", "出售"
        ]
      })
      wx.setNavigationBarTitle({
        title: '房屋出租'
      })
    }

    // 二手买卖
    function secondHand() {
      that.setData({
        "id": idx,
        "showNavUl.navList": [
          "车辆", "手机", "电脑", "家用电器",
          "家具日用", "美容护肤", "孕婴儿童", "办公用品",
          "乐器运动", "收藏品", "其它"
        ]
      })
      wx.setNavigationBarTitle({
        title: '二手买卖'
      })
    }
  },
  onShow: function () {

  },
  // 刷新
  onPullDownRefresh: function () {
    var that = this
    wx.showLoading({
      title: "加载中...",
      success: function () {
        let exceInfo = that.data.infoList.li

        // 数据储存
        that.setData({
          idxSUrl: app.globalData.serviceUrl + "get_serve",
          shopUrl: app.globalData.serviceUrl + "get_bussiness",
          areaId: app.globalData.areaId,
        });
        // 刷新数据
        that.sendDataRe()
        setTimeout(function () {
          wx.stopPullDownRefresh()
          if (that.data.areaId != 0) {
            wx.hideLoading()
          }
        }, 300)
      }
    })
  },
  // 显示商家左侧选项卡切换
  navListTap: function (e) {
    var index = e.currentTarget.dataset.idx
    var that = this
    var idx = this.data.id

    that.onPullDownRefresh()

    that.setData({
      type: index
    })

    this.setData({
      "showNavUl.currentNavList": index
    })
  },
  // 商品详情
  shopDetails: function (e) {
    // 商家列表详情
    var index = e.currentTarget.dataset.idx

    // 左侧列表索引
    var listIdx = this.data.showNavUl.currentNavList
    var data = this.data.shopList.li[index]

    wx.navigateTo({
      url: '../shopDetails/shopDetails?business_id=' + data.business_id + '&business_categroy=' + data.business_categroy
    })
  },
  // 信息详情
  infoDetails: function (e) {
    var idx = e.currentTarget.dataset.idx
    var data = this.data.infoList.li[idx]

    wx.navigateTo({
      url: '../infoDetails/infoDetails?title=' + data.title + '&tel=' + data.tel + '&data=' + data.date + '&content=' + data.content + '&images=' + data.images
    })
  },
  // 剪切字符串
  checkString: function (obj, length) {
    var that = this
    if (obj.length > length) {
      return obj.substring(0, length) + "..."
    } else {
      return obj.substring(0, obj.length)
    }
  }
})