// pages/incomeUpData/incomeUpData.js
var app = getApp()
var urls = app.globalData.url
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayStyle: [{
        month: 'current',
        day: new Date().getDate(),
        color: '#F55E01',
        background: '#F2F2F2'
      },
      {
        month: 'current',
        day: new Date().getDate(),
        color: '#F55E01',
        background: '#F2F2F2'
      }
    ],
    activeNames: ['1'],
    selectMonth: '',
    clickDate: '',
    changeDayMoEv: '',
    price: '',
    show: false,
    actions: [{
        name: '上午'
      },
      {
        name: '下午'
      }
    ],
    imageUrl: [],
    avatar: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/ba0323a3f08e49cfb2511fa8fd067f00',
    noticeVal: '',
    checkIndex: '2',
    name: '',
    lineId: '',
    tenderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '运费上报' //页面标题为路由参数
    });
    this.setData({
      name: options.name,
      lineId: options.lineId,
      tenderId: options.id
    })
    // this.getDeatail()
  },

  getDeatail(time){
    let that = this;
    let driverId = wx.getStorageSync('driverId')
    network.requestLoading('api/driver/magpie/income/report/query', {
      driverId: driverId,
      lineId: that.data.lineId,
      completeDate: time
    },
      'post',
      '',
      'json',
      function (res) {
        if (res.success) {
          if (res.data.flag) {
            let detail = res.data;
            let completeDateFlag = '上午'
            if (detail.completeDateFlag == 2){
              completeDateFlag = '下午'
            }
            let completeDate = detail.completeDate.slice(0, 10)
            let imageArr = []
            if (detail.signatureReceiptUrl.length) {
              imageArr = detail.signatureReceiptUrl
            }
            that.setData({
              price: res.data.freightIncomeYuan,
              changeDayMoEv: completeDateFlag,
              clickDate: completeDate,
              imageUrl: imageArr
            })
            let event = {
              detail:{
                year: detail.completeDate.slice(0, 4),
                month: detail.completeDate.slice(5, 7),
                day: detail.completeDate.slice(8, 10),
              }
            }
            that.dayClick(event, 'hidden')
          } else {
            that.setData({
              price: '',
              imageUrl: []
            })
          }
        } 
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  dateChange: function(event) {
    console.log(event.detail);
  },

  // 折叠面板操作
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  dayClick: function (event, flag) {
    let clickDate = event.detail.year + '-' + event.detail.month + '-' + event.detail.day
    let clickDay = event.detail.day;
    let selectMonth = event.detail.month;
    let changeBg = `dayStyle[1].background`;
    let changeDay = `dayStyle[1].day`;
    let changeColor = `dayStyle[1].color`;
    let changeMonth = `dayStyle[1].month`;
    let showType = true;
    if (flag == 'hidden') {
      showType = false;
    }
    this.setData({
      selectMonth: selectMonth,
      clickDate: clickDate,
      show: showType,
      [changeDay]: clickDay,
      [changeBg]: "#F55E01",
      [changeMonth]: "current",
      [changeColor]: "white"
    })
  },

  next: function(event) {
    let currentMonth = event.detail.currentMonth;
    let nowMonth = new Date().getMonth() + 1;
    let changeMonth = `dayStyle[0].month`;
    let changeMonth2 = `dayStyle[1].month`;
    let selectMonth = this.data.selectMonth;
    if (nowMonth == currentMonth) {
      this.setData({
        [changeMonth]: 'current'
      })
    } else {
      if (nowMonth < currentMonth) {
        this.setData({
          [changeMonth]: 'next'
        })
      } else {
        this.setData({
          [changeMonth]: 'prev'
        })
      }
    }
    if (selectMonth == currentMonth) {
      this.setData({
        [changeMonth2]: 'current'
      })
    } else {
      if (selectMonth < currentMonth) {
        this.setData({
          [changeMonth2]: 'next'
        })
      } else {
        this.setData({
          [changeMonth2]: 'prev'
        })
      }
    }
  },

  prev: function(event) {
    let currentMonth = event.detail.currentMonth;
    let nowMonth = new Date().getMonth() + 1;
    let changeMonth = `dayStyle[0].month`;
    let changeMonth2 = `dayStyle[1].month`;
    let selectMonth = this.data.selectMonth;
    if (nowMonth == currentMonth) {
      this.setData({
        [changeMonth]: 'current'
      })
    } else {
      if (nowMonth < currentMonth) {
        this.setData({
          [changeMonth]: 'next'
        })
      } else {
        this.setData({
          [changeMonth]: 'prev'
        })
      }
    }
    if (selectMonth == currentMonth) {
      this.setData({
        [changeMonth2]: 'current'
      })
    } else {
      if (selectMonth < currentMonth) {
        this.setData({
          [changeMonth2]: 'next'
        })
      } else {
        this.setData({
          [changeMonth2]: 'prev'
        })
      }
    }
  },

  onClose() {
    let changeBg = `dayStyle[1].background`;
    let changeDay = `dayStyle[1].day`;
    let changeColor = `dayStyle[1].color`;
    let changeMonth = `dayStyle[1].month`;
    this.setData({
      show: false,
      selectMonth: '',
      clickDate: '',
      changeDayMoEv: '',
      [changeDay]: new Date().getDate(),
      [changeBg]: "#F2F2F2",
      [changeMonth]: "current",
      [changeColor]: "#F55E01"
    });
  },

  onSelect(event) {
    this.setData({
      show: false,
      changeDayMoEv: event.detail.name
    });
    let stringTime = this.data.clickDate;
    let timestamp2 = new Date(stringTime.replace(/-/g, "/")).getTime();
    this.getDeatail(timestamp2)
  },

  // 添加图片
  changeAvatar: function() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var avatar = res.tempFilePaths;
        var token = wx.getStorageSync('token')
        wx.uploadFile({
          url: urls + 'api/base/v1/upload/uploadOSS/img/true/-1',
          filePath: avatar[0],
          header: {
            "Authorization": token
          },
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function(res) {
            let datas = JSON.parse(res.data)
            let imageArr = that.data.imageUrl;
            imageArr.push(datas.data.url)
            that.setData({
              imageUrl: imageArr
            })
          }
        })
      },
      fail: function(err) {
        Notify({
          text: err.message,
          duration: 1000,
          selector: '#van-notify',
          backgroundColor: '#FAC844'
        });
      },
      complete: function() {
        // complete
      }
    })
  },

  delImage(e) {
    let _this = this;
    let i = e.currentTarget.dataset.index
    let arrs = _this.data.imageUrl
    arrs.splice(i, 1);
    _this.setData({
      imageUrl: arrs
    })
  },

  //输入内容
  inputPrice(e) {
    let value = e.detail.value;
    this.setData({
      price: value
    })

  },

  //上传图片
  submitForm: function() {
    let that = this;
    if (that.data.changeDayMoEv == '') {
      Notify({
        text: '请选择配送完成时间',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    if (that.data.price == '') {
      Notify({
        text: '请输入运费收入',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    let stringTime = that.data.clickDate;
    let timestamp2 = new Date(stringTime.replace(/-/g, "/")).getTime();
    let driverId = wx.getStorageSync('driverId')
    let completeDateFlag = 2;
    if (that.data.changeDayMoEv == '上午') {
      completeDateFlag = 1
    }
    network.requestLoading('api/driver/magpie/income/report/save', {
        "completeDate": timestamp2,
        "driverId": driverId,
        "completeDateFlag": completeDateFlag,
        "freightIncomeYuan": that.data.price,
        "lineId": that.data.lineId,
        "lineName": that.data.name,
        "signatureReceiptUrl": that.data.imageUrl
      },
      'POST',
      '',
      'json',
      function (res) {
        if (res.success) {
          if (res.data) {
            wx.redirectTo({
              url: '/pages/incomeUpSuccess/incomeUpSuccess'
            });
          } else {
            Notify({
              text: res.errorMsg,
              duration: 1000,
              selector: '#van-notify',
              backgroundColor: '#FAC844'
            });
          }
        } else {
          Notify({
            text: res.errorMsg,
            duration: 1000,
            selector: '#van-notify',
            backgroundColor: '#FAC844'
          });
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})