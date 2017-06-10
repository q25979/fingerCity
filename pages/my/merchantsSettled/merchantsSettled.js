var app = getApp()
var detail = ""
var dizhi = ""
var la = ''
var lon = ''
Page({
  data: {
    docTitle: "商家入驻",
    area: ['美食', '服饰鞋包', '商超', '好店'],
    areaIndex: 0,
    businessType: "businessmen_food",
    type: ['饭店', '快餐小吃', '蛋糕房', '汉堡披萨', '甜点饮品', '水果屋'],
    typeIndex: 0,
    logoImg: "",
    confirmBtn: "确认提交",
    showToast: "提交成功"
  },

  // 右上角转发
  onShareAppMessage: function () { },
  selectLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        dizhi = res.name
        detail = res.address
        la = res.latitude,
          lon = res.longitude
        that.setData({
          dizhi: res.name,
          detaildizhi: res.address
        })
      }
    })
  },
  // 提交表单
  formSubmit: function (e) {
    var val = e.detail.value
    var that = this

    // 验证提交的数据是否为空
    if (val.business_name == "") {
      noAdopt("商家名称不能为空")
      return false
    }
    if (val.address == "") {
      noAdopt("地址不能为空")
      return false
    }
    if (val.detaile_address == "") {
      noAdopt("详细地址不能为空")
      return false
    }
    if (val.tel == "") {
      noAdopt("请输入你的电话")
      return false
    }
    if (val.wechat == "") {
      noAdopt("请输入你的微信号")
      return false
    }
    if (val.account == "") {
      noAdopt("管理店铺的账号不能为空")
      return false
    }
    if (val.password == "") {
      noAdopt("登录密码不能为空")
      return false
    }
    if (this.data.logoImg == "") {
      noAdopt("请上传logo")
      return false
    }

    // 表单验证不通过对话框
    function noAdopt(title) {
      wx.showToast({
        title: title,
        image: "../../res/warning.png",
        duration: 1200,
        mask: true
      })
    }

    // 提交数据提示
    wx.showModal({
      title: that.data.confirmBtn,
      content: "请检查你要提交的数据是否有误",
      success: function (ev) {
        if (ev.confirm) {
          // 确认提交
          that.sendDataFn(val)
        }
        console.log(e.detail.value)
      }
    })
  },

  // 把表单发送后台请求
  sendDataFn: function (formData) {
    var that = this

    // 显示加载框
    wx.showLoading({
      title: "正在提交数据...",
      mask: true
    })
    console.log(that.data)
    wx.uploadFile({
      url: app.globalData.serviceUrl + "release_bussinessmen",
      filePath: that.data.logoImg[0],
      name: "logo",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      formData: {
        "business_name": formData.business_name,
        "address": formData.address,
        "detaile_address": formData.detaile_address,
        "tel": formData.tel,
        "wechat": formData.wechat,
        "account": formData.account, // 登录账号
        "password": formData.password,
        "user_id": app.globalData.openid,
        "lat": la,
        "lon": lon,
        "area_id": app.globalData.areaId,
        "type": that.data.typeIndex,
        "business_categroy": that.data.businessType
      },
      success: function (res) {
        console.log(res.data)
        wx.hideToast() // 数据请求成功隐藏加载框

        if (parseInt(res.data) == 0) {
          wx.showToast({
            title: "登录账号已经被注册",
            image: "../../res/warning.png"
          })

          return false
        }

        // 商家注册成功,提示框提示
        wx.showToast({
          title: that.data.showToast,
          icon: "success"
        })

        // 商家注册成功,返回上一层
        setTimeout(function () {
          wx.navigateBack()
        }, 1800)
      },
      fail: function (res) {
        console.log("发送表单失败:")
        console.log(res.errMsg)
      }
    })
  },

  // 类型
  onAreaChange: function (e) {

    var businessType = "businessmen_clothes"

    switch (e.detail.value) {
      case "0":
        businessType = "businessmen_food"
        break;
      case "1":
        businessType = "businessmen_clothes"
        break;
      case "2":
        businessType = "businessmen_market"
        break;
      case "3":
        businessType = "businessmen_store"
        break;
    }
    this.setData({
      areaIndex: e.detail.value,
      businessType: businessType
    });
    this.judgeTypeFn(e.detail.value)
    console.log("类型:" + this.data.businessType)
  },

  // 所属行业
  onIndustyChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    });
    console.log("行业:" + this.data.typeIndex)
  },

  // 选择图片
  logoImgTap: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        // 图片保存临时路劲
        that.setData({
          logoImg: res.tempFilePaths
        })
      }
    })
  },

  // 判断类型
  judgeTypeFn: function () {
    var id = this.data.areaIndex
    var that = this

    switch (id) {
      case "0": //美食
        foot()
        break;
      case "1": //服饰鞋包
        clothing()
        break;
      case "2": //商超
        shop()
        break;
      case "3": //好店
        goodShop()
        break;
    }

    // 美食
    function foot() {
      that.setData({
        type: ['饭店', '快餐小吃', '蛋糕房', '汉堡披萨', '甜点饮品', '水果屋']
      })
    }

    // 服饰鞋包
    function clothing() {
      that.setData({
        type: ['服装', '饰品', '鞋子', '箱包']
      })
    }

    // 商超
    function shop() {
      that.setData({
        type: ['全部']
      })
    }

    // 好店
    function goodShop() {
      that.setData({
        type: ['房地产', '汽车', '电动车', '娱乐健身', '丽状美容', '家用电器', '手机数码', '文具办公', '饮品酒茶', '宾馆酒店', '摄影婚庆', '装修建材', '孕婴用品', '教育培训', '儿童玩具', '水产副食', '旅游出行', '鱼缸绿植', '微店', '其它']
      })
    }

    this.setData({
      typeIndex: 0
    })
  },
});