// pages/recommendDetail/recommendDetail.js
var app = getApp();
var network = require("../../utils/network.js");
import {
  base64src
} from '../../utils/base64src.js'
var url = app.globalData.url;
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode: '',
    canvasHidden: true,
    hindBgType: false,
    avatarUrl: '', //用户头像
    nickName: '', //用户昵称
    wxappName: app.globalData.wxappName, //小程序名称
    shareImgPath: '',
    screenWidth: '350', //设备屏幕宽度
    description: app.globalData.description, //奖品描述
    FilePath: '', //头像路径
    shareImgText1: '长按识别直接咨询',
    shareImgText2: '梧桐喜鹊小程序',
    lineDetail: {
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
    },
    price: '1.7',
    salePrice: '11.9',
    carImg: '',
    bkImg: '',
    id: '',
    city: '',
    openSettingBtnHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.setNavigationBarTitle({
      title: '活动详情' //页面标题为路由参数
    });
    that.setData({
      id: options.id
    })
    // 获取城市
    if (options && options.city) {
      this.setData({
        city: options.city
      })
    }
    that.getDetail()
  },

  getDetail() {
    let that = this;
    let imgUrlsBK = 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/e904722bfa414fa189fa0b29d683e38a';
    wx.getImageInfo({
      src: imgUrlsBK,
      success: function(sres) {
        that.setData({
          bkImg: sres.path
        })
        // that.saveImageToPhotosAlbum()
      }
    })
  },

  //保存图片
  saveImageToPhotosAlbum: function() {
    wx.showLoading({
      title: '保存中...',
    })
    var that = this;
    //设置画板显示，才能开始绘图
    that.setData({
      canvasHidden: false
    })
    // var unit = that.data.screenWidth / 375
    // var path1 = that.data.bkImg //背景图
    // var context = wx.createCanvasContext('share')
    // context.drawImage(path1, 0, 0, unit * 375, unit * 880)
    // //把画板内容绘制成图片，并回调 画板图片路径
    // context.draw(true, function (e) {
    //   wx.canvasToTempFilePath({
    //     x: 0,
    //     y: 0,
    //     width: unit * 480,
    //     height: unit * 890,
    //     destWidth: unit * 480 * 8,
    //     destHeight: unit * 890 * 8,
    //     canvasId: 'share',
    wx.saveImageToPhotosAlbum({
      filePath: that.data.bkImg,
      success: function(res) {
        let imageUrl = res.tempFilePath
        // wx.getImageInfo({
        //   src: imageUrl,
        //   success: function (sres) {
        //     // 画板路径保存成功后，调用方法吧图片保存到用户相册
        //     wx.saveImageToPhotosAlbum({
        //       filePath: sres.path,
        //       //保存成功失败之后，都要隐藏画板，否则影响界面显示。
        //       success: (res) => {
        wx.hideLoading()
        that.setData({
          canvasHidden: true,
          hindBgType: true
        })
        wx.showToast({
          title: '保存成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        Dialog.confirm({
          title: '保存成功',
          message: '是否返回首页'
        }).then(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
          that.setData({
            hindBgType: false
          })
        }).catch(() => {
          // on cancel
        });
      },
      fail: (err) => {
        Notify({
          text: '暂无访问相册权限，请先授权并重新保存',
          duration: 1000,
          selector: '#van-notify',
          backgroundColor: '#FAC844'
        });
        wx.hideLoading()
        that.setData({
          canvasHidden: true,
          openSettingBtnHidden: true
        })
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          wx.openSetting({
            success(settingdata) {
              console.log(settingdata)
              if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
              } else {
                console.log("获取权限失败")
              }
            }
          })
        }
        //     }
        //   })
        // }
        // })
      },
      fail: function(err) {
        if (!res.tempFilePath) {
          wx.showModal({
            title: '提示',
            content: '图片绘制中，请稍后重试',
            showCancel: false
          })
        }
      }
    })
    // });
  },

  handleSetting: function(e) {
    let that = this;
    // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您已授权，赶紧将图片保存在相册中吧！',
        showCancel: false
      })
      that.setData({
        openSettingBtnHidden: false
      })
    }
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
    let userId = wx.getStorageSync('userId')
    return {
      title: '自主创业，随时上岗；货源稳定、线路优质；购车保收入10万+/年',
      path: '/pages/index/index?puserId=' + userId + '&source=2',
      imageUrl: '../../lib/image/shareImg.jpg',
      success: function(res) {
        // 转发成功
      },
    }
  }
})