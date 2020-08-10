// pages/test/test.js
var app = getApp();
var network = require("../../utils/network.js");
var url = app.globalData.url;
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/img/731b50a82567493b8bb8c104aae97f52'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    
  },

  goChart() {
    // wx.qy.openUserProfile({
    //   type: 2,//1表示该userid是企业成员，2表示该userid是外部联系人
    //   userid: "wmEQlEGwAAHxbWYDOK5u3Af13xlYAAAA", //可以是企业成员，也可以是外部联系人
    //   success: function (res) {
    //     // 回调
    //     console.log(11111, res)
    //   }
    // });

    // wx.qy.selectEnterpriseContact({
    //   fromDepartmentId: -1,// 必填，-1表示打开的通讯录从自己所在部门开始展示, 0表示从最上层开始
    //   mode: "single",// 必填，选择模式，single表示单选，multi表示多选
    //   type: ["department", "user"],// 必填，选择限制类型，指定department、user中的一个或者多个
    //   success: function (res) {
    //     console.log(11111, res)
    //     var selectedDepartmentList = res.result.departmentList;// 已选的部门列表
    //     for (var i = 0; i < selectedDepartmentList.length; i++) {
    //       var department = selectedDepartmentList[i];
    //       var departmentId = department.id;// 已选的单个部门ID
    //       var departemntName = department.name;// 已选的单个部门名称
    //     }
    //     var selectedUserList = res.result.userList; // 已选的成员列表
    //     for (var i = 0; i < selectedUserList.length; i++) {
    //       var user = selectedUserList[i];
    //       var userId = user.id; // 已选的单个成员ID
    //       var userName = user.name;// 已选的单个成员名称
    //       var userAvatar = user.avatar;// 已选的单个成员头像
    //     }
    //   },
    //   fail(err) {
    //     console.log(22222, err)
    //   }
    // });

    // wx.qy.selectExternalContact({
    //   filterType: 0,//0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。
    //   success: function (res) {
    //     var userIds = res.userIds;// 返回此次选择的外部联系人userId列表，数组类型
    //   }
    // });

    // wx.qy.openEnterpriseChat({
    //   // 注意：userIds和externalUserIds至少选填一个，且userIds+openIds总数不能超过2000。
    //   userIds: 'zhangshan;lisi;wangwu',    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
    //   externalUserIds: 'wmSAlECoAAHrbWYDjK5u3Af13xlYAAAA;wmESkECwAAHrNWYDOK5u3Af13xlYAAAA', // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
    //   groupName: '讨论组',  // 必填，会话名称。单聊时该参数传入空字符串""即可。
    //   success: function (res) {
    //     // 回调
    //   },
    //   fail: function (res) {
    //     // 失败处理
    //   }
    // });

    // wx.qy.selectEnterpriseContact({
    //   fromDepartmentId: 0,// 必填，-1表示打开的通讯录从自己所在部门开始展示, 0表示从最上层开始
    //   mode: "single",// 必填，选择模式，single表示单选，multi表示多选
    //   type: ["department", "user"],// 必填，选择限制类型，指定department、user中的一个或者多个
    //   success: function (res) {
    //     var selectedDepartmentList = res.result.departmentList;// 已选的部门列表
    //     for (var i = 0; i < selectedDepartmentList.length; i++) {
    //       var department = selectedDepartmentList[i];
    //       var departmentId = department.id;// 已选的单个部门ID
    //       var departemntName = department.name;// 已选的单个部门名称
    //     }
    //     var selectedUserList = res.result.userList; // 已选的成员列表
    //     for (var i = 0; i < selectedUserList.length; i++) {
    //       var user = selectedUserList[i];
    //       var userId = user.id; // 已选的单个成员ID
    //       var userName = user.name;// 已选的单个成员名称
    //       var userAvatar = user.avatar;// 已选的单个成员头像
    //     }
    //   }
    // });

    wx.qy.login({
      success: function (res) {
        console.log(333333, res)
        if (res.code) {
          network.requestLoading('api/bss/v1/bss/line/task/xcxLineTasks?abc=' + res.code, {
            "carTypeName": res.code,
            "cargoType": res.code,
            "region": res.code,
            "city": res.code,
            "key": '',
            "limit": 20,
            "page": 1
          },
            'POST',
            '',
            'json',
            function (res) {
              if (res.success) { } else {
                console.log('test')
              }
            },
            function (res) {
              wx.showToast({
                title: '加载数据失败',
              });
            });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail: res => {
        console.log(4444, res)
      }
    });
  },

  previewImage: function (e) {
    console.log(e)
    wx.previewImage({
      urls: this.data.scene.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错
    })
  },

  addDB() {
    let that = this;
    // _movies.doc('57964ec45daec8d501f4b60f14351b56').remove({
    //   success: res => {
    //     _movies.where({
    //     }).get({
    //       success: function (res) {
    //         that.setData({
    //           list: res.data
    //         })
    //       }
    //     })
    //   }, fail: err => {
    //     console.log(err)
    //   }
    // })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'get',
      // 传给云函数的参数
      data: {
        a: 1,
        b: 2,
      },
      success: function (res) {
        console.log(res.result.sum) // 3
      },
      fail: console.error
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