var app = getApp()

Page({
    data: {
        carts: [],
        minusStatuses: [],
        selectedAllStatus: false,
        toastHidden: true,
        total: '',
    },
    // 右上角转发
    onShareAppMessage: function() {
        console.log("转发")
    },
    onLoad: function() {
        // 设置用户id
        this.setData({
            user_id: app.globalData.openid,
            infoUrl: app.globalData.serviceUrl + "buy_goods"
        })

        this.getCartsData()
    },
    // 获取购物车数据
    getCartsData: function() {
        var that = this
        var oldGoods = []
        var newGoods = []

        // 获取缓存的名字
        wx.getStorageInfo({
            success: function(res) {
                // 获取缓存的内容
                for (var i = 0; i < res.keys.length; i++) {
                    wx.getStorage({
                        key: res.keys[i],
                        success: function(res) {
                            oldGoods.push(res.data.goods)
                            conArray()
                        }
                    })
                }
            }
        })

        // 把二维数组转为一维数组, 并返回购物车
        function conArray() {
            var i, j, k = 0
            var selected = that.data.carts

            // 二维数组转一维
            for (i = 0; i < oldGoods.length; i++) {
                // oldGoods[i]
                for (j = 0; j < oldGoods[i].length; j++) {
                    newGoods[k] = oldGoods[i][j]
                    k++
                }
            }

            that.setData({
                carts: newGoods,
            })
        }
    },
    // 增加和减少商品数量
    status: function(e, ari) {
        var index = e.currentTarget.dataset.index;
        var num = this.data.carts[index].num;

        if (ari == 0) {
            if (num > 1) {
                num--;
            }else{
              wx.showToast({
                title: '不能再少啦~',
                duration: 2000
              })
            }
        } else {
            num++;
        }

        // 只有大于0件的时候，才能normal状态，否则disable状态
        var minusStatus = num <= 0 ? 'disabled' : 'normal';
        // 购物车数据
        var carts = this.data.carts;
        carts[index].num = num;
        // 按钮可用状态
        var minusStatuses = this.data.minusStatuses;
        minusStatuses[index] = minusStatus;
        // 将数值与状态写回
        this.setData({
            carts: carts,
            minusStatuses: minusStatuses
        })

        this.sum()
    },
    bindMinus: function(e) {
        this.status(e, 0)
    },
    bindPlus: function(e) {
        this.status(e, 1)
    },
    bindManual: function(e) {},
    bindViewTap: function() {},
    bindCheckbox: function(e) {
        /*绑定点击事件，将checkbox样式改变为选中与非选中*/
        //拿到下标值，以在carts作遍历指示用
        var index = parseInt(e.currentTarget.dataset.index);
        //原始的icon状态
        var selected = this.data.carts[index].selected;
        var carts = this.data.carts;
        // 对勾选状态取反
        carts[index].selected = !selected;
        // 写回经点击修改后的数组
        this.setData({
            carts: carts
        });

        this.sum()
    },
    bindSelectAll: function() {
        // 环境中目前已选状态
        var selectedAllStatus = this.data.selectedAllStatus;
        // 取反操作
        selectedAllStatus = !selectedAllStatus;
        // 购物车数据，关键是处理selected值
        var carts = this.data.carts;
        // 遍历
        for (var i = 0; i < carts.length; i++) {
            carts[i].selected = selectedAllStatus;
        }
        this.setData({
            selectedAllStatus: selectedAllStatus,
            carts: carts
        });

        this.sum()
    },
    bindCheckout: function() {
        var that = this
        var newCarts = []

        // 初始化toastStr字符串

        // 遍历取出已勾选的goods_id
        for (var i = 0; i < this.data.carts.length; i++) {
            if (this.data.carts[i].selected) {
                var addCarts = {
                    "num": (that.data.carts[i].num).toString(),
                    "goods_id": (that.data.carts[i].goods_id).toString()
                }
                newCarts.push(addCarts)
            }
        }

        that.setData({
            new_carts: JSON.stringify(newCarts) // json转字符
        })

        // 因为上面保存的值是字符串,而初始化是[]
        // 如果没有字符传进去的话长度为2
        if (this.data.new_carts.length == 2) {
            wx.showModal({
                title: "购物车",
                content: "你目前没有选择任何商品",
                showCancel: false
            })

            return false
        }

        // 获取收货人信息
        wx.chooseAddress({
            success: function(res) {
                // 设置收货人信息
                that.setData({
                    address: res.detailInfo,
                    user_name: res.userName,
                    tel: res.telNumber,
                })

                // 请求中,导航条加载动画
                wx.showNavigationBarLoading()

                that.onPullDownRefresh()
            },
            fail: function() {
                wx.showModal({
                    title: "地址选择失败",
                    content: "不能购买商品,请联系客服",
                    showCancel: false
                })
            }
        })
    },
    // 发送数据请求
    sendUserInfo: function(fn) {
        var that = this

        wx.request({
            url: that.data.infoUrl,
            data: {
                user_id: that.data.user_id,
                address: that.data.address,
                tel: that.data.tel,
                user_name: that.data.user_name,
                goods_json: that.data.new_carts
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            success: function(res) {
                fn(res)
            }
        })
    },
    // 刷新页面
    onPullDownRefresh: function() {
        var that = this
        var toastStr = '商品购买成功'

        // wx.stopPullDownRefresh()
        // 请求成功,就弹框
        this.sendUserInfo(function(e) {
            console.log(e.data)

            // 请求成功,隐藏导航条加载动画
            wx.hideNavigationBarLoading()
            that.setData({
                toastHidden: false,
                toastStr: toastStr
            })

            // 提交订单成功,清除购物车缓存
            // 获取缓存的名字
            wx.clearStorage({
                success: function() {
                    wx.navigateBack()
                    console.log("清除缓存成功")
                }
            })

            // 刷新页面
            // that.onPullDownRefresh()
        })

        wx.stopPullDownRefresh()
    },
    bindToastChange: function() {
        this.setData({
            toastHidden: true
        });
    },
    // 汇总
    sum: function() {
        var carts = this.data.carts;
        // 计算总金额
        var total = 0;
        for (var i = 0; i < carts.length; i++) {
            if (carts[i].selected) {
                total += carts[i].num * carts[i].cur_price;
            }
        }
        // 写回经点击修改后的数组
        this.setData({
            carts: carts,
            total: '￥' + total
        });
    }
})