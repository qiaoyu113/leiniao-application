// pages/sceneAnalyze/sceneAnalyze.js
var app = getApp();
var network = require ('../../utils/network.js');
var common = require ('../../utils/util.js');
// import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
Page ({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    wx.setNavigationBarTitle ({
      title: '正在识别二维码...', //页面标题为路由参数
    });
    const that = this;
    const scene = decodeURIComponent (query.scene);
    if (scene != 'undefined') {
      network.requestLoading (
        'api/core/v1/wechat/getParamByQrCodeId',
        {qrCodeId: scene},
        'GET',
        '',
        '',
        function (res) {
          if (res.success) {
            let data = JSON.parse (res.data);
            console.log(data)
            if (data.redirectUrl) {
              that.redirectFn (data.redirectUrl, data);
            } else {
              let urlList = [
                '../index/index',
                '../lineList/lineList',
                '../myCenter/myCenter'
              ];
              if (urlList.indexOf (data.page) > -1) {
                app.globalData.pageParam = data.pageParam
                wx.switchTab ({
                  url: data.page,
                });
              } else {
                wx.redirectTo ({
                  url: data.page + '?' + data.pageParam,
                  fail: function (res) {
                    Dialog.alert ({
                      title: '提示',
                      message: '路径无法识别',
                    }).then (() => {
                      wx.switchTab ({
                        url: '../index/index',
                      });
                    });
                  },
                });
              }
            }
          } else {
            Dialog.alert ({
              title: '提示',
              message: res.errorMsg,
            }).then (() => {
              wx.switchTab ({
                url: '../index/index',
              });
            });
          }
        },
        function (res) {
          wx.showToast ({
            title: '加载数据失败',
          });
        }
      );
    } else {
      Dialog.alert ({
        title: '提示',
        message: '无法识别二维码',
      }).then (() => {
        wx.switchTab ({
          url: '../index/index',
        });
      });
    }
  },
  redirectFn: function (url, data) {
    network.requestLoading (
      url,
      {},
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          let urlList = [
            '../index/index',
            '../lineList/lineList',
            '../myCenter/myCenter',
          ];
          if (urlList.indexOf (data.page) > -1) {
            app.globalData.pageParam = data.pageParam
            wx.switchTab ({
              url: data.page,
            });
          } else {
            wx.redirectTo ({
              url: data.page + '?' + data.pageParam,
              fail: function (res) {
                Dialog.alert ({
                  title: '提示',
                  message: '路径无法识别',
                }).then (() => {
                  wx.switchTab ({
                    url: '../index/index',
                  });
                });
              },
            });
          }
        } else {
          Dialog.alert ({
            title: '提示',
            message: res.errorMsg,
          }).then (() => {
            wx.switchTab ({
              url: '../index/index',
            });
          });
        }
      },
      function (res) {
        wx.showToast ({
          title: '加载数据失败',
        });
      }
    );
  },
  getScan (url) {
    let that = this;
    wx.getStorageInfo;
    network.requestLoading (
      url,
      {
        dictType: 'online_city',
      },
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          //过滤picker
          that.setData ({
            array: res.data,
          });
          const arrays = that.data.array;
          let cityArr = common.picker (arrays);
          that.setData ({
            cityArray: cityArr,
          });
        }
      },
      function (res) {
        wx.showToast ({
          title: '加载数据失败',
        });
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
