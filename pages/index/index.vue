<template>

	<view class="content">

		<ygc-comment ref="ygcComment" :placeholder="'发布评论'" @pubComment="pubComment" style="z-index: 999;">
		</ygc-comment>

		<wyb-action-sheet ref="actionSheet" :options="options" @itemclick="onItemClick"/>



		<mSearch @search="search($event)" style="justify-content: center;width: 100%;"></mSearch>
		<swiperNavBar :scrollIntoView="scrollIntoView" :swiperTabList='swiperTabList' :swiperTabIdx='swiperTabIdx'
			:currentSwiperWidth='currentSwiperWidth' :currentSwiperHeight='currentSwiperHeight'
			:swiperCurrentSize='swiperCurrentSize' :swiperColor='swiperColor' :swiperCurrentColor='swiperCurrentColor'
			:currentSwiperLineShow="currentSwiperLineShow" :currentSwiperLineActiveWidth="currentSwiperLineActiveWidth"
			:currentSwiperLineActiveHeight="currentSwiperLineActiveHeight"
			:currentSwiperLineActiveBg="currentSwiperLineActiveBg"
			:currentSwiperLineAnimatie="currentSwiperLineAnimatie" v-if=" swiperTabList.length > 1 "
			@change="CurrentTab" style="width: 100%;">
		</swiperNavBar>
		<movable-area :style="{height:content_height+'px',}" class="content-scroll">

			<movable-view class="content-plus" direction="all" style="pointer-events: auto; z-index: 99;"
				@click="addcontent">
				<view class="content-plus-flex">
					<text class="icon icon-plus">&#xf081;</text>
					<text
						style="font-size: 28rpx;color: #FFFFFF;padding: 10rpx;font-weight: bold; padding-left: 5rpx;">发布动态</text>
				</view>
			</movable-view>


			<scroll-view white-space=nowrap; scroll-x="false" enable-back-to-top="true" refresher-background="#cdcdcd"
				scroll-y :style="{height:content_height+'px',}" class="content-scroll">

				<view class="content-list" hover-class="content-list-hover" v-for="(item,index) in content_list"
					:key="index">
					<view class="content-title">
						<view class="content-avatar-view" @click="gotoUser(item)">
							<image :src="item.useravatarurl" class="content-avatar" mode="scaleToFill" webp="true" >
							</image>
						</view>

						<view class="content-name-from">
							<view class="content-username" @click="gotoUser(item)">{{item.username}}</view>
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
			</scroll-view>
		</movable-area>
		
	</view>

</template>

<script>
	import wybActionSheet from '@/components/wyb-action-sheet/wyb-action-sheet.vue';
	import mSearch from '@/components/mehaotian-search/mehaotian-search.vue';
	import ygcComment from '@/components/ygc-comment/ygc-comment.vue';
	import swiperNavBar from "@/components/swiperNavBar/swiperNavBar.vue";
	import SOtime from '@/utils/fl-SOtime/SOtime.js'

	var loginRes = uni.getStorageSync('loginRes')
	var SynsUserOpenid = uni.getStorageSync('UserOpenid')
	var SynsUserName = uni.getStorageSync('UserName')
	var windowheight = wx.getSystemInfoSync().windowHeight + 'px'
	var loginflag = 0
	var comments = 0
	var content = []
	export default {
		components: {
			mSearch,
			ygcComment,
			swiperNavBar,
			wybActionSheet
		},

		data() {
			return {
				// 这里的options有两种写法
				// 简写形式：
				// 完整形式

				options: [],


				// spanStyle: {
				//    "--windowheight": uni.getSystemInfoSync().windowHeight
				// },
				buttonTop: 0,
				buttonLeft: 0,
				windowHeight: '',
				windowWidth: '',
				contentid: '',
				content_height: '',
				curcontent: [],
				content: [],
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

				content_list: [],
				//导航
				scrollIntoView: 0, //设置哪个方向可滚动，则在哪个方向滚动到该元素
				swiperTabList: ['热门', '关注'], //导航列表
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
			// 加载定义好的方法


			this.content_height = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().windowWidth * (95 / 750) -
				38;

			if (SynsUserOpenid == null || SynsUserName == null || loginRes == 0) {
				loginRes = this.checkLogin('../index/index', 2);
			}

			// 没有登录成功，返回空
			if (!loginRes) {
				console.log("fail")
				return;
			}

			// 刷新动态列表


		},


		onShow() {
			if (this.swiperTabIdx == 0) {
				this.getContentList()
			}
			
			if (this.swiperTabIdx == 1) {
				this.getFollowContentList()
			}
		},

		methods: {
			
			showactionsheet(e) {
				this.options = [{
					label: '删除动态', // 显示的文字
					color: '#ff0000', // 文字颜色
					fontSize: '', // 文字大小
					disabled: false // 是否禁用
				}, {
					label: '投诉动态',
					color: '#000000',
					fontSize: '',
					disabled: false
				},
				{
					label: '编辑动态',
					color: '#000000',
					fontSize: '',
					disabled: false
				}]
				let content = e
				this.curcontent = content
				if(content.contentcreatedby == uni.getStorageSync("UserOpenid")){
					this.options[1].disabled = true
				}
				if(content.contentcreatedby != uni.getStorageSync("UserOpenid")){
					this.options[2].disabled = true
					this.options[0].disabled = true
				}
				
				this.$refs.actionSheet.showActionSheet(); // 显示
			},
			
			onItemClick(e) {
				let index = e.index
				let label = e.label
				if (label == "删除动态") {
					this.deleteContent(this.curcontent)
				}
				if (label == "编辑动态") {
					this.updateContent(this.curcontent)
				}
				
			},


			toggleMask(type, content, id) {
				this.$refs.ygcComment.toggleMask(type);
				this.content = content
				this.contentid = id
			},
			search(e) {
				console.log(e);
				let message = e
				var navData = JSON.stringify(message);
				uni.navigateTo({
					url: '/pages/search/search?data=' + navData
				})
			},
			//tab点击事件 自行完善需要的代码
			CurrentTab: function(index, item) {
				this.swiperTabIdx = index;
				this.scrollIntoView = Math.max(0, index - 1);
				if (index == 0) {
					this.getContentList()
				}
				
				if (index == 1) {
					this.getFollowContentList()
				}

				console.log(index + '----' + item)
			},
			//滑动事件  自行完善需要的代码
			SwiperChange: function(e) {
				console.log(e)
				console.log(e.detail)
				console.log(e.detail.current);
				this.swiperTabIdx = e.detail.current;
				this.scrollIntoView = Math.max(0, e.detail.current - 1);
			},
			
			getFollowContentList() {
				let _self = this
				
				uni.request({
					url: _self.apiServer + 'getFollowContentList',
				
					data: {
						useropenid: uni.getStorageSync("UserOpenid"),
					},
				
					header: {
						'content-type': 'application/json',
					},
				
					method: 'POST',
				
					success: res => {
						this.content_list = res.data.content
				
						for (var i = 0; i < res.data.content.length; i++) {
							res.data.content[i].time = SOtime.time1(res.data.content[i]
								.contentcreatedtimeunix)
						}
						console.log(this.content_list)
				
					},
				})
			},
			
			
			getContentList() {
				let _self = this

				uni.request({
					url: _self.apiServer + 'getContentList',

					data: {
						useropenid: uni.getStorageSync("UserOpenid"),
						groupid: ""
					},

					header: {
						'content-type': 'application/json',
					},

					method: 'POST',

					success: res => {
						this.content_list = res.data.content

						for (var i = 0; i < res.data.content.length; i++) {
							res.data.content[i].time = SOtime.time1(res.data.content[i]
								.contentcreatedtimeunix)
						}
						console.log(this.content_list)

					},
				})
			},

			addcontent() {
				uni.navigateTo({
					url: '/pages/index/addcontent'
				})
			},
			
			updateContent(e) {
				let content = e;
				let _self = this;
				
				var navData = JSON.stringify(content);
				uni.navigateTo({
					url: '/pages/index/updatecontent?data=' + navData
				})
				
				
			},
			
			deleteContent(e) {
				let _self = this
				let content = e
				console.log(content.contentid)
				uni.request({
					url: _self.apiServer + 'deleteContent',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						contentcreatedby : uni.getStorageSync("UserOpenid"),
						contentid : content.contentid
			
					},
					method: 'POST',
					success: res => {
			
						if (res.data.code == 0) {
							uni.hideLoading();
							uni.showToast({
								title: '删除失败',
								icon: "none",
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
							this.options[1].disabled = false
							this.getContentList()
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
			

			LikeContent(e, id) {
				let _self = this;
				let contentid = e
				let index = id

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

							setTimeout(function() {

							}, 2000)
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
							setTimeout(function() {

							}, 2000)
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
			
			gotoUser(e) {
				let content = e;
				let _self = this;
			
				var navData = JSON.stringify(content);
				uni.navigateTo({
					url: '/pages/my/myinfo?data=' + navData
				})
			},
			
			pubComment(e, id) {
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

<style scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}



	.content-plus {
		left: 285rpx;
		top: 92%;
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

	.content-right {
		width: 100%;
		display: flex;
		flex-direction: row;
		margin-left:auto;
		justify-content: flex-end;
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
	.content-share-bar {
		width: 100%;
		height: 100rpx;
		position: relative;
		top: 20rpx;

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
	
	.content-right-info {
		display: flex;
		flex-direction: row;
		position: relative;

	}
</style>
