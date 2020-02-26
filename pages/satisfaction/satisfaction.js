// pages/satisfaction/satisfaction.js
var network = require("../../utils/network.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value1: 0,
    value2: 0,
    value3: 0,
    value4: 0,
    value5: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '满意度反馈' //页面标题为路由参数
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  onChange(event) {
    let num = event.currentTarget.dataset.id
    this.setData({
      ['value' + num]: event.detail
    });
  },

  bindFormSubmit: function(e) {
    let that = this;
    if (that.data.value1 && that.data.value2 && that.data.value3 && that.data.value4) {
      network.requestLoading('api/driver/driver/income/market-survey', [{
            "answerContent": that.data.value1,
            "answerType": 3,
            "questionId": 100
          },
          {
            "answerContent": that.data.value2,
            "answerType": 3,
            "questionId": 101
          },
          {
            "answerContent": that.data.value3,
            "answerType": 3,
            "questionId": 102
          },
          {
            "answerContent": that.data.value4,
            "answerType": 3,
            "questionId": 103
          },
          {
            "answerContent": e.detail.value.textarea,
            "answerType": 2,
            "questionId": 104
          }
        ],
        'post',
        '',
        'json',
        function(res) {
          if (res.success) {
            if (res.data.flag) {
              Toast('感谢您的反馈');
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          }
        },
        function(res) {
          wx.showToast({
            title: '加载数据失败',
          });
        });
    } else {
      Notify({
        text: '请完整填写满意度调查',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
    }
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