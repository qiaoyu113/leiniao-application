// pages/income/income.js
var app = getApp();
var network = require("../../utils/network.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayStyle: [{
        month: 'current',
        day: new Date().getDate(),
        color: 'white',
        background: '#AAD4F5'
      },
      {
        month: 'current',
        day: new Date().getDate(),
        color: 'white',
        background: '#AAD4F5'
      }
    ],
    dateVal: '',
    image_filepath: null,
    image_filepath2: null,
    image_filepath3: null,
    image_filepath4: null,
    sysW: null,
    lastDay: null,
    firstDay: null,
    year: null,
    hasEmptyGrid: false,
    cur_year: '',
    cur_month: '',
    firstDay: null,
    getDate: null,
    month: null,
    display: "none",
    week: [{
      wook: "一"
    }, {
      wook: "二"
    }, {
      wook: "三"
    }, {
      wook: "四"
    }, {
      wook: "五"
    }, {
      wook: "六"
    }, {
      wook: "日"
    }, ],
    day: [{
      wook: '',
      src: '',
    }, {
      wook: ''
    }, {
      wook: ''
    }, {
      wook: ''
    }, {
      wook: ''
    }, {
      wook: ''
    }, {
      wook: ''
    }],
    days: [],
    detail: ''
  },

  clickDays(e) {
    let that = this;
    let type = e.currentTarget.dataset.type
    let driverId = wx.getStorageSync('driverId')
    let stringTime = this.data.dateVal + "-01 00:00:00";
    let timestamp2 = new Date(stringTime.replace(/-/g, "/")).getTime();
    network.requestLoading('api/driver/magpie/income/statistics/query/detail', {
        driverId: driverId,
        statisticsDate: timestamp2,
        type: type
      },
      'POST',
      '',
      'json',
      function(res) {
        if (res.success) {
          that.setData({
            days: res.data
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
    that.setData({
      typeVal: type,
      display: "block"
    })
  },

  goFeedBack(e) {
    wx.navigateTo({
      url: '../question/question?type=0'
    });
  },

  dateChange: function(event) {
    console.log(event.detail);
  },

  dayClick: function(event) {
    let clickDay = event.detail.day;
    let changeDay = `dayStyle[1].day`;
    let changeBg = `dayStyle[1].background`;
    this.setData({
      [changeDay]: clickDay,
      [changeBg]: "#84e7d0"
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '收入统计' //页面标题为路由参数
    });
    this.getLoadImg()
    this.getDataNow()
    this.setNowDate();
    this.getProWeekList()
    this.dataTime();
    var res = wx.getSystemInfoSync();
    this.setData({
      sysW: res.windowHeight / 12 - 8, //更具屏幕宽度变化自动设置宽度
      marLet: this.data.firstDay,
      getDate: this.data.getDate,
      judge: 1,
      month: this.data.month,
    });
  },

  getData(time) {
    let that = this;
    let driverId = wx.getStorageSync('driverId')
    network.requestLoading('api/driver/magpie/income/statistics/query', {
        driverId: driverId,
        statisticsDate: time
      },
      'POST',
      '',
      'json',
      function(res) {
        if (res.success) {
          that.setData({
            detail: res.data
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  getDataNow() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var nowDate = year + "-" + month;
    this.setData({
      dateVal: nowDate
    })
    this.getData(date.getTime())
  },

  getLoadImg() {
    // 获取图片
    let that = this;
    const path = wx.getStorageSync('image_cache_income1')
    if (path && path != null) {
      that.setData({
        image_filepath: path
      })
    } else {
      wx.downloadFile({
        url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/063a7ea7748b483a8b004f115da5b50d',
        success: function(res) {
          if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager()
            fs.saveFile({
              tempFilePath: res.tempFilePath, // 传入一个临时文件路径
              success(res) {
                that.setData({
                  image_filepath: res.savedFilePath
                })
                wx.setStorageSync('image_cache_income1', res.savedFilePath)
              }
            })
          } else {
            console.log('响应失败', res.statusCode)
          }
        }
      })
    }
    // const path2 = wx.getStorageSync('image_cache_income2')
    // if (path2 && path2 != null) {
    //   that.setData({
    //     image_filepath2: path2
    //   })
    // } else {
    //   wx.downloadFile({
    //     url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/a33533b9791f420281cab3cb6edd3674',
    //     success: function(res) {
    //       if (res.statusCode === 200) {
    //         const fs = wx.getFileSystemManager()
    //         fs.saveFile({
    //           tempFilePath: res.tempFilePath, // 传入一个临时文件路径
    //           success(res) {
    //             that.setData({
    //               image_filepath2: res.savedFilePath
    //             })
    //             wx.setStorageSync('image_cache_income2', res.savedFilePath)
    //           }
    //         })
    //       } else {
    //         console.log('响应失败', res.statusCode)
    //       }
    //     }
    //   })
    // }
    // const path3 = wx.getStorageSync('image_cache_income3')
    // if (path3 && path3 != null) {
    //   that.setData({
    //     image_filepath3: path3
    //   })
    // } else {
    //   wx.downloadFile({
    //     url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/fd405039cac940f1a757cfac22e10bcb',
    //     success: function(res) {
    //       if (res.statusCode === 200) {
    //         const fs = wx.getFileSystemManager()
    //         fs.saveFile({
    //           tempFilePath: res.tempFilePath, // 传入一个临时文件路径
    //           success(res) {
    //             that.setData({
    //               image_filepath3: res.savedFilePath
    //             })
    //             wx.setStorageSync('image_cache_income3', res.savedFilePath)
    //           }
    //         })
    //       } else {
    //         console.log('响应失败', res.statusCode)
    //       }
    //     }
    //   })
    // }
    // const path4 = wx.getStorageSync('image_cache_income4')
    // if (path4 && path4 != null) {
    //   that.setData({
    //     image_filepath4: path4
    //   })
    // } else {
    //   wx.downloadFile({
    //     url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/53e4df6c7b194998849e6e0cc425ff96',
    //     success: function(res) {
    //       if (res.statusCode === 200) {
    //         const fs = wx.getFileSystemManager()
    //         fs.saveFile({
    //           tempFilePath: res.tempFilePath, // 传入一个临时文件路径
    //           success(res) {
    //             that.setData({
    //               image_filepath4: res.savedFilePath
    //             })
    //             wx.setStorageSync('image_cache_income4', res.savedFilePath)
    //           }
    //         })
    //       } else {
    //         console.log('响应失败', res.statusCode)
    //       }
    //     }
    //   })
    // }
  },

  getDateTime: function(e) {
    this.setData({
      dateVal: e.detail.value
    })
    let stringTime = this.data.dateVal + "-01 00:00:00";
    let timestamp2 = new Date(stringTime.replace(/-/g, "/")).getTime();
    this.getData(timestamp2)
  },

  getProWeekList: function() {
    let that = this
    let date = new Date()
    let dateTime = date.getTime(); // 获取现在的时间
    let dateDay = date.getDay(); // 获取现在的
    let oneDayTime = 24 * 60 * 60 * 1000; //一天的时间
    let proWeekList;
    let weekday;
    for (let i = 0; i < 7; i++) {
      let time = dateTime - (dateDay - 1 - i) * oneDayTime;
      proWeekList = new Date(time).getDate(); //date格式转换为yyyy-mm-dd格式的字符串
      weekday = "day[" + i + "].wook"
      that.setData({
        [weekday]: proWeekList,
      })
      //that.data.day[i].wook = new Date(time).getDate();
    }
  },

  setNowDate: function() {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const todayIndex = date.getDate();
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      weeks_ch,
      todayIndex,
    })
  },

  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];
    let weekday;
    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      // days[i].push(i);
      weekday = "days[" + (i - 1) + "].item"
      this.setData({
        [weekday]: i,
        src: ''
      })
    }
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    this.setData({
      days: []
    })
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      let firstDay = new Date(newYear, newMonth - 1, 1);
      this.data.firstDay = firstDay.getDay();
      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        marLet: this.data.firstDay
      })
      if (this.data.month == newMonth) {
        this.setData({
          judge: 1
        })
      } else {
        this.setData({
          judge: 0
        })
      }
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      let firstDay = new Date(newYear, newMonth - 1, 1);
      this.data.firstDay = firstDay.getDay();
      this.setData({
        cur_year: newYear,
        cur_month: newMonth,
        marLet: this.data.firstDay
      })
      if (this.data.month == newMonth) {
        this.setData({
          judge: 1
        })
      } else {
        this.setData({
          judge: 0
        })
      }
    }
  },
  dataTime: function() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var months = date.getMonth() + 1;

    //获取现今年份
    this.data.year = year;

    //获取现今月份
    this.data.month = months;

    //获取今日日期
    this.data.getDate = date.getDate();

    //最后一天是几号
    var d = new Date(year, months, 0);
    this.data.lastDay = d.getDate();

    //第一天星期几
    let firstDay = new Date(year, month, 1);
    this.data.firstDay = firstDay.getDay();
  },

  onHideBlock: function() {
    this.setData({
      display: "none",
    })
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
    this.setData({
      display: "none",
    })
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