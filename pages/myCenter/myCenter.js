const app = getApp();
var network = require("../../utils/network.js");
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    entranceType: false,
    abilityCreatOrder: Boolean,
    flag: false,
    entranceType2: Boolean,
    canIUse: true,
    souceCity: '',
    source: '0',
    puserId: '',
    cityCode: '',
    cityName: '北京市'
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '个人中心' //页面标题为路由参数
    });
    let cityCode = wx.getStorageSync('cityCode')
    // 获取分享人 
    this.setData({
      puserId: wx.getStorageSync('puserId'),
      source: wx.getStorageSync('sourceType')
    })
    if (!cityCode) {
      this.getMap()
    }else{
      this.setData({
        cityCode:cityCode
      })
    }
    this.hasEnter()
    this.hasAbilityCreatOrder()
    let that = this;
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                canIUse: false
              })
            }
          })
        } else {
          that.setData({
            canIUse: true
          })
        }
      }
    })
  },
  getUserInfoFun: function() {
    var S = this;
    wx.getUserInfo({
      success: function(res) {
        S.setData({
          canIUse: false
        })
      },
      fail: S.showPrePage
    })
  },
  //是否有权限创建订单
  hasAbilityCreatOrder() {
    let that = this;
    network.requestLoading('88/driver/v2/driver/applet/judgeCreateOrderPermission', {},
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          that.setData({
            abilityCreatOrder: res.data.flag
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },
  // hesEnter() {
  //   //是否已经入驻
  //   let that = this;
  //   network.requestLoading('81/driver/v2/driver/applet/appletsMagpieClientJudge', {},
  //     'GET',
  //     '',
  //     '',
  //     function(res) {
  //       if (res.success) {
  //         let flag = res.data.flag;
  //         if (res.data.driverId && flag) {
  //           that.setData({
  //             entranceType2: flag
  //           })
  //           wx.setStorageSync('driverId', res.data.driverId)
  //         } else {
  //           that.setData({
  //             entranceType2: false
  //           })
  //         }
  //       }
  //     },
  //     function(res) {
  //       wx.showToast({
  //         title: '加载数据失败',
  //       });
  //     });
  // },
  getMap() {
    let that = this;
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'LOBBZ-Q4ZCJ-2IJFK-KHO4E-AREME-QHF3Y' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) {
            var city = addressRes.result.address_component.city;
            var address = addressRes.result.address_component.city + addressRes.result.address_component.province + addressRes.result.address_component.district
            wx.setStorageSync('locationAddress', address)
            //获取城市code
            network.requestLoading('25/base/v1/base/area/getCityCodeByCityName', {
                cityName: city
              },
              'GET',
              '',
              '',
              function(res) {
                if (res.success) {
                  if (that.data.cityCode == '') {
                    wx.setStorageSync('cityCode', res.data.code)
                    that.setData({
                      cityCode: res.data.code,
                      souceCity: address
                    })
                  } else {
                    wx.setStorageSync('cityCode', that.data.cityCode)
                    that.setData({
                      souceCity: address
                    })
                  }
                }
              },
              function(res) {
                wx.showToast({
                  title: '加载数据失败',
                });
              });
          }
        })
      }
    })
  },
  pageBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  //拨打电话
  talphone() {
    let cityName = this.data.cityName
    network.requestLoading('81/driver/v2/driver/applet/getGmInfoByUserId', {
      cityName: cityName
    },
    'GEt',
    '',
    '',
    function(res) {
      if (res.success) {
        wx.makePhoneCall({
          phoneNumber: res.data.mobile,
        })
      } else {
        wx.showToast({
          title: '获取手机号失败',
        });
      }
    },
    function(res) {
      wx.showToast({
        title: '加载数据失败',
      });
    });
  },
  goRouter(e) {
    let type = e.currentTarget.dataset.type;
    let routerName = '';
    if (type == '1') {
      routerName = '../myRecommend/myRecommend'
    } else if (type == '2') {
      routerName = '../myCollect/myCollect'
    } else if (type == '3') {
      // routerName = '../immediatelyEnter/immediatelyEnter'
      if (this.data.puserId && this.data.puserId != '') {
        routerName = '../immediatelyEnter/immediatelyEnter?type='+ type +'&puserId=' + that.data.puserId
      } else {
        routerName = '../immediatelyEnter/immediatelyEnter?type='+ type
      }
    } else if (type == '4') {
      routerName = '../persenolInfo/persenolInfo'
    } else if (type == '5') {
      routerName = '../account/account'
    } else if (type == '6') {
      routerName = '../questionMenu/questionMenu'
    } else if (type == '7') {
      routerName = '../myOrder/myOrder'
    } else if (type == '8') {
      routerName = '../incomeMenu/incomeMenu'
    } else if (type == '9') {
      routerName = '../creatOrder/creatOrder'
    } else if (type == '10') {
      routerName = '../incomeUpDataNew/incomeUpDataNew'
    } else if (type == '11') {
      routerName = '../satisfaction/satisfaction'
    } else if (type == '12') {
      routerName = '../serialOrder/serialOrder'
    } else if (type == '13') {
      routerName = '../serviceStandard/serviceStandard'
    } else if (type == '14') {
      routerName = '../myContract/myContract'
    }
    wx.navigateTo({
      url: routerName
    });
  },
  hasEnter() {
    //是否已经入驻
    let that = this;
    network.requestLoading('81/driver/v2/driver/applet/appletsMagpieClientJudge', {},
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          let flag = res.data.flag;
          wx.setStorageSync('driverId', res.data.driverId)
          that.setData({
            entranceType: flag,
            cityName: res.data.cityName
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },
  onShow: function() {
    let that = this;
    that.hasEnter()
    this.hasAbilityCreatOrder()
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
  getPhoneNumber: function(e) {
    let that = this;
    if (e.detail.errMsg && e.detail.errMsg.indexOf('getPhoneNumber:fail') > -1) {

    } else {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // 登录成功后存token
          let code = res.code;
          network.requestLoading('25/core/v1/wx/encryptedData2PhoneNo', {
            code: code,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            openId: that.data.openId
          },
          'POST',
          '',
          'json',
          function(res) {
            if (res.success) {
              let phone = res.data.phone;
              let openId = wx.getStorageSync('openId')
              network.requestLoading('25/auth/v2/jwt/getToken', {
                  openId: openId,
                  phone: phone,
                  puserId: that.data.puserId
                },
                'post',
                '',
                'json',
                function(res) {
                  if (res.success) {
                    if (res.success) {
                      wx.setStorage({
                        key: 'token',
                        data: res.data.token,
                        success: function(res) {},
                      })
                      wx.setStorage({
                        key: 'phone',
                        data: res.data.phone,
                      })
                      wx.setStorage({
                        key: 'openId',
                        data: res.data.openId,
                      })
                      that.setData({
                        flag: true,
                        openId: res.data.openId
                      })
                    }
                  }
                },
                function(res) {
                  wx.showToast({
                    title: '加载数据失败',
                  });
                });
              network.requestLoading('32/driver/v2/driver/applet/clue/generateClue', {
                "phone": phone,
                "sourceChannel": that.data.source,
                "workCity": that.data.cityCode,
                "recoUserId": that.data.puserId,
                "authorizePosition": that.data.souceCity,
                "name": '',
                "busiType": ''
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
                        that.setData({
                          flag: true
                        })
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
        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let userId = wx.getStorageSync('userId')
    return {
      title: '自主创业，随时上岗；货源稳定、线路优质；购车保收入10万+/年',
      path: '/pages/index/index?puserId=' + userId + '&source=2',
      imageUrl: '../../lib/image/shareImg.jpg',
      success: function(res) {
        // 转发成功
      },
    }
  }
});