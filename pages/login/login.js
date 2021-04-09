const app = getApp();
var network = require("../../utils/network.js");
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getPhoneNumber: function(e) {
    let that = this;
    if (e.detail.errMsg && e.detail.errMsg.indexOf('getPhoneNumber:fail') > -1) {

    } else {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // 登录成功后存token
          let code = res.code;
          let openId = wx.getStorageSync('openId')
          network.requestLoading('25/core/v1/wx/encryptedData2PhoneNo', {
            code: code,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            openId: openId
          },
          'POST',
          '',
          'json',
          function(res) {
            if (res.success) {
              let phone = res.data.phone;
              let openId = wx.getStorageSync('openId')
              network.requestLoading('25/auth/v2/jwt/getToken', {
                  openId: openId,
                  phone: phone,
                  puserId: that.data.puserId
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
                    wx.setStorage({
                      key: 'openId',
                      data: res.data.openId,
                    })
                    that.setData({
                      flag: true,
                      openId: res.data.openId
                    })
                    wx.navigateBack({
                      delta: 1,
                    })
                  } else {
                    wx.showToast({
                      title: res.errorMsg,
                    });
                  }
                },
                function(res) {
                  wx.showToast({
                    title: '加载数据失败',
                  });
                });
            } else {
              wx.showToast({
                title: res.errorMsg,
              });
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

  // 返回按钮
  onClickLeft() {
    wx.navigateBack({
      delta: 1,
    })
  },

  goLogin() {
    wx.navigateTo({
      url: '../phoneLogin/phoneLogin'
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