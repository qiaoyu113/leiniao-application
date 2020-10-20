// pages/scanOrder/scanOrder.js
var network = require("../../utils/network.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '123',
    price: '',
    checkName: '',
    checkType: '',
    phone: '',
    COpenId: '',
    modalName: null,
    loadText: '正在确认订单',
    loadModal: false,
    orderId: '',
    source: '1',
    cityCode: '110100',
    cityName: '北京市',
    souceCity: '',
    puserId: '',
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '在线支付' //页面标题为路由参数
    });
    let that = this;
    let puserId = ''
    if (options) {
      let checkName = ''
      if (options.checkType == '1') {
        checkName = '意向金'
      } else if (options.checkType == '2') {
        checkName = '全款'
      }
      that.setData({
        name: options.name,
        price: options.price,
        checkType: options.checkType,
        COpenId: options.COpenId,
        checkName: checkName,
      })
    }
    if (options && options.puserId) {
      puserId = options.puserId;
      if (puserId) {
        this.setData({
          puserId: puserId
        })
        wx.setStorageSync('puserId', puserId)
      }
    }else{
      // 获取分享人
      this.setData({
        puserId: wx.getStorageSync('puserId')
      })
    }
    // that.checkPhone()
  },

  checkPhone() {
    let that = this;
    let token = wx.getStorageSync('token')
    if (token) {
      let phone = wx.getStorageSync('phone')
      that.setData({
        phone: phone
      })
      // that.creatOrder()
    } else {
      network.requestLoading('81/driver/v2/driver/applet/pay', {
          "driverName": '',
          "driverPhone": '',
          "openId": '',
          "payType": '',
          "paymentMoney": '',
          "remarks": ''
        },
        'post',
        '',
        'json',
        function(res) {
          if (res.success) {} else {
            that.checkPhone()
          }
        },
        function(res) {
          wx.showToast({
            title: '加载数据失败',
          });
          that.checkPhone()
        });
    }
  },

  creatOrder() {
    let that = this;
    if (that.data.name && that.data.price && that.data.checkType && that.data.COpenId) {
      if (that.data.phone) {
        network.requestLoading('api/order/v1/magpie/order/createOrderFromMagpieApp', {
            "driverName": that.data.name,
            "driverPhone": that.data.phone,
            "openId": that.data.COpenId,
            "payType": 2,
            "paymentMoney": Number(that.data.price),
            "remarks": that.data.checkName
          },
          'post',
          '',
          'json',
          function(res) {
            if (res.success) {
              if(res.data.flag){
                that.setData({
                  loadModal: false,
                  orderId: res.data.orderId
                })
              }else {
                that.setData({
                  loadText: res.data.msg,
                })
              }
            } else {
              that.setData({
                loadText: res.errorMsg,
              })
            }
          },
          function(res) {
            that.setData({
              loadText: res.errorMsg,
            });
          });
      } else {
        that.setData({
          loadText: '正在确认订单',
          loadModal: false
        })
        that.showModal()
      }
    } else {
      that.setData({
        loadText: '订单已失效，请重新扫码支付'
      })
    }
  },

  getPhoneNumber: function(e) {
    let that = this;
    if (e.detail.errMsg && e.detail.errMsg.indexOf('getPhoneNumber:fail') > -1) {
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
                        that.payOrder()
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
                  // if (that.data.cityCode == '') {
                    wx.setStorageSync('cityCode', res.data.code)
                    that.setData({
                      cityCode: res.data.code,
                      souceCity: address
                    })
                  // } else {
                  //   wx.setStorageSync('cityCode', that.data.cityCode)
                  //   that.setData({
                  //     souceCity: address
                  //   })
                  // }
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
  showModal() {
    this.setData({
      modalName: 'bottomModal'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  payOrderNow() {
    let that = this;
    network.requestLoading('api/order/v1/magpie/order/payMoneyFromMagpieApp', {
      
      "orderId": that.data.orderId
    },
      'post',
      '',
      'json',
      function (res) {
        if (res.success) {
          let respond = res.data.wxPayUnifiedOrderVo
          wx.requestPayment(
            {
              'timeStamp': respond.timeStamp,
              'nonceStr': respond.nonceStr,
              'package': respond.packageValue,
              'signType': respond.signType,
              'paySign': respond.paySign,
              'success': function (res) {
                wx.redirectTo({
                  url: '../scanOrderSuccess/scanOrderSuccess'
                });
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败',
                });
              },
              'complete': function (res) { }
            })
        } else {

        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },
  payOrder(){
    let that = this;
    network.requestLoading('81/driver/v2/driver/applet/pay', {
      payMoney: that.data.price
    },
      'POST',
      '',
      'json',
      function (res) {
        if (res.success) {
          let respond = res.data.WxPayMpOrderResult;
          let outTradeNo = res.data.outTradeNo;
          that.payResult(outTradeNo, 2)
          wx.requestPayment(
            {
              'timeStamp': respond.timeStamp,
              'nonceStr': respond.nonceStr,
              'package': respond.packageValue,
              'signType': respond.signType,
              'paySign': respond.paySign,
              'success': function () {
                wx.showToast({
                  title: '支付成功',
                });
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../scanOrderSuccess/scanOrderSuccess'
                  });
                }, 2000);
                // that.payResult(res.data.outTradeNo)
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败',
                });
              },
              'complete': function (res) { }
            })
        }else if(res.errorMsg){
          wx.showToast({
            title: res.errorMsg,
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },
  payResult(outTradeNo, status) {
    network.requestLoading('81/driver/v2/driver/applet/payResult', {
      outTradeNo,
      status
    },
      'GET',
      '',
      'json',
      function (res) {},
      function (res) {
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
  login() {
    let that = this;
    // wx.removeStorage({
    //   key: 'token',
    //   success: function(res) {}
    // })
    wx.login({
      success: function(res) {
        that.setData({
          code: res.code
        })
        network.requestLoading('25/auth/v2/jwt/getToken', {
            wxCode: that.data.code,
            puserId: that.data.puserId
          },
          'post',
          '',
          'json',
          function(res) {
            if (res.success) {
              that.setData({
                openId: res.data.openId
              })
              let token = res.data.token;
              let phone = res.data.phone;
              let openId = res.data.openId;
              let userId = res.data.userId;
              wx.setStorage({
                key: 'openId',
                data: openId,
                success: function(res) {
                  wx.setStorage({
                    key: 'userId',
                    data: userId,
                    success: function(res) {
                      if (phone) {
                        wx.setStorage({
                          key: 'phone',
                          data: phone,
                          success: function(res) {},
                        })
                        that.setData({
                          flag: true
                        })
                      }
                      wx.setStorage({
                        key: 'token',
                        data: token,
                        success: function(res) {
                          that.loginFunction()
                        },
                      })
                    }
                  })
                }
              })
            }
          },
          function(res) {
            wx.showToast({
              title: '加载数据失败',
            });
          });
      },
      fail: function(error) {
        console.log('[app-login] :: 微信用户登录失败 > ' + (JSON.stringify(error) || ''));

      }
    })
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              // console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  loginFunction() {
    let that = this;
    let cityCode = wx.getStorageSync('cityCode')
    if (!cityCode) {
      that.getMap()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    let hasToken = wx.getStorageSync('token')
    if (!hasToken) {
      that.login();
    } else {
      that.loginFunction()
    }
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