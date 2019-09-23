// pages/login/login.js
const app = getApp();
var network = require("../../utils/network.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    password: '',
    userId: ''
  },
  //输入账号
  phoneInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //输入密码
  phoneInput2: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  getUserInfo() {//同意授权，获取用户信息，encryptedData是加密字符串，里面包含unionid和openid信息
    wx.getUserInfo({
      withCredentials: true,//此处设为true，才会返回encryptedData等敏感信息
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        // app.globalData.userInfo = res.userInfo;
        // app.globalData.encryptedData = res.encryptedData;
        // app.globalData.iv = res.iv;
        let userInfo = res.userInfo
        let that = this;
        wx.login({
          success: function (res) {
            that.setData({
              code: res.code
            })
            network.requestLoading('api/auth/v1/jwt/getToken', {
              wxCode: that.data.code,
              puserId: that.data.userId,
              source: 1,
              weChatUserInfo: {
                city: userInfo.city,
                headImage: userInfo.avatarUrl,
                nickName: userInfo.nickName,
                province: userInfo.province,
                sex: userInfo.gender
              },
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
                  if (phone) {
                    wx.setStorage({
                      key: 'phone',
                      data: phone,
                      success: function (res) { 
                      },
                    })
                  }
                  wx.setStorage({
                    key: 'token',
                    data: token,
                    success: function (res) {
                      wx.setStorage({
                        key: 'openId',
                        data: openId,
                        success: function (res) {
                          wx.switchTab({
                            url: '/pages/index/index'
                          });
                        }
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
        })
      }
    })
  },

  login(){
    let that = this;
    let name = that.data.name;
    let password = that.data.password;
    if (name == '') {
      Notify({
        text: '请输入用户名',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#1cbbb4'
      });
      return false;
    }
    if (password == '') {
      Notify({
        text: '请输入密码',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#1cbbb4'
      });
      return false;
    }
    network.requestLoading('api/auth/bss/getToken',
      {
        password: password,
        username: name
      },
      'POST',
      '',
      'json',
      function (res) {
        if (res.data.flag) {
          wx.setStorage({
            key: 'admin',
            data: [name, password],
            success: function (res) {
              
            },
            fail: function (res) {
              Notify({
                text: res.errMsg,
                duration: 1000,
                selector: '#van-notify',
                backgroundColor: '#1cbbb4'
              });
            }
          })
          wx.setStorage({
            key: 'token',
            data: res.data.token,
            success: function (res) {
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000
              })
              wx.redirectTo({
                url: '/pages/dataCenter/index'
              });
            },
            fail: function (res) {
              Notify({
                text: res.errMsg,
                duration: 1000,
                selector: '#van-notify',
                backgroundColor: '#1cbbb4'
              });
            }
          })
        } else {
          Notify({
            text: res.data.msg,
            duration: 1000,
            selector: '#van-notify',
            backgroundColor: '#1cbbb4'
          });
        }
      },
      function () {
        wx.showToast({
          title: '登录失败',
        });
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '登录' //页面标题为路由参数
    });
    if (options && options.puserId) {
      that.setData({
        userId: options.puserId
      })
    }
    wx.getStorage({
      //获取数据的key
      key: 'admin',
      success: function (res) {
        var admin = res.data;
        that.setData({
          name: admin[0],
          password: admin[1]
        })
      }
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