// pages/subpage/SummaryDet/SummaryDet.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsID: '',
    wordsname: '',
    id: '',
    name: '',

    isShow: 0,

    listData: []
  },



  //获取数据
  getListData() {
    let that = this;
    let token = wx.getStorageSync('token')
    let wordsID = that.data.wordsID
    let id = that.data.id
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'summary/details?type=1&dialect_id=' + id + '&words_id=' + wordsID + '&status', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            listData: res.data.data
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



  //收藏
  getcollection(e) {
    let that = this;
    let token = wx.getStorageSync('token')
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let data = that.data.listData
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
              listData: data
            })
          } else {
            data[index].is_show = 0
            that.setData({
              listData: data
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

  //复制文本
  copyText(e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
              icon: 'none'
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
    this.setData({
      wordsID: options.wordsID,
      wordsname: options.wordsname,
      id: options.id,
      name: options.name
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getListData()
  },


})