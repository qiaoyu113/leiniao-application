// pages/lineList/lineList.js
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectCityType: false,
    selectCityType2: false,
    cityArray: [],
    cityArray2: [],
    cityCode: '110100',
    cityCode2: '110100',
    array2Code: '',
    array2_1Code: '',
    array3Code: '',
    array4Code: '',
    array: [],
    carCheckList: [],
    cargoCheckList: [],
    difficultyCheckList: [],
    index: 0,
    index2: '',
    index3: 0,
    index4: 0,
    page: 1,
    list: [],
    flag: false,
    array2: [],
    array2_1: [],
    areaArr: [],
    array3: [],
    goodArray: [],
    array4: [],
    carArray: [],
    areaVal: '配送区域',
    goodVal: '更多',
    carVal: '车型',
    puserId: '',
    checkAreaCode: [],
    checkAreaCode2: [],
    carType: false,
    otherType: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '货源大厅' //页面标题为路由参数
    });
    console.log(options)
    if (options && options.puserId) {
      let puserId = options.puserId;
      if (puserId) {
        this.setData({
          puserId: puserId
        })
        wx.setStorageSync('puserId', puserId)
        this.loginPuserId();
      }
    } else {
      // 获取分享人 
      this.setData({
        puserId: wx.getStorageSync('puserId')
      })
    }
    this.getCity()
    this.getLoad()
  },

  getLoad() {
    // 获取图片
    let that = this;
    // const path = wx.getStorageSync('image_cache_Line')
    // if (path && path != null) {
    //   that.setData({
    //     image_filepath: path
    //   })
    // } else {
    //   wx.downloadFile({
    //     url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/539e47df1c024da4aa9216b36b6c9ff8',
    //     success: function(res) {
    //       if (res.statusCode === 200) {
    //         const fs = wx.getFileSystemManager()
    //         fs.saveFile({
    //           tempFilePath: res.tempFilePath, // 传入一个临时文件路径
    //           success(res) {
    //             that.setData({
    //               image_filepath: res.savedFilePath
    //             })
    //             wx.setStorageSync('image_cache_Line', res.savedFilePath)
    //           }
    //         })
    //       } else {
    //         console.log('响应失败', res.statusCode)
    //       }
    //     }
    //   })
    // }
    wx.getStorage({
      //获取数据的key
      key: 'phone',
      success: function (res) {
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

  // 有推荐人
  loginPuserId() {
    let that = this;
    // wx.removeStorage({
    //   key: 'token',
    //   success: function(res) {}
    // })
    wx.login({
      success: function (res) {
        that.setData({
          code: res.code
        })
        network.requestLoading('api/auth/v1/jwt/getToken', {
          wxCode: that.data.code,
          puserId: that.data.puserId
        },
          'post',
          '',
          'json',
          function (res) {
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
                success: function (res) {
                  wx.setStorage({
                    key: 'userId',
                    data: userId,
                    success: function (res) {
                      if (phone) {
                        wx.setStorage({
                          key: 'phone',
                          data: phone,
                          success: function (res) { },
                        })
                      }
                      wx.setStorage({
                        key: 'token',
                        data: token,
                        success: function (res) {
                          that.loginFunction()
                        },
                      })
                    }
                  })
                }
              })
            }
          },
          function (res) {
            wx.showToast({
              title: '加载数据失败',
            });
          });
      },
      fail: function (error) {
        console.log('[app-login] :: 微信用户登录失败 > ' + (JSON.stringify(error) || ''));
      }
    })
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
          const arrays = JSON.parse(JSON.stringify(that.data.array))
          let cityCode = wx.getStorageSync('cityCode')
          let arr = [];
          let i = 0;
          arrays.forEach(function (item, index) {
            if (cityCode) {
              if (item.cityCode == cityCode) {
                i = index;
              }
            }
            arr.push(item.cityName);
          })
          //获取区域
          that.setData({
            index: i
          })
          const cityArray = JSON.parse(JSON.stringify(arrays))
          const cityArray2 = JSON.parse(JSON.stringify(arrays))
          that.setData({
            cityArray: cityArray,
            cityArray2: cityArray2,
            cityCode: arrays[i].cityCode,
            cityCode2: arrays[i].cityCode
          });
          that.getCityCode(i, 1)
          that.getCityCode(i, 2)
          that.getList()
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
          const arrays = res.data
          that.setData({
            goodArray: arrays
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
          const arrays = res.data
          arrays.forEach((item) => {
            item.check = false;
          })
          that.setData({
            carArray: arrays
          });
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
      //装卸难度
      network.requestLoading('api/base/base/dict/qryDictByType', {
        dictType: 'handling_difficulty_degree'
      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          //过滤picker
          that.setData({
            arrayDifficulty: res.data
          });
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  getCityCode(i, type) {
    let that = this;
    if (type == 1) {
      const countyDTOS = that.data.cityArray[i].countyDTOS
      countyDTOS.forEach(function(item) {
        item.check = false;
      })
      that.setData({
        array2: countyDTOS
      });
    } else {
      const countyDTOS = that.data.cityArray2[i].countyDTOS
      countyDTOS.forEach(function(item) {
        item.check = false;
      })
      that.setData({
        array2_1: countyDTOS
      });
    }
  },

  selectArea(e) {
    let that = this;
    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    let arrayNew = that.data.array2
    let checkAreaCode = that.data.checkAreaCode
    if (item.countyCode == '-99') {
      if (item.check) {
        checkAreaCode = []
        arrayNew.forEach((item) => {
          item.check = false;
        })
      } else {
        checkAreaCode = []
        arrayNew.forEach((item) => {
          item.check = true;
          checkAreaCode.push(item.countyCode)
        })
      }
    } else {
      if (!arrayNew[index].check) {
        checkAreaCode.push(arrayNew[index].countyCode)
      } else {
        checkAreaCode.forEach((item, i, arr) => {
          if(item == arrayNew[index].countyCode) {
            arr.splice(i, 1);
          }
          if(item == '-99'){
            arr.splice(i, 1);
            arrayNew[0].check = !arrayNew[0].check
          }
        })
      }
      arrayNew[index].check = !arrayNew[index].check
    }
    that.setData({
      array2: arrayNew,
      checkAreaCode: checkAreaCode
    })
  },

  selectArea2(e) {
    let that = this;
    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    let arrayNew = that.data.array2_1
    let checkAreaCode = that.data.checkAreaCode2
    if (item.countyCode == '-99') {
      if (item.check) {
        checkAreaCode = []
        arrayNew.forEach((item) => {
          item.check = false;
        })
      } else {
        checkAreaCode = []
        arrayNew.forEach((item) => {
          item.check = true;
          checkAreaCode.push(item.countyCode)
        })
      }
    } else {
      if (!arrayNew[index].check) {
        checkAreaCode.push(arrayNew[index].countyCode)
      } else {
        checkAreaCode.forEach((item, i, arr) => {
          if(item == arrayNew[index].countyCode) {
            arr.splice(i, 1);
          }
          if(item == '-99'){
            arr.splice(i, 1);
            arrayNew[0].check = !arrayNew[0].check
          }
        })
      }
      arrayNew[index].check = !arrayNew[index].check
      console.log(arrayNew)
    }
    that.setData({
      array2_1: arrayNew,
      checkAreaCode2: checkAreaCode
    })
  },

  selectCity(e){
    let that = this;
    let i = e.currentTarget.dataset.index
    let cityCode = e.currentTarget.dataset.citycode
    that.setData({
      checkAreaCode: [],
      cityCode: cityCode
    })
    that.getCityCode(i, 1)
  },

  selectCity2(e){
    let that = this;
    let i = e.currentTarget.dataset.index
    let cityCode = e.currentTarget.dataset.citycode
    that.setData({
      checkAreaCode2: [],
      cityCode2: cityCode
    })
    that.getCityCode(i, 2)
  },

  checkYes(e) {
    let that = this;
    let type = e.currentTarget.dataset.type
    if (type == 3) {
      that.setData({
        page: 1,
        list: []
      })
      that.getList()
    } else {
      if(type == 1){
        let checkAreaCode = that.data.checkAreaCode
        if (checkAreaCode.length) {
          that.setData({
            page: 1,
            list: []
          })
          that.getList()
        } else {
          Toast('请选择区域');
          return false
        }
      } else {
        let checkAreaCode2 = that.data.checkAreaCode2
        if (checkAreaCode2.length) {
          that.setData({
            page: 1,
            list: []
          })
            that.getList()
          } else {
            Toast('请选择区域');
            return false
          }
        }
    }
  },

  reset(e) {
    let that = this;
    const arrays = that.data.array
    let type = e.currentTarget.dataset.type
    let cityCode = wx.getStorageSync('cityCode')
    let i = 0;
    arrays.forEach(function (item, index) {
      if (cityCode) {
        if (item.cityCode == cityCode) {
          i = index;
        }
      }
    })
    //获取区域
    if (type == 1) {
      that.setData({
        cityCode: cityCode,
        checkAreaCode: []
      })
    } else {
      that.setData({
        cityCode2: cityCode,
        checkAreaCode2: []
      })
    }
    that.getCityCode(i, type)
  },

  reset2(e) {
    let that = this;
    let type = e.currentTarget.dataset.type
    if(type == 'car'){
      const carArray = that.data.carArray
      carArray.forEach((item,i,arr) => {
        item.check = false;
      })
      that.setData({
        carCheckList: [],
        carArray: carArray
      })
    } else {
      const goodArray = that.data.goodArray
      const arrayDifficulty = that.data.arrayDifficulty
      goodArray.forEach((item,i,arr) => {
        item.check = false;
      })
      arrayDifficulty.forEach((item,i,arr) => {
        item.check = false;
      })
      that.setData({
        cargoCheckList: [],
        difficultyCheckList: [],
        goodArray: goodArray,
        arrayDifficulty: arrayDifficulty
      })
    }
  },

  selectAddress(e) {
    let that = this;
    let type = e.currentTarget.dataset.type
    if(type == 1){
      that.setData({
        selectCityType: !that.data.selectCityType,
        selectCityType2: false,
        otherType: false,
        carType: false
      })
    } else {
      that.setData({
        selectCityType: false,
        selectCityType2: !that.data.selectCityType2,
        otherType: false,
        carType: false
      })
    }
  },

  selectCar() {
    let that = this;
    that.setData({
      selectCityType: false,
      selectCityType2: false,
      otherType: false,
      carType: !that.data.carType
    })
  },

  selectGood() {
    let that = this;
    that.setData({
      selectCityType: false,
      selectCityType2: false,
      carType: false,
      otherType: !that.data.otherType
    })
  },

  selectCarType(e) {
    let that = this;
    let checkList = that.data.carCheckList
    let i = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    let carArray = that.data.carArray
    if (!item.check) {
      carArray[i].check = !item.check
      checkList.push(item.codeVal)
    } else {
      carArray[i].check = !item.check;
      checkList.forEach((item, index, arr) => {
        if(item == carArray[i].codeVal) {
          arr.splice(index, 1)
        }
      })
    }
    that.setData({
      carCheckList: checkList,
      carArray: carArray
    })
  },

  selectCargo(e){
    let that = this;
    let checkList = that.data.cargoCheckList
    let i = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    let goodArray = that.data.goodArray
    if (!item.check) {
      goodArray[i].check = !item.check
      checkList.push(item.codeVal)
    } else {
      goodArray[i].check = !item.check;
      checkList.forEach((item, index, arr) => {
        if(item == goodArray[i].codeVal) {
          arr.splice(index, 1)
        }
      })
    }
    that.setData({
      cargoCheckList: checkList,
      goodArray: goodArray
    })
  },

  selectDifficulty(e) {
    let that = this;
    let checkList = that.data.difficultyCheckList
    let i = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    let arrayDifficulty = that.data.arrayDifficulty
    if (!item.check) {
      arrayDifficulty[i].check = !item.check
      checkList.push(item.codeVal)
    } else {
      arrayDifficulty[i].check = !item.check;
      checkList.forEach((item, index, arr) => {
        if(item == arrayDifficulty[i].codeVal) {
          arr.splice(index, 1)
        }
      })
    }
    that.setData({
      difficultyCheckList: checkList,
      arrayDifficulty: arrayDifficulty
    })
  },

  getList() {
    let that = this;
    //获取线路列表
    network.requestLoading('api/bss/v1/bss/line/task/xcxLineTasks', {
        "carTypeName": that.data.carCheckList,
        "handlingDifficultyDegree": that.data.difficultyCheckList,
        "cargoType": that.data.cargoCheckList,
        "deliveryCity": that.data.cityCode2,
        "deliveryCounty": that.data.checkAreaCode2,
        "warehouseCity": that.data.cityCode,
        "warehouseCounty": that.data.checkAreaCode,
        "key": '',
        "limit": 20,
        "page": that.data.page
      },
      'POST',
      '',
      'json',
      function(res) {
        if (res.success) {
          wx.stopPullDownRefresh()
          let arr = res.data;
          let lists = that.data.list.concat(arr)
          that.setData({
            list: lists,
            selectCityType: false,
            selectCityType2: false,
            otherType: false,
            carType: false
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
  },

  //拨打电话
  talphone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },

  goDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../lineDetail/lineDetail?id=' + id
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
                "puserId": that.data.puserId,
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
    this.setData({
      list: [],
      page: 1
    })
    this.getList()
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
      path: '/pages/lineList/lineList?puserId=' + userId + '&source=2',
      imageUrl: '../../lib/image/shareImg.jpg',
      success: function(res) {
        // 转发成功
      },
    }
  }
})