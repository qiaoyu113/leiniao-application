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
    price: 222,
    inputValue: '',
    sms_box: false,
    sms_check: true,
    countTime: 2,
    phone:'',
    Length: 4, //输入框个数
    isFocus: true, //聚焦
    Value: "", //输入的内容
    ispassword: false, //是否密文显示 true为密文， false为明文。
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  next() {
    let that = this;
    let price = that.data.inputValue;
    if (price == ''){
      Notify({
        text: '请输入提现金额',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    } else {
      let phone = wx.getStorageSync('phone')
      network.requestLoading('api/core/v1/sim/getIdentifyingCode', {
        phone: phone
      },
        'POST',
        '',
        '',
        function (res) {
          if (res.success) {
            // 改良版
            clearInterval(setTime)
            let time = that.data.countTime;
            console.log(time)
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
            setTime = setInterval(function () {
              time--;
              if (time < 0) {
                clearInterval(setTime);
              } else {
                that.setData({
                  countTime: time
                })
              }
            }, 1000)
          }
        },
        function (res) {
          wx.showToast({
            title: '加载数据失败',
          });
        });
    }
  },

  //关闭提交手机号
  delSms: function () {
    // let time = this.data.countTime;
    // if(time < 60 && time >= 0){
    //   clearInterval(setTime);
    // }
    // clearInterval(setTime);
    this.setData({
      sms_box: false,
      Value: '',
      sms_check: true
    })
  },

  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue,
    })
    console.log(inputValue)
    if (e.detail.value.length == 4) {
      let openId = wx.getStorageSync('openId');
      network.requestLoading('api/customer/v1/cust/helpMeBuy', {
        phone: that.data.phone,
        openId: openId,
        city: that.data.addressUser.code,
        verify: e.detail.value
      },
        'POST',
        '',
        '',
        function (res) {
          if (res.success) {
            that.setData({
              Value: '',
              sms_box: false,
              sms_check: true,
              Value: '',
              phone: ''
            })
            clearInterval(setTime);
            that.warn(1, '提交成功，顾问会尽快与您联系!', 2);
          } else {
            that.setData({
              sms_check: false
            })
          }
        },
        function (res) {
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
    const price = e.detail.value;
    const max = this.data.price
    if (price < max){
      this.setData({
        inputValue: e.detail.value
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})