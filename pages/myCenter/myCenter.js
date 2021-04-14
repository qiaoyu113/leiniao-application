const app = getApp();
var network = require("../../utils/network.js");
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    entranceType: false,
    abilityCreatOrder: Boolean,
    flag: false,
    entranceType2: Boolean,
    canIUse: false,
    souceCity: '',
    source: '0',
    puserId: '',
    cityCode: '',
    headImg: 'https://img0.baidu.com/it/u=2291332875,175289127&fm=26&fmt=auto&gp=0.jpg',
    userName: '',
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
      // this.getMap()
    }else{
      this.setData({
        cityCode:cityCode
      })
    }
    let that = this;
    try {
      var value = wx.getStorageSync('phone')
      if (value) {
        that.setData({
          canIUse: true
        })
      } else {
        that.setData({
          canIUse: false
        })
      }
    } catch (e) {
      that.setData({
        canIUse: false
      })
    }
  },
  getUserInfoFun: function() {
    var S = this;
    wx.getUserInfo({
      success: function(res) {
        S.setData({
          canIUse: true
        })
      },
      fail: S.showPrePage
    })
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
  goLogin() {
    wx.navigateTo({
      url: '../login/login'
    });
  },
  goRouter(e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    let canIUse = that.data.canIUse
    let routerName = '';
    if (type == '1') {
      if (canIUse) {
        routerName = '../collect/collect'
      } else {
        routerName = '../login/login'
      }
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
        // wx.showToast({
        //   title: '加载数据失败',
        // });
      });
  },
  onShow: function() {
    let that = this;
    try {
      var value = wx.getStorageSync('phoneName')
      if (value) {
        console.log(3333, value)
        that.setData({
          userName: value,
          canIUse: true
        })
      } else {
        that.setData({
          canIUse: false
        })
      }
    } catch (e) {
      console.log(1)
      that.setData({
        canIUse: false
      })
    }
    console.log(that.data.canIUse)
    that.hasEnter()
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
                      let pre =  phone.substr(0,3);
                      let next = phone.substr(7,4);
                      let phones  =  pre + '****' + next;
                      that.setData({
                        flag: true,
                        userName: phones,
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
  // 退出
  quit() {
    Dialog.confirm({
      message: '确定退出登录吗？',
    }).then(() => {
      this.setData({
        canIUse: false
      })
      wx.removeStorageSync('phoneName')()
    })
    .catch(() => {
      // on cancel
    });
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