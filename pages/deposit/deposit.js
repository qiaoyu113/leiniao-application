// pages/deposit/deposit.js
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
var setTime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: 0,
    inputValue: '',
    sms_box: false,
    sms_check: true,
    countTime: 60,
    phone: wx.getStorageSync('phone'),
    Length: 4, //输入框个数
    isFocus: true, //聚焦
    Value: "", //输入的内容
    ispassword: false, //是否密文显示 true为密文， false为明文。
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '提现' //页面标题为路由参数
    });
    this.setData({
      price: options.canExtract
    })
  },

  next() {
    let that = this;
    let price = that.data.inputValue;
    if (price == '') {
      Notify({
        text: '请输入提现金额',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    } else if (price <= 0) {
      Notify({
        text: '提现金额不得为0',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    } else {
      let phone = wx.getStorageSync('phone')
      network.requestLoading('api/core/v1/sim/getIdentifyingCode', {
          phone: phone,
          scene: 'CASH_OUT'
        },
        'POST',
        '',
        '',
        function(res) {
          console.log(res.data.verifyCode)
          if (res.success) {
            // 改良版
            clearInterval(setTime)
            let time = that.data.countTime;
            if (time < 60 && time > 0) {
              that.setData({
                sms_box: true
              })
            } else {
              that.setData({
                sms_box: true,
                countTime: 60
              })
              time = that.data.countTime;
            }
            setTime = setInterval(function() {
              time--;
              if (time < 0) {
                clearInterval(setTime);
              } else {
                that.setData({
                  countTime: time
                })
              }
            }, 1000)
          } else {
            Notify({
              text: res.errorMsg,
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
    }
  },

  //关闭提交手机号
  delSms: function() {
    // let time = this.data.countTime;
    // if(time < 60 && time >= 0){
    //   clearInterval(setTime);
    // }
    clearInterval(setTime);
    this.setData({
      sms_box: false,
      Value: '',
      sms_check: true,
      countTime: 60
    })
  },

  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue,
    })
    if (e.detail.value.length == 4) {
      let openId = wx.getStorageSync('openId');
      let phone = wx.getStorageSync('phone')
      network.requestLoading('api/bill/v1/bill/acctInfo/cashOut', {
          "cash": that.data.inputValue,
          "verifyCode": inputValue
        },
        'POST',
        '',
        'json',
        function(res) {
          if (res.success) {
            if (res.data.code == 200) {
              that.setData({
                sms_box: false,
                sms_check: true,
                Value: '',
                phone: ''
              })
              clearInterval(setTime);
              // Notify({
              //   text: '已提交提现申请',
              //   duration: 1000,
              //   selector: '#van-notify',
              //   backgroundColor: '#67C23A'
              // });
              wx.navigateTo({
                url: '/pages/depositSuccess/depositSuccess'
              });
            } else {
              that.setData({
                sms_check: false
              })
              Notify({
                text: res.data.msg,
                duration: 3000,
                selector: '#van-notify',
                backgroundColor: '#FAC844'
              });
            }
          } else {
            that.setData({
              sms_check: false
            })
            Notify({
              text: res.errorMsg,
              duration: 3000,
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
    } else {
      that.setData({
        sms_check: true
      })
    }
  },

  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },

  inputChange(e) {
    let price = e.detail.value;
    price = price.match(/^\d*(\.?\d{0,2})/g)[0]
    const max = this.data.price
    if (Number(price) < Number(max)) {
      this.setData({
        inputValue: price
      })
    } else {
      this.setData({
        inputValue: max
      })
    }
  },

  depositAll() {
    const max = this.data.price
    this.setData({
      inputValue: max
    })
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
    let userId = wx.getStorageSync('userId')
    return {
      title: '自主创业，随时上岗；货源稳定、线路优质；购车保收入10万+/年',
      path: '/pages/index/index?puserId=' + userId + '&source=2',
      imageUrl: '../../lib/image/shareImg.jpg',
      success: function (res) {
        // 转发成功
      },
    }
  }
})