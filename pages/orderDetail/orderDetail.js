
var network = require ( "../../utils/network.js" );
Page({
  data: {
    orderObj:{
      statusName:'',
      status:'',
      orderId:'',
      busiTypeName:'',
      cooperationModelName:'',
      cooperationCarName:'',
      cooperationTime:'',
      goodsAmount:''
    },
    orderPayRecordInfoVOList:[],
    createDate:'',//订单生成时间
    passTime:'',//成交时间
    orderRefundApplyTime:'', //退款申请时间
    orderRefundCompleteTime:'',//退款成功时间
    updateDate:''//取消时间

  },
  onLoad:function(option) {
    this.setData({
      'orderObj.orderId':option.orderId
    })
    wx.setNavigationBarTitle({
      title: '订单详情' 
    });
    this.getData()
  },
  /**
   * 获取订单详情
   */
  getData() {
    let that = this
    network.requestLoading ( 'api/order/v1/order/orderDetail',
    {
      orderId:this.data.orderObj.orderId 
    },
    'GET',
    '正在加载',
    'json',
    function ( response ) {
        var res = response.data
        that.setData ( {
          orderObj:{
            orderId:res.orderId,
            busiTypeName:res.busiTypeName,
            cooperationModelName:res.cooperationModelName,
            cooperationCarName:res.cooperationCarName,
            cooperationTime:res.cooperationTime,
            goodsAmount:res.goodsAmount,
            statusName:res.statusName,
            status:res.status
          },
          orderPayRecordInfoVOList:res.orderPayRecordInfoVOList || [],
          createDate:res.createDate || '',
          passTime: res.passTime || '',
          orderRefundApplyTime:res.orderRefundApplyTime || '',
          orderRefundCompleteTime:res.orderRefundCompleteTime || '',
          updateDate:res.updateDate || ''
        } );
    }, function () {
        wx.showToast ( {
            image: '../../lib/image/jg.png',
            title: '加载数据失败',
        } );
    } );
  }
})