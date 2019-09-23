// pages/immediatelyEnter/immediatelyEnter.js
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    nametype: false,
    cardNumber: '',
    phonetype: false,
    bank: '',
    bankVal: '',
    bankType: false,
    bankArr: [],
    bankArr_new: [],
    logistics: '',
    logisticsVal: '',
    logisticsType: false,
    logisticsArr: [],
    logisticsArr_new: [],
    goods: '',
    goodsVal: '',
    goodsType: false,
    goodsArr: [],
    goodsArr_new: [],
    income: '',
    incomeVal: '',
    incomeType: false,
    incomeArr: [],
    incomeArr_new: [],
    accept: '',
    acceptVal: '',
    acceptType: false,
    acceptArr: [],
    acceptArr_new: [],
    bankOther: '',
    bankOtherVal: '',
    bankOtherType: false,
    bankOtherArr: [],
    bankOtherArr_new: [],
    account: '',
    accountVal: '',
    accountType: false,
    accountArr: [
      {
        code: '城镇户口',
        codeVal: '1'
      },
      {
        code: '农村户口',
        codeVal: '2'
      }
    ],
    accountArr_new: ['城镇户口', '农村户口'],
    isHaveLoan: '',
    isHaveLoanVal: '',
    isHaveLoanType: false,
    isHaveLoanArr: [
      {
        code: '是',
        codeVal: '1'
      },
      {
        code: '否',
        codeVal: '2'
      }
    ],
    isHaveLoanArr_new: ['是', '否'],
    childrenNum: '',
    childrenNumVal: '',
    childrenNumType: false,
    childrenNumArr: [
      {
        code: '无',
        codeVal: '0'
      },
      {
        code: '1个',
        codeVal: '1'
      },
      {
        code: '2个',
        codeVal: '2'
      },
      {
        code: '3个',
        codeVal: '3'
      },
      {
        code: '4个',
        codeVal: '4'
      },
      {
        code: '5个',
        codeVal: '5'
      },
      {
        code: '6个',
        codeVal: '6'
      },
      {
        code: '7个',
        codeVal: '7'
      },
      {
        code: '8个',
        codeVal: '8'
      },
      {
        code: '9个',
        codeVal: '9'
      },
    ],
    childrenNumArr_new: ['无', '1个', '2个', '3个', '4个', '5个', '6个', '7个', '8个', '9个'],
    buyCarFollow: '',
    buyCarFollowVal: '',
    buyCarFollowType: false,
    buyCarFollowArr: [
      {
        code: '货源',
        codeVal: '货源'
      },
      {
        code: '收入',
        codeVal: '收入'
      },
      {
        code: '工作强度',
        codeVal: '工作强度'
      },
      {
        code: '车辆品牌',
        codeVal: '车辆品牌'
      },
      {
        code: '首付比例',
        codeVal: '首付比例'
      },
      {
        code: '挂靠上牌',
        codeVal: '挂靠上牌'
      },
    ],
    buyCarFollowArr_new: ['货源', '收入', '工作强度', '车辆品牌', '首付比例', '挂靠上牌'],
    type: false,
    loadModal: false,
    puserId: '',
    orderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '银行卡管理' //页面标题为路由参数
    });
    this.setData({
      orderId: options.id
    })
    this.getData();
  },

  getData() {
    let that = this;
    //获取城市列表
    network.requestLoading('api/base/base/dict/qryDictByType', {
      dictType: 'online_city'
    },
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          //过滤picker
          that.setData({
            bankArr: res.data
          });
          const arrays = that.data.bankArr
          that.setData({
            bankArr_new: common.picker(arrays)
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
    //获取物流从业经验
    network.requestLoading('api/base/base/dict/qryDictByType', {
      dictType: 'logistics_experience'
    },
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          //过滤picker
          that.setData({
            bankOtherArr: res.data
          });
          const arrays = that.data.bankOtherArr
          that.setData({
            bankOtherArr_new: common.picker(arrays)
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
  },

  inputName: function (e) {
    let that = this;
    let name = e.detail.value;
    let types = false;
    if (name != '') {
      types = true;
    }
    that.setData({
      name: name,
      nametype: types
    })
  },

  inputBank: function (e) {
    let that = this;
    let name = e.detail.value;
    let types = false;
    if (name != '') {
      types = true;
    }
    that.setData({
      bankVal: name,
      bankType: types
    })
  },

  inputBankOther: function (e) {
    let that = this;
    let name = e.detail.value;
    let types = false;
    if (name != '') {
      types = true;
    }
    that.setData({
      bankOtherVal: name,
      bankOtherType: types
    })
  },

  inputAccount: function (e) {
    let that = this;
    let bancknum = e.detail.value;
    let types = false;
    if (bancknum.length >= 16 && bancknum.length <= 19) {
      types = true;
    }
    that.setData({
      cardNumber: bancknum,
      phonetype: types
    })
  },

  // 选择开户银行
  bindPickerChangeBank: function (e) {
    this.setData({
      bank: this.data.bankArr_new[e.detail.value],
      bankVal: this.data.bankArr[e.detail.value].codeVal,
      bankType: true
    })
  },

  //开户支行
  bindPickerChangebankOther: function (e) {
    this.setData({
      bankOther: this.data.bankOtherArr_new[e.detail.value],
      bankOtherVal: this.data.bankOtherArr[e.detail.value].codeVal,
      bankOtherType: true
    })
  },

  submitNoBtn: function (e) {
    let that = this;
    Notify({
      text: '请填写完整信息',
      duration: 1000,
      selector: '#van-notify',
      backgroundColor: '#FAC844'
    });
  },

  submitBtn: function (e) {
    let that = this; 
    if (that.data.bankVal == '') {
      Notify({
        text: '请选择开户银行',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    if (that.data.bankOtherVal == '') {
      Notify({
        text: '请选择开户支行',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    if (that.data.name == '') {
      Notify({
        text: '请输入开户名',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    if (that.data.cardNumber == '') {
      Notify({
        text: '请输入银行账户',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    network.requestLoading('api/order/order/xique-modify-bank-account', {
      "accountName": that.data.name,
      "accountOpeningBranch": that.data.bankOtherVal,
      "bankName": that.data.bankVal,
      "cardNumber": that.data.cardNumber,
      "orderId": that.data.orderId
    },
      'post',
      '',
      'json',
      function (res) {
        if (res.success) {
          if (res.data.success) {
            that.setData({
              loadModal: true
            })
            let type = that.data.type;
            if (type == 'home') {
              var pages = getCurrentPages();             //  获取页面栈
              var prevPage = pages[pages.length - 2];    // 上一个页面
              prevPage.setData({
                entranceType: true                     // 假数据
              })
            } else if (type == 'detail') {
              var pages = getCurrentPages();             //  获取页面栈
              var prevPage = pages[pages.length - 2];    // 上一个页面
              prevPage.setData({
                entranceType: true                     // 假数据
              })
            } else if (type == 'myCenter') {
              var pages = getCurrentPages();             //  获取页面栈
              var prevPage = pages[pages.length - 2];    // 上一个页面
              prevPage.setData({
                entranceType: true                     // 假数据
              })
            }
            setTimeout(() => {
              wx.navigateBack({ changed: true });
            }, 1500)
          } else {
            Notify({
              text: res.data.msg,
              duration: 1000,
              selector: '#van-notify',
              backgroundColor: '#FAC844'
            });
            return false;
          }
        } else {
          Notify({
            text: res.errorMsg,
            duration: 1000,
            selector: '#van-notify',
            backgroundColor: '#FAC844'
          });
          return false;
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