// pages/searchfor/searchfor.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,

    coll: -1,

    //历史记录
    history: [],

    srfy: '',
    srfyname: '',

    srfy2: 0,

    search_text: '',

    searchData: [],
    Dialect:[],
  },

  //拉起父组件弹框
  showTips() {
    this.triggerEvent('showTipss')
  },

  showTips2() {
    this.triggerEvent('showTipss2')
  },

  //获取选择的方言
  getsrfy() {
    this.setData({
      srfy: app.globalData.srfy,
      srfyname: app.globalData.srfyname,
    })
  },

  getsrfy2() {
    this.setData({
      srfy2: app.globalData.srfy2, 
    })
  },

  //跳转词汇详情
  govbDetails() {
    wx.navigateTo({
      url: '/pages/subpage/vbDetails/vbDetails',
    })
  },

  //收藏
  collection(e) {
    let coid = e.currentTarget.dataset.coid
    this.setData({
      coll: coid
    })
  },

  //获取历史记录数据
  getHistoryData() {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'summary/record', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            history: res.data.data
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

  //获取搜索框内容
  getsearchtext(e) {
    this.setData({
      search_text: e.detail.value
    })
    if(e.detail.value == ''){
      this.getHistoryData()
    }
  },


  //获取搜索数据
  getSearchData() {
    let that = this;
    let token = wx.getStorageSync('token')
    let dialect_id = that.data.srfy
    let srfy2 = that.data.srfy2
    let Dialect_id = that.data.Dialect[0].id
    let id = dialect_id != '' ? dialect_id : Dialect_id
    let search_text = that.data.search_text
    console.log(srfy2)
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'summary/details? type= 0 & dialect_id= ' + id + ' & search_text=' + search_text + '&status=' + srfy2,
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            searchData: res.data.data
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

  //跳转词汇详情
  govbDetails(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/subpage/vbDetails/vbDetails?id=' + id,
    })
  },


  getSearchData2(e) {
    let that = this;
    let token = wx.getStorageSync('token')
    let dialect_id = that.data.srfy
    let srfy2 = that.data.srfy2
    let Dialect_id = that.data.Dialect[0].id
    let id = dialect_id != '' ? dialect_id : Dialect_id
    let search_text = e.currentTarget.dataset.name
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'summary/details? type= 0 & dialect_id= ' + id + ' & search_text=' + search_text + '&status=' + srfy2,
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            searchData: res.data.data,
            search_text: search_text
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

  //收藏
  getcollection(e) {
    let that = this;
    let token = wx.getStorageSync('token')
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let data = that.data.searchData
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'summary/collection?mandarin_id=' + id,
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {

          if (res.data.data == '收藏成功') {
            data[index].is_show = 1
            that.setData({
              searchData: data
            })
          } else {
            data[index].is_show = 0
            that.setData({
              searchData: data
            })
          }

          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 2000
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


  //复制文本
  copyText(e){
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon:'none'
            })
          }
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getHistoryData()
    this.getDialectData()
  },

})