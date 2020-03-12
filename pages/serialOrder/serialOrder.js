// pages/serialOrder/serialOrder.js
var network = require("../../utils/network.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
var common = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    option2: [
      { text: '全部', value: '' },
      { text: '已确认', value: '2' },
      { text: '未确认', value: '1' }
    ],
    dateName: '日期',
    date: '',
    value2: '',
    activeName: 1,
    totalPrice: 0,
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '运费流水' //页面标题为路由参数
    });
  },

  //当前时间
  nowTime(){
    let that = this;
    var date = new Date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" + month : month);
    var mydate = (year.toString() + '-' + month.toString());
    let e = {
      detail:{
        value: mydate
      }
    }
    that.getDateTime(e)
  },

  //日期选择
  getDateTime(e) {
    let that = this;
    let stringTime = e.detail.value + "-01 00:00:00";
    let timestamp2 = new Date(stringTime.replace(/-/g, "/")).getTime();
    this.setData({
      date: timestamp2,
      dateName: e.detail.value
    })
    that.getList()
  },

  // 获取流水
  getList() {
    let that = this;
    let date = that.data.date;
    network.requestLoading('api/dispatch/driver/dispatch/xcx/records', {
      "queryDate": date,
      "state": that.data.value2
    },
      'POST',
      '',
      'json',
      function (res) {
        if (res.success) {
          let totalPrices = 0;
          let arr = res.data
          arr.forEach((i) => {
            totalPrices = totalPrices + i.totalCost
          })
          //过滤picker
          that.setData({
            orderList: res.data,
            totalPrice: totalPrices
          });
        }
      },
      function (err) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  goCheck(e) {
    wx.navigateTo({
      url: '../freightCheck/freightCheck?date=' + e.currentTarget.dataset.datename
    });
  },

  goDetail(e) {
    wx.navigateTo({
      url: '../freightDetail/freightDetail?date=' + e.currentTarget.dataset.datename
    });
  },

  //塞选
  onSwitch1Change({ detail }) {
    this.setData({ value2: detail });
    this.getList();
  },

  //选择时间订单
  onChange(event) {
    this.setData({
      activeName: event.detail
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
    this.nowTime();
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