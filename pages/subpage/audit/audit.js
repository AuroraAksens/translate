// pages/subpage/audit/audit.js
var app = getApp()
const voicePlayer = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topId: 0,

    listdata: [],

    userinfo: '',

    indexs: null,

    indexids: null
  },


  //获取数据
  tapTab(e) {
    let that = this;
    let token = wx.getStorageSync('token')
    let id = e.currentTarget.dataset.id
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'examine?status=' + id, //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            topId: id,
            listdata: res.data.data
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let token = wx.getStorageSync('token')
    let userinfo = wx.getStorageSync('userinfo')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'examine?status=0', //仅为示例，并非真实的接口地址
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            listdata: res.data.data,
            userinfo: userinfo
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
    let indexid = e.currentTarget.dataset.indexid
    let that = this
    voicePlayer.autoplay = true
    wx.hideLoading();
    voicePlayer.src = voice,
      voicePlayer.play()
    voicePlayer.onPlay(() => {
      that.setData({
        indexs: indexs,
        indexids: indexid
      })
    })
    voicePlayer.onEnded((res) => {
      console.log('播放结束')
      that.setData({
        indexs: null,
        indexids: null
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})