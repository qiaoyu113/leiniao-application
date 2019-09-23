// pages/activity/activity.js
var app = getApp()
var urls = app.globalData.url
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeVal: '',
    image_filepath: '',
    hindBgType: false,
    btnType: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '中秋活动' //页面标题为路由参数
    });
    this.getData()
    this.getType()
  },

  getType() {
    let that = this;
    network.requestLoading('api/driver/bless-words/get-xique-activity-has-invole', {},
      'get',
      '',
      '',
      function (res) {
        if (res.success) {
          if (!res.data) {
            that.setData({
              btnType: true
            })
          } else {
            that.setData({
              btnType: false
            })
          }
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  getData() {
    let that = this;
    //获取广播消息
    network.requestLoading('api/driver/bless-words/get-happy-news-broadcast-msg', {},
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          //过滤picker
          that.setData({
            noticeVal: res.data
          });
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
    // 获取图片
    const path = wx.getStorageSync('image_cache_activity')
    if (path && path != null) {
      that.setData({
        image_filepath: path
      })
    } else {
      wx.downloadFile({
        url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/697f035ca93c4384b3e79590b7495552',
        success: function (res) {
          if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager()
            fs.saveFile({
              tempFilePath: res.tempFilePath, // 传入一个临时文件路径
              success(res) {
                that.setData({
                  image_filepath: res.savedFilePath
                })
                wx.setStorageSync('image_cache_activity', res.savedFilePath)
              }
            })
          } else {
            console.log('响应失败', res.statusCode)
          }
        }
      })
    }
  },

  goActivity() {
    let that = this;
    network.requestLoading('api/driver/bless-words/get-xique-activity-has-invole', {},
      'get',
      '',
      '',
      function (res) {
        if (res.success) {
          if (!res.data) {
            wx.navigateTo({
              url: '/pages/activityApply/activityApply'
            });
          } else {
            that.setData({
              hindBgType: true
            })
            Dialog.alert({
              title: '提示',
              message: '您已参加过该活动，请等待活动结束公布中奖名单'
            }).then(() => {
              that.setData({
                hindBgType: false
              })
            })
          }
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