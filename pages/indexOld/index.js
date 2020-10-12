var app = getApp();
var network = require("../../utils/network.js");
var url = app.globalData.url;
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
var qqmapsdk;

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
    bannerImg: [],
    imgUrl: '',
    recommendArray: [],
    code: '',
    openId: '',
    currentCity: '',
    cityCode: '',
    souceCity: '',
    puserId: '',
    cityName: '北京市',
    source: '1',
    hindBgType: false,
    entranceType: false, // 是否已经入驻
    image_filepath: '',
    image_filepath2: '',
    image_filepath3: '',
    image_filepath4: '',
    image_filepath5: '',
    image_filepath6: '',
  },

  startAuth() {
    wx.checkIsSupportSoterAuthentication({
      success(res) {
        let supportMode = res.supportMode
        const startSoterAuthentication = () => {
          wx.startSoterAuthentication({
            requestAuthModes: supportMode,
            challenge: 'test',
            authContent: '小程序示例',
            success: (res) => {
              wx.showToast({
                title: '认证成功'
              })
            },
            fail: (err) => {
              console.error(err)
              wx.showModal({
                title: '失败',
                content: '认证失败',
                showCancel: false
              })
            }
          })
        }

        const checkIsEnrolled = () => {
          wx.checkIsSoterEnrolledInDevice({
            checkAuthMode: supportMode[0],
            success: (res) => {
              console.log(2, res)
              if (parseInt(res.isEnrolled) <= 0) {
                wx.showModal({
                  title: '错误',
                  content: '您暂未录入指纹信息，请录入后重试',
                  showCancel: false
                })
                return
              }
              startSoterAuthentication();
            },
            fail: (err) => {
              console.error(err)
            }
          })
        }

        wx.checkIsSupportSoterAuthentication({
          success: (res) => {
            console.log(1, res)
            checkIsEnrolled()
          },
          fail: (err) => {
            console.error(err)
            wx.showModal({
              title: '错误',
              content: '您的设备不支持指纹识别',
              showCancel: false
            })
          }
        })
      },
      errMsg(err) {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let phone = wx.getStorageSync('phone')
    let hasToken = wx.getStorageSync('token')
    let puserId = ''
    if (JSON.stringify(options) != "{}") {
      wx.reportAnalytics('total_information', {
        total_information: JSON.stringify(options),
      });
    }
    if (options && options.puserId) {
      puserId = options.puserId;
      if (puserId) {
        this.setData({
          puserId: puserId
        })
        wx.setStorageSync('puserId', puserId)
      }
    }
    if (options && options.city) {
      this.setData({
        cityCode: options.city
      })
      wx.setStorageSync('cityCode', this.data.cityCode)
      wx.reportAnalytics('city_resource', {
        city: options.city,
      });
    }
    if (options && options.source && options.source !== '') {
      this.setData({
        source: options.source
      })
      console.log(options)
      wx.reportAnalytics('source', {
        source: options.source,
      });
    }
    wx.setStorageSync('sourceType', this.data.source)
    // if (!hasToken) {
    this.login();
    // } else {
    // if (puserId && puserId != '') {
    //     wx.redirectTo({
    //       url: '/pages/login/login?puserId=' + userId
    //     });
    // } else {
    //     wx.redirectTo({
    //       url: '/pages/login/login'
    //     });
    // }
    // }
    this.getLoadImg()

  },

  getLoadImg() {
    // 获取图片
    let that = this;
    const path = wx.getStorageSync('image_cache_index1')
    if (path && path != null) {
      that.setData({
        image_filepath: path
      })
    } else {
      wx.downloadFile({
        url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/53b4a46105ee45caaad5035a27e9f485',
        success: function(res) {
          if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager()
            fs.saveFile({
              tempFilePath: res.tempFilePath, // 传入一个临时文件路径
              success(res) {
                that.setData({
                  image_filepath: res.savedFilePath
                })
                wx.setStorageSync('image_cache_index1', res.savedFilePath)
              }
            })
          } else {
            console.log('响应失败', res.statusCode)
          }
        }
      })
    }
    const path2 = wx.getStorageSync('image_cache_index2')
    if (path2 && path2 != null) {
      that.setData({
        image_filepath2: path2
      })
    } else {
      wx.downloadFile({
        url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/8947c1ad74914f6d8f72eab2efedce18',
        success: function(res) {
          if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager()
            fs.saveFile({
              tempFilePath: res.tempFilePath, // 传入一个临时文件路径
              success(res) {
                that.setData({
                  image_filepath2: res.savedFilePath
                })
                wx.setStorageSync('image_cache_index2', res.savedFilePath)
              }
            })
          } else {
            console.log('响应失败', res.statusCode)
          }
        }
      })
    }
    const path3 = wx.getStorageSync('image_cache_index3')
    if (path3 && path3 != null) {
      that.setData({
        image_filepath3: path3
      })
    } else {
      wx.downloadFile({
        url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/f9e2e843897840b29ae834b52599c6ba',
        success: function(res) {
          if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager()
            fs.saveFile({
              tempFilePath: res.tempFilePath, // 传入一个临时文件路径
              success(res) {
                that.setData({
                  image_filepath3: res.savedFilePath
                })
                wx.setStorageSync('image_cache_index3', res.savedFilePath)
              }
            })
          } else {
            console.log('响应失败', res.statusCode)
          }
        }
      })
    }
    const path4 = wx.getStorageSync('image_cache_index4')
    if (path4 && path4 != null) {
      that.setData({
        image_filepath4: path4
      })
    } else {
      wx.downloadFile({
        url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/4af0c66ef2d44555a82fae815cf60ca1',
        success: function(res) {
          if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager()
            fs.saveFile({
              tempFilePath: res.tempFilePath, // 传入一个临时文件路径
              success(res) {
                that.setData({
                  image_filepath4: res.savedFilePath
                })
                wx.setStorageSync('image_cache_index4', res.savedFilePath)
              }
            })
          } else {
            console.log('响应失败', res.statusCode)
          }
        }
      })
    }
    const path5 = wx.getStorageSync('image_cache_index5')
    if (path5 && path5 != null) {
      that.setData({
        image_filepath5: path5
      })
    } else {
      wx.downloadFile({
        url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/89147cd50ccf4f2293e23cc7438dc7ce',
        success: function(res) {
          if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager()
            fs.saveFile({
              tempFilePath: res.tempFilePath, // 传入一个临时文件路径
              success(res) {
                that.setData({
                  image_filepath5: res.savedFilePath
                })
                wx.setStorageSync('image_cache_index5', res.savedFilePath)
              }
            })
          } else {
            console.log('响应失败', res.statusCode)
          }
        }
      })
    }
    const path6 = wx.getStorageSync('image_cache_index6')
    if (path6 && path6 != null) {
      that.setData({
        image_filepath6: path6
      })
    } else {
      wx.downloadFile({
        url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/d10dffb1c94a445a9b191680181bd8e0',
        success: function(res) {
          if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager()
            fs.saveFile({
              tempFilePath: res.tempFilePath, // 传入一个临时文件路径
              success(res) {
                that.setData({
                  image_filepath6: res.savedFilePath
                })
                wx.setStorageSync('image_cache_index6', res.savedFilePath)
              }
            })
          } else {
            console.log('响应失败', res.statusCode)
          }
        }
      })
    }
  },

  getBanner() {
    let that = this;
    //获取轮播图链接
    network.requestLoading('25/base/v2/base/getBanner', {

      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          that.setData({
            bannerImg: res.data
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
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
            network.requestLoading('25/base/v2/base/dict/getCityCode', {
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
    that.getBanner()
    that.getDataList()
    that.hasEnter()
    let cityCode = wx.getStorageSync('cityCode')
    if (!cityCode) {
      that.getMap()
    }
  },

  enTranceNow() {
    let that = this;
    // wx.navigateTo({
    //   url: '/pages/immediatelyEnterNew/immediatelyEnterNew?type=home'
    // });
    if (that.data.puserId && that.data.puserId != '') {
      wx.navigateTo({
        url: '/pages/immediatelyEnterNew/immediatelyEnterNew?type=home&puserId=' + that.data.puserId
      });
    } else {
      wx.navigateTo({
        url: '/pages/immediatelyEnterNew/immediatelyEnterNew?type=home'
      });
    }
  },

  getDataList() {
    let that = this;
    //获取梧桐推荐列表
    network.requestLoading('81/driver/v2/driver/getHighQualityLine', {
        dictType: 'online_city'
      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          that.setData({
            recommendArray: res.data
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
          network.requestLoading('25/core/v2/core/wx/encryptedData2PhoneNo', {
            code: code,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            openId: that.data.openId
          },
          'POST',
          '',
          '',
          function(res) {
            if (res.success) {
              if (res.data.flag) {
                let phone = res.data.phone;
                let openId = wx.getStorageSync('openId')
                network.requestLoading('25/auth/v2/jwt/getToken', {
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
                // network.requestLoading('api/driver/driver/clue/create', {
                //     "phone": phone,
                //     "sourceType": that.data.source,
                //     "workCity": that.data.cityCode,
                //     "authorizePosition": that.data.souceCity
                network.requestLoading('32/driver/v2/driver/applet/clue/generateClue', {
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
                          // wx.navigateTo({
                          //   url: '/pages/immediatelyEnter/immediatelyEnter?type=home'
                          // });
                          if (that.data.puserId && that.data.puserId != '') {
                            wx.navigateTo({
                              url: '/pages/immediatelyEnterNew/immediatelyEnterNew?type=home&puserId=' + that.data.puserId
                            });
                          } else {
                            wx.navigateTo({
                              url: '/pages/immediatelyEnterNew/immediatelyEnterNew?type=home'
                            });
                          }
                        },
                      })
                    }
                  },
                  function(res) {
                    wx.showToast({
                      title: '加载数据失败',
                    });
                  });
              } else {
                wx.showToast({
                  title: res.data.memo,
                });
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
          network.requestLoading('25/core/v2/core/wx/encryptedData2PhoneNo', {
            code: code,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            openId: that.data.openId
          },
          'POST',
          '',
          '',
          function(res) {
            if (res.success) {
              let phone = res.data.phone;
              let openId = wx.getStorageSync('openId')
              network.requestLoading('25/auth/v2/jwt/getToken', {
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
              // network.requestLoading('api/driver/driver/clue/create', {
              //     "phone": phone,
              //     "sourceType": that.data.source,
              //     "workCity": that.data.cityCode,
              //     "authorizePosition": that.data.souceCity
              network.requestLoading('32/driver/v2/driver/applet/clue/generateClue', {
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
      })
      
    }
  },

  //拨打电话
  talphone() {
    let cityName = this.data.cityName
    network.requestLoading('81/v2/driver/getGmInfoByUserId', {
      cityName: cityName
    },
    'GET',
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

  //跳转列表页面
  goLineList() {
    wx.switchTab({
      url: '/pages/lineList/lineList'
    });
  },

  // 跳转活动详情
  goActivity() {
    let that = this;
    if (this.data.entranceType) {
      network.requestLoading('api/driver/bless-words/get-xique-activity-finished', {
          id: 1
        },
        'get',
        '',
        '',
        function(res) {
          if (res.success) {
            if (!res.data.end) {
              wx.navigateTo({
                url: '/pages/activity/activity'
              });
            } else {
              wx.navigateTo({
                url: '/pages/activityResult/activityResult'
              });
            }
          }
        },
        function(res) {
          wx.showToast({
            title: '加载数据失败',
          });
        });
    } else {
      that.setData({
        hindBgType: true
      })
      Dialog.confirm({
        title: '提示',
        message: '请先入驻为梧桐司机后方可参加活动'
      }).then(() => {
        wx.navigateTo({
          url: '/pages/immediatelyEnterNew/immediatelyEnterNew?type=home'
        });
        that.setData({
          hindBgType: false
        })
      }).catch(() => {
        that.setData({
          hindBgType: false
        })
      });
    }
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