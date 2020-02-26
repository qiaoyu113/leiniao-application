// pages/question/question.js
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [],
    indexCheck: -1,
    issueDesc: '',
    submitType: true,
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '问题反馈' //页面标题为路由参数
    });
    if (options.type) {
      this.getDirList(options.type)
    } else {
      this.getDirList()
    }
    
  },

  getDirList(type) {
    let that = this;
    //获取车型
    network.requestLoading('api/base/base/dict/qryDictByType', {
        dictType: 'xcx_driver_feedback_issue_type'
      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          //过滤picker
          that.setData({
            questionList: res.data
          });
          if(type){
            that.setData({
              indexCheck: type,
              code: that.data.questionList[type].codeVal
            })
          }
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  checkIndex: function(e) {
    this.setData({
      indexCheck: e.currentTarget.dataset.index,
      code: e.currentTarget.dataset.code
    })
  },

  bindTextAreaBlur: function(e) {
    this.setData({
      issueDesc: e.detail.value
    })
  },

  bindFormSubmit: function(e) {
    let that = this;
    if (that.data.code == '') {
      Notify({
        text: '请选择问题类型',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    if (e.detail.value.textarea == '') {
      Notify({
        text: '请输入问题描述',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    if (that.data.submitType) {
      that.setData({
        submitType: false
      })
      network.requestLoading('api/driver/driver/xcx/save-driver-feedback-issue-info', {
          issueType: that.data.code,
          issueContent: e.detail.value.textarea
        },
        'post',
        '',
        'json',
        function(res) {
          console.log(res)
          if (res.success) {
            if (res.data.flag) {
              Toast('操作成功，工作人员会尽快与您取得联系');
              setTimeout(() => {
                wx.navigateBack({
                  changed: true
                });
              }, 1000)
            } else {
              Notify({
                text: res.data.msg,
                duration: 1000,
                selector: '#van-notify',
                backgroundColor: '#FAC844'
              });
            }
          } else {
            that.setData({
              submitType: true
            })
          }
        },
        function(res) {
          wx.showToast({
            title: '加载数据失败',
          });
          that.setData({
            submitType: true
          })
        });
    }
  },

  //拨打电话
  talphone() {
    wx.makePhoneCall({
      phoneNumber: '400-688-9179',
    })
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