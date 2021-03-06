import pub from "/util/public";
import promptConf from "/util/promptConf.js";
let good = {};
let index;
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        tableOperate: "编辑",
        codeType: "1",
        good: {},
        hidden2: true,
        tableItems: [
            {
                prop: "Name",
                label: "物料名称",
                width: 300,
            },
            {
                prop: "CodeNumber",
                label: "物料编码",
                width: 200,
            },
            {
                prop: "Standard",
                label: "规格型号",
                width: 300,
            },
            {
                prop: "BigCode",
                label: "物料大类编码",
                width: 100,
            },
            {
                prop: "SmallCode",
                label: "物料小类编码",
                width: 100,
            },

            {
                prop: "Unit",
                label: "单位",
                width: 100,
            },
            {
                prop: "SurfaceTreatment",
                label: "表面处理",
                width: 300,
            },
            {
                prop: "PerformanceLevel",
                label: "性能等级",
                width: 100,
            },
            {
                prop: "StandardNumber",
                label: "标准号",
                width: 100,
            },
            {
                prop: "Features",
                label: "典型特征",
                width: 300,
            },
            {
                prop: "purpose",
                label: "用途",
                width: 300,
            },
            {
                prop: "Remark",
                label: "备注",
                width: 100,
            },

            {
                prop: "FNote",
                label: "预计价格",
                width: 100,
            },
        ],
        //data:[]
    },
    submit(e) {
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark,
        };
        if (this.data.nodeid == 2) {
            for (let t of this.data.tableData) {
                if (!t.CodeNumber) {
                    dd.alert({
                        content: "您还有物料编码未填写！",
                        button: promptConf.promptConf.Confirm,
                    });
                    return;
                }
            }
            //判断是否重复物料编码
            let CodeNumber = this.data.tableData.map(value => {
                return value.CodeNumber
            });
            let CodeNumberSet = new Set(CodeNumber);
            if (CodeNumberSet.size != CodeNumber.length) {
                dd.alert({
                    content: `物料编码不可重复，请重新输入！`,
                    buttonText: promptConf.promptConf.Confirm,
                });
                return;
            }



            this.requestJsonData(
                "POST",
                "ItemCodeAdd/TableModify",
                res => {
                    let url2 = "/ItemCodeAdd/InsertPurcahse";
                    if (this.data.codeType == "2") url2 = "/ItemCodeAdd/InsertOffice";
                    this.requestJsonData(
                        "POST",
                        url2, 
                        res => { 
                            this.aggreSubmit(param);
                        },
                        JSON.stringify(this.data.tableData) 
                    );
                },
                JSON.stringify(this.data.tableData)
            );
            return;
        }
        this.aggreSubmit(param);

    },
    //提交弹窗表单
    addGood(e) {
        let value = e.detail.value;
        console.log(this.data.index);
        if (!value || !value.CodeNumber) {
            dd.alert({
                content: `表单填写不完整`,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }




        this.data.tableData[this.data.index].CodeNumber = value.CodeNumber;
        this.data.tableData[this.data.index].FNote = value.FNote;
        let index = this.data.index * (this.data.tableParam.now - 1) + this.data.index;
        this.data.purchaseList[index].CodeNumber = value.CodeNumber;
        this.data.purchaseList[index].FNote = value.FNote;

        this.setData({
            tableData: this.data.tableData,
            purchaseList: this.data.purchaseList,
        });
        this.onModalCloseTap2();
    },
    radioChange: function (e) {
        this.data.codeType = e.detail.codeType;
    },
    onModalCloseTap2() {
        this.createMaskHideAnim();
        this.createContentHideAnim();
        setTimeout(() => {
            this.setData({
                hidden2: true,
            });
        }, 210);
    },
    //显示弹窗表单
    chooseItem(e) {
        if (!e) return;
        console.log(e);
        good = e.target.targetDataset.row;
        index = e.target.targetDataset.index;
        this.data.good = good;
        this.data.index = index;

        if (!good) return;

        this.setData({
            hidden2: !this.data.hidden2,
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },
    onShow() {
        this.data.pageIndex = this.data.index;
        console.log(this.data.pageIndex);
        if (this.data.pageIndex != 0) {
            this.data.tableOperate = "";
        }
    },
});
