// pages/lineList/lineList.js
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityArray: [],
    cityCode: '110100',
    array2Code: '',
    array3Code: '',
    array4Code: '',
    array: [],
    index: 0,
    index2: '',
    index3: 0,
    index4: 0,
    page: 1,
    list: [],
    flag: false,
    array2: [],
    areaArr: [],
    array3: [],
    goodArray: [],
    array4: [],
    carArray: [],
    areaVal: '区域',
    goodVal: '货物类型',
    carVal: '车型',
    image_filepath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '货源大厅' //页面标题为路由参数
    });
    this.getCity()
    this.getList()
    this.getLoad()
  },

  getLoad() {
    // 获取图片
    let that = this;
    const path = wx.getStorageSync('image_cache_Line')
    if (path && path != null) {
      that.setData({
        image_filepath: path
      })
    } else {
      wx.downloadFile({
        url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/539e47df1c024da4aa9216b36b6c9ff8',
        success: function (res) {
          if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager()
            fs.saveFile({
              tempFilePath: res.tempFilePath, // 传入一个临时文件路径
              success(res) {
                that.setData({
                  image_filepath: res.savedFilePath
                })
                wx.setStorageSync('image_cache_Line', res.savedFilePath)
              }
            })
          } else {
            console.log('响应失败', res.statusCode)
          }
        }
      })
    }
  },

  getCity() {
    let that = this;
    //获取城市列表
    network.requestLoading('api/line/line/task/getXcxLineCity', {
        // dictType: 'online_city'
      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          //过滤picker
          that.setData({
            array: res.data
          });
          const arrays = that.data.array
          let arr = [];
          arrays.forEach(function (item) {
            arr.push(item.cityName);
          })
          that.setData({
            cityArray: arr
          });
          //获取区域
          that.getCityCode(0)
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
    //获取货物类型
    network.requestLoading('api/base/base/dict/qryDictByType', {
        dictType: 'type_of_goods'
      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          //过滤picker
          that.setData({
            array3: res.data
          });
          const arrays = that.data.array3
          arrays.unshift({
            code: "货物类型",
            codeVal: ""
          })
          let goodArray = common.picker(arrays)
          that.setData({
            goodArray: goodArray
          });
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
    //获取车型
    network.requestLoading('api/base/base/dict/qryDictByType', {
        dictType: 'Intentional_compartment'
      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          //过滤picker
          that.setData({
            array4: res.data
          });
          const arrays = that.data.array4
          arrays.unshift({
            code: "车型",
            codeVal: ""
          })
          let carArray = common.picker(arrays)
          that.setData({
            carArray: carArray
          });
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  getCityCode(i) {
    let that = this;
    that.setData({
      array2: that.data.array[i].countyDTOS
    });
    const arrays = that.data.array2
    let arr = [];
    arrays.forEach(function (item) {
      arr.push(item.countyName);
    })
    that.setData({
      areaArr: arr
    });
    // network.requestLoading('api/base/user/area/getReginByCityCode', {
    //     city: that.data.cityCode
    //   },
    //   'GET',
    //   '',
    //   '',
    //   function(res) {
    //     if (res.success) {
    //       //过滤picker
    //       that.setData({
    //         array2: res.data
    //       });
    //       const arrays = that.data.array2
    //       let areaArr = common.picker2(arrays)
    //       that.setData({
    //         areaArr: areaArr
    //       });
    //     }
    //   },
    //   function(res) {
    //     wx.showToast({
    //       title: '加载数据失败',
    //     });
    //   });
  },

  getList() {
    let that = this;
    //获取线路列表
    network.requestLoading('api/bss/v1/bss/line/task/xcxLineTasks', {
        "carTypeName": that.data.array4Code,
        "cargoType": that.data.array3Code,
        "region": that.data.array2Code,
        "city": that.data.cityCode,
        "key": '',
        "limit": 20,
        "page": that.data.page
      },
      'POST',
      '',
      'json',
      function(res) {
        if (res.success) {
          let arr = res.data;
          let lists = that.data.list.concat(arr)
          that.setData({
            list: lists
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
  talphone() {
    wx.makePhoneCall({
      phoneNumber: '400-688-9179',
    })
  },

  goDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../lineDetail/lineDetail?id=' + id
    });
  },

  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
      cityCode: this.data.array[e.detail.value].cityCode,
      page: 1,
      list: [],
      array2Code: '',
      areaVal: '区域'
    })
    //获取区域
    this.getCityCode(e.detail.value)
    this.getList()
  },

  bindPickerChange2(e) {
    this.setData({
      index2: e.detail.value,
      areaVal: this.data.array2[e.detail.value].countyName,
      array2Code: this.data.array2[e.detail.value].countyCode,
      page: 1,
      list: []
    })
    this.getList()
  },

  bindPickerChange3(e) {
    this.setData({
      index3: e.detail.value,
      goodVal: this.data.array3[e.detail.value].code,
      array3Code: this.data.array3[e.detail.value].codeVal,
      page: 1,
      list: []
    })
    this.getList()
  },

  bindPickerChange4(e) {
    this.setData({
      index4: e.detail.value,
      carVal: this.data.array4[e.detail.value].code,
      array4Code: this.data.array4[e.detail.value].codeVal,
      page: 1,
      list: []
    })
    this.getList()
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

  myCatchTouch: function() {
    console.log('stop user scroll it!');
    return;
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
      // network.requestLoading('api/core/v1/wx/getOpenIdByCode', {
      //   code: that.data.code
      // },
      //   'POST',
      //   '',
      //   '',
      //   function (res) {
      //     if (res.success) {
      //       that.setData({
      //         openId: res.data
      //       });
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
            let souceCity = wx.getStorageSync('locationAddress')
            let source = wx.getStorageSync('sourceType')
            let cityCode = wx.getStorageSync('cityCode')
            network.requestLoading('api/driver/driver/clue/create', {
                "phone": phone,
                "sourceType": source,
                "workCity": cityCode,
                "authorizePosition": souceCity
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
      // }
      // },
      // function (res) {
      //   wx.showToast({
      //     title: '加载数据失败',
      //   });
      // });
    }
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
    let page = this.data.page;
    page = page + 1;
    this.setData({
      page: page
    })
    this.getList()
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