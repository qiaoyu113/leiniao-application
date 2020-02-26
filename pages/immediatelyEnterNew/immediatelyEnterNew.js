// pages/immediatelyEnter/immediatelyEnter.js
var network = require("../../utils/network.js");
var common = require("../../utils/util.js");
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    nametype:false,
    phone:'',
    phonetype:false,
    address:'',
    addressVal: '',
    addressType:false,
    addressArr: [],
    addressArr_new:[],
    logistics:'',
    logisticsVal: '',
    logisticsType: false,
    logisticsArr: [],
    logisticsArr_new: [],
    goods:'',
    goodsVal: '',
    goodsType: false,
    goodsArr: [],
    goodsArr_new: [],
    income:'',
    incomeVal: '',
    incomeType: false,
    incomeArr: [],
    incomeArr_new: [],
    accept: '',
    acceptVal: '',
    acceptType: false,
    acceptArr: [],
    acceptArr_new: [],
    intentional: '',
    intentionalVal: '',
    intentionalType: false,
    intentionalArr: [],
    intentionalArr_new: [],
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
    accountArr_new: ['城镇户口','农村户口'],
    isHaveLoan:'',
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
    buyCarFollowArr_new: ['货源', '收入', '工作强度', '车辆品牌', '首付比例','挂靠上牌'],
    type: false,
    loadModal: false,
    puserId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '立即入驻' //页面标题为路由参数
    });
    let phone = wx.getStorageSync('phone')
    if (phone){
      this.setData({
        phone: phone,
        phonetype: true
      })
    }
    if (options && options.type){
      this.setData({
        type: options.type
      })
    }
    if (options && options.puserId) {
      this.setData({
        puserId: options.puserId
      })
    }
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
            addressArr: res.data
          });
          const arrays = that.data.addressArr
          that.setData({
            addressArr_new: common.picker(arrays)
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
            logisticsArr: res.data
          });
          const arrays = that.data.logisticsArr
          that.setData({
            logisticsArr_new: common.picker(arrays)
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
    //获取货物经验
    network.requestLoading('api/base/base/dict/qryDictByType', {
      dictType: 'type_of_goods'
    },
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          //过滤picker
          that.setData({
            goodsArr: res.data
          });
          const arrays = that.data.goodsArr
          that.setData({
            goodsArr_new: common.picker(arrays)
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
    //获取期望月收入
    network.requestLoading('api/base/base/dict/qryDictByType', {
      dictType: 'expected_monthly_income'
    },
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          //过滤picker
          that.setData({
            incomeArr: res.data
          });
          const arrays = that.data.incomeArr
          that.setData({
            incomeArr_new: common.picker(arrays)
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
    //获取可接受一天工作时长
    network.requestLoading('api/base/base/dict/qryDictByType', {
      dictType: 'accept_one_day_of_work'
    },
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          //过滤picker
          that.setData({
            acceptArr: res.data
          });
          const arrays = that.data.acceptArr
          that.setData({
            acceptArr_new: common.picker(arrays)
          });
        }
      },
      function (res) {
        wx.showToast({
          title: '加载数据失败',
        });
      });
    //获取意向车型
    network.requestLoading('api/base/base/dict/qryDictByType', {
      dictType: 'Intentional_compartment'
    },
      'GET',
      '',
      '',
      function (res) {
        if (res.success) {
          //过滤picker
          that.setData({
            intentionalArr: res.data
          });
          const arrays = that.data.intentionalArr
          that.setData({
            intentionalArr_new: common.picker(arrays)
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

  inputPhone: function (e) {
    let that = this;
    let value = e.detail.value;
    let types = false;
    if (value != '') {
      types = true;
    }
    that.setData({
      phone: value,
      phonetype: types
    })
  },

  // 选择城市
  bindPickerChangeCity: function (e) {
    this.setData({
      address: this.data.addressArr_new[e.detail.value],
      addressVal: this.data.addressArr[e.detail.value].codeVal,
      addressType: true
    })
  },

  // 选择物流从业经验
  bindPickerChangeLogistics: function (e) {
    this.setData({
      logistics: this.data.logisticsArr_new[e.detail.value],
      logisticsVal: this.data.logisticsArr[e.detail.value].codeVal,
      logisticsType: true
    })
  },

  // 选择货物经验
  bindPickerChangegoods: function (e) {
    this.setData({
      goods: this.data.goodsArr_new[e.detail.value],
      goodsVal: this.data.goodsArr[e.detail.value].codeVal,
      goodsType: true
    })
  },

  // 选择期望月收入
  bindPickerChangeincome: function (e) {
    this.setData({
      income: this.data.incomeArr_new[e.detail.value],
      incomeVal: this.data.incomeArr[e.detail.value].codeVal,
      incomeType: true
    })
  },

  //可接受一天工作时长
  bindPickerChangeaccept: function (e) {
    this.setData({
      accept: this.data.acceptArr_new[e.detail.value],
      acceptVal: this.data.acceptArr[e.detail.value].codeVal,
      acceptType: true
    })
  },

  //意向车型
  bindPickerChangeintentional: function (e) {
    this.setData({
      intentional: this.data.intentionalArr_new[e.detail.value],
      intentionalVal: this.data.intentionalArr[e.detail.value].codeVal,
      intentionaType: true
    })
  },

  //户口类型
  bindPickerChangeaccount: function (e) {
    this.setData({
      account: this.data.accountArr_new[e.detail.value],
      accountVal: this.data.accountArr[e.detail.value].codeVal,
      accountType: true
    })
  },

  //是否还在还贷款
  bindPickerChangeisHaveLoan: function (e) {
    this.setData({
      isHaveLoan: this.data.isHaveLoanArr_new[e.detail.value],
      isHaveLoanVal: this.data.isHaveLoanArr[e.detail.value].codeVal,
      isHaveLoanType: true
    })
  },

  //家里有几个孩子
  bindPickerChangechildrenNum: function (e) {
    this.setData({
      childrenNum: this.data.childrenNumArr_new[e.detail.value],
      childrenNumVal: this.data.childrenNumArr[e.detail.value].codeVal,
      childrenNumType: true
    })
  },

  //购车最关注
  bindPickerChangebuyCarFollow: function (e) {
    this.setData({
      buyCarFollow: this.data.buyCarFollowArr_new[e.detail.value],
      buyCarFollowVal: this.data.buyCarFollowArr[e.detail.value].codeVal,
      buyCarFollowType: true
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
    let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(that.data.phone)) {
      Notify({
        text: '请输入正确的手机号',
        duration: 1000,
        selector: '#van-notify',
        backgroundColor: '#FAC844'
      });
      return false;
    }
    let souceCity = wx.getStorageSync('locationAddress')
    let source = wx.getStorageSync('sourceType')
    network.requestLoading('api/driver/driver/clue/settledInForLessInfo', {
      "carType": that.data.intentionalVal,
      "name": that.data.name,
      "phone": that.data.phone,
      "puserId": that.data.puserId,
      "sourceType": source,
      "workCity": that.data.addressVal,
    },
      'POST',
      '',
      'json',
      function (res) {
        if (res.success) {
          if(res.data.code == 200){
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
              wx.removeStorageSync('token')
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