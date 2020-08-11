// components/contractItem/contractItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    params: Object,
    phone: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    callManager() {
      let that = this;
      if (this.data.phone) {
        wx.makePhoneCall({
          phoneNumber: that.data.phone
        })
      }
    },
    aliveContract() {
      wx.showToast({
        title: '合同签约时间过期，请联系客服激活，并及时签约合同',
        icon: 'none'
      });
    },
    goStart() {
      let that = this;
      var myEventDetail = {open:true,params:this.data.params} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    },
    goDetail() {
      let that = this
      wx.navigateTo({
        url: `../agreement/agreement?contractName=${that.data.params.subject}&id=${that.data.params.contractId}&contract=${that.data.params.driverInfoBusiVO.phone}`,
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {},
      })
    },
  }
})