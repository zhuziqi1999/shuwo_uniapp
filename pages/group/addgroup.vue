<template>
	<view class="content">
		<view class="content-title">
			<text>创建小组</text>
		</view>
		<view class="content-avatar">
			<view class="content-avatar-bar">
				<text class="content-avatar-text">上传头像</text>
				<view class="upload-avatar" @click="uploadimg()">
					<text v-if="!tempFilePaths" class="icon icon-uploadimg">&#xe64f;</text>
					<image class="upload-image" v-if="tempFilePaths" :src="tempFilePaths"></image>
				</view>
			</view>

		</view>
		<view class="content-group">
			<view class="content-group-text">
				<textarea v-on:input="bindTextAreaBlur1" maxlength=-1 placeholder="输入小组名" @onfocus="this.placeholder=''"
					word-break:break-all />


			</view>

		</view>
		<view class="content-text">
			<view class="content-text-input">
				<textarea v-on:input="bindTextAreaBlur" maxlength=-1 placeholder="输入小组宣言" @onfocus="this.placeholder=''"
					word-break:break-all />
			</view>

		</view>

		<view class="content-add">

			<view class="content-plus" @click="createGroup()">
				<view class="content-plus-flex">
					<text class="icon icon-plus">&#xf081;</text>
				</view>

			</view>


		</view>
	</view>
</template>

<script>
	var text = ""
	var groupname = ""
	var image
	export default {
		data() {
			return {
				
				tempFilePaths: '',
				group: [],
				file: [],
				fileselected: 0
			}
		},
		onLoad(options) {
			if (options.data) {
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

			bindTextAreaBlur: function(e) {
				this.text = e.detail.value
			},

			bindTextAreaBlur1: function(e) {
				this.groupname = e.detail.value
			},

			uploadimg() {
				let _self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (chooseImageRes) => {

						const tempFilePaths = chooseImageRes.tempFilePaths;
						this.tempFilePaths = tempFilePaths


					}
				});
			},

			createGroup() {
				console.log(this.tempFilePaths)
				let _self = this
				uni.uploadFile({
					url: _self.apiServer + 'createGroup', 
					filePath: this.tempFilePaths[0],
					name: 'file',
					formData: {
						groupcreatedby : uni.getStorageSync("UserOpenid"),
						groupname : this.groupname,
						groupremark : this.text,
					},
					success: (uploadFileRes) => {
						console.log(uploadFileRes.data);
						
							wx.showToast({
								title: '创建成功',
								icon: "success",
								duration: 2000
							})
							
							setTimeout(function() {
								wx.navigateBack({
									delta: 1,
								})
							}, 2000)
						
						
					},
					fail:(uploadFileRes) => {
						console.log(uploadFileRes.data);
					}
				});
			},

			
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

	.content-avatar {
		width: 100%;
		display: flex;
		flex-direction: row;
		height: 200rpx;
		align-items: center;
		justify-content: center;
		background-color: #F8F8F8;
		padding: 30rpx;
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

	.content-avatar-text {
		width: 75%;
		height: 100rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		display: flex;
		flex-direction: row;

		align-items: center;
		color: #808080;
		font-weight: bold;
		font-size: 30rpx;
	}

	.content-avatar-bar {
		width: 100%;
		height: 100%;
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
		height: 300rpx;
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
		src: url('//at.alicdn.com/t/font_2415376_3g556n31qfl.eot');
		src: url('//at.alicdn.com/t/font_2415376_3g556n31qfl.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_2415376_3g556n31qfl.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_2415376_3g556n31qfl.woff') format('woff'),
			url('//at.alicdn.com/t/font_2415376_3g556n31qfl.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_2415376_3g556n31qfl.svg#iconfont') format('svg');
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
		margin-right: 30rpx;
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

	.upload-avatar {
		background-color: #eeeeee;
		width: 150rpx;
		height: 150rpx;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
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

	.upload-image {
		width: 100%;
		height: 100%;
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
		justify-content: flex-end;
		width: 100%;
	}

	.file {
		width: 620rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.content-group-text textarea {
		width: 100%;
		height: 40rpx;

	}
</style>
