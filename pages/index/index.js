var app = getApp();
var network = require("../../utils/network.js");
var url = app.globalData.url;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ndicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    flag: false,
    bannerImg: [{
      picLink: '',
      picUrl: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/a87e2632306543248198b9df5b12af10'
    }, {
        picLink: '/pages/advertising/advertising',
      picUrl: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/fed2a3fd435242e9892c447597c8d2db'
    }],
    imgUrl: '',
    recommendArray: [],
    code: '',
    openId: '',
    currentCity: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let hasToken = wx.getStorageSync('token')
    if (hasToken){
      this.login();
    }else{
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }
    console.log(options)
    if(options.city){
      wx.reportAnalytics('city', {
        city: options.city,
      });
    }
  },

  login(){
    let that = this;
    wx.removeStorage({
      key: 'token',
      success: function (res) {
        // console.log(res.data)
      }
    })
    wx.login({
      success: function (res) {
        that.setData({
          code: res.code
        })
        network.requestLoading('api/auth/v1/jwt/getToken', {
          wxCode: that.data.code
        },
          'post',
          '',
          'json',
          function (res) {
            if (res.success) {
              that.setData({
                openId: res.data.openId
              })
              wx.setStorage({
                key: 'openId',
                data: res.data.openId,
                success: function (res) { }
              })
              if(res.data.phone){
                wx.setStorage({
                  key: 'phone',
                  data: res.data.phone,
                  success: function (res) {},
                })
              }
              wx.setStorage({
                key: 'token',
                data: res.data.token,
                success: function (res) {
                  that.getDataList()
                },
              })
            }
          },
          function (res) {
            wx.showToast({
              title: '加载数据失败',
            });
          });
      }
    })
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              // console.log(res.userInfo)
            }
          })
        }
      }
    })
  },

  getDataList() {
    let that = this;
    //获取梧桐推荐列表
    network.requestLoading('api/driver/driver/magpie/getHighQualityLine', {
        dictType: 'online_city'
      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          that.setData({
            recommendArray: JSON.parse(res.data)
          });
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  bindGetUserInfo: function(e) {
    // console.log(e.detail.userInfo)
  },

  getPhoneNumber: function(e) {
    let that = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      // wx.showModal({
      //   title: '提示',
      //   showCancel: false,
      //   content: '未授权',
      //   success: function (res) { }
      // })
    } else {
      network.requestLoading('api/core/v1/wx/decodeEncryptData', {
          code: that.data.code,
          iv: e.detail.iv,
          entryData: e.detail.encryptedData,
          openId: that.data.openId
        },
        'POST',
        '',
        '',
        function(res) {
          if (res.success) {
            let phone = res.data.phone;
            let openId = wx.getStorageSync('openId')
            network.requestLoading('api/auth/v1/jwt/getToken', {
              openId: openId,
              phone: phone
            },
              'post',
              '',
              'json',
              function (res) {
                if (res.success) {
                  wx.setStorage({
                    key: 'token',
                    data: res.data.token,
                    success: function (res) { },
                  })
                }
              },
              function (res) {
                wx.showToast({
                  title: '加载数据失败',
                });
              });
            network.requestLoading('api/driver/driver/clue/create', {
                "phone": phone,
                "sourceType": 1,
                "workCity": 100000
              },
              'POST',
              '',
              'json',
              function(res) {
                if (res.success) {
                  wx.setStorage({
                    key: 'phone',
                    data: phone,
                    success: function(res) {
                      wx.switchTab({
                        url: '/pages/lineList/lineList'
                      });
                    },
                  })
                }
              },
              function(res) {
                wx.showToast({
                  title: '加载数据失败',
                });
              });
          }
        },
        function(res) {
          wx.showToast({
            title: '加载数据失败',
          });
        });
    // }
    // },
    // function (res) {
    //   wx.showToast({
    //     title: '加载数据失败',
    //   });
    // });
  }
},

//拨打电话
talphone() {
  wx.makePhoneCall({
    phoneNumber: '01086469220',
  })
},

//跳转列表页面
goLineList() {
  wx.switchTab({
    url: '/pages/lineList/lineList'
  });
},

//跳转列表页面
goLineList2() {
  if (this.data.flag) {
    wx.switchTab({
      url: '/pages/lineList/lineList'
    });
  }
},

//跳转导航
// goAddress(e) {
//   let url = e.currentTarget.dataset.url
//   console.log(url)
//   wx.navigateTo({
//     url: url
//   });
// },

//推荐跳转
goRecommend() {
  wx.navigateTo({
    url: '/pages/recommend/recommend'
  });
},

/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function() {

},

showHints() {

},

/**
 * 生命周期函数--监听页面显示
 */
onShow: function() {
  let that = this;
  wx.getStorage({
    //获取数据的key
    key: 'phone',
    success: function(res) {
      var flag = res.data;
      if (flag) {
        flag = true
      } else {
        flag = false
      }
      that.setData({
        flag: flag
      })
    }
  })
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