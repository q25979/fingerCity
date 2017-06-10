var app = getApp()
var detail = ""
var dizhi = ""
var la = ''
var lon = ''
Page({
  data: {
    docTitle: "商家管理",
    area: ['美食', '服饰鞋包', '商超', '好店'],
    areaIndex: 0,
    businessType: "businessmen_food",
    type: ['饭店', '快餐小吃', '蛋糕房', '汉堡披萨', '甜点饮品', '水果屋'],
    typeIndex: 0,
    logoImg: "",
    confirmBtn: "确认修改",
    showToast: "修改成功",
    day: '',
    shopname: '',
    dizhi: '',
    dizhidetail: '',
    phone: '',
    wechat: '',
    fenlei: '',
    leixing: ''

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
          dizhidetail: res.address
        })
      }
    })
  },
  onLoad: function (e) {
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
      success: function (res) {
        var bigtype,leixing;
        console.log(res.data)
        if (res.data.business_category == 'businessmen_food') {
          bigtype = '美食'
          if (res.data.type==0){
            leixing = '饭店'
          } else if (res.data.type == 1){
            leixing = '快餐小吃'
          } else if (res.data.type == 2) {
            leixing = '蛋糕房'
          } else if (res.data.type == 3) {
            leixing = '汉堡披萨'
          } else if (res.data.type == 4) {
            leixing = '甜点饮品'
          } else{
            leixing = '水果屋'
          }
        } else if (res.data.business_category == 'businessmen_clothes')
        { 
          bigtype = '服饰鞋包'
          if (res.data.type == 0) {
            leixing = '服装'
          } else if (res.data.type == 1) {
            leixing = '饰品'
          } else if (res.data.type == 2) {
            leixing = '鞋子'
          } else  {
            leixing = '箱包'
          }
        } else if (res.data.business_category == 'businessmen_market') {
          bigtype = '商超'
          leixing = "全部"
         } else { 
          bigtype = '好店'
          if (res.data.type == 0) {
            leixing = '房地产'
          } else if (res.data.type == 1) {
            leixing = '汽车'
          } else if (res.data.type == 2) {
            leixing = '电动车'
          } else if (res.data.type == 3) {
            leixing = '娱乐健身'
          } else if (res.data.type == 4) {
            leixing = '丽状美容'
          } else if (res.data.type == 4) {
            leixing = '家用电器'
          } else if (res.data.type == 4) {
            leixing = '手机数码'
          } else if (res.data.type == 4) {
            leixing = '文具办公'
          } else if (res.data.type == 4) {
            leixing = '饮品酒茶'
          } else if (res.data.type == 4) {
            leixing = '宾馆酒店'
          } else if (res.data.type == 4) {
            leixing = '摄影婚庆'
          } else if (res.data.type == 4) {
            leixing = '装修建材'
          } else if (res.data.type == 4) {
            leixing = '孕婴用品'
          } else if (res.data.type == 4) {
            leixing = '教育培训'
          } else if (res.data.type == 4) {
            leixing = '儿童玩具'
          } else if (res.data.type == 4) {
            leixing = '水产副食'
          } else if (res.data.type == 4) {
            leixing = '旅游出行'
          } else if (res.data.type == 4) {
            leixing = '鱼缸绿植'
          } else if (res.data.type == 4) {
            leixing = '微店'
          } else {
            leixing = '其他'
          }
         }
        that.setData({
          dizhi: res.data.address,
          day: res.data.expired_days + ' 天',
          shopname: res.data.name,
          phone: res.data.tel,
          wechat: res.data.wechat,
          dizhidetail: res.data.detaile_address,
          logoImg: res.data.logo,
          fenlei:bigtype,
          leixing:leixing,
        })
      },
      fail: function (res) {
        console.log("请求失败" + res.errMsg)
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
        // errMsg
        console.log("发送表单失败:")
        console.log(res.errMsg)
      }
    })
  },
  // 续费
  renewTap: function () {
    wx.requestPayment({
      timeStamp: '', // 时间戳
      nonceStr: '',	// 随机字符串
      package: '',	// 统一下单
      signType: 'MD5',
      paySign: '',
      success: function (res) {
        console.log(1)
        console.log(res)
      }
    })
  },

  // 点击复制链接
  copyTap: function () {
    wx.setClipboardData({
      data: app.globalData.serviceUrl,
      success: function () {
        wx.showModal({
          title: "复制成功",
          content: app.globalData.serviceUrl + "\n请用浏览器打开此链接发布商品(最好使用电脑)"
        })
      }
    })
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
});