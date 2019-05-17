// pages/lineList/lineList.js
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityArray:[],
    cityCode:'110100',
    array:[],
    index:0,
    page:1,
    list:[],
    flag: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '货源大厅' //页面标题为路由参数
    });
    this.getCity()
    this.getList()
  },

  getCity() {
    let that = this;
    //获取城市列表
    network.requestLoading('api/base/base/dict/qryDictByType', {
      dictType: 'online_city'
    },
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          //过滤picker
          that.setData({
            array: res.data
          });
          const arrays = that.data.array
          let cityArr = common.picker(arrays)
          that.setData({
            cityArray: cityArr
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  getList(){
    let that = this;
    //获取线路列表
    network.requestLoading('api/bss/v1/bss/line/task/xcxLineTasks', {
      "city": that.data.cityCode,
      "key": "",
      "limit": 20,
      "page": that.data.page
    },
      'POST',
      '',
      'json',
      function (res) {
        if (res.success) {
          let arr = res.data;
          let lists = that.data.list.concat(arr)
          that.setData({
            list: lists
          })
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  //拨打电话
  talphone() {
    wx.makePhoneCall({
      phoneNumber: '01086469220',
    })
  },

  goDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../lineDetail/lineDetail?id=' + id
    });
  },

  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
      cityCode: this.data.array[e.detail.value].codeVal,
      page: 1,
      list: []
    })
    this.getList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
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

  myCatchTouch: function () {
    console.log('stop user scroll it!');
    return;
  },


  getPhoneNumber: function (e) {
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
        function (res) {
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
              function (res) {
                if (res.success) {
                  wx.setStorage({
                    key: 'phone',
                    data: phone,
                    success: function (res) {
                      that.setData({
                        flag: true
                      })
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
        },
        function (res) {
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
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page;
    page = page + 1;
    this.setData({
      page:page
    })
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})