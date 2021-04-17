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
    
  },

  lifetimes: {
    attached: function() {
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
      console.log('todo 登录态检查&跳转详情页')
      // todo 登录态检查&跳转详情页
    }
  }
})
