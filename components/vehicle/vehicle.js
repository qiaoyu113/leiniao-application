const { getWxOpenId } = require("../../utils/network")
const app = getApp()

// components/vehicleFilter/vehicleFilter.js
Component({
  options: {
    addGlobalClass: true 
  },
  /**
   * 组件的属性列表
   */
  properties: {
    item: Object,
    labels: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    isRent: false
  },

  lifetimes: {
    attached: function() {
      this.setData({
        isRent: app.utils.getEntryRoute() === 'rentedCar'
      })
      // 在组件实例进入页面节点树时执行
      this.init()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init () {},
    onViewDetail (evt) {
      wx.navigateTo({
        url: `/pages/carDetail/carDetail?carId=${this.data.item.id}`,
      })
    }
  }
})
