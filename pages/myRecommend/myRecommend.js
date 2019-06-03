// pages/myRecommend/myRecommend.js
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '您已成功推荐0人',
    marqueePace: 1,//滚动速度
    marqueeDistance: 100,//初始滚动距离
    size: 14,
    orientation: 'left',//滚动方向
    interval: 20, // 时间间隔
    adUrl: 'https://oss-qzn.yunniao.cn/img/798794c361364119a216c34bb2393b0e',
    array: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的推荐与奖励' //页面标题为路由参数
    });
    this.getList()
  },

  //获取推荐列表
  getList() {
    let that = this;
    network.requestLoading('api/driver/driver/clue/myRecommend', {},
      'POST',
      '',
      '',
      function (res) {
        if (res.success) {
          let num = res.data.length;
          that.setData({
            array: res.data,
            text: '您已成功推荐' + num + '人'
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  goDeposit() {
    wx.navigateTo({
      url: '../deposit/deposit'
    });
  },

  goRecord(){
    wx.navigateTo({
      url: '../transactionRecord/transactionRecord'
    });
  },

  goRecommendDetail() {
    wx.navigateTo({
      url: '../recommendDetail/recommendDetail'
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
    // 页面显示
    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    that.setData({
      length: length,
      windowWidth: windowWidth,
    });
    that.runMarquee();// 水平一行字滚动完了再按照原来的方向滚动
  },

  runMarquee: function () {
    var that = this;
    var interval = setInterval(function () {
      //文字一直移动到末端
      if (-that.data.marqueeDistance < that.data.length) {
        that.setData({
          marqueeDistance: that.data.marqueeDistance - that.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        that.setData({
          marqueeDistance: that.data.windowWidth
        });
        that.runMarquee();
      }
    }, that.data.interval);
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