<template>
	<view class="center">
		<nav-bar type="transparentFixed" :scrollTop="scrollTop" transparentFixedFontColor="#FFF"
			:bgColor="['#FFFFFF','#FFFFFF']" :title="group.groupname">

		</nav-bar>
		<ygc-comment ref="ygcComment" :placeholder="'发布评论'" @pubComment="pubComment" style="z-index: 999;">
		</ygc-comment>
		<wyb-action-sheet ref="actionSheet" :options="options" @itemclick="onItemClick" />

		<view class="center_top">
			<view class="mask">
				<text class="mask-text" v-bind:style="{top: jiaonang}">个人中心</text>
			</view>
		</view>
		<view class="center_box_bg">
			<view class="profily">
				<view class="base">
					<view class="profily_header">
						<open-data type="userAvatarUrl" class="userAvatarUrl"></open-data>
						<open-data type="userNickName" lang="zh_CN" class="userNickName"></open-data>
					</view>


					<view class="center_box_number">
						<view class="cbn_content">
							<text class="cbn_name">发布</text>
							<text class="cbn_number">{{user.UserContentNumber}}</text>
						</view>
						<view class="cbn_content">
							<text class="cbn_name">文件</text>
							<text class="cbn_number">{{user.UserFileNumber}}</text>
						</view>
						<view class="cbn_content">
							<text class="cbn_name">评论</text>
							<text class="cbn_number">{{user.UserCommentNumber}}</text>
						</view>
					</view>

				</view>
			</view>

			<view class="center_menu">
				<view class="menu_item" v-for="item in menus">
					<image :src="item.icon" mode="aspectFill"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>

		<view class="content-title">
			<text>我的小组</text>
			<view class="goods-plus" @click="addgroup()">
				<text class="icon icon-search"
					style="color: #FFFFFF;font-size: 25rpx;margin-top: 2rpx;top: 0rpx;">&#xf081;</text>
				<view
					style="color: #FFFFFF; font-weight: bold; margin-left: 8rpx;font-size: 25rpx;">
					创建小组</view>
			</view>
		</view>
		<view class="nogroup" v-if="group_list.length == 0">尚未加入小组</view>
		<view class="group-list" v-if="group_list.length != 0">
			<view class="group" v-if="group_list[0]" @click="gotogroup(group_list[0])">
				<image :src="group_list[0].groupavatarurl" class="groups-avatar" mode="scaleToFill" webp="true"></image>
				<text class="group-name">{{group_list[0].groupname}}</text>
			</view>
			<view class="group" v-if="group_list[1]" @click="gotogroup(group_list[1])">
				<image :src="group_list[1].groupavatarurl" class="groups-avatar" mode="scaleToFill" webp="true"></image>
				<text class="group-name">{{group_list[1].groupname}}</text>
			</view>
			<view class="group" v-if="group_list[2]" @click="gotogroup(group_list[2])">
				<image :src="group_list[2].groupavatarurl" class="groups-avatar" mode="scaleToFill" webp="true"></image>
				<text class="group-name">{{group_list[2].groupname}}</text>
			</view>
			<view class="group" v-if="group_list[3]" @click="gotogroup(group_list[3])">
				<image :src="group_list[3].groupavatarurl" class="groups-avatar" mode="scaleToFill" webp="true"></image>
				<text class="group-name">{{group_list[3].groupname}}</text>
			</view>
		</view>

		<view class="content-title" style="top: 20rpx;">
			<text>我的动态</text>
		</view>
		<view class="nogroup" v-if="content_list.length == 0" style="height: 100rpx;">暂无任何动态</view>

		<view class="content-list" v-if="content_list.length != 0" hover-class="content-list-hover" v-for="(item,index) in content_list" :key="index">
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
				<view class="content-share-file">
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

					<image src="../../static/bookmark1.png" v-if="item.iscollected == 0" class="content-operate-icon"
						@click="CollectContent(item.contentid,index)">
					</image>
					<image src="../../static/bookmark.png" v-if="item.iscollected == 1" class="content-operate-icon"
						@click="UncollectContent(item.contentid,index)">
					</image>

				</view>
			</view>

		</view>


	</view>
</template>

<script>
	var jiaonang;
	var menuButton = wx.getMenuButtonBoundingClientRect();
	var systemInfo = wx.getSystemInfoSync();
	var windowWidth = systemInfo.windowWidth;
	var statusBarHeight = systemInfo.statusBarHeight
	var loginRes = uni.getStorageSync('loginRes')
	var SynsUserOpenid = uni.getStorageSync('UserOpenid')
	var SynsUserName = uni.getStorageSync('UserName')
	var windowheight = wx.getSystemInfoSync().windowHeight + 'px'
	var loginflag = 0
	var comments = 0
	var height = 0
	var navbarpostion = 'postion'
	import wybActionSheet from '@/components/wyb-action-sheet/wyb-action-sheet.vue';
	import ygcComment from '@/components/ygc-comment/ygc-comment.vue';
	import SOtime from '@/utils/fl-SOtime/SOtime.js'
	import navBar from "@/components/zhouWei-navBar/index1";
	export default {
		components: {
			navBar,
			ygcComment,
			wybActionSheet
		},
		data() {
			return {
				options: [{
					label: '删除动态', // 显示的文字
					color: '#ff0000', // 文字颜色
					fontSize: '', // 文字大小
					disabled: false // 是否禁用
				}, {
					label: '投诉动态',
					color: '#000000',
					fontSize: '',
					disabled: false
				}],
				group_list: [],
				user: [],
				jiaonang: '',
				scrollTop: 0,
				bgColor: "#FFF",
				fontColor: "#000",
				height: 0,
				group: [],
				contentid: '',
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
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad(options) {

			// 加载定义好的方法
			this.content_height = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().windowWidth * (95 / 750);

		},
		onShow() {
			this.getUserInfor()
			this.refresh()
			this.getGroupList()
		},
		onReady() {

			let capsuleButtonInfo = wx.getMenuButtonBoundingClientRect();
			let gap = capsuleButtonInfo.top - statusBarHeight;

			this.jiaonang = gap * 2 + capsuleButtonInfo.height + 4 + 'px'


		},
		methods: {
			showactionsheet(e) {
				let content = e
				this.curcontent = content
				if (content.contentcreatedby == uni.getStorageSync("UserOpenid")) {
					console.log("sdf")
					this.options[1].disabled = true
				}
				this.$refs.actionSheet.showActionSheet(); // 显示
			},

			onItemClick(e) {
				let index = e.index
				let label = e.label
				if (index == 0) {
					this.deleteContent(this.curcontent)
				}

			},
			toggleMask(type, content, id) {
				this.$refs.ygcComment.toggleMask(type);
				this.content = content
				this.contentid = id
			},
			getUserInfor() {
				let _self = this

				uni.request({
					url: _self.apiServer + 'loginApplets',

					data: {
						useropenid: uni.getStorageSync("UserOpenid"),
					},

					header: {
						'content-type': 'application/json',
					},

					method: 'POST',

					success: res => {
						this.user = res.data.user
						console.log(this.user)

					},
				})
			},

			refresh() {
				let _self = this

				uni.request({
					url: _self.apiServer + 'getMyContentList',

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
							res.data.content[i].time = SOtime.time1(res.data.content[i].contentcreatedtimeunix)
						}
						console.log(this.content_list)

					},
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
						contentcreatedby: uni.getStorageSync("UserOpenid"),
						contentid: content.contentid

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
							this.refresh()
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

			getGroupList() {
				let _self = this

				uni.request({
					url: _self.apiServer + 'getMyGroupList',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						useropenid: uni.getStorageSync('UserOpenid')
					},


					method: 'POST',

					success: res => {
						console.log(res.data.content)
						this.group_list = res.data.content
					},
				})
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
			addgroup() {
				uni.navigateTo({
					url: '/pages/group/addgroup'
				})
			},
			gotogroup(e) {
				let group = e;
				let _self = this;

				var navData = JSON.stringify(group);
				uni.navigateTo({
					url: '/pages/group/groupinfo?data=' + navData
				})
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


		},
		computed: {

		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}



	.center_box_bg {
		position: relative;
		height: 250rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.profily,
	.profily_header {
		display: flex;
		flex-direction: row;
		border-radius: 8px;
		width: 100%;
		align-items: center;
		position: relative;
		top: -100rpx;
	}

	.userAvatarUrl {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		overflow: hidden;

	}

	.userNickName {
		font-weight: bold;
		font-size: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
		margin-left: 20rpx;
	}

	.mask-text {
		position: relative;
		color: #FFFFFF;
		font-size: 40rpx;
		font-weight: bold;
		padding-left: 20rpx;
	}

	.center {
		height: 100%;

		&_top {
			height: 20%;
			background-color: #1E8DD5;
			background-size: cover;

			// background: #E6E6E6;
			.mask {
				background: rgba(0, 0, 0, .4);
				height: 100%;
			}
		}

		&_box_bg {
			background: #F9F9F9;
			position: relative;

			.profily {
				position: absolute;
				width: 95%;
				// border:1px solid #F7F7F7;
				height: 300rpx;
				margin: 0 auto;
				top: -100upx;

				background: #FEFEFE;
				padding: 35upx;
				box-sizing: border-box;
				box-shadow: 0px 2px 5px #EDEDED;
			}
		}
	}

	.base {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-bottom: 2px solid #F6F6F6;
		padding-bottom: 20rpx;
		position: relative;
		width: 100%;
		height: 10rpx;

		.profily_header {
			height: 120upx;
			width: 100%;
			background-size: 100%;
		}



	}

	.order_status {
		display: flex;
		justify-content: space-between;
		margin-top: 35upx;

		.status {
			width: 140upx;
			font-size: 24upx;
			text-align: center;
			letter-spacing: .5px;
			display: flex;
			flex-direction: column;

			.icon {
				width: 50upx;
				height: 50upx;
				margin: 0 auto;
				margin-bottom: 5px;

			}
		}
	}

	.baiban {
		background: #FEFEFE;
		height: 300upx;
	}

	.center_menu {
		width: 100%;
		display: inline-block;

		.menu_item {
			font-size: 28upx;
			letter-spacing: 1px;
			padding: 14px 5%;
			background: #FEFEFE;
			overflow: hidden;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			position: relative;
			border-bottom: 1px solid #EFEFEF;

			&:hover {
				background: #F6F6F6 !important;
			}

			&::after {
				content: '';
				width: 30upx;
				height: 30upx;
				position: absolute;
				right: 5%;
				background-size: 100%;
			}

			text:nth-of-type(1) {
				margin-left: 10px;
			}

			image {
				width: 40upx;
				height: 40upx;
			}

			&:nth-of-type(4) {
				margin-top: 10px;
			}
		}
	}

	.content-right {
		width: 100%;
		display: flex;
		flex-direction: row;
		margin-left: auto;
		justify-content: flex-end;
	}

	.content-right-info {
		display: flex;
		flex-direction: row;
		position: relative;

	}

	.center_box_number {
		display: flex;
		flex-direction: row;
		height: 100rpx;
		width: 100%;
		align-items: center;
		justify-content: center;
		position: relative;
		top: -40rpx;
	}

	.cbn_content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-left: 75rpx;
		padding-right: 75rpx;
	}

	.cbn_name {
		font-weight: bold;
		font-size: 30rpx;
	}

	.content-title {
		position: relative;
		font-weight: bold;
		font-size: 40rpx;
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100rpx;


	}

	.content-title text {
		position: relative;
		padding-left: 20rpx;
		top: 20rpx;
	}
	
	.nogroup {
		height: 160rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #c7c7c7;
		text-align: center;
	}

	.group-list {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 160rpx;

	}

	.group {
		display: flex;
		flex-direction: column;
		margin-left: 30rpx;
		margin-right: 30rpx;
		text-align: center;

	}

	.group-name {
		margin-top: 10rpx;
		font-weight: bold;
		font-size: 30rpx;
		width: 120rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.groups-avatar {
		position: relative;
		width: 120rpx;
		height: 120rpx;
		border-radius: 10rpx;

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
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 200rpx;
	}

	.content-operate-likes {
		display: flex;
		flex-direction: row;
		padding-left: 40rpx;
		padding-right: 100rpx;
	}

	.goods-plus {
		position: relative;
		top: 28rpx;
		display: flex;
		width: 160rpx;
		height: 50rpx;
		line-height: 25px;
		flex-direction: row;
		background-color: $theme-color;
		border-radius: 9.05rpx;
		align-content: center;
		text-align: center;
		vertical-align: middle;
		left: 380rpx;

	}

	.content-operate-comments {
		display: flex;
		flex-direction: row;
		padding-left: 50rpx;
		padding-right: 90rpx;
	}

	.goods-words {
		position: relative;
		left: 40rpx;
		color: #FFFFFF;
		font-weight: bold;
		text-align: center;
		font-size: 25rpx;
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



</style>
