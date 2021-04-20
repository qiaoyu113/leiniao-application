const app = getApp();
var network = require("../../utils/network.js");
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
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
          // let openId = wx.getStorageSync('openId')
          try {
            var openId = wx.getStorageSync('openId')
            if (openId) {
              network.requestLoading('25/core/v1/wx/encryptedData2PhoneNoToLeiNiao', {
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
                  network.requestLoading('25/auth/v1/leiniaoAuth/jwt/getToken', {
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
                        let pages = getCurrentPages();
                        let prevpage = pages[pages.length - 2];
                        console.log('prevpage',prevpage.route)
                        if(prevpage.route == 'pages/shareLogin/shareLogin'){
                          wx.navigateBack({
                            delta: 2,
                          })
                        } else {
                          wx.navigateBack({
                            delta: 1,
                          })
                        }
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
            } else {
              Dialog.alert({
                title: '提示',
                message: '请重新登陆'
              }).then(() => {
                
              })
              wx.clearStorageSync()
              that.hasEnter()
            }
          } catch (e) {
            Dialog.alert({
              title: '提示',
              message: '请重新登陆'
            }).then(() => {
              
            })
            wx.clearStorageSync()
            that.hasEnter()
          }
        }
      })
    }
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
          
        }
      },
      function(res) {
        // wx.showToast({
        //   title: '加载数据失败',
        // });
      });
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