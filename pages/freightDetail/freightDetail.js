// pages/freightDetail/freightDetail.js
var network = require("../../utils/network.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
var common = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    totalPrice: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '运费详情' //页面标题为路由参数
    });
    let date = options.date;
    this.setData({
      date: date
    })
    this.getDetail(date);
  },

  getDetail(date) {
    let that = this;
    let stringTime = date + " 00:00:00";
    let timestamp2 = new Date(stringTime.replace(/-/g, "/")).getTime();
    network.requestLoading('api/dispatch/driver/dispatch/xcx/get_delivery_record_detail', {
      runningDate: timestamp2
    },
      'post',
      '',
      'json',
      function (res) {
        if (res.success) {
          //过滤picker
          that.setData({
            list: res.data.detailInfoVOList,
            totalPrice: res.data.totalCost
          });
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