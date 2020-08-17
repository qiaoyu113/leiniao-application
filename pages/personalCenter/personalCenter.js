// pages/personalCenter/personalCenter.js
const app = getApp();
var network = require("../../utils/network.js");
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    entranceType: false,
    abilityCreatOrder: Boolean,
    flag: false,
    entranceType2: Boolean,
    canIUse: true,
    isVip: false,
    souceCity: '',
    puserId: '',
    cityCode: '',
    orderNum: 0,
    contractNum: 0,
    nikeName: '暂无昵称',
    cityName: '北京市'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心' //页面标题为路由参数
    });
    let cityCode = wx.getStorageSync('cityCode')
    // 获取分享人 
    this.setData({
      puserId: wx.getStorageSync('puserId')
    })
    if (!cityCode) {
      this.getMap()
    }
    this.hasAbilityCreatOrder()
    // this.getVip()
    let that = this;
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                canIUse: false,
                nikeName: res.userInfo.nickName
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
  getVip() {
    let that = this;
    let driverId = wx.getStorageSync('driverId')
    if(driverId){
      //获取是否是vip
      network.requestLoading('api/business_center/v1/order/judgeMember', {
        driver: driverId
      },
      'get',
      '',
      'json',
      function(res) {
        if (res.success) {
          that.setData({
            isVip: res.data.data
          })
        } else {
          wx.stopPullDownRefresh()
        }
      },
      function(res) {
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '加载数据失败',
        });
      });
    } else {
      that.setData({
        isVip: false
      })
    }    
  },
  fetchData(driverId) {
    let that = this;
    //获取订单数量
    network.requestLoading('api/business_center/v1/order/countOrderByDriverId', {
      driverId: driverId
    },
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          //过滤picker
          that.setData({
            orderNum: res.data
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });

    //获取合同数量
    network.requestLoading('api/business_center/v1/contract/countContractByDriverId', {
      driverId: driverId
    },
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          //过滤picker
          that.setData({
            contractNum: res.data
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },
  getUserInfoFun: function() {
    var S = this;
    wx.getUserInfo({
      success: function(res) {
        S.setData({
          canIUse: false,
          nikeName: res.userInfo.nickName
        })
      },
      fail: S.showPrePage
    })
  },
  //是否有权限创建订单
  hasAbilityCreatOrder() {
    let that = this;
    network.requestLoading('api/order/v1/magpie/order/judgeCreateOrderPermission', {},
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
  hasEnter() {
    //是否已经入驻
    let that = this;
    let phone = wx.getStorageSync('phone')
    if(!phone){
      that.setData({
        entranceType: false
      })
    } else {
      network.requestLoading('api/driver/v1/driver/clue/clue/has-stationed', {
        phone: phone
      },
        'GET',
        '',
        '',
        function(res) {
          if (res.success) {
            // let flag = res.data.flag;
            let flag = res.data.stationed;
            // if (res.data.driverId && flag) {
            if (flag) {
              that.setData({
                entranceType: true
              })
              if(res.data.cityName){
                that.setData({
                  cityName: res.data.cityName
                })
              }
              if(res.data.type === 3){
                wx.setStorageSync('driverId', res.data.id)
                that.fetchData(res.data.id)
              }
            } else {
              that.setData({
                entranceType: false
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
  },
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
            network.requestLoading('api/base/v1/base/area/getAreaCodeByName', {
                cityName: city
              },
              'GET',
              '',
              '',
              function(res) {
                if (res.success) {
                  if (that.data.cityCode == '') {
                    wx.setStorageSync('cityCode', res.data)
                    that.setData({
                      cityCode: res.data,
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
    network.requestLoading('api/driver/v1/driver/getGmInfoByUserId', {
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
      routerName = '../immediatelyEnterNew/immediatelyEnterNew'
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
      routerName = '../myOrderList/myOrderList'
    } else if (type == '15') {
      routerName = '../contractList/contractList'
    } else if (type == '16') {
      routerName = '../payDeposit/payDeposit'
    }
    wx.navigateTo({
      url: routerName
    });
  },
  hasEnterPhone() {
    //是否已经入驻
    let that = this;
    network.requestLoading('api/driver/driver/magpie/appletsMagpieClientJudge', {},
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          let flag = res.data.flag;
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
    // that.hasEnterPhone()
    that.hasEnter()
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
    that.getDriverId()
  },
  getDriverId:function() {
    let that = this;
    //获取driverId
    network.requestLoading('api/driver/v1/driver/getDriverIDByUserId', {
    },
    'GET',
    '',
    '',
    function(res) {
      if (res.success) {
        wx.setStorageSync('driverId', res.data)
      }
    },
    function(res) {
      wx.showToast({
        title: '加载数据失败',
      });
    });
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
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
    
          // 登录成功后存token
          let code = res.code;
          // let code = wx.getStorageSync('code')
      let openId = wx.getStorageSync('openId')
      network.requestLoading('api/core/v1/wx/encryptedData2PhoneNo', {
          code: code,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          openId: openId
        },
        'POST',
        '',
        'json',
        function(res) {
          if (res.success) {
            let phone = res.data;
            network.requestLoading('api/auth/v1/jwt/getToken', {
                openId: openId,
                phone: phone
              },
              'post',
              '',
              'json',
              function(res) {
                if (res.success) {
                  wx.setStorage({
                    key: 'token',
                    data: res.data.token,
                    success: function(res) {},
                  })
                }
              },
              function(res) {
                wx.showToast({
                  title: '加载数据失败',
                });
              });
            let source = wx.getStorageSync('sourceType')
            network.requestLoading('api/driver/v1/driver/clue/create/activity', {
                "phone": phone,
                "sourceChannel": source,
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
                      wx.navigateTo({
                        url: '/pages/immediatelyEnter/immediatelyEnter?type=myCenter'
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
              wx.setStorage({
                key: 'phone',
                data: phone,
                success: function(res) {
                  wx.navigateTo({
                    url: '/pages/immediatelyEnter/immediatelyEnter?type=myCenter'
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
})