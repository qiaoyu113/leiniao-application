// pages/incomeUpData/incomeUpData.js
var app = getApp()
var urls = app.globalData.url
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';

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
    reviewShow: false,
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
    tenderId: '',
    arrayLine: ['1', '2'],
    incomeArr: [],
    oldImgUrl: [],
    lineNameVal: '',
    inComeUpList: [{
      lineName: '',
      checked: true,
      salary: ''
    }]
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
    this.getLineName()
  },

  getLineName() {
    let that = this;
    network.requestLoading('api/driver/driver/income/isolate/salary/line-name/list', {},
      'get',
      '',
      'json',
      function(res) {
        if (res.success) {
          that.setData({
            arrayLine: res.data
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  bindPickerChange(e) {
    let index = e.currentTarget.dataset.index
    let i = e.detail.value
    let arr = this.data.inComeUpList
    let name = this.data.arrayLine[i]
    arr[index].lineName = name
    this.setData({
      inComeUpList: arr
    })
  },

  addIncome() {
    let that = this;
    let arr = that.data.inComeUpList;
    arr.push({
      lineName: '',
      checked: true,
      salary: ''
    })
    that.setData({
      inComeUpList: arr
    })
  },

  checkPushIncome() {
    let that = this;
    let arr = that.data.inComeUpList;
    let arr2 = that.data.incomeArr;
    let newArr2 = []
    let newArr = []
    for (let i = 0; i < arr2.length; i++) {
      newArr2.push({
        lineName: arr2[i].lineName,
        checked: true,
        salary: arr2[i].salary
      })
    }
    let imgUrl = that.data.oldImgUrl;
    let newImgUrl = [];
    for (let i = 0; i < imgUrl.length; i++) {
      newImgUrl.push('https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/' + imgUrl[i])
    }
    newArr = arr.concat(newArr2)
    that.setData({
      inComeUpList: newArr,
      imageUrl: newImgUrl
    })
  },

  delIncomeList(e) {
    let that = this;
    let i = e.currentTarget.dataset.i;
    let arr = that.data.inComeUpList;
    arr.splice(i, 1)
    that.setData({
      inComeUpList: arr
    })
  },

  getDeatail(time) {
    let that = this;
    let driverId = wx.getStorageSync('driverId')
    network.requestLoading('api/driver/driver/income/isolate/salary/info/list', {
        date: time
      },
      'get',
      '',
      'json',
      function(res) {
        if (res.success) {
          if (res.data) {
            let incomeArr = res.data.salaryInfos;
            if (incomeArr.length) {
              let imgUrl = res.data.receiptPhotos
              that.setData({
                reviewShow: true,
                oldImgUrl: imgUrl,
                incomeArr: incomeArr
              })
            }
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.errorMsg,
            showCancel: false,
            success: res => {
              if (res.confirm) {}
            }
          });
          that.onClose()
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  getUserInfo(event) {
    console.log(event.detail);
  },

  onClose2() {
    this.setData({
      reviewShow: false
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

  onChangeCheck(even) {
    let incomeCheckType = wx.getStorageSync('incomeCheckType')
    if (!incomeCheckType) {
      wx.showModal({
        title: '提示',
        content: '开启开关时为手动输入线路名称，关闭时为选择历史线路名称',
        showCancel: false,
        success: res => {
          if (res.confirm) {
            wx.setStorageSync('incomeCheckType', 'true')
          }
        }
      });
    }
    let i = even.currentTarget.dataset.i
    let arr = this.data.inComeUpList
    let detail = even.detail
    arr[i].checked = detail
    this.setData({
      inComeUpList: arr
    })
  },

  dayClick: function(event) {
    let clickDate = event.detail.year + '-' + event.detail.month + '-' + event.detail.day
    let clickDay = event.detail.day;
    let selectMonth = event.detail.month;
    let changeBg = `dayStyle[1].background`;
    let changeDay = `dayStyle[1].day`;
    let changeColor = `dayStyle[1].color`;
    let changeMonth = `dayStyle[1].month`;
    let showType = true;
    // if (flag == 'hidden') {
    //   showType = false;
    // }
    this.setData({
      selectMonth: selectMonth,
      clickDate: clickDate,
      // show: showType,
      [changeDay]: clickDay,
      [changeBg]: "#F55E01",
      [changeMonth]: "current",
      [changeColor]: "white"
    })
    let timestamp2 = new Date(clickDate.replace(/-/g, "/")).getTime();
    this.getDeatail(timestamp2)
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
    let that = this;
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index
    let arr = that.data.inComeUpList
    arr[index].salary = value;
    that.setData({
      inComeUpList: arr
    })
  },

  inputLineName(e) {
    let that = this;
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index
    let arr = that.data.inComeUpList
    arr[index].lineName = value
    that.setData({
      inComeUpList: arr
    })
  },

  repetition(arr) {
    var nary = arr.sort();
    let flag = true;
    for (var i = 0; i < nary.length - 1; i++) {
      if (nary[i].lineName == nary[i + 1].lineName) {
        flag = false;
        break;
      }
    }
    return flag
  },

  //提交收入
  submitForm: function() {
    let that = this;
    let arr = that.data.inComeUpList;
    let flag = true;
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].lineName || !arr[i].salary) {
        Notify({
          text: '请填写完整的第' + (Number(i) + 1) + '条线路信息',
          duration: 2000,
          selector: '#van-notify',
          backgroundColor: '#FAC844'
        });
        flag = false
        break;
      } else {
        flag = true
      }
    }
    if (!flag) {
      return false
    }
    if (that.data.clickDate == '') {
      Notify({
        text: '请选择配送完成时间',
        duration: 2000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    let stringTime = that.data.clickDate;
    let timestamp2 = new Date(stringTime.replace(/-/g, "/")).getTime();
    let driverId = wx.getStorageSync('driverId')
    let taskDetailList = that.data.inComeUpList
    let imgArr = that.data.imageUrl
    let imageUrl = []
    if (imgArr.length) {
      for (let i = 0; i < imgArr.length; i++) {
        let arr = imgArr[i].split('/')
        imageUrl.push(arr[arr.length - 1])
      }
    }
    if (!that.repetition(taskDetailList)) {
      Notify({
        text: '相同名称的线路当天只能提交一次',
        duration: 2000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    network.requestLoading('api/driver/driver/income/isolate/salary/save', {
        "taskDetailList": taskDetailList,
        "workDate": timestamp2,
        "receiptPhotos": imageUrl
      },
      'POST',
      '',
      'json',
      function(res) {
        if (res.success) {
          if (res.data.flag) {
            Toast.success('上报成功')
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          } else {
            Notify({
              text: res.data.msg,
              duration: 1500,
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