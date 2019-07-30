import pub from '/util/public';
Page({
  ...pub.func,
  ...pub.func.dowith,
  data: {
    ...pub.data,
    useTimeList: [],
    imgUrlList:[],
    table:{},
  },
  uploadImg(e){
    var that = this
    dd.chooseImage({
      count: 2,
      success: (res) => {
        that.setData({imageList:that.data.imageList})
        //dd.alert({content:'ues ' + JSON.stringify(res)})
        for(let p of res.apFilePaths){
          that.data.imageList.push(p)
          that.setData({disablePage:true})
          dd.uploadFile({
            url: that.data.dormainName + 'drawingupload/Upload',
            fileType: 'image',
            fileName: p.substring(7),
            filePath: p,
            success: (res) => {
              //dd.alert({content:'你返回的 ' + JSON.stringify(res)})
              console.log(JSON.parse(res.data).Content)
              that.data.imgUrlList.push(JSON.parse(res.data).Content)
              that.setData({disablePage:false})
            },
            fail:(err) => {
              dd.alert({content:'sorry' + JSON.stringify(err)})
            }
          });
        }
        that.setData({imageList:that.data.imageList})
      },
    });
  },
  deleteImg(){
    this.setData({
      imageList:this.data.imageList.splice(0,this.data.imageList.length-1)
    })
    this.data.imgUrlList.splice(0,this.data.imgUrlList.length-1)
  },
  submit(e) {
    var that = this
    var value = e.detail.value
    if((!value.StartKilometres || !value.EndKilometres) && (this.data.nodeid ==3 || this.data.nodeid ==4)){
      dd.alert({content:'表单未填写完整'})
      return
    }
    if(this.data.nodeid == 3 && this.data.imgUrlList.length <2){
      dd.alert({content:'需要上传起止公里数图片'})
      return
    }
    this.data.table['ImageUrl'] = this.data.imgUrlList.join(',')
    if(this.data.table['ImageUrl'].length>6){
      var param = {
          Title: value.title,
          Remark: value.remark,
          ImageUrl: this.data.table['ImageUrl']
      }
    }else{
      var param = {
          Title: value.title,
          Remark: value.remark,
          ImageUrl: this.data.tableInfo.ImageUrl
      }
    }
    this.data.table['FactTravelWay'] = value.FactTravelWay
    this.data.table['StartKilometres'] = value.StartKilometres
    this.data.table['EndKilometres'] = value.EndKilometres
    this.data.table['UseKilometres'] = parseInt(value.EndKilometres) - parseInt(value.StartKilometres)
    this.setData({disablePage:true})
    this._postData("CarTableNew/TableModify",
      (res) => {
        that.aggreSubmit(param)
      },this.data.table
    )
  },
  print(){
    this._postData('CarTableNew/GetPrintPDF',
      (res) => {
         dd.alert({content:"获取成功，请在钉钉PC端查收"})
      },
      {
        UserId: this.data.DingData.userid,
        TaskId: this.data.taskid,
        IsPublic: false
      },this.data.DingData
    )
  },
  reApproval(){
    this.data.localStorage = JSON.stringify({
          valid: true,
          flowid:this.data.flowid,
          title: this.data.tableInfo.Title,
          table: this.data.table
      })
    for (let m of this.data.menu) {
        if (m.flowId == this.data.flowid) {
          dd.redirectTo({
            url: '/page/start/' + m.url + '?flowid=' + m.flowId
          })
        }
    }
  },
  onReady(){
    this._getData("CarTableNew/TableQuary" + this.formatQueryStr({TaskId:this.data.taskid}),
      (res) => {
        let data = res[0]
        if(!data.FactTravelWay) data.FactTravelWay = data.PlantTravelWay
        if(!data.PeerNumber) data.PeerNumber = ''
        this.setData({
          table: data
        })
      }
    )
  },
});