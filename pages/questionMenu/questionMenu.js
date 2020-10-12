// pages/questionMenu/questionMenu.js
const app = getApp();
var network = require("../../utils/network.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    entranceType: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '问题反馈' //页面标题为路由参数
    });
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
          let flag = res.data.flag;
          that.setData({
            entranceType: flag
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  goRouter(e) {
    let type = e.currentTarget.dataset.type;
    let routerName = '';
    if (type == '1') {
      routerName = '../myRecommend/myRecommend'
    } else if (type == '2') {
      routerName = '../myCollect/myCollect'
    } else if (type == '3') {
      // routerName = '../immediatelyEnter/immediatelyEnter'
      routerName = '../immediatelyEnterNew/immediatelyEnterNew'
    } else if (type == '4') {
      routerName = '../persenolInfo/persenolInfo'
    } else if (type == '5') {
      routerName = '../account/account'
    } else if (type == '6') {
      routerName = '../question/question'
    } else if (type == '7') {
      routerName = '../myOrder/myOrder'
    } else if (type == '8') {
      routerName = '../incomeMenu/incomeMenu'
    } else if (type == '9') {
      routerName = '../creatOrder/creatOrder'
    } else if (type == '10') {
      routerName = '../incomeUpDataNew/incomeUpDataNew'
    } else if (type == '11') {
      routerName = '../satisfaction/satisfaction'
    } else if (type == '12') {
      routerName = '../serialOrder/serialOrder'
    }
    wx.navigateTo({
      url: routerName
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
    let that = this;
    that.hasEnter()
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