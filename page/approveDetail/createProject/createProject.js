import pub from "/util/public";
Page({
	...pub.func,
	...pub.func.dowith,
	data: {
		...pub.data,
		IsReview: true,
		copyMans: [],
		table: {},

	},
	submit(e) {
		var value = e.detail.value;
		var param = {
			Remark: value.remark
		};
		console.log(this.data.table);
		console.log(this.data.DingData);

		this.data.table.IsReview = this.data.IsReview;
		this.data.table.ProjectId = value.ProjectId;
		if (this.data.nodeid == 3 || this.data.nodeid == 2) {
			if (this.data.nodeid == 3 && !this.data.table.ProjectId) {
				console.log(this.data.table);
				dd.alert({ content: "项目编号不能为空" });
				return;
			}
			this._postData(
				"CreateProject/Modify",
				res => {
					if (this.data.nodeid != 3) {
						this.aggreSubmit(param);
						return;
					}
					this.data.table.ApplyManId = this.data.DingData.userid;
					this.data.table.ApplyMan = this.data.DingData.nickName;
					this._postData('ProjectNew/AddProject', (res) => {
						this.aggreSubmit(param);
					}, [this.data.table]);

				},
				this.data.table
			);
		} else {
			this.aggreSubmit(param);
		}
	},
	//下载文件
	downloadServerFile(e) {
		dd.downloadFile({
			url: e.target.dataset.url,
			success({ filePath }) {
				dd.previewImage({
					urls: [filePath]
				});
			},
			fail(res) {
				dd.alert({
					content: res.errorMessage || res.error
				});
			}
		});
	},
	print() {
		var that = this;
		this._postData(
			"CreateProject/PrintPDF",
			res => {
				dd.alert({ content: "获取成功，请在钉钉PC端查收" });
			},
			{
				UserId: that.data.DingData.userid,
				TaskId: that.data.taskid,
				IsPublic: true
			}
		);
	},
	radioChange: function(e) {
		this.data.IsReview = e.detail.value;
	},
	onReady() {
		let that = this;
		
		this._getData(
			"CreateProject/Read" +
			this.formatQueryStr({ TaskId: this.data.taskid }),
			res => {
				if (that.data.nodeid > 2) {
					that.data.IsReview = res.IsReview == true ? "是" : "否";
				}
				console.log(that.data.nodeid);
				console.log(that.data.index == 2 && that.data.state=='未完成' && that.data.nodeid == 0);

				this.setData({
					table: res,
					IsReview: that.data.IsReview
				});
			}
		);
	}
});
