// pages/lineDetail/lineDetail.js
var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var network = require("../../utils/network.js");
var url = app.globalData.url;
var qqmapsdk;
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    recommendState: false,
    noEnter: true,
    markers: [],
    poi: '',
    mapShow: true,
    id: '',
    detail: '',
    numDetail: '',
    numDetail2: '',
    entranceType: false,
    collect: false,
    flag: false,
    firstCome: false,
    cityCode: '',
    cityName: '',
    city: '',
    souceCity: '',
    source: '1',
    puserId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 是否第一次进入
    if (options && options.firstCome) {
      let flag = true;
      this.setData({
        firstCome: flag
      })
    }
    // 获取城市
    if (options && options.city) {
      this.setData({
        city: options.city
      })
    } else {
      //获取当前位置
      this.getCityCode()
    }
    // 获取来源
    if (options && options.source) {
      this.setData({
        source: options.source
      })
    }
    wx.setStorageSync('sourceType', this.data.source)
    // 获取分享人 
    this.setData({
      puserId: wx.getStorageSync('puserId')
    })
    // 线路Id
    if (options && options.id) {
      this.setData({
        id: options.id
      })
    }
    this.getDetail()
    this.hasEnter()
    this.hasCollect()
  },

  hasEnter() {
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
            noEnter: true
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  closeEnter() {
    this.setData({
      noEnter: !this.data.noEnter
    })
  },

  hasCollect() {
    let that = this;
    network.requestLoading('api/driver/driver/magpie/whetherToCollectTheCurrentLine', {
        lineId: that.data.id
      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          let flag = res.data.flag;
          that.setData({
            collect: flag
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  //拨打电话
  talphone(e) {
    let cityName = this.data.detail.cityName
    network.requestLoading('api/driver/driver/magpie/getXcxCustomerServicePhone', {
      cityName: cityName
    },
    'GET',
    '',
    '',
    function(res) {
      if (res.success) {
        wx.makePhoneCall({
          phoneNumber: res.data[0],
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

  enTranceNow() {
    let that = this;
    let puserId = that.data.puserId
    if (puserId == '') {
      wx.navigateTo({
        url: '/pages/immediatelyEnterNew/immediatelyEnterNew?type=detail'
      });
    } else {
      wx.navigateTo({
        url: '/pages/immediatelyEnterNew/immediatelyEnterNew?type=detail&puserId=' + that.data.puserId
      });
    }

  },

  //收藏操作
  collectBtn(e) {
    let that = this;
    let status = e.target.dataset.type
    network.requestLoading('api/driver/driver/magpie/collectTheCurrentLine', {
        "lineId": that.data.id,
        "state": status
      },
      'POST',
      '',
      'json',
      function(res) {
        if (res.success) {
          if (res.data.flag) {
            if (status == 1) {
              that.setData({
                collect: true
              })
              // Toast('成功收藏');
              Toast('您的加盟经理会尽快联系您');
            } else {
              that.setData({
                collect: false
              })
              Toast('已取消收藏');
            }
            that.getCollectNum()
          }
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  getDetail() {
    let that = this
    network.requestLoading('api/v1/line/lineInfo/getXcxLineTaskDetail', {
        "key": that.data.id,
        "limit": 0,
        "page": 0
      },
      'post',
      '',
      'json',
      function(res) {
        if (res.success) {
          if (res.data[0].workingTimeRegin) {
            res.data[0].workingTimeRegin = res.data[0].workingTimeRegin.split(",")
          } else {
            res.data[0].workingTimeRegin = '—'
          }
          res.data[0].receiverType = res.data[0].receiverType ? res.data[0].receiverType : ''
          that.setData({
            detail: res.data[0]
          })
          wx.setNavigationBarTitle({
            title: that.data.detail.cargoType //页面标题为路由参数
          });
          // 实例化腾讯地图API核心类
          qqmapsdk = new QQMapWX({
            key: 'LOBBZ-Q4ZCJ-2IJFK-KHO4E-AREME-QHF3Y' // 必填
          });
          //1、获取当前位置坐标
          let address = that.data.detail.warehouse;
          if (address == '') {

          }
          qqmapsdk.geocoder({
            address: that.data.detail.warehouse, //搜索关键词
            success: function(res) { //搜索成功后的回调
              var res = res.result;
              var latitude = Number(res.location.lat);
              var longitude = Number(res.location.lng);
              //根据地址解析在地图上标记解析地址位置
              that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
                markers: [{
                  id: 0,
                  title: res.title,
                  latitude: latitude,
                  longitude: longitude,
                  iconPath: '../../lib/image/position.png', //图标路径
                  width: 50,
                  height: 50
                }],
                poi: { //根据自己data数据设置相应的地图中心坐标变量名称
                  latitude: latitude,
                  longitude: longitude
                }
              });
            },
            fail: function(res) {
              that.setData({
                mapShow: false
              })
            },
            complete: function(res) {
              // console.log(res)
            }
          });
          // 查看浏览数
          network.requestLoading('api/driver/driver/magpie/linePageVies', {
              "lineId": that.data.detail.lineId,
            },
            'get',
            '',
            '',
            function(res) {
              if (res.success) {
                that.setData({
                  numDetail: res.data.pageView
                })
              }
            },
            function(res) {
              wx.showToast({
                title: '加载数据失败',
              });
            });
          that.getCollectNum()
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  getCollectNum() {
    let that = this;
    // 查看收藏量
    network.requestLoading('api/driver/driver/magpie/lineCollection', {
        "lineId": that.data.detail.lineId,
      },
      'get',
      '',
      '',
      function(res) {
        if (res.success) {
          that.setData({
            numDetail2: res.data.collection
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  getCityCode() {
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
            network.requestLoading('api/base/base/dict/getCityCode', {
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

  openRecommend() {
    this.setData({
      recommendState: true,
      mapShow: false
    })
  },

  closeRecommend() {
    this.setData({
      recommendState: false,
      mapShow: true
    })
  },

  // 防止滑动
  myCatchTouch: function() {
    return;
  },

  goRecommendDetail() {
    wx.navigateTo({
      url: '../recommendDetail/recommendDetail?id=' + this.data.detail.lineId + '&city=' + this.data.cityCode
    });
  },

  goRecommend() {
    wx.navigateTo({
      url: '../recommend/recommend'
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

  getPhoneNumber2: function(e) {
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
        }
      })
      let code = wx.getStorageSync('code')
      let openId = wx.getStorageSync('openId')
      network.requestLoading('api/core/v1/wx/encryptedData2PhoneNo', {
          code: code,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          openId: openId
        },
        'POST',
        '',
        '',
        function(res) {
          if (res.success) {
            let phone = res.data.phone;
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
            if (that.data.city == '') {
              that.setData({
                city: that.data.cityCode
              })
            }
            // network.requestLoading('api/driver/driver/clue/create', {
            //     "phone": phone,
            //     "sourceType": that.data.source,
            //     "workCity": that.data.city,
            //     "puserId": that.data.puserId,
            //     "authorizePosition": that.data.souceCity
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
                        url: '/pages/immediatelyEnter/immediatelyEnter?type=home'
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
    }
  },

  goHome: function() {
    let that = this;
    wx.reLaunch({
      url: "/pages/index/index?source=" + that.data.source + '&puserId=' + that.data.id + '&city=' + that.data.cityCode //这个是默认的单页
    });
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
    let puserId = wx.getStorageSync('userId')
    return {
      title: '优选线路:' + this.data.detail.lineName,
      path: '/pages/lineDetail/lineDetail?firstCome=true&id=' + this.data.id + '&city=' + this.data.cityCode + '&source=2&puserId=' + puserId,
      success: function(res) {
        // 转发成功
      },
    }
  }
})