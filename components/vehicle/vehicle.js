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
    labels: [],
    info: {}
  },

  observers: {
    'item': function (item) {
      this.addRotateClassForImage(item)
    }
  },

  lifetimes: {
    attached: function() {
      this.setData({
        isRent: app.utils.getEntryRoute() === 'rentedCar'
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onViewDetail (evt) {
      const hasLogin = wx.getStorageSync('phoneName')
      const url = hasLogin ? `/pages/carDetail/carDetail?carId=${this.data.item.carId}&type=${this.data.isRent ? 'rent':'sale'}` : '/pages/login/login'
      wx.navigateTo({url})
    },
    addRotateClassForImage (item) {
      wx.getImageInfo({
        src: item.pic,
        success: res => {
          const orientation = res.orientation || 'up'
          const rotate = {
            'down': 'rotate-180',
            'down-mirrored': 'rotate-180',
            'left': 'rotate-270',
            'left-mirrored': 'rotate-270',
            'right': 'rotate-90',
            'right-mirrored': 'rotate-90'
          }
          if (orientation !== 'up') {
            console.log(orientation, item)
          }
          item.orientation = orientation
          item.rotateClass = rotate[orientation] || ''
          this.setData({info: item})
        }
      })
    }
  }
})
