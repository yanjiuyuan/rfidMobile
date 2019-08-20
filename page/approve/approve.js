import pub from '/util/public';
Page({
  ...pub.func,
  data: {
    ...pub.data, 
    activeItem:0,
    pageIndex:1,
    pageCount:0,
    clientHeight:400,
    size:5,
    items:[
      {
        index:0,
        name:'待我审批',
        image:'../../image/1.png'
      },
      {  
        index:1,
        name:'我已审批',
        image:'../../image/1.png'
      },
      {
        index:2,
        name:'我发起的',
        image:'../../image/2.png'
      },
      {
        index:3,
        name:'抄送我的',
        image:'../../image/3.png'
      }
    ],
    approveList:[]
  },
  onLoad(query) {
    return
    if(query.index){
      this.setData({
        activeItem:query.index
      })
    }
    this.checkLogin(() => {
      this.getApproveList(this.data.activeItem);
    })
   
  },
  onShow() {
    setTimeout(() => {
      this.checkLogin(() => {
        this.getApproveList(this.data.activeItem);
      })
    },200)
    //this.getApproveList(this.data.activeItem)
  },
  onReady() {
    let that=this;
    dd.getSystemInfo({
      success: function(res) {
        console.log(res);
          that.setData({
          clientHeight: res.windowHeight-res.windowHeight*0.14
        });
      }
    })
  },
  changeItem(e)
  {
    this.data.size = 5;
    var that = this
    let index = e.target.dataset.index
    if(index == this.data.activeItem) return
    this.setData({
      activeItem:index
    })
    this.checkLogin(function(){
      that.getApproveList(index);
    })
  },
  //关键字搜索
  search(e) {
    var value = e.detail.value
    this.getApproveList(this.data.activeItem,value.keyword)
  },
  //下拉刷新
  onPullDownRefresh() {
    var that = this
    this.checkLogin(function(){
      that.getApproveList(that.data.activeItem);
    })
    dd.stopPullDownRefresh();
  },
  //获取审批列表
  getApproveList(index,keyword){
    var that = this
    let param =  {
      Index:index,
      ApplyManId:that.data.DingData.userid,
      IsSupportMobile:true,
      pageIndex:1,
      pageSize:this.data.size,
      }
    if(keyword) param['Key'] = keyword
    dd.showLoading({content:'获取审批列表中，请稍候~'})
    that._getData('FlowInfoNew/GetFlowStateDetail' + that.formatQueryStr(
     param) ,
     function(res) { 
      that.setData({
        'approveList': res.slice(0,50),
        pageCount:Math.ceil(res.length/5)
      })
      dd.hideLoading();
    })
  },
  //跳转到详细页面
  toDetial(e){
    let row = e.target.dataset.row
    var that = this
    console.log(row)
    if(this.data.activeItem == 3){
      that._getData('FlowInfoNew/ChangeSendState' + that.formatQueryStr({TaskId:row.TaskId,UserId:that.data.DingData.userid}),
      function(res) { 
        that.router(row)
      })
    }else{
      that.router(row)
    }
  },
  router(row){
    if (row.TaskId && row.FlowId) {
        let param = {
            taskid: row.TaskId,
            flowid: row.FlowId,
            nodeid: row.NodeId,
            id: row.Id,
            index: this.data.activeItem,
            state: row.State
        }
        let url = ''
        switch(row.FlowId){
          case 1: url = '/page/approveDetail/officeSupplies/officeSupplies'; break;
          case 6: url = '/page/approveDetail/paper/paper'; break;
          case 8: url = '/page/approveDetail/purchase/purchase'; break;
          case 12: url = '/page/approveDetail/meterieCode/meterieCode'; break;
          case 13: url = '/page/approveDetail/usePublicCar/usePublicCar'; break;
          case 14: url = '/page/approveDetail/useCar/useCar'; break;
          case 18: url = '/page/approveDetail/officePurchase/officePurchase'; break;
          case 24: url = '/page/approveDetail/gift/gift'; break;
          case 19: url = '/page/approveDetail/sendRead/sendRead'; break;
          case 26: url = '/page/approveDetail/picking/picking'; break;
          case 27: url = '/page/approveDetail/intoStorage/intoStorage'; break;
          case 30: url = '/page/approveDetail/goOut/goOut'; break;
          case 31: url = '/page/approveDetail/createProject/createProject'; break;
          case 32: url = '/page/approveDetail/crossHelp/crossHelp'; break;
          case 33: url = '/page/approveDetail/changePaper/changePaper'; break;
          case 34: url = '/page/approveDetail/techonologySupply/techonologySupply'; break;
          case 35: url = '/page/approveDetail/letGoodsGo/letGoodsGo'; break;
          case 36: url = '/page/approveDetail/intellectualProperty/intellectualProperty'; break;
          case 67: url = '/page/approveDetail/borrowThing/borrowThing'; break;
          case 68: url = '/page/approveDetail/maintain/maintain'; break;
          case 69: url = '/page/approveDetail/projectClosure/projectClosure'; break; 
        
        }
        dd.navigateTo({
            url: url + this._formatQueryStr(param)
          })
    }
  },



  scroll(){
    this.data.size=this.data.size + 5;
    // console.log(this.data.size);
    this.getApproveList(this.data.activeItem);
  },



});
