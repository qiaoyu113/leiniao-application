// components/hotNew/hotNew.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    gotoadList(e) {
      let { index } = e.currentTarget.dataset
      this.triggerEvent('gotoadList', { params: index })
    },
  },
})
