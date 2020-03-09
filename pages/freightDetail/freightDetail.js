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
    date: '2020-03-10',
    totalPrice: 0,
    list: [
      {
        name: '12asdfasf',
        price: '300',
        date: '2020-10-20'
      },
      {
        name: '12asdfasf',
        price: '300',
        date: '2020-10-20'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '运费详情' //页面标题为路由参数
    });
    let id = options.id;
    this.setData({
      id: id
    })
    this.getDetail(id);
  },

  getDetail(id) {
    let that = this;
    network.requestLoading('api/base/base/dict/qryDictByType', {
      dictType: 'online_city'
    },
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          //过滤picker
          // that.setData({
          //   orderList: res.data
          // });
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