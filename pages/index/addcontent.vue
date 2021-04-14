<template>
	<view class="content">
		<view class="content-title">
			<text>新的动态</text>
		</view>
		<view class="content-group">
			<view class="content-group-text" @click="addgroup()">
				<text>{{groupname}}</text>

				<text class="icon icon-right">&#xef6f;</text>
			</view>

		</view>
		<view class="content-text">
			<view class="content-text-input">
				<textarea v-on:input="bindTextAreaBlur" maxlength=-1 placeholder="输入动态内容" @onfocus="this.placeholder=''"
					word-break:break-all />
			</view>

		</view>

		<view class="content-add">
			<view class="file">
				<view v-if="fileselected == 0" class="content-file" @click="addfile">
					<view class="content-plus-flex">
						<text class="icon icon-plus">&#xefdc;</text>
					</view>
				</view>

				<view v-if="fileselected == 1" class="content-share-file" @click="addfile">
					<image class="content-share-file-img" v-if="file.filetype == 'doc'" src="../../static/W.png"></image>
					<image class="content-share-file-img" v-if="file.filetype == 'docx'" src="../../static/W.png"></image>
					<image class="content-share-file-img" v-if="file.filetype == 'pdf'" src="../../static/P.png"></image>
					<text class="content-share-file-word">{{file.filename}}</text>
				</view>
			</view>
			<view class="content-plus" @click="addcontent">
				<view class="content-plus-flex">
					<text class="icon icon-plus">&#xf246;</text>
				</view>

			</view>


		</view>
	</view>
</template>

<script>
	var text = ""
	export default {
		data() {
			return {
				group: [],
				file: [],
				groupname: "添加小组",
				fileselected: 0
			}
		},
		onLoad(options) {
			if(options.data){
				var data = JSON.parse(options.data)
				// 字符串转对象
				this.group = data
				console.log(this.group)
			}
			

		},

		onShow(options) {
			var pages = getCurrentPages();

			var currPage = pages[pages.length - 1];
			if (currPage.data.group.length == 0) {
				this.groupname = this.group.groupname
			
			}
			if (currPage.data.group.length != 0) {

				this.group = currPage.data.group
				this.groupname = this.group.groupname

			}
			if (currPage.data.file.length != 0) {
				
				this.file = currPage.data.file
				console.log(this.file)
				this.fileselected = 1
				this.filename = this.file.filename
			}

		},

		methods: {
			addgroup() {
				uni.navigateTo({
					url: '/pages/group/selectgroup'
				})
			},
			addfile() {
				uni.navigateTo({
					url: '/pages/file/selectfile'
				})
			},
			bindTextAreaBlur: function(e) {
				this.text = e.detail.value
			},

			addcontent() {
				let _self = this
				// console.log("小组"+this.group)
				setTimeout(function() {

				}, 2000)
				if (this.group.groupid == null) {

					uni.showToast({
						title: '小组不能为空',
						icon: "none",
						duration: 2000
					})
					return false;
				}
				console.log("text:" + this.text)
				uni.request({
					url: _self.apiServer + 'createContent',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						contentcreatedby: uni.getStorageSync("UserOpenid"),
						contenttext: this.text,
						contentfrom: this.group.groupid,
						contentshare: this.file.fileid
					},
					method: 'POST',
					success: res => {
						if (res.data.code == 0) {

							wx.showToast({
								title: '发送失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存

							wx.showToast({
								title: '发送成功',
								icon: "success",
								duration: 2000
							})

							setTimeout(function() {
								wx.navigateBack({
									delta: 1,
								})
							}, 2000)



						}

					},
					fail: () => {
						uni.showToast({
							title: '操作失败',
							icon: 'none'
						});
					}
				});
			}
		},



	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;

		height: 100%;
		background-color: #F8F8F8;
	}



	.content-title {
		font-weight: bold;
		font-size: 40rpx;
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100rpx;


	}

	.content-title text {
		position: relative;
		padding-left: 30rpx;
		top: 20rpx;
	}

	.content-group {
		width: 100%;
		display: flex;
		flex-direction: row;
		height: 100rpx;
		align-items: center;
		justify-content: center;
		background-color: #F8F8F8;

	}

	.content-group-text {
		width: 100%;
		height: 100rpx;
		margin: 30rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #808080;
		font-weight: bold;
		font-size: 30rpx;
		padding-left: 20rpx;
	}

	.content-text {
		width: 100%;
		display: flex;
		flex-direction: row;
		height: auto;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		background-color: #F8F8F8;
		border-radius: 10rpx;

	}

	.content-text-input {
		width: 100%;
		height: 500rpx;
		margin: 30rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		color: #808080;
		font-weight: bold;
		font-size: 30rpx;

	}

	.content-text-input textarea {
		margin: 20rpx;
		width: 95%;
	}

	@font-face {
		font-family: 'iconfont';
		/* project id 2415376 */
		src: url('//at.alicdn.com/t/font_2415376_d0yozlbwnos.eot');
		src: url('//at.alicdn.com/t/font_2415376_d0yozlbwnos.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_2415376_d0yozlbwnos.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_2415376_d0yozlbwnos.woff') format('woff'),
			url('//at.alicdn.com/t/font_2415376_d0yozlbwnos.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_2415376_d0yozlbwnos.svg#iconfont') format('svg');
	}

	.icon {
		font-family: iconfont;
		font-size: 32upx;
		font-style: normal;
		color: #999;
	}

	.icon-right {
		position: relative;
		left: 500rpx;
	}

	.content-plus {
		position: relative;

		background-color: #1E8DD5;
		border-radius: 50%;
		width: 100rpx;
		height: 100rpx;

		vertical-align: middle;

	}

	.content-file {
		position: relative;
		left: 30rpx;
		background-color: #1E8DD5;
		border-radius: 50%;
		width: 100rpx;
		height: 100rpx;
		vertical-align: middle;
	}

	.content-share-file {
		position: relative;
		display: flex;
		flex-direction: row;
		width: 300rpx;
		height: 100rpx;
		background-color: #eeeeee;
		border-radius: 10rpx;
		padding-left: 20rpx;
		left: 20rpx;
		text-align: center;
		align-items: center;
	}

	.content-share-file-img {
		width: 80rpx;
		height: 80rpx;
	}

	.content-share-file-word {
		width: 200rpx;
		padding-left: 10rpx;
		font-size: 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.content-plus-flex {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.icon-plus {
		color: #FFFFFF;
		font-size: 38rpx;
		position: relative;
		text-align: center;
		align-items: center;
	}

	.content-add {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
	
	.file {
		width: 620rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
