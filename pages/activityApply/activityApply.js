// pages/activityApply/activityApply.js
var app = getApp()
var urls = app.globalData.url
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: '',
    avatar: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/ba0323a3f08e49cfb2511fa8fd067f00',
    noticeVal: '',
    blessList: [
      '月饼圆圆的、甜甜的在这最美好的时刻祝您和您的家人合家欢乐、幸福美满!',
      '天上月圆，人间团圆，家庭情圆，心中梦圆;愿你每一天中，财源不断，事事如愿!祝中秋节快乐!'
    ],
    checkIndex: '2',
    textareaVal: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '参与活动' //页面标题为路由参数
    });
    this.getData()
  },

  getData() {
    let that = this;
    //获取广播消息
    network.requestLoading('api/driver/bless-words/get-happy-news-broadcast-msg', {},
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          //过滤picker
          that.setData({
            noticeVal: res.data
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  _input(event) {
    let value = event.detail.value
    this.setData({
      textareaVal: value
    })
  },

  checkBless(e) {
    var that = this;
    let index = e.currentTarget.dataset.index
    that.setData({
      checkIndex: index
    })
    let val = that.data.blessList[index]
    this.setData({
      textareaVal: val
    })
  },

  // 切换头像
  changeAvatar: function() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        console.log(res.tempFilePaths + "修改页面")
        var avatar = res.tempFilePaths;
        that.setData({
          avatar: avatar,
          upAvatar: true
        })
        var token = wx.getStorageSync('token')
        wx.uploadFile({
          url: urls + 'api/base/v1/upload/uploadOSS/img/true/-1',
          filePath: avatar[0],
          header: { "Authorization": token },
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            let data = JSON.parse(res.data)
            that.setData({
              imageUrl: data.data.url
            })
          }
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  //上传图片
  submitForm: function(){
    let that = this;
    if (that.data.imageUrl == '') {
      Notify({
        text: '请上传参加活动照片',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    if (that.data.textareaVal == '') {
      Notify({
        text: '请送上您的祝福语',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    network.requestLoading('api/driver/bless-words/submit-bless-word', {
      "blessWords": that.data.textareaVal,
      "photos": [that.data.imageUrl]
    },
      'POST',
      '',
      'json',
      function (res) {
        if (res.success) {
          if (res.data) {
            wx.redirectTo({
              url: '/pages/activityShare/activityShare'
            });
          } else {
            Notify({
              text: res.errorMsg,
              duration: 1000,
              selector: '#van-notify',
              backgroundColor: '#FAC844'
            });
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