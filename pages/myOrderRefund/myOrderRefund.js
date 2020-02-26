// pages/myOrderRefund/myOrderRefund.js
var app = getApp()
var urls = app.globalData.url
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    avatar: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/ba0323a3f08e49cfb2511fa8fd067f00',
    imageList: [],
    textareaVal: '',
    detail: '',
    typeBtn: true,
    hindBgType: false,
    Type: false,
    index: 0,
    refundArray: [],
    arrays: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '退款申请' //页面标题为路由参数
    });
    this.setData({
      id: options.id
    })
    if (options.type) {
      this.setData({
        Type: options.type
      })
      this.getDetail2()
    } else {
      this.getDetail()
    }
  },

  getDetail() {
    let that = this;
    network.requestLoading('api/base/base/dict/qryDictByType', {
        dictType: 'order_refund_reason'
      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          //过滤picker
          that.setData({
            array: res.data
          });
          const arrays = that.data.array
          let refundArray = common.picker(arrays)
          that.setData({
            refundArray: refundArray
          });
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
    network.requestLoading('api/order/v1/magpie/order/orderDetail', {
        orderId: that.data.id
      },
      'get',
      '',
      '',
      function(res) {
        if (res.success) {
          let data = res.data
          if (data.managementFeeFirst) {
            data.managementFeeFirst = data.managementFeeFirst.toFixed(2)
          } else {
            data.managementFeeFirst = '0.00'
          }
          that.setData({
            detail: data
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  getDetail2() {
    let that = this;
    network.requestLoading('api/base/base/dict/qryDictByType', {
        dictType: 'order_refund_reason'
      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          //过滤picker
          that.setData({
            array: res.data
          });
          const arrays = that.data.array
          let refundArray = common.picker(arrays)
          that.setData({
            refundArray: refundArray
          });
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
    network.requestLoading('api/order/v1/magpie/order/queryRefundApplication', {
        orderId: that.data.id
      },
      'get',
      '',
      '',
      function(res) {
        if (res.success) {
          let data = res.data
          if (data.managementFeeFirst) {
            data.managementFeeFirst = data.managementFeeFirst.toFixed(2)
          } else {
            data.managementFeeFirst = '0.00'
          }
          that.setData({
            detail: data
          })
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
      textareaVal: this.data.array[e.detail.value].codeVal,
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
        var avatar = res.tempFilePaths;
        that.setData({
          upAvatar: true
        })
        var token = wx.getStorageSync('token')
        wx.uploadFile({
          url: urls + 'api/base/v1/upload/uploadOSS/img/true/-1',
          filePath: avatar[0],
          header: {
            "Authorization": token
          },
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function(res) {
            let data = JSON.parse(res.data)
            let arrs = that.data.imageList
            arrs.push(data.data.url)
            that.setData({
              imageList: arrs
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

  delImage(e) {
    let _this = this;
    let i = e.currentTarget.dataset.index
    let arrs = _this.data.imageList
    arrs.splice(i, 1);
    _this.setData({
      imageList: arrs
    })
  },

  _input(event) {
    let value = event.detail.value
    this.setData({
      textareaVal: value
    })
  },

  submitForm: function() {
    let that = this;
    let typeBtn = that.data.typeBtn;
    if (typeBtn) {
      that.setData({
        typeBtn: false
      })
      if (that.data.textareaVal == '') {
        Notify({
          text: '请填写退款原因',
          duration: 1000,
          selector: '#van-notify',
          backgroundColor: '#FAC844'
        });
        that.setData({
          typeBtn: true
        })
        return false;
      }
      if (that.data.imageList.length == '') {
        Notify({
          text: '请上传付款数据',
          duration: 1000,
          selector: '#van-notify',
          backgroundColor: '#FAC844'
        });
        that.setData({
          typeBtn: true
        })
        return false;
      }
      if (that.data.Type) {
        network.requestLoading('api/order/v1/magpie/order/refundApplication', {
            "reason": that.data.textareaVal,
            "urls": that.data.imageList.toString(),
            "orderId": that.data.id
          },
          'POST',
          '',
          'json',
          function(res) {
            if (res.success) {
              wx.redirectTo({
                url: '../myOrderRefundSuccess/myOrderRefundSuccess?id=' + that.data.id + '&&type=1'
              });
            } else {
              Notify({
                text: res.errorMsg,
                duration: 2000,
                selector: '#van-notify',
                backgroundColor: '#FAC844'
              });
              that.setData({
                typeBtn: true
              })
            }
          },
          function(res) {
            that.setData({
              typeBtn: true
            })
            wx.showToast({
              title: '加载数据失败',
            });
          });
      } else {
        network.requestLoading('api/order/v1/magpie/order/checkOrderRefundCondition', {
            orderId: that.data.id
          },
          'get',
          '',
          '',
          function(res) {
            if (res.success) {
              network.requestLoading('api/order/v1/magpie/order/refundOrder', {
                  "refundReason": that.data.textareaVal,
                  "receiptPhoto": that.data.imageList.toString(),
                  "orderId": that.data.id
                },
                'POST',
                '',
                'json',
                function(res) {
                  if (res.success) {
                    wx.redirectTo({
                      url: '../myOrderRefundSuccess/myOrderRefundSuccess?id=' + that.data.id
                    });
                    // Dialog.alert({
                    //   title: '提交成功',
                    //   message: '已将退款申请提交至总部审核，具体到账时间按审核后打款为准。详情可咨询: 400-688-9179'
                    // }).then(() => {

                    //   that.setData({
                    //     hindBgType: false
                    //   })
                    // })
                    // that.setData({
                    //   hindBgType: true
                    // })
                  } else {
                    Notify({
                      text: res.errorMsg,
                      duration: 2000,
                      selector: '#van-notify',
                      backgroundColor: '#FAC844'
                    });
                    that.setData({
                      typeBtn: true
                    })
                  }
                },
                function(res) {
                  that.setData({
                    typeBtn: true
                  })
                  wx.showToast({
                    title: '加载数据失败',
                  });
                });
            } else {
              Notify({
                text: res.errorMsg,
                duration: 2000,
                selector: '#van-notify',
                backgroundColor: '#FAC844'
              });
              that.setData({
                typeBtn: true
              })
            }
          },
          function(res) {
            wx.showToast({
              title: '加载数据失败',
            });
          });
      }
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

  }
})