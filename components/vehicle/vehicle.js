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
    item: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    isRent: false,
    labels: []
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
    init () {
      this.setData({
        labels: [
          {name: '准新车', key: 'isNewCar'},
          this.data.isRent ? {name: '急租', key: 'isUrgentRent'} : {name: '急售', key: 'isUrgentSale'},
          {name: '宽体', key: 'isWidth'},
          {name: '有尾板', key: 'hasTailboard'},
          {name: '有通行证', key: 'hasPass'},
        ]
      })
    },
    onViewDetail (evt) {
      const hasLogin = wx.getStorageSync('phoneName')
      const url = hasLogin ? `/pages/carDetail/carDetail?carId=${this.data.item.carId}` : '/pages/shareLogin/shareLogin'
      wx.navigateTo({url})
    }
  }
})
