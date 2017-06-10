var imgAddr = "https://pipi.ihyou.cn/imgs/"

Page({
	data: {
		dataList: ["招聘", "求职"],
		idx: "",
		imgSrc: "",
	},
	releaseFormTap: function(e) {
		var that = this
		var type = e.currentTarget.dataset.idx

		wx.navigateTo({
			url: '../formRelease/formRelease?idx=' + that.data.idx + '&type=' + type
		})
	},
	// 右上角转发
	onShareAppMessage: function() {},
	// 发布入口菜单
	menuFn: function(e) {
		var that = this

		switch (e.idx) {
			case "0":
				service()
				break;
			case "1":
				job()
				break;
			case "2":
				house()
				break;
			case "3":
				secondHand()
				break;
		}

		function service() {
			that.setData({
				idx: "serve_life",
				dataList: ["手机维修", "电脑维修", "家电维修", "配送跑腿",
					"搬家", "生意转让", "商务服务", "快递", "货运物流",
					"保姆月嫂", "房屋装修", "开换修锁", "干洗保洁", "管道疏通",
					"二手回收", "婚姻交友", "殡葬", "其它"
				],
				imgSrc: [imgAddr + "shouji.png", imgAddr + "diannao.png",
					imgAddr + "jiadian.png", imgAddr + "peisong.png", imgAddr + "panjia.png",
					imgAddr + "shengyi.png", imgAddr + "shangwu.png", imgAddr + "kuaidi.png",
					imgAddr + "huoyun.png", imgAddr + "baomu.png", imgAddr + "zhuangxiu.png",
					imgAddr + "kaisuo.png", imgAddr + "ganxi.png", imgAddr + "guandao.png",
					imgAddr + "ershou.png", imgAddr + "hunyin.png",
					imgAddr + "binzan.png", imgAddr + "qita.png"
				]
			})
		}

		function job() {
			that.setData({
				idx: "serve_recruitment",
				dataList: ["求职", "招聘"],
				imgSrc: [imgAddr + "qiuzhi.png", imgAddr + "zhaoping.png"]
			})
		}

		function house() {
			that.setData({
				idx: "serve_houserent",
				dataList: ["出租", "出售"],
				imgSrc: [imgAddr + "chuzu.png", imgAddr + "chushou.png"]
			})
		}

		function secondHand() {
			that.setData({
				idx: "serve_secondhand",
				dataList: [
					"车辆", "手机", "电脑", "家用电器",
					"家具日用", "美容护肤", "孕婴儿童", "办公用品",
					"乐器运动", "收藏品", "其它"
				],
				imgSrc: [imgAddr + "cheliang.png", imgAddr + "shouji2.png",
					imgAddr + "diannao2.png", imgAddr + "dianqi.png",
					imgAddr + "riyong.png", imgAddr + "meirong.png",
					imgAddr + "ertong.png", imgAddr + "shebei.png",
					imgAddr + "tushu.png", imgAddr + "shoucang.png", imgAddr + "qita.png"
				]
			})
		}
	},
	// 加载初始化
	onLoad: function(e) {

		this.menuFn(e)
	}
})