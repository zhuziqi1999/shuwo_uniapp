<template>


	<view class="content">
		<mSearch @search="search($event,0)" style="justify-content: center;width: 100%;"></mSearch>

		<hFormAlert v-if="formalert" @confirm="createfolder" @cancel="hiddenformalert" placeholder="请输入文件夹名"
			title="新建文件夹"></hFormAlert>
		<hFormAlert1 v-if="formalert1" @confirm="deleteFolder" @cancel="hiddenformalert1" :type="none" title="是否删除该文件夹">
		</hFormAlert1>
		<hFormAlert1 v-if="formalert2" @confirm="deleteFile" @cancel="hiddenformalert2" :type="none" title="是否删除该文件">
		</hFormAlert1>


		<view class="content-more">
			<view class="content-plus" @click="upload">
				<view class="content-plus-flex">
					<text class="icon icon-plus" style="font-size: 36rpx;">&#xe60f;</text>
				</view>

			</view>
			<view class="content-plus" @click="showformalert">
				<view class="content-plus-flex">
					<text class="icon icon-plus">&#xe663;</text>
				</view>

			</view>


		</view>


		<ren-dropdown-filter :filterData='filterData' :defaultIndex='defaultIndex' @onSelected='onSelected()'
			@dateChange='dateChange' style="width: 100%;position: relative;"></ren-dropdown-filter>


		<scroll-view white-space=nowrap; scroll-x="false" enable-back-to-top="true" refresher-background="#cdcdcd"
			scroll-y :style="{height:content_height+'px',}" class="content-scroll">

			<view class="prefolder" v-if="curfolder" @click="outfolder">
				<text class="icon icon-prefolder">&#xf096;</text>
			</view>
			<view class="content-list" hover-class="content-list-hover" v-for="(item,index) in folder_list"
				:key="index">

				<image src="../../static/newfolder.png" class="file-img" @click="infolder(item)" mode="scaleToFill">
				</image>
				<view class="file-infor" @click="infolder(item)">
					<text class="file-name">{{item.foldername}}</text>
					<view class="file-time">{{item.foldercreatedtime}}</view>
				</view>

				<text class="icon icon-delete" @click="showformalert1(item)">&#xf117;</text>
			</view>


			<view class="content-list" hover-class="content-list-hover" v-for="(item,index) in file_list" :key="index">
				<image v-if="item.filetype == 'doc' " src=" ../../static/W.png" class="file-img" mode="scaleToFill"
					@click="openfile(item)"></image>
				<image v-if="item.filetype == 'docx' " src=" ../../static/W.png" class="file-img" mode="scaleToFill"
					@click="openfile(item)"></image>
				<image v-if="item.filetype == 'pdf' " src="../../static/P.png" class="file-img" mode="scaleToFill"
					@click="openfile(item)">
				</image>
				<view class="file-infor" @click="openfile(item)">
					<view class="file-name">{{item.filename}}</view>
					<view class="file-time">{{item.filecreatedtime}}</view>
				</view>
				<text class="icon icon-delete" @click="showformalert2(item)">&#xf117;</text>
			</view>



		</scroll-view>
	</view>
</template>

<script>
	import hFormAlert from '@/components/h-form-alert/h-form-alert.vue';
	import hFormAlert1 from '@/components/h-form-alert/h-form-alert1.vue';
	import mSearch from '@/components/mehaotian-search/mehaotian-search.vue'
	import RenDropdownFilter from '@/components/ren-dropdown-filter/ren-dropdown-filter.vue'
	import SOtime from '@/utils/fl-SOtime/SOtime.js'
	export default {
		components: {
			mSearch,
			RenDropdownFilter,
			hFormAlert,
			hFormAlert1
		},

		data() {
			return {
				code1: 0,
				code2: 0,
				folders: [""],
				index: 0,
				folderflag: [],
				curfolder: "",
				perfolder: "",
				folderid: '',
				fileid: '',
				formalert1: 0,
				formalert2: 0,
				formalert: 0,
				folder_list: [],
				file_list: [],
				content_height: '',
				val0: '',
				val1: '',
				val2: '',
				val3: '',
				placeholder: '动态占位内容',
				// 筛选
				filterData: [
					[{
						text: '排序',
						value: 0
					}, {
						text: '按修改时间',
						value: 1
					}, {
						text: '按文件名',
						value: 2
					}],
					[{
						text: '文件类型',
						value: 0
					}, {
						text: 'Word文件',
						value: 1
					}, {
						text: 'PDF文件',
						value: 2
					}]
				],

				defaultIndex: [0, 0]
			}
		},
		onLoad() {
			this.content_height = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().windowWidth * (95 / 750) -
				59;

		},
		onShow() {
			this.getFolderList(this.curfolder);
			this.getFileList();
		},

		methods: {
			search(e) {
				console.log(e);
				let message = e
				var navData = JSON.stringify(message);
				uni.navigateTo({
					url: '/pages/search/search?data=' + navData
				})
			},
			onSelected(res) {


				this.code1 = res[0][0].value
				this.code2 = res[1][0].value
				console.log(this.code1)
				console.log(this.code2)
				this.getFileList()
			},
			dateChange(d) {
				uni.showToast({
					icon: 'none',
					title: d
				})
			},

			getFolderList(e) {
				let _self = this

				uni.request({
					url: _self.apiServer + 'getFolderList',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						foldercreatedby: uni.getStorageSync("UserOpenid"),
						folderparentid: e

					},
					method: 'POST',
					success: res => {

						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '获取文件夹列表失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							console.log(res.data)
							this.folder_list = res.data.folderlist
							// this.perfolder = this.curfolder
							// if(this.folderflag.parentid != null){
							// 	this.perfolder = this.curfolder
							// }
							// if(this.folderflag.parentid == null){
							// 	this.perfolder = this.folderflag.parentid
							// }

							for (var i = 0; i < res.data.folderlist.length; i++) {
								this.folder_list[i].foldercreatedtime = SOtime.time1(this.folder_list[i]
									.foldercreatedtimeunix)
							}


						}

					},
					fail: () => {
						uni.showToast({
							title: '操作失败',
							icon: 'none'
						});
					}
				});
			},

			createfolder(e) {
				let _self = this
				let foldername = e.text

				uni.request({
					url: _self.apiServer + 'createFolder',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						foldercreatedby: uni.getStorageSync("UserOpenid"),
						foldername: foldername,
						folderparentid: this.curfolder

					},
					method: 'POST',
					success: res => {

						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '新建文件夹失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							console.log(res.data)


							wx.showToast({
								title: '创建成功',
								icon: "success",
								duration: 2000
							})

							setTimeout(function() {

							}, 2000)
							this.formalert = 0;
							this.getFolderList(this.folders[this.index]);
						}

					},
					fail: () => {
						uni.showToast({
							title: '操作失败',
							icon: 'none'
						});
					}
				});


			},

			showformalert() {
				this.formalert = 1;
			},

			hiddenformalert() {
				this.formalert = 0;
			},


			showformalert1(e) {
				this.folderid = e.folderid;
				this.formalert1 = 1;
			},

			hiddenformalert1() {
				this.formalert1 = 0;
			},

			showformalert2(e) {
				this.fileid = e.fileid;
				this.formalert2 = 1;
			},

			hiddenformalert2() {
				this.formalert2 = 0;
			},

			deleteFolder() {
				let _self = this


				uni.request({
					url: _self.apiServer + 'deleteFolder',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						foldercreatedby: uni.getStorageSync("UserOpenid"),
						folderid: this.folderid

					},
					method: 'POST',
					success: res => {

						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '删除失败',
								duration: 2000,
								icon: "none"
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							console.log(res.data)


							wx.showToast({
								title: '删除成功',
								icon: "none",
								duration: 2000
							})

							setTimeout(function() {}, 2000)
							this.formalert1 = 0;
							this.getFolderList(_self.curfolder);
							this.getFolderList();
						}

					},
					fail: () => {
						uni.showToast({
							title: '操作失败',
							icon: 'none'
						});
					}
				});
			},

			deleteFile() {
				let _self = this

				uni.request({
					url: _self.apiServer + 'deleteFile',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						filecreatedby: uni.getStorageSync("UserOpenid"),
						fileid: this.fileid

					},
					method: 'POST',
					success: res => {

						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '删除失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							console.log(res.data)

							wx.showToast({
								title: '删除成功',
								icon: "none",
								duration: 2000
							})

							setTimeout(function() {}, 2000)
							this.formalert2 = 0;
							this.getFolderList();
							this.getFileList();
						}

					},
					fail: () => {
						uni.showToast({
							title: '操作失败',
							icon: 'none'
						});
					}
				});
			},


			infolder(e) {
				this.folderflag = e
				this.folders.push(this.folderflag.folderid)
				this.index++

				this.curfolder = this.folders[this.index]

				this.getFolderList(this.folders[this.index])
				this.getFileList()
			},

			outfolder() {
				this.folders.pop()
				this.index--

				this.curfolder = this.folders[this.index]
				this.getFolderList(this.folders[this.index])
				this.getFileList()
			},

			upload() {
				let _self = this;
				wx.chooseMessageFile({
					count: 1, //能选择文件的数量
					type: 'all', //能选择文件的类型,我这里只允许上传文件.还有视频,图片,或者都可以
					success(res) {
						console.log(res)
						var size = res.tempFiles[0].size;
						var name = res.tempFiles[0].name;
						var temporaryPdfArr = [];
						temporaryPdfArr.push(res.tempFiles[0]);
						var filePath = res.tempFiles[0].path;
						var newfilename = name + "";

						if (size > 10485760 || (newfilename.indexOf(".pdf") == -1 && newfilename.indexOf(".doc") ==
								-1 && newfilename.indexOf(".docx") == -1)) { //限制了文件的大小和具体文件类型
							wx.showToast({
								title: '文件大小不能超过10MB,格式必须为pdf、doc、docx！',
								icon: "none",
								duration: 2000,
								mask: true
							})
						} else {
							wx.showLoading({
								title: '上传中...',
								mask: true,
							});
							var formData = { //打开PDF文件所需传入的data
								filecreatedby: uni.getStorageSync("UserOpenid"),
								filename: name,
								filefolderid: _self.curfolder

							}
							wx.uploadFile({
								url: _self.apiServer + 'uploadFile', //上传的路径
								filePath: filePath, //刚刚在data保存的文件路径
								formData: formData,
								name: 'file', //后台获取的凭据
								success(res) {
									console.log(res.data)

									wx.hideLoading(); //隐藏提示框

									// 用户信息写入缓存
									console.log("success")
									wx.hideToast()

									wx.showToast({
										title: '上传成功',
										icon: "success",
										duration: 2000
									})
									setTimeout(function() {}, 2000)
									_self.getFolderList(_self.curfolder)
									_self.getFileList()
								},
								fail: () => {
									uni.showToast({
										title: '操作失败',
										icon: 'none'
									});
								}

							})
						}
					},
					fail: (res) => {
						console.log(res)
						uni.showToast({
							title: '文件上传失败',
							icon: 'none'
						});
					}
				})
			},

			getFileList() {
				let _self = this
				if (_self.curfolder == null) {
					_self.curfolder = ""
				}
				uni.request({
					url: _self.apiServer + 'getFileList',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						filecreatedby: uni.getStorageSync("UserOpenid"),
						filefolderid: _self.curfolder,
						code1: this.code1,
						code2: this.code2

					},
					method: 'POST',
					success: res => {

						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '获取文件列表失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							console.log(res.data)
							this.file_list = res.data.filelist

							for (var i = 0; i < res.data.filelist.length; i++) {
								this.file_list[i].filecreatedtime = SOtime.time1(this.file_list[i]
									.filecreatedtimeunix)
							}


						}

					},
					fail: () => {
						uni.showToast({
							title: '操作失败',
							icon: 'none'
						});
					}
				});
			},

			openfile(e) {

				let file = e
				console.log("11")
				let downloadpath = 'https://shuwo.ltd/download/'
				console.log(downloadpath + file.fileid + '.' + file.filetype)
				uni.showLoading();
				wx.downloadFile({
				
					url: downloadpath + file.fileid + '.' + file.filetype,
					header: {
						'Content-Type': 'application/' + file.filetype
					},
					success: function(res) {
						var filePath = res.tempFilePath;
						console.log(res)
						wx.openDocument({
							filePath: filePath,
							fileType: file.filetype,
							success: function(res) {
								uni.hideLoading();
								console.log('打开文档成功');
							},
							fail: function(res) {
								uni.hideLoading();
								uni.showToast({
									title: '删除失败',
									icon: "none",
									duration: 2000
								})
								console.log(res)
							}
						});
					},

				});
			}


		},



	};
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;

		height: 100%;
	}

	.content-scroll {
		width: 100%;
		padding-top: 59px;
	}

	.content-list {
		display: flex;
		flex-direction: row;

		width: 100%;
		background-color: #FFFFFF;
		height: 110rpx;
		align-items: center;
	}

	.file-img {
		padding-left: 20rpx;
		width: 100rpx;
		height: 110rpx;
	}

	.file-infor {
		display: flex;
		flex-direction: column;
		text-align: left;
		width: 530rpx;
		padding-right: 40rpx;
	}

	.file-name {
		font-weight: bold;
		font-size: 30rpx;
		padding-left: 20rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		height: 44rpx;
		white-space: nowrap;
	}

	.file-time {
		font-size: 22rpx;
		font-weight: bold;
		color: #808080;
		padding-left: 20rpx;
		padding-top: 10rpx;
	}

	.content-more {
		position: fixed;
		display: flex;
		flex-direction: row;
		bottom: 30rpx;
		z-index: 99;
	}

	.content-plus {
		margin: 10rpx;
		background-color: #1E8DD5;
		border-radius: 30rpx;
		width: 120rpx;
		height: 60rpx;
		box-shadow: 5px 5px 10px #888888;
		vertical-align: middle;

	}



	.content-plus-flex {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.prefolder {

		width: 100%;
		height: 40rpx;
		padding-left: 30rpx;
	}


	@font-face {
		font-family: 'iconfont';
		/* project id 2415376 */
		src: url('//at.alicdn.com/t/font_2415376_1kvulk3jywh.eot');
		src: url('//at.alicdn.com/t/font_2415376_1kvulk3jywh.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_2415376_1kvulk3jywh.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_2415376_1kvulk3jywh.woff') format('woff'),
			url('//at.alicdn.com/t/font_2415376_1kvulk3jywh.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_2415376_1kvulk3jywh.svg#iconfont') format('svg');
	}

	.icon {
		font-family: iconfont;
		font-size: 32upx;
		font-style: normal;
		color: #999;
	}

	.icon-plus {
		color: #FFFFFF;
		font-size: 50rpx;
		position: relative;
		text-align: center;
		align-items: center;
	}

	.icon-delete {
		color: #bfbfbf;
		font-size: 30rpx;
		position: relative;
		text-align: center;
		align-items: center;
	}


	.icon-prefolder {
		color: #bfbfbf;
		font-size: 30rpx;
		position: relative;
		text-align: center;
		align-items: center;
	}
</style>
