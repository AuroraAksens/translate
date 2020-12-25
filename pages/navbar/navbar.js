var app = getApp()
Page({
  data: {
    current: 0,
    height: "calc(100vh - 100rpx)",

    //弹框 false关闭  true开启
    showTips: false,
    showTips2: false,
    //弹框下标
    showNum: 0,

    modalName: null,

    itemid: '',

    // 方言类别
    Dialect: [],
    Dialect2:[{
      id:0,
      name:'普通话'
    },{
      id:1,
      name:'同义词'
    }]
  },

  showModal(e) {
    this.setData({
      modalName: 'RadioModal'
    })
  },

  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },


  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  mineJump(e) {

    // 获取子组件的实例，这个方法可以操作直接设置子组件的data里面的关键字
    // const child = this.selectComponent('#order')
    // child.setData({
    //   TabCur: e.detail
    // })


    //自定义的页面切换事件，用来做特殊的自定义页面跳转的。
    this.setData({
      current: 0
    })

    this.onShow()
  },

  NavChange(e) {
    let cur = Number(e.currentTarget.dataset.cur)
    this.setData({
      current: cur
    })
  },

  cardSwiper(e) {
    let cur = Number(e.detail.current)
    if (cur == 0) {
      this.selectComponent('#index').getCategory1()
      this.selectComponent('#index').getCategory2()
      this.setData({
        height: "calc(100vh - 100rpx)",
        current: cur
      })
    } else if (cur == 1) {
      this.selectComponent('#searchfor').onShow()
      this.setData({
        current: cur
      })
    } else if (cur == 2) {
      this.selectComponent('#summary').onShow()
      this.setData({
        height: "calc(100vh - 100rpx)",
        current: cur
      })
    } else{
      this.selectComponent('#mine').zdyShow()
      this.setData({
        height: "calc(100vh - 100rpx)",
        current: cur
      })
    }
  },


  //弹框
  showTips() {
    let show = this.data.showTips
    if (show == true) {
      this.setData({
        showTips: false
      })
      this.selectComponent('#searchfor').getsrfy()
    } else {
      this.setData({
        showTips: true
      })
    }
  },

  showTips2() {
    let show = this.data.showTips2
    if (show == true) {
      this.setData({
        showTips2: false
      })
      this.selectComponent('#searchfor').getsrfy2()
    } else {
      this.setData({
        showTips2: true
      })
    }
  },

  //选择语言
  actioc(e) {
    let id = e.currentTarget.dataset.id
    let itemid = e.currentTarget.dataset.itemid
    let itemname = e.currentTarget.dataset.itemname
    app.globalData.srfy = itemid
    app.globalData.srfyname = itemname
    this.setData({
      showNum: id,
    })
  },

  actioc2(e) {
    let id = e.currentTarget.dataset.id
    app.globalData.srfy2 = id
    this.setData({
      showNum: id,
    })
  },

  //跳转录入页
  goindex() {
    this.setData({
      current: 0
    })
  },


  //获取方言类别数据
  getDialectData() {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'index/get_dialect', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            Dialect: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
    })
  },

  checkLogin(){
    let that = this
    wx.showModal({
      title: '登录提示',
      content: '您还未登录，请先登录。',
      success (res) {
        if (res.confirm) {
          that.setData({
            current: 3
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },



  onShow() {
    this.selectComponent('#searchfor').onShow()
    this.selectComponent('#summary').onShow()
    this.selectComponent('#mine').zdyShow()
    this.selectComponent('#index').getCategory1()
    this.selectComponent('#index').getCategory2()
    this.getDialectData()
  },

})