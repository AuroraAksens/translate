var app = getApp()
const voiceReciver = wx.getRecorderManager();
const voicePlayer = wx.createInnerAudioContext()
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    modalName: null,
    box: [''],
    box1: [{
      'name': '',
      'pinyin': '',
      'item3': [{
        'voice': '',
        'bftype': false
      }]
    }],

    putong: '',
    remarks: '',


    changImg: false,

    //地区
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',

    //分类类别
    picker1: [],
    picker2: [],

    category1: null,
    category2: null,
    category1name: null,
    category2name: null,

    resVoice: '',

    // 录音gif
    lodGif: false,

    toLogin: false
  },

  pageLifetimes: {
    show: function () {
      this.getCategory1()
      this.getCategory2()
    },
  },

  methods: {
    // 删除读音
    splicDuying(e) {
      let index = e.currentTarget.dataset.index
      let indexs = e.currentTarget.dataset.indexs
      console.log(this.data.box1[index].item3)
      this.data.box1[index].item3.splice(indexs, 1)
      this.setData({
        box1: this.data.box1
      })
    },
    // 添加读音
    addDuying(e) {
      let index = e.currentTarget.dataset.index
      let block = {
        'voice': '',
        'bftype': false
      }
      this.data.box1[index].item3.push(block)
      this.setData({
        box1: this.data.box1
      })
      console.log(this.data.box1)
    },
    // 删除同义词
    splicSynonym(e) {
      let index = e.currentTarget.dataset.index
      this.data.box.splice(index, 1)
      this.setData({
        box: this.data.box
      })
    },
    // 添加同义词
    addSynonym() {
      let blokc = ''
      this.data.box.push(blokc)
      this.setData({
        box: this.data.box
      })
    },
    // 删除词汇
    splicDialect(e) {
      let index = e.currentTarget.dataset.index
      this.data.box1.splice(index, 1)
      this.setData({
        box1: this.data.box1
      })
    },
    // 添加词汇
    addDialect() {
      let blokc = {
        'name': '',
        'pinyin': '',
        'item3': [{
          'voice': '',
          'bftype': false
        }]
      }
      this.data.box1.push(blokc)
      this.setData({
        box1: this.data.box1
      })
    },
    formSubmit(e) {
      console.log(e)
      let that = this;
      let token = wx.getStorageSync('token')
      let box1 = this.data.box1
      let arr = Object.values(e.detail.value)
      let arr1 = Object.keys(e.detail.value)
      let putong = this.data.putong // 普通话
      let remarks = this.data.remarks //备注
      let region = this.data.region //地区
      let category1 = this.data.category1 //方言ID
      let category2 = this.data.category2 //词汇ID
      // 同义词的内容数组
      let Synonyms = []
      for (let i = 0; i < arr1.length; i++) {
        let Synonym = arr1[i].split(',')
        if (Synonym[0] == "Synonym") {
          let block = {
            'name': arr[i]
          }
          Synonyms.push(block)
        }
      }
      console.log('同义词--------------')
      console.log(Synonyms)
      // 方言的内容数组
      console.log('方言数组内容--------------')
      console.log(box1)

      console.log(putong)
      console.log(remarks)
      console.log(region)
      console.log(category1)
      console.log(category2)


      if (putong != '' && region != '' && category1 != '' && category2 != '') {
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: app.globalData.src + 'index/add_vocabulary', //仅为示例，并非真实的接口地址
          method: 'POST',
          data: {
            name: putong,
            province: region[0],
            city: region[1],
            area: region[2],
            words_id: category2,
            dialect_id: category1,
            remarks: remarks,
            item: Synonyms,
            item2: box1
          },
          header: {
            'token': token,
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            wx.hideLoading()
            if (res.data.code == 200) {
              console.log(res.data)
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/navbar/navbar',
                })
              }, 2000)
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          },
        })
      } else {
        wx.showToast({
          title: '请填写完整。',
          icon: 'none',
          duration: 2000
        })
      }

    },
    srFangyan(e) {
      let box1 = this.data.box1
      let index = e.currentTarget.dataset.index
      let value = e.detail.value
      box1[index].name = value
      this.setData({
        box1: box1
      })
    },
    srPingying(e) {
      let box1 = this.data.box1
      let index = e.currentTarget.dataset.index
      let value = e.detail.value
      box1[index].pinyin = value
      this.setData({
        box1: box1
      })
    },
    boxShuru(e) {
      let names = {
        'name': e.detail.value
      }
      let name = names
      this.data.box1.push(name)
      this.setData({
        box1: this.data.box1
      })
    },
    touchStart() {
      let that = this
      let option = {
        duration: 10000, //录音的时长，之前最大值好像只有1分钟，现在最长可以录音10分钟
        format: 'mp3', //录音的格式，有aac和mp3两种   
      }
      that.setData({
        lodGif: true
      })
      voiceReciver.start(option); //开始录音   这么写的话，之后录音得到的数据，就是你上面写得数据。
      voiceReciver.onStart(() => {})
      console.log(this.data.changImg)
    },
    touchEnd(e) {
      let that = this
      let index = e.currentTarget.dataset.index
      let indexs = e.currentTarget.dataset.indexs
      voiceReciver.stop();
      voiceReciver.onStop((res) => {
        let tempFilePath = res.tempFilePath
        wx.hideLoading()
        console.log(tempFilePath)
        wx.uploadFile({
          url: app.globalData.src + 'voice', //仅为示例，非真实的接口地址
          filePath: tempFilePath,
          name: 'file',
          success(res) {
            const data = res.data
            const datas = JSON.parse(data)
            that.data.box1[index].item3[indexs].voice = datas.data
            let time = parseInt(res.duration / 1000);
            that.setData({
              voice: res,
              voiceTime: time,
              showVoice: true,
              box1: that.data.box1,
              lodGif: false
            })
          }
        })

        console.log(this.data.box1)
        that.setData({
          resVoice: res.tempFilePath
        })
        // 其中：
        // res.tempFilePath;//是临时的文件地址
        // res.duration;//录音的时长
        // res.fileSize;//文件的大小
      })
      console.log(this.data.changImg)
    },
    playVoice(e) {
      wx.showLoading({
        title:'加载中'
      })
      let index = e.currentTarget.dataset.index
      let indexs = e.currentTarget.dataset.indexs
      let voice = this.data.resVoice;
      this.data.box1[index].item3[indexs].bftype = true
      let that = this
      voicePlayer.autoplay = true
      wx.hideLoading();
      voicePlayer.src = voice,
        voicePlayer.play()
      voicePlayer.onPlay(() => {
        that.setData({
          box1: that.data.box1
        })
      })
      voicePlayer.onEnded((res) => {
        that.data.box1[index].item3[indexs].bftype = false
        that.setData({
          box1: that.data.box1
        })
        console.log('播放结束')
      })
      voicePlayer.onStop((res) => {
        console.log('停止')
      })
      voicePlayer.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
    },

    //获取普通话
    getputong(e) {
      let data = e.detail.value
      this.setData({
        putong: data
      })
    },

    //备注
    textareaAInput(e) {
      let data = e.detail.html
      this.setData({
        remarks: data
      })
    },

    //选择地区
    bindRegionChange(e) {
      console.log(e)
      this.setData({
        region: e.detail.value
      })
    },

    //验证登录
    CLogin() {
      wx.showToast({
        title: '您还未登录，请前往我的页面进行登录。',
        icon: 'none',
        duration: 4000
      })
    },

    //选择类别
    PickerChange1(e) {
      let index = e.detail.value
      this.setData({
        category1: this.data.picker1[index].id,
        category1name: this.data.picker1[index].name
      })
      console.log(this.data.category1name)
    },

    //选择分类
    PickerChange2(e) {
      let index = e.detail.value
      this.setData({
        category2: this.data.picker2[index].id,
        category2name: this.data.picker2[index].name
      })
      console.log(this.data.category2name)
    },

    //请求类别
    getCategory1() {
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
              picker1: res.data.data,
              toLogin: true
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            that.setData({
              toLogin: false
            })
          }
        },
      })
    },

    //请求分类
    getCategory2() {
      let that = this;
      let token = wx.getStorageSync('token')
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.src + 'index/get_words', //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          'token': token,
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            that.setData({
              picker2: res.data.data,
              toLogin: true
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            that.setData({
              toLogin: false
            })
          }
        },
      })
    },

    showModal(e) {
      this.triggerEvent('showModals')
    },
    hideModal(e) {
      this.triggerEvent('hideModals')
    },
  }
})