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
    phoneCheck: false,
    hintText: ''
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
    var myreg = /^1[3456789]\d{9}$/;
    if (value.length == 0) {
      that.setData({
        hintType: true,
        phoneCheck: false,
        hintText: '请输入手机号'
      })
      return false
    } else if (!myreg.test(value)) {
      that.setData({
        hintType: true,
        phoneCheck: false,
        hintText: '手机号码格式错误'
      })
      return false
    } else {
      that.setData({
        hintType: false,
        phoneCheck: true
      })
      return true
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
    if(!that.phoneCheck()){
      return false
    }
    network.requestLoading('88/auth/v1/leiniaoAuth/jwt/sendVerificationCode', {
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

  // 登录
  login(){
    let that = this;
    let phone = that.data.phone
    let code = that.data.code
    network.requestLoading('88/auth/v1/leiniaoAuth/jwt/getTokenByPhone', {
      phone: phone,
      code: code
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
        wx.setStorage({
          key: 'phone',
          data: res.data.phone,
        })
        let ph = phone.toString()
        let phoneName =  ph.substring(0, 3)+"****"+ ph.substring(ph.length-4)
        wx.setStorage({
          key: 'phoneName',
          data: phoneName,
        })
        wx.setStorage({
          key: 'openId',
          data: res.data.openId,
        })
        that.setData({
          flag: true,
          openId: res.data.openId
        })
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
    let userId = wx.getStorageSync('userId')
    return {
      title: '雷鸟车池',
      path: '/pages/rentedCar/rentedCar?puserId=' + userId + '&source=2',
      imageUrl: '',
      success: function(res) {
        // 转发成功
      },
    }
  }
})