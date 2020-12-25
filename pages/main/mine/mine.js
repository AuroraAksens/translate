var app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    //  AuthType授权状态  0表示已授权 1表示未授权
    AuthType: 1,

    nickName: '',
    avatarUrl: '',
    count: '',

  },
  attached() {
    this.getUserinfo()
  },
  methods: {
    zdyShow() {
      var that = this
      let token = wx.getStorageSync('token')
      if (token) {
        that.setData({
          AuthType: 0
        })
      } else {
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  that.getUserinfo()
                  wx.setStorageSync('userinfo', res.userInfo)
                  that.setData({
                    AuthType: 0,
                  })
                }
              })
            } else {
              // 未授权
              that.setData({
                AuthType: 1
              })
            }
          }
        })
      }
    },

    login() {
      var that = this
      // 用户信息
      let userInfo = wx.getStorageSync('userinfo')
      if (userInfo) {
        wx.login({
          success(res) {
            if (res.code) {
              var code = res.code
              wx.showLoading({
                title: '加载中',
              })
              wx.request({
                url: app.globalData.src + 'login', //仅为示例，并非真实的接口地址
                method: 'POST',
                data: {
                  nickName: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl,
                  code: code,
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res) {
                  wx.hideLoading()
                  if (res.data.code == 200) {
                    wx.setStorageSync('token', res.data.data.token)
                    wx.showToast({
                      title: '登录成功',
                      icon: 'none'
                    })
                    that.setData({
                      AuthType: 0,
                    })
                    that.getUserinfo()
                    that.triggerEvent('mineJumps')
                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none'
                    })
                  }
                },
                fail(res) {
                  wx.showToast({
                    title: '服务器繁忙',
                    icon: 'none'
                  })
                }
              })

            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      } else {
        wx.showToast({
          title: '你还未授权，请前往我的页面授权。',
          icon: 'none',
          duration: 3000
        })
      }

    },

    // 获取用户信息数据
    bindGetUserInfo(e) {
      var that = this
      if (e.detail.errMsg == "getUserInfo:ok") {
        wx.setStorageSync('userinfo', e.detail.userInfo)
        that.login()
      } else {
        that.setData({
          AuthType: 1
        })
      }
    },

    goOrder(e) {
      let id = e.currentTarget.dataset.id
      // 调用navbar页面的方法，也就是父组件的方法
      this.triggerEvent('mineJumps', id)
    },

    //跳转审核页
    goAudit() {
      wx.navigateTo({
        url: '/pages/subpage/audit/audit',
      })
    },

    //跳转我的收藏页
    goCol() {
      wx.navigateTo({
        url: '/pages/subpage/collection/collection',
      })
    },


    //获取用户数据
    getUserinfo() {
      let that = this;
      let token = wx.getStorageSync('token')
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.src + 'user_info', //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          'token': token,
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            let user = res.data.data.user_info
            that.setData({
              nickName: user.nickname,
              avatarUrl: user.avatar_image,
              count: res.data.data.enter_count
            })
          } else if (res.data.code == 10003) {
            wx.getStorageSync('token', '')
            console.log('10003重新登录')
            that.login()
          } else if (res.data.code == 10004) {
            wx.getStorageSync('token', '')
            console.log('10004重新登录')
            that.login()
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





  },
})