<template>
	
	
	<view class="content">
		<mSearch @search="search($event,0)" style="justify-content: center;width: 100%;"></mSearch>
		
		<hFormAlert v-if="formalert"  @confirm="createfolder" @cancel="hiddenformalert" placeholder="请输入文件夹名" title="新建文件夹"></hFormAlert>
		<hFormAlert1 v-if="formalert1"  @confirm="deleteFolder" @cancel="hiddenformalert1" :type="none" title="是否删除该文件夹"></hFormAlert1>
		
		<view class="content-plus" >
			<view class="content-plus-flex" @click="showformalert">
				<text class="icon icon-plus">&#xe663;</text>
			</view>
			
		</view>
		
		<view class="content-upload">
			<view class="content-plus-flex">
				<text class="icon icon-plus">&#xef2a;</text>
			</view>
			
		</view>
		
		<ren-dropdown-filter :filterData='filterData' :defaultIndex='defaultIndex'
		@onSelected='onSelected' @dateChange='dateChange' style="width: 100%;"></ren-dropdown-filter>
		

		<scroll-view white-space=nowrap; scroll-x="false" enable-back-to-top="true" refresher-background="#cdcdcd"
			scroll-y :style="{height:content_height+'px',}" class="content-scroll">
			
			<view class="prefolder" v-if="curfolder" @click="outfolder">
				<text class="icon icon-prefolder">&#xf096;</text>
			</view>
			<view class="content-list" hover-class="content-list-hover"  v-for="(item,index) in folder_list"
				:key="index" >

				<image  src="../../static/newfolder.png" class="file-img" @click="infolder(item)" mode="scaleToFill"></image>
				<view class="file-infor" @click="infolder(item)">
					<view class="file-name">{{item.foldername}}</view>
					<view class="file-time">{{item.foldercreatedtime}}</view>
				</view>
				
				<text class="icon icon-delete" @click="showformalert1(item)">&#xf117;</text>
			</view>
			
			
			<view class="content-list" hover-class="content-list-hover" v-for="(item,index) in file_list"
				:key="index" >
				<image v-if="item.type == "doc" || item.type == "docx" " src="../../static/W.png" class="file-img" mode="scaleToFill"></image>
				<image v-if="item.type == "pdf" " src="../../static/P.png" class="file-img" mode="scaleToFill"></image>
				<view class="file-infor">
					<view class="file-name">{{item.file_name}}</view>
					<view class="file-time">{{item.file_time}}</view>
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
				folders : [""],
				index : 0 ,
				folderflag : [],
				curfolder : "",
				perfolder : "",
				folderid : '',
				formalert1 : 0,
				formalert : 0,
				folder_list : [],
				file_list : [],
				content_height: '',
				val0: '',
				val1: '',
				val2: '',
				val3: '',
				placeholder:'动态占位内容',
				// 筛选
				filterData:[
				    [{ text: '排序', value: '' }, { text: '按修改时间', value: 1 }, { text: '按文件名', value: 2 }],
				    [{ text: '文件类型', value: '' }, { text: 'Word文件', value: 1 }, { text: 'PDF文件', value: 2 }]
				],
				
				defaultIndex:[0,0]
			}
		},
		onLoad() {
			this.content_height = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().windowWidth * (95 / 750);
			
		},
		onShow() {
			this.getFolderList();
		},
		
		methods: {
			search(e, val) {
				console.log(e, val);
				this['val'+val] = e;
			},
			onSelected(res){
			    uni.showToast({
			        icon:'none',
			        title:'控制台查看筛选结果'
			    })
			},
			dateChange(d){
			   uni.showToast({
			       icon:'none',
			       title:d
			   })
			},
			
			getFolderList(e){
				let _self = this
				
				uni.request({
					url: _self.apiServer + 'getFolderList',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						foldercreatedby : uni.getStorageSync("UserOpenid"),
						folderparentid : e
				
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
								this.folder_list[i].foldercreatedtime = SOtime.time1(this.folder_list[i].foldercreatedtimeunix)
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
						foldercreatedby : uni.getStorageSync("UserOpenid"),
						foldername : foldername,
						folderparentid : this.curfolder
				
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
								icon:"success",
								duration: 2000
							})
							
							setTimeout(function(){

							},2000)
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
			
			
			showformalert1(e){
				this.folderid = e.folderid;
				this.formalert1 = 1;
			},
			
			hiddenformalert1() {
				this.formalert1 = 0;
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
						foldercreatedby : uni.getStorageSync("UserOpenid"),
						folderid : this.folderid
				
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
								icon:"none",
								duration: 2000
							})

							setTimeout(function(){
							},2000)
							this.formalert1 = 0;
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
			
			infolder(e) {
				this.folderflag = e
				this.folders.push(this.folderflag.folderid)
				this.index ++

				this.curfolder = this.folders[this.index]

				this.getFolderList(this.folders[this.index])
			},
			
			outfolder() {
				this.folders.pop()
				this.index --

				this.curfolder = this.folders[this.index]
				this.getFolderList(this.folders[this.index])
			}
			
		},
		
		
		
	};
</script>

<style>
.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	
	.content-scroll {
		width: 100%;
		position: relative;
		top: 59px;
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
		width: 570rpx;
	}
	
	.file-name {
		font-weight: bold;
		font-size: 30rpx;
		padding-left: 20rpx;
	}
	
	.file-time {
		font-size: 22rpx;
		font-weight: bold;
		color: #808080;
		padding-left: 20rpx;
		padding-top: 10rpx;
	}
	
	.content-plus {
		position: fixed;
		z-index: 99;
		left: 600rpx;
		bottom: 80rpx;
		background-color: #1E8DD5;
		border-radius: 50%;
		width: 120rpx;
		height: 120rpx;
		box-shadow: 5px 5px 10px #888888;
		vertical-align: middle;
		
	}
	
	.content-upload {
		position: fixed;
		z-index: 99;
		left: 600rpx;
		bottom: 240rpx;
		background-color: #1E8DD5;
		border-radius: 50%;
		width: 120rpx;
		height: 120rpx;
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
  font-family: 'iconfont';  /* project id 2415376 */
  src: url('//at.alicdn.com/t/font_2415376_6vr0ad3x53d.eot');
  src: url('//at.alicdn.com/t/font_2415376_6vr0ad3x53d.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_2415376_6vr0ad3x53d.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_2415376_6vr0ad3x53d.woff') format('woff'),
  url('//at.alicdn.com/t/font_2415376_6vr0ad3x53d.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_2415376_6vr0ad3x53d.svg#iconfont') format('svg');
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
