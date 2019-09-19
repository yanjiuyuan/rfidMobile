import pub from '/util/public';
let good = {}
Page({
  ...pub.func,
  ...pub.func.start,
  data: {
    ...pub.data,
    hidden: true,
    tableOperate: '选择',
    purchaseList: [],
    tableParam2: {
      size: 100,
      now: 1,
      total: 0
    },
    tableOperate2: '删除',
    good: {},
    totalPrice: 0,
    tableItems: [
      {
        prop: 'fNumber',
        label: '物料编码',
        width: 200
      },
      {
        prop: 'fName',
        label: '物料名称',
        width: 300
      },
      {
        prop: 'fModel',
        label: '规格型号',
        width: 300
      },
      {
        prop: 'unitName',
        label: '单位',
        width: 100
      },
      {
        prop: 'fNote',
        label: '预计单价',
        width: 100
      }
    ],
    tableItems2: [
      {
        prop: 'CodeNo',
        label: '物料编码',
        width: 200
      },
      {
        prop: 'Name',
        label: '物料名称',
        width: 300
      },
      {
        prop: 'Standard',
        label: '规格型号',
        width: 300
      },
      {
        prop: 'Unit',
        label: '单位',
        width: 100
      },
      {
        prop: 'ExpectPrice',
        label: '预计单价',
        width: 100
      },
      {
        prop: 'Count',
        label: '数量',
        width: 100
      },
      {
        prop: 'Purpose',
        label: '用途',
        width: 300
      },
      {
        prop: 'Mark',
        label: '备注',
        width: 300
      }
    ],
    //data:[]
  },
  //表单操作相关
  search(e){
    var that = this;
    var value = e.detail.value;
    console.log(this.data.chooseParam);
    console.log(value);
    if (!value || !value.keyWord.trim()) {
      dd.alert({
        content:"请输入关键字",
        buttonText:"确认"
      })
      return;
      }
    let url =  that.data.jinDomarn + 'OfficeSupply/GetOfficeInfo' + that.formatQueryStr({Key:value.keyWord.trim()})
    dd.httpRequest({
      url:url,
      method: 'GET',
      headers:{'Content-Type':'application/x-www-form-urlencoded; charset=utf-8'},
      success: function(res) {
        let data = res.data.data
        console.log(url)
        console.log(data)
        if(data.length == 0){
          dd.alert({
            content:"未搜索到相关结果",
            buttonText:"确认"
          })
        }
        that.setData({
          'tableParam.total': data.length
        })
        that.data.data =  data
        that.getData()
      },
      fail: function(res) {
        if(JSON.stringify(res) == '{}') return
        dd.alert({ content: '获取数据失败-' + url+ '报错:'  +  JSON.stringify(res) });
      }
    });
    return
    that.requestData('GET', 'OfficeSupplies/GetICItem' + that.formatQueryStr({Key:value.keyWord}) , function(res) { 
      console.log(JSON.parse(res.data))
      that.setData({
        'tableParam.total': JSON.parse(res.data).length
      })
      that.data.data =  JSON.parse(res.data)
      that.getData()
    })
  },
  submit(e) {
    var that = this
    var value = e.detail.value
    var param = {
        Title: value.title,
        Remark: value.remark
    }
    if(!that.data.purchaseList.length){
      dd.alert({content: `请选择办公用品` })
      return
    }
    let callBack = function (taskId) {
        that.bindAll(taskId)
    }
    console.log(param)
    //return
    this.approvalSubmit(param, callBack)
  },
  bindAll(taskId) {
      var that = this
      var paramArr = []
      for (let p of that.data.purchaseList) {
          p.TaskId = taskId
          paramArr.push(p)
      }
      that.requestJsonData('POST', "OfficeSupplies/SaveTable", function(res) {
          that.doneSubmit()
      },JSON.stringify(paramArr))
  },


  //弹窗表单相关
  //显示弹窗表单
  chooseItem(e){
    if(!e) return
    console.log(e)
    good = e.target.targetDataset.row
    if(!good) return
    
    this.setData({
      hidden: !this.data.hidden
    })
    this.createMaskShowAnim();
    this.createContentShowAnim();
  },
  deleteItem(e){
    if(!e) return
    console.log(e)
    let index = e.target.targetDataset.index
    if((!index) && index != 0)  return
    console.log(this.data.purchaseList)
    this.data.purchaseList.splice(index, 1)
    this.setData({
      purchaseList:this.data.purchaseList
    })
    console.log(this.data.purchaseList)
  },
  selectDate(){
    dd.datePicker({
      currentDate: this.data.DateStr,
      startDate: this.data.DateStr,
      endDate: this.data.Year+1 + '-' + this.data.Month + '-' + this.data.Day,
      success: (res) => {
        this.setData({
          dateStr: res.date
        })
      },
    });
  },
  //提交弹窗表单
  addGood(e){
    var value = e.detail.value;
    console.log(value);
    for (let p of this.data.purchaseList) {
        if (p.CodeNo == good.FNumber) return
    }

    let reg  = /^-?\d+$/;
    if(!reg.test(value.Count)){
      dd.alert({
        content: `数量必须为整数，请重新输入！`,
        buttonText:"确认"
      });
      return;
    }
    if(value.Count == 0){
      dd.alert({
        content: `数量不允许为0，请重新输入！`,
        buttonText:"确认"
      });
      return;
    }
    if (!value || !value.Count) {
      dd.alert({
        content: `数量不允许为空，请输入！`,
        buttonText:"确认"
      });
      return
    }


    let param = {
        CodeNo: good.fNumber,
        Name: good.fName,
        Standard: good.fModel,
        Unit: good.unitName,
        ExpectPrice: good.fNote,
        Count: value.Count,
        Purpose: value.Purpose.trim(),
        Mark: value.Mark.trim()
    }
    let length = this.data.purchaseList.length
    console.log("ssssss")
    console.log(length);
    let setStr = 'purchaseList[' + length + ']'
    this.setData({
      'tableParam2.total': length + 1,
      [`purchaseList[${length}]`]: param,
      totalPrice: (this.data.totalPrice + param.Price * param.Count) + ''
    })
    console.log(param.Purpose)
    this.onModalCloseTap()
  },
  //显示临时保存数据
  saveTempData() {
      localStorage.setItem('purchase', JSON.stringify(this.data.purchaseList))
      dd.alert({content:'保存成功'})
  },
  loadTempData() {
      var data = JSON.parse(localStorage.getItem('purchase'))
      if (data && data.length && data.length > 0) {
        this.setData({purchaseList: data})
        localStorage.removeItem('purchase')
      }
  },
  onShow() {
    //this.loadTempData()
  },

  // test(){
  //   dd.navigateTo({
  //     url:"/page/start/productionMonitoring/productionMonitoring?taskid=497" 
  //   })
  // }
});
