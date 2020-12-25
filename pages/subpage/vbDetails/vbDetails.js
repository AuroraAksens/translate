// pages/subpage/vbDetails/vbDetails.js
var app = getApp()
const voicePlayer = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',

    listData: '',

    indexs: null
  },


  //获取数据
  getListData() {
    let that = this;
    let token = wx.getStorageSync('token')
    let id = that.data.id
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'summary/get_details?id=' + id, //仅为示例，并非真实的接口地址
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

  //播放录音
  playVoice(e) {
    wx.showLoading({
      title: '加载中'
    })
    let voice = e.currentTarget.dataset.voice
    let indexs = e.currentTarget.dataset.indexs
    let that = this
    voicePlayer.autoplay = true
    wx.hideLoading();
    voicePlayer.src = voice,
      voicePlayer.play()
    voicePlayer.onPlay(() => {
      that.setData({
        indexs: indexs
      })
    })
    voicePlayer.onEnded((res) => {
      console.log('播放结束')
      that.setData({
        indexs: null
      })
    })
    voicePlayer.onStop((res) => {
      console.log('停止')
    })
    voicePlayer.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
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
            data.is_show = 1
            that.setData({
              listData: data
            })
          } else {
            data.is_show = 0
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
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getListData()
  },

})