// pages/phoneLogin/phoneLogin.js
var network = require("../../utils/network.js");
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hintType: false,
    time: 60,
    code: '',
    phone: '',
    phoneCheck: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  // 手机号校验
  handlePhoneChange(e) {
    let value = e.detail.value.replace(/\D/g, '')
    this.setData({
      phone: value,
    })
  },

  // 手机号校验
  phoneCheck(){
    let that = this;
    let value = that.data.phone
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (value.length == 0) {
      that.setData({
        hintType: true,
        phoneCheck: false
      })
    } else if (value.length < 11) {
      that.setData({
        hintType: true,
        phoneCheck: false
      })
    } else if (!myreg.test(value)) {
      that.setData({
        hintType: true,
        phoneCheck: false
      })
    } else {
      that.setData({
        hintType: false,
        phoneCheck: true
      })
    }
  },

  // 验证码输入
  handleCodeChange(e) {
    let value = e.detail.value
    this.setData({
      code: value
    })
  },

  // 获取验证码
  getCode() {
    let that = this;
    if(!that.data.phoneCheck){
      that.setData({
        hintType: true,
        phoneCheck: false
      })
      return false
    }
    network.requestLoading('88/v1/leiniaoAuth/jwt/sendVerificationCode', {
      phone: that.data.phone
    },
    'GET',
    '',
    '',
    function(res) {
      if (res.success) {
        let times = 59
        that.setData({
          time: times
        })
        let overTime = setInterval((res) => {
          times = times - 1
          that.setData({
            time: times
          })
          if(times == 0) {
            clearInterval(overTime)
            that.setData({
              time: 60
            })
          }
        }, 1000)
      } else {
        Dialog.alert({
          title: '提示',
          message: res.errorMsg
        }).then(() => {
          
        })
      }
    },
    function(res) {
      wx.showToast({
        title: '加载数据失败',
      });
    });
    
  },

  // 查看协议
  goRouter(e) {
    if(e.target.dataset.type == 1) {
      wx.navigateTo({
        url: '../privacy/privacy'
      });
    } else {
      wx.navigateTo({
        url: '../clause/clause'
      });
    }
  },

  // 返回按钮
  onClickLeft() {
    wx.navigateBack({
      delta: 1,
    })
  },

  // 登陆
  login(){
    let that = this;
    let phone = that.data.phone
    let code = that.data.code
    network.requestLoading('88/driver/v2/driver/applet/judgeCreateOrderPermission', {
      phone: phone,
      code: code
    },
    'GET',
    '',
    '',
    function(res) {
      if (res.success) {
        wx.switchTab({
          url: '../myCenter/myCenter',
        })
      } else {
        Dialog.alert({
          title: '提示',
          message: res.errorMsg
        }).then(() => {
          
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