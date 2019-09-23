// pages/recommend/recommend.js
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    nameType: false,
    phone: '',
    phoneType: false,
    address: '请选择',
    cityArray: [],
    array: [],
    index: 0,
    addressType: false,
    carName: '',
    array2: [],
    carArray: [],
    index2: 0,
    carName: '请选择',
    carType: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '推荐司机信息' //页面标题为路由参数
    });
    this.getCity();
    this.getCar();
  },

  getCity() {
    let that = this;
    //获取城市列表
    network.requestLoading('api/base/base/dict/qryDictByType', {
        dictType: 'online_city'
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
          let cityArr = common.picker(arrays)
          that.setData({
            cityArray: cityArr
          });
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  getCar() {
    let that = this;
    //意向车型
    network.requestLoading('api/base/base/dict/qryDictByType', {
        dictType: 'Intentional_compartment'
      },
      'GET',
      '',
      '',
      function(res) {
        if (res.success) {
          //过滤picker
          that.setData({
            array2: res.data
          });
          const arrays = that.data.array2
          let carArray = common.picker(arrays)
          that.setData({
            carArray: carArray
          });
        }
      },
      function(res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  //输入内容
  inputChange(e) {
    let type = e.currentTarget.dataset.type
    if (type == 1) {
      let value = e.detail.value;
      this.setData({
        name: value,
        nameType: true
      })
      if (value == '') {
        this.setData({
          name: value,
          nameType: false
        })
      }
    } else if (type == 2) {
      let value = e.detail.value;
      this.setData({
        phone: value,
        phoneType: true
      })
      if (value == '') {
        this.setData({
          phone: value,
          phoneType: false
        })
      }
    }
  },

  bindPickerChange: function(e) {
    this.setData({
      address: this.data.cityArray[e.detail.value],
      index: e.detail.value,
      addressType: true
    })
  },

  bindPickerChange2: function(e) {
    this.setData({
      carName: this.data.carArray[e.detail.value],
      carType: true,
      index2: e.detail.value
    })
  },

  submit: function() {
    let that = this;
    if (!that.data.nameType) {
      Notify({
        text: '请输入姓名',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    } else if (!that.data.phoneType) {
      Notify({
        text: '请输入联系方式',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    } else if (!that.data.addressType) {
      Notify({
        text: '请选择城市',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    } else if (!that.data.carType) {
      Notify({
        text: '请选择意向车型',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    } else {
      if (!(/^1[3456789]\d{9}$/.test(that.data.phone))) {
        Notify({
          text: '请输入正确手机号',
          duration: 1000,
          selector: '#van-notify',
          backgroundColor: '#FAC844'
        });
        return false;
      } else {
        network.requestLoading('api/driver/driver/clue/recommendDriverClue', {
            name: that.data.name,
            phone: that.data.phone,
            workCity: that.data.array[that.data.index].codeVal,
            carType: that.data.array2[that.data.index2].codeVal,
            sourceType: '1'
          },
          'POST',
          '',
          'json',
          function(res) {
            if (res.success) {
              if(res.data.code == 200){
                wx.redirectTo({
                  url: '../successRecommend/successRecommend'
                })
              } else {
                Notify({
                  text: res.data.msg,
                  duration: 2000,
                  selector: '#van-notify',
                  backgroundColor: '#FAC844'
                });
              }
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
    let userId = wx.getStorageSync('userId')
    return {
      title: '自主创业，随时上岗；货源稳定、线路优质；购车保收入10万+/年',
      path: '/pages/index/index?puserId=' + userId + '&source=2',
      imageUrl: '../../lib/image/shareImg.jpg',
      success: function (res) {
        // 转发成功
      },
    }
  }
})