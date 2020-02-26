// pages/account/account.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePath: '',
    tempFilePath2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的钱包' //页面标题为路由参数
    });
    this.getLoad()
  },

  getLoad(){
    // 获取图片
    let that = this;
    const path = wx.getStorageSync('image_cache_accout1')
    if (path && path != null) {
      that.setData({
        image_filepath: path
      })
    } else {
      wx.downloadFile({
        url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/998ee7347aab41bebe5abd272fa841b0',
        success: function (res) {
          if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager()
            fs.saveFile({
              tempFilePath: res.tempFilePath, // 传入一个临时文件路径
              success(res) {
                that.setData({
                  image_filepath: res.savedFilePath
                })
                wx.setStorageSync('image_cache_accout1', res.savedFilePath)
              }
            })
          } else {
            console.log('响应失败', res.statusCode)
          }
        }
      })
    }
    const path2 = wx.getStorageSync('image_cache_accout2')
    if (path2 && path2!= null) {
      that.setData({
        image_filepath2: path2
      })
    } else {
      wx.downloadFile({
        url: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/e6b1c56750cd473792ac3c16dc97fb61',
        success: function (res) {
          if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager()
            fs.saveFile({
              tempFilePath: res.tempFilePath, // 传入一个临时文件路径
              success(res) {
                that.setData({
                  image_filepath2: res.savedFilePath
                })
                wx.setStorageSync('image_cache_accout2', res.savedFilePath)
              }
            })
          } else {
            console.log('响应失败', res.statusCode)
          }
        }
      })
    }
  },

  goRouter(e) {
    let type = e.currentTarget.dataset.type;
    let routerName = '';
    if (type == '1') {
      routerName = '../checkPayment/checkPayment'
    } else if (type == '2') {
      routerName = '../checkOrder/checkOrder'
    } else if (type == '3') {
      routerName = '../myRecommend/myRecommend'
    } else if (type == '4') {
      routerName = '../transactionLog/transactionLog'
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