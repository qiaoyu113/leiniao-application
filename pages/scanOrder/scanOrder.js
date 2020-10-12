// pages/scanOrder/scanOrder.js
var network = require("../../utils/network.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

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
    loadModal: true,
    orderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '在线支付' //页面标题为路由参数
    });
    let that = this;
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
    that.checkPhone()
  },

  checkPhone() {
    let that = this;
    let token = wx.getStorageSync('token')
    if (token) {
      let phone = wx.getStorageSync('phone')
      that.setData({
        phone: phone
      })
      that.creatOrder()
    } else {
      network.requestLoading('api/order/v1/magpie/order/createOrderFromMagpieApp', {
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
    let code = wx.get
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
          that.setData({
            phone: phone
          })
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
                let phone = res.data.phone
                wx.setStorage({
                  key: 'token',
                  data: res.data.token,
                  success: function(res) {
                    wx.setStorage({
                      key: 'phone',
                      data: phone,
                      success: function(res) {
                        that.hideModal();
                        that.checkPhone();
                      },
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
        } else {
          Notify({
            text: '支付失败:' + res.errorMsg,
            duration: 1000,
            selector: '#van-notify',
            backgroundColor: '#FAC844'
          });
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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