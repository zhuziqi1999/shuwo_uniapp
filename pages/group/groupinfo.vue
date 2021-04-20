<template>
	<view class="content">
		<ygc-comment ref="ygcComment" :placeholder="'发布评论'" @pubComment="pubComment" style="z-index: 999;">
		</ygc-comment>
		
		<nav-bar type="transparentFixed" :scrollTop="scrollTop" transparentFixedFontColor="#FFF"
			:bgColor="['#FFFFFF','#FFFFFF']" :title="group.groupname">

		</nav-bar>

				<view class="content-plus" @click="addcontent">
			<view class="content-plus-flex">
				<text class="icon icon-plus">&#xf081;</text>
				<text style="font-size: 28rpx;color: #FFFFFF;padding: 10rpx;font-weight: bold; padding-left: 5rpx;">发布动态</text>
			</view>
		
		</view>

		<view class="content-scroll" :style="{height:content_height+'px'}">
			<view class="group-title">
				<view class="group-top">
					<image class="group-image" :src="group.groupavatarurl" mode=""></image>
					<view class="group-info">
						<text class="group-name">{{group.groupname}}</text>
						<text class="group-number">共有{{group.groupnumber}}组员</text>
					</view>

					<view class="goods-plus" v-if="group.IsInGroup == 0" @click="inGroup(group.groupid)">
						<text class="icon icon-search"
							style="color: #1E8DD5;font-size: 25rpx;margin-left: 7rpx;margin-top: 2rpx;">&#xf081;</text>
						<view style="color: #1E8DD5; font-weight: bold; margin-left: 15rpx;font-size: 25rpx;">
							加入小组</view>
					</view>
					<view class="goods-plus" v-if="group.IsInGroup == 1" style="background-color: #B6B9BB;"
						@click="outGroup(group.groupid)">
						<view class="goods-words">已加入</view>
					</view>
				</view>
				<view class="group-bottom">
					<text>小组简介：{{group.groupremark}}</text>

				</view>

			</view>
			<view class="swiperNavBar">
				<swiperNavBar :scrollIntoView="scrollIntoView" :swiperTabList='swiperTabList'
					:swiperTabIdx='swiperTabIdx' :currentSwiperWidth='currentSwiperWidth'
					:currentSwiperHeight='currentSwiperHeight' :swiperCurrentSize='swiperCurrentSize'
					:swiperColor='swiperColor' :swiperCurrentColor='swiperCurrentColor'
					:currentSwiperLineShow="currentSwiperLineShow"
					:currentSwiperLineActiveWidth="currentSwiperLineActiveWidth"
					:currentSwiperLineActiveHeight="currentSwiperLineActiveHeight"
					:currentSwiperLineActiveBg="currentSwiperLineActiveBg"
					:currentSwiperLineAnimatie="currentSwiperLineAnimatie" v-if=" swiperTabList.length > 1 "
					@change="CurrentTab" style="width: 100%;">
				</swiperNavBar>
			</view>


				<view class="content-list" hover-class="content-list-hover" v-for="(item,index) in content_list"
					:key="index">
					<view class="content-title">
						<view class="content-avatar-view">
							<image :src="item.useravatarurl" class="content-avatar" mode="scaleToFill" webp="true">
							</image>
						</view>

						<view class="content-name-from">
							<view class="content-username">{{item.username}}</view>
							<view class="content-share-from">发布自{{item.groupname}}</view>
						</view>
						<view class="content-right">
							<view class="content-right-info">
							<view class="content-share-time" @click="gotoContent(item)">{{item.time}}</view>
							<image class="content-share-more" src="../../static/ellipsis-h.png"
								@click="showactionsheet(item)"></image>
							</view>
						</view>

					</view>

					<view class="content-share-word" @click="gotoContent(item)">{{item.contenttext}}</view>
					<!-- 图片 -->
					<!-- <image class="content-share-image" mode="scaleToFill" src="../../static/1614174681858.jpg">
					</iamge> -->
					<view class="content-share-bar" v-if="item.filename" @click="gotoContent(item)">
					<view class="content-share-file" >
						<image class="content-share-file-img" v-if="item.filetype == 'doc'" src="../../static/W.png">
						</image>
						<image class="content-share-file-img" v-if="item.filetype == 'docx'" src="../../static/W.png">
						</image>
						<image class="content-share-file-img" v-if="item.filetype == 'pdf'" src="../../static/P.png">
						</image>
						<text class="content-share-file-word">{{item.filename}}</text>
					</view>
					</view>

					<view class="content-operate">
						<view class="content-operate-likes">
							<image src="../../static/heart1.png" v-if="item.isliked == 0" class="content-operate-icon"
								@click="LikeContent(item.contentid,index)"></image>
							<image src="../../static/heart.png" v-if="item.isliked == 1" class="content-operate-icon"
								@click="UnlikeContent(item.contentid,index)"></image>
							<text class="content-operate-likes-number">{{item.contentlikes}}</text>
						</view>
						<view class="content-operate-comments">
							<image src="../../static/comments1.png" v-if="comments == 0" class="content-operate-icon"
								@click="toggleMask('show',item,index)">
							</image>
							<text class="content-operate-comments-number">{{item.contentcomments}}</text>
						</view>

						<view class="content-operate-collect">

							<image src="../../static/bookmark1.png" v-if="item.iscollected == 0"
								class="content-operate-icon" @click="CollectContent(item.contentid,index)">
							</image>
							<image src="../../static/bookmark.png" v-if="item.iscollected == 1"
								class="content-operate-icon" @click="UncollectContent(item.contentid,index)">
							</image>

						</view>
					</view>

				</view>
			

		</view>


	</view>
</template>

<script>
	import SOtime from '@/utils/fl-SOtime/SOtime.js'
	import swiperNavBar from "@/components/swiperNavBar/swiperNavBar.vue";
	import ygcComment from '@/components/ygc-comment/ygc-comment.vue';
	import navBar from "@/components/zhouWei-navBar/index";
	var loginRes = uni.getStorageSync('loginRes')
	var SynsUserOpenid = uni.getStorageSync('UserOpenid')
	var SynsUserName = uni.getStorageSync('UserName')
	var windowheight = wx.getSystemInfoSync().windowHeight + 'px'
	var loginflag = 0
	var comments = 0
	var height = 0
	var navbarpostion = 'postion'
	export default {
		components: {
			swiperNavBar,
			ygcComment,
			navBar
		},
		data() {
			return {

				scrollTop: 0,
				bgColor: "#FFF",
				fontColor: "#000",
				height: 0,
				group: [],
				contentid : '',
				content_height: '',
				windowheight,
				loginRes,
				SynsUserOpenid,
				SynsUserName,
				comments,
				val0: '',
				val1: '',
				val2: '',
				val3: '',
				placeholder: '动态占位内容',
				content: [],
				is_comments: 1,
				is_likes: 0,
				navbarpostion: '',
				comments_list: [],
				content_list: [],
				likes_list: [],
				//导航
				scrollIntoView: 0, //设置哪个方向可滚动，则在哪个方向滚动到该元素
				swiperTabList: ['热门', '最新'], //导航列表
				swiperTabIdx: 0,
				swiperCurrentSize: '26rpx', //导航的字体大小
				swiperColor: '#333333', //导航栏字体未选中前颜色
				swiperCurrentColor: '#1E8DD5', //选中当前导航栏字体颜色
				currentSwiperWidth: '16%', //当前导航的宽度 % upx rpx px  （导航超出可左右滑动 ）
				currentSwiperHeight: 70, //当前导航的高度度 rpx px
				mainHeight: 200, //全屏或者局部滑动设置的高度
				currentSwiperLineShow: true, //是否显示导航栏的线条 （线条距离标题太近的话可自行修改.swiperLine的css）
				currentSwiperLineActiveBg: '#1E8DD5', //当前选中的导航栏线条颜色
				currentSwiperLineActiveWidth: '30rpx', //当前选中的导航栏线条的宽度 upx rpx px
				currentSwiperLineActiveHeight: '6rpx', //当前选中的导航栏线条的高度度 upx rpx px
				currentSwiperLineAnimatie: 300 //当前选中的导航栏线条过渡效果


				//（全屏出现滚动条 去掉paddingTop 但导航栏会遮住部分内容 自行改.swiperCont .swiper里css）
				//也可获取导航栏的高度  屏幕高度减去导航栏高度 = 你的内容全屏高度  不会出现滚动条
			}
		},
		onLoad(options) {
			var data = JSON.parse(options.data)
			// 字符串转对象
			this.group = data
			console.log(this.group)
			// 加载定义好的方法
			this.content_height = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().windowWidth * (95 / 750) -
				38;

			


		},
		onShow() {
			this.refresh();
		},

		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			toggleMask(type, content,id) {
				this.$refs.ygcComment.toggleMask(type);
				this.content = content
				this.contentid = id
			},
			changeColor(type) {
				setTimeout(() => {
					if (type == 1) {
						this.bgColor = "#f37402";
						this.fontColor = "#FFF";
						this.title = "案例展示9";
						this.changeColor(2);
					} else {
						this.bgColor = "#FFF";
						this.fontColor = "#000";
						this.title = "案例展示9-9";
						this.changeColor(1);
					}
				}, 2000);
			},
			refresh() {
				let _self = this

				uni.request({
					url: _self.apiServer + 'getContentList',

					data: {
						useropenid: uni.getStorageSync("UserOpenid"),
						groupid: this.group.groupid
					},

					header: {
						'content-type': 'application/json',
					},

					method: 'POST',

					success: res => {
						this.content_list = res.data.content

						for (var i = 0; i < res.data.content.length; i++) {
							res.data.content[i].time = SOtime.time1(res.data.content[i].contentcreatedtimeunix)
						}
						console.log(this.content_list)

					},
				})
			},

			inGroup(e) {
				let _self = this;
				let groupid = e


				uni.request({
					url: _self.apiServer + 'inGroup',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						userid: uni.getStorageSync('UserOpenid'),
						groupid: groupid

					},
					method: 'POST',
					success: res => {

						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '加入失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							uni.hideLoading();
							uni.showToast({
								title: '加入成功',
								icon: "none",
								duration: 2000
							})

							this.group.IsInGroup = 1
							console.log(this.group.IsInGroup)
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

			outGroup(e) {
				let _self = this;
				let groupid = e


				uni.request({
					url: _self.apiServer + 'outGroup',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						userid: uni.getStorageSync('UserOpenid'),
						groupid: groupid

					},
					method: 'POST',
					success: res => {


						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '退出失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							uni.hideLoading();
							uni.showToast({
								title: '退出成功',
								icon: "none",
								duration: 2000
							})

							this.group.IsInGroup = 0
							console.log(this.group.IsInGroup)
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
			addcontent() {
				console.log(this.group)
				var navData = JSON.stringify(this.group);
				uni.navigateTo({
					url: '/pages/index/addcontent?data=' + navData
				})
			},

			LikeContent(e, id) {
				let _self = this;
				let contentid = e
				let index = id
				console.log(index)
				uni.request({
					url: _self.apiServer + 'likeContent',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						userid: uni.getStorageSync('UserOpenid'),
						contentid: contentid

					},
					method: 'POST',
					success: res => {


						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '点赞失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							uni.hideLoading();

							this.content_list[index].isliked = 1

							this.content_list[index].contentlikes++
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

			UnlikeContent(e, id) {
				let _self = this;
				let contentid = e
				let index = id

				uni.request({
					url: _self.apiServer + 'unlikeContent',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						userid: uni.getStorageSync('UserOpenid'),
						contentid: contentid

					},
					method: 'POST',
					success: res => {


						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '点赞取消失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							uni.hideLoading();
							this.content_list[index].isliked = 0
							this.content_list[index].contentlikes--
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

			CollectContent(e, id) {
				let _self = this;
				let contentid = e
				let index = id

				uni.request({
					url: _self.apiServer + 'collectContent',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						userid: uni.getStorageSync('UserOpenid'),
						contentid: contentid

					},
					method: 'POST',
					success: res => {


						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '收藏失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							this.content_list[index].iscollected = 1
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

			UncollectContent(e, id) {
				let _self = this;
				let contentid = e
				let index = id

				uni.request({
					url: _self.apiServer + 'uncollectContent',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						userid: uni.getStorageSync('UserOpenid'),
						contentid: contentid

					},
					method: 'POST',
					success: res => {
						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '收藏取消失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							this.content_list[index].iscollected = 0
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

			gotoContent(e) {
				let content = e;
				let _self = this;

				var navData = JSON.stringify(content);
				uni.navigateTo({
					url: '/pages/index/content?data=' + navData
				})
			},
			pubComment(e) {
				let text = e
				let _self = this

				uni.request({
					url: _self.apiServer + 'createComment',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						commentcreatedby: uni.getStorageSync('UserOpenid'),
						commenttext: text,
						commentcontentid: this.content.contentid,
						commentbackuserid: this.content.contentcreatedby
					},
					method: 'POST',
					success: res => {
						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '评论失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存

						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存

							uni.hideLoading();
							uni.showToast({
								title: '评论成功',
								duration: 2000
							})
							this.$refs.ygcComment.toggleMask("false");
							this.content_list[this.contentid].contentcomments++
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


		}
	}
</script>

<style>
	.swiperNavBar {
		position: sticky;
		top: 168rpx;
		background-color: #FFFFFF;
		width: 100%;

		z-index: 99;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;

		height: 100%;
	}

	.content-plus {
		position: fixed;
		z-index: 99;
		left: 285rpx;
		top: 1480rpx;
		background-color: #1E8DD5;
		border-radius: 30rpx;
		width: 180rpx;
		height: 60rpx;
		box-shadow: 0px 5px 10px #888888;
		vertical-align: middle;

	}

	.content-plus-flex {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		
	}

	.content-scroll {
		width: 100%;
	}

	.content-scroll1 {
		width: 100%;
		position: fixed;

	}
	.logo {
		position: relative;
		height: 200rpx;
		width: 200rpx;
		top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.content-list {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: auto;
		background-color: #FFFFFF;
		border-bottom: #e3e3e3 solid 1rpx;
		margin-top: 10rpx;

	}

	.content-title {
		display: flex;
		flex-direction: row;
		width: auto;
		height: 100rpx;

	}

	.group-title {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 400rpx;
		background-color: #1E8DD5;
	}


	.content-avatar {
		position: relative;
		width: 70rpx;
		height: 70rpx;

		border-radius: 50%;
		background-size: 100% 100%;

	}

	.content-avatar-view {
		margin-left: 20rpx;

		margin-top: 24rpx;
	}

	.content-name-from {
		display: flex;
		flex-direction: column;
		margin-left: 28rpx;
		margin-top: 26rpx;
		width: 300rpx;
	}

	.content-username {
		position: relative;
		height: 30rpx;
		width: auto;
		font-size: 26rpx;
		font-weight: bold;
	}
	.content-right {
		width: 100%;
		display: flex;
		flex-direction: row;
		margin-left:auto;
		justify-content: flex-end;
	}
	.content-right-info {
		display: flex;
		flex-direction: row;
		position: relative;
	
	}
	.content-share-from {
		position: relative;
		width: auto;
		height: 30rpx;
		font-size: 22rpx;
		font-weight: bold;
		top: 10rpx;
		color: #cdcdcd;

	}

	.content-share-time {
		position: relative;
		top: 45rpx;
		width: 150rpx;
		height: 30rpx;
		font-size: 27rpx;
		font-weight: bold;
		padding-right: 20rpx;
		text-align: right;
		color: #cdcdcd;

	}

	.content-share-more {
		position: relative;
		width: 50rpx;
		height: 50rpx;
		top: 38rpx;
		margin-right: 20rpx;
	}

	.content-share-word {
		font-size: medium;
		position: relative;
		padding-top: 20rpx;
		padding-left: 20rpx;
		padding-right: 40rpx;
		margin-bottom: 20rpx;
		height: auto;
	}

	.content-share-image {
		padding-left: 20rpx;
		width: 300rpx;
	}

	.content-operate {
		margin-top: 20rpx;
		width: 100%;
		height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

	}

	.content-operate-icon {
		width: 45rpx;
		height: 45rpx;
		align-items: center;
		justify-content: center;

	}

	@font-face {
		font-family: 'iconfont';
		/* project id 2415376 */
		src: url('//at.alicdn.com/t/font_2415376_goytk0t66mq.eot');
		src: url('//at.alicdn.com/t/font_2415376_goytk0t66mq.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_2415376_goytk0t66mq.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_2415376_goytk0t66mq.woff') format('woff'),
			url('//at.alicdn.com/t/font_2415376_goytk0t66mq.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_2415376_goytk0t66mq.svg#iconfont') format('svg');
	}

	.icon {
		font-family: iconfont;
		font-size: 32upx;
		font-style: normal;
		color: #999;
	}

	.icon-plus {
		color: #FFFFFF;
		font-size: 30rpx;
		position: relative;
		text-align: center;
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
		margin-left: 20rpx;
		text-align: center;
		align-items: center;
		margin-right: 500rpx;
	}

	.content-share-file-img {
		width: 80rpx;
		height: 80rpx;
	}

	.content-share-file-word {
		padding-left: 10rpx;
		font-size: 20rpx;
		width: 200rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: start;
	}

	.content-operate-likes {
		display: flex;
		flex-direction: row;
		padding-left: 40rpx;
		padding-right: 100rpx;
	}

	.content-operate-comments {
		display: flex;
		flex-direction: row;
		padding-left: 50rpx;
		padding-right: 90rpx;
	}

	.content-operate-collect {
		display: flex;
		flex-direction: row;
		padding-left: 90rpx;
		padding-right: 50rpx;
	}

	.content-operate-likes-number {
		padding-left: 20rpx;
	}

	.content-operate-comments-number {
		padding-left: 20rpx;
	}

	.content-list-hover {
		background-color: #f8f8f8;
	}

	.group-image {
		position: relative;
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;
		top: 180rpx;
		left: 20rpx;
	}

	.group-info {
		display: flex;
		flex-direction: column;
		position: relative;
		top: 190rpx;
		left: 50rpx;

	}

	.group-top {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 300rpx;
	}

	.group-name {
		font-size: 35rpx;
		font-weight: bold;
		color: #FFFFFF;
		margin-bottom: 15rpx;
	}

	.group-number {
		font-size: 26rpx;
		color: #cbcbcb;
	}

	.group-bottom {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 20rpx;

		color: #FFFFFF;
		font-size: 28rpx;
		font-weight: bold;
		justify-content: center;
		height: 100rpx;
	}
	
	.group-bottom text {
		width: 90%;
		height: 200rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goods-plus {
		position: absolute;
		display: flex;
		width: 150rpx;
		height: 50rpx;
		line-height: 25px;
		flex-direction: row;
		background-color: #FFFFFF;
		border-radius: 9.05rpx;
		align-content: center;
		text-align: center;
		vertical-align: middle;
		left: 580rpx;
		top: 210rpx;
		margin-right: 20rpx;

	}

	.number {
		margin-left: 10rpx;
		font-size: 30rpx;
		margin-top: 10rpx;
		color: #000000;
		font-weight: bold;
		width: 220rpx;
	}

	.money {
		font-size: 24rpx;
		color: #efba21;
	}

	.goods-bottom {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		width: 95%;
		margin-right: 5%;
		border-radius: 9.05rpx;
		height: 60rpx;
		padding-top: 25rpx;
		padding-left: 20rpx;
		margin-top: 40rpx;
		margin-bottom: 20rpx;
		background-color: #ECEAEA
	}

	.goods-words {
		position: relative;
		left: 40rpx;
		color: #FFFFFF;
		font-weight: bold;
		text-align: center;
		font-size: 25rpx;
	}
	
	.content-share-bar {
		width: 100%;
		height: 100rpx;
		position: relative;
		top: 20rpx;
	}
</style>
