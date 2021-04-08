<template>
	<view class="content">
		<swiperNavBar :scrollIntoView="scrollIntoView" :swiperTabList='swiperTabList' :swiperTabIdx='swiperTabIdx'
			:currentSwiperWidth='currentSwiperWidth' :currentSwiperHeight='currentSwiperHeight'
			:swiperCurrentSize='swiperCurrentSize' :swiperColor='swiperColor' :swiperCurrentColor='swiperCurrentColor'
			:currentSwiperLineShow="currentSwiperLineShow" :currentSwiperLineActiveWidth="currentSwiperLineActiveWidth"
			:currentSwiperLineActiveHeight="currentSwiperLineActiveHeight"
			:currentSwiperLineActiveBg="currentSwiperLineActiveBg"
			:currentSwiperLineAnimatie="currentSwiperLineAnimatie" v-if=" swiperTabList.length > 1 "
			@change="CurrentTab" style="width: 100%;">
		</swiperNavBar>

		<scroll-view white-space=nowrap; scroll-x="false" enable-back-to-top="true" refresher-background="#cdcdcd"
			scroll-y :style="{height:content_height+'px',}" class="content-scroll">
			
			<!-- 点赞 -->
			<view class="content-list" hover-class="content-list-hover" v-for="(item,index) in like_list"
				:key="index" v-if="navbar == 0">
				<view class="content-title">

					<image class="content-avatar" :src="item.useravatarurl"></image>
					<view class="content-name-from">
						<view class="content-username">{{item.username}}</view>
					</view>
					<view class="content-share-time">{{item.time}}</view>

				</view>
				<view class="content-share-from">点赞了你的内容</view>
				<view class="goods-bottom">
					<view class="goods-bottom-name">
						<text>@</text>
						<open-data type="userNickName" lang="zh_CN" class="userNickName"></open-data>
						</view>
					<view style="color: #515151; font-weight: bold; font-size: 25rpx;height: 25rpx;margin-top: 15rpx;">
						{{item.contenttext}}</view>

				</view>
			</view>
			<!-- 评论 -->
			<view class="content-list" hover-class="content-list-hover" v-for="(item,index) in comment_list"
				:key="index" v-if="navbar == 1">
				<view class="content-title">
			
					<image class="content-avatar" :src="item.useravatarurl"></image>
					<view class="content-name-from">
						<view class="content-username1">{{item.username}}</view>
						<view class="content-pinlun">评论了你</view>
					</view>
					<view class="content-share-time">{{item.time}}</view>
			
				</view>
				<view class="content-share-from">{{item.commenttext}}</view>
				<view class="goods-bottom">
					<view class="goods-bottom-name">
					<text>@</text>
					<open-data type="userNickName" lang="zh_CN" class="userNickName"></open-data>
					</view>
					<view style="color: #515151; font-weight: bold; font-size: 25rpx;height: 25rpx;margin-top: 15rpx;">
						{{item.contenttext}}</view>
			
				</view>
			</view>
			
			<!-- 小组 -->
<!-- 			<view class="content-list" hover-class="content-list-hover" v-for="(item,index) in content_list"
				:key="index" v-if="navbar == 2">
				<view class="content-title">
			
					<image class="content-group-avatar" src="../../static/go.jpg"></image>
					<view class="content-name-from">
						<view class="content-username">小组名</view>
					</view>
					<view class="content-share-time1">{{item.time}}</view>
			
				</view>
				<view class="content-share-from1">信息内容</view>
				
			</view> -->
			<!-- 收藏 -->
			<view class="content-list" hover-class="content-list-hover" v-for="(item,index) in collect_list"
				:key="index" v-if="navbar == 2">
				<view class="content-title">
			
					<image class="content-avatar" :src="item.useravatarurl"></image>
					<view class="content-name-from">
						<view class="content-username">{{item.username}}</view>
					</view>
					<view class="content-share-time">{{item.time}}</view>
			
				</view>
				<view class="content-share-from">收藏了你的内容</view>
				<view class="goods-bottom">
					<view class="goods-bottom-name">
						<text>@</text>
						<open-data type="userNickName" lang="zh_CN" class="userNickName"></open-data>
			
						</view>
					<view style="color: #515151; font-weight: bold; font-size: 25rpx;height: 25rpx;margin-top: 15rpx;">
						{{item.contenttext}}</view>
			
				</view>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	import swiperNavBar from "@/components/swiperNavBar/swiperNavBar.vue";
	import SOtime from '@/utils/fl-SOtime/SOtime.js'
	// var navbar == 0 
	export default {
		components: {
			swiperNavBar
		},
		data() {
			return {
				content_height: '',
				val0: '',
				val1: '',
				val2: '',
				val3: '',
				placeholder: '动态占位内容',
				navbar: '',
				like_list : [],
				comment_list : [],
				collect_list : [],
				
				//导航
				scrollIntoView: 0, //设置哪个方向可滚动，则在哪个方向滚动到该元素
				swiperTabList: ['点赞', '评论', '收藏'], //导航列表
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
		onLoad() {
			this.content_height = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().windowWidth * (95 / 750);
			
		},
		onShow() {
			this.GetLikeList();
			this.GetCollectList();
			this.GetCommentList();
		},
		methods: {
			//tab点击事件 自行完善需要的代码
			CurrentTab: function(index, item) {
				this.swiperTabIdx = index;
				this.scrollIntoView = Math.max(0, index - 1);
				this.navbar = index;
				console.log(index)
				if(index == 0) {
					this.GetLikeList();
				}
				
				if(index == 1) {
					this.GetCommentList()
				}
				
				if(index == 2) {
					this.GetCollectList()
				}
			},
			//滑动事件  自行完善需要的代码
			SwiperChange: function(e) {
				console.log(e)
				console.log(e.detail)
				console.log(e.detail.current);
				this.swiperTabIdx = e.detail.current;
				this.scrollIntoView = Math.max(0, e.detail.current - 1);
			},
			
			GetLikeList (){
				let _self = this
				
				uni.request({
					url: _self.apiServer + 'getLikeMessageList',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						useropenid: uni.getStorageSync("UserOpenid")
				
					},
					method: 'POST',
					success: res => {
				
						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '获取点赞列表失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存
				
						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							console.log(res.data)
							
							for (var i = 0; i < res.data.likelist.length; i++) {
								res.data.likelist[i].time = SOtime.time1(res.data.likelist[i].intimeunix)
							}
							
							this.like_list = res.data.likelist
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
			
			GetCommentList (){
				let _self = this
				
				uni.request({
					url: _self.apiServer + 'getCommentMessageList',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						useropenid: uni.getStorageSync("UserOpenid")
				
					},
					method: 'POST',
					success: res => {
				
						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '获取评论列表失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存
				
						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							console.log(res.data)
							
							for (var i = 0; i < res.data.commentlist.length; i++) {
								res.data.commentlist[i].time = SOtime.time1(res.data.commentlist[i].commentcreatedtimeunix)
							}
							
							this.comment_list = res.data.commentlist
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
			
			GetCollectList (){
				let _self = this
				
				uni.request({
					url: _self.apiServer + 'getCollectMessageList',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						useropenid: uni.getStorageSync("UserOpenid")
				
					},
					method: 'POST',
					success: res => {
				
						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '获取收藏列表失败',
								duration: 2000
							})
							return false;
						}
						// 用户信息写入缓存
				
						// 已经授权了、查询到用户的数据了
						if (res.data.code == 1) {
							// 用户信息写入缓存
							console.log(res.data)
							
							for (var i = 0; i < res.data.collectlist.length; i++) {
								res.data.collectlist[i].time = SOtime.time1(res.data.collectlist[i].intimeunix)
							}
							
							this.collect_list = res.data.collectlist
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
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
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
		
		border-bottom: 5rpx solid #e8e8e8;
	}

	.content-title {
		display: flex;
		flex-direction: row;
		width: auto;
		height: 100rpx;

	}

	.content-avatar {
		position: relative;
		width: 70rpx;
		height: 70rpx;
		margin-left: 38rpx;
		border-radius: 50%;
		background-size: 100% 100%;
		margin-top: 24rpx;
	}

	.content-name-from {
		display: flex;
		flex-direction: column;
		margin-left: 28rpx;
		margin-top: 26rpx;
	}

	.content-username {
		position: relative;
		height: 30rpx;
		top: 15rpx;
		right: 5rpx;
		width: auto;
		font-size: 26rpx;
		font-weight: bold;
	}

	.content-share-from {
		padding-left: 30rpx;
		position: relative;
		width: auto;
		height: 30rpx;
		font-size: 30rpx;

		top: 10rpx;
		color: #000;

	}

	.content-share-time {
		position: relative;
		top: 45rpx;
		width: auto;
		height: 30rpx;
		font-size: 27rpx;
		left: 390rpx;
		font-weight: bold;
		color: #cdcdcd;
		margin-right: 50rpx;
	}

	.content-share-more {
		position: relative;
		width: 50rpx;
		height: 50rpx;
		top: 38rpx;
		left: 260rpx;
		margin-right: 100rpx;
	}

	.content-share-word {
		font-size: medium;
		position: relative;
		padding-top: 20rpx;
		padding-left: 40rpx;
		padding-right: 40rpx;
		margin-bottom: 20rpx;
		height: auto;
	}

	.content-share-image {
		padding-left: 40rpx;
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
		padding-left: 95rpx;
		padding-right: 95rpx;
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
		font-size: 50rpx;
		position: relative;
		text-align: center;
		align-items: center;
	}

	.goods-bottom {
		display: flex;
		flex-direction: column;

		margin-right: 5%;
		border-radius: 9.05rpx;
		height: 110rpx;
		padding-top: 25rpx;
		margin-left: 25rpx;
		margin-right: 25rpx;
		margin-top: 40rpx;
		margin-bottom: 20rpx;
		padding-left: 40rpx;
		background-color: #ECEAEA;

	}

	.goods-bottom-name {
		font-size: 25rpx;
		font-weight: bold;

	}
	
	.content-pinlun{
		position: relative;
		width: auto;
		height: 30rpx;
		font-size: 22rpx;
		font-weight: bold;
		top: 10rpx;
		color: #cdcdcd;
	}
	
	.content-username1 {
		position: relative;
		height: 30rpx;
		width: auto;
		font-size: 26rpx;
		font-weight: bold;
	}
	
	.content-group-avatar {
		position: relative;
		width: 70rpx;
		height: 70rpx;
		margin-left: 38rpx;
		border-radius: 5rpx;
		background-size: 100% 100%;
		margin-top: 24rpx;
	}
	
	.content-share-time1 {
		position: relative;
		top: 45rpx;
		width: auto;
		height: 30rpx;
		font-size: 27rpx;
		left: 440rpx;
		font-weight: bold;
		color: #cdcdcd;
		margin-right: 50rpx;
	}
	
	.content-share-from1{
		padding-left: 30rpx;
		position: relative;
		width: auto;
		height: 30rpx;
		font-size: 30rpx;
		top: 10rpx;
		color: #000;
		padding-bottom: 40rpx;
	}
</style>
