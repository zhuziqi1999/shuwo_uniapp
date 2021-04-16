<template>
	<view class="content">

		<ygc-comment ref="ygcComment" :placeholder="'发布评论'" @pubComment="pubComment" style="z-index: 999;">
		</ygc-comment>
		
		<wyb-action-sheet ref="actionSheet" :options="options" @itemclick="onItemClick"/>
		
		<scroll-view white-space=nowrap; scroll-x="false" enable-back-to-top="true" refresher-background="#cdcdcd"
			scroll-y :style="{height:content_height+'px',}" class="content-scroll">
			<view class="content-list">
				<view class="content-title">
					<view class="content-avatar-view" @click="gotoUser(content)">
						<image :src="content.useravatarurl" class="content-avatar" mode="scaleToFill" webp="true">
						</image>
					</view>

					<view class="content-name-from">
						<view class="content-username">{{content.username}}</view>
						<view class="content-share-from">发布自{{content.groupname}}</view>
					</view>
						<view class="content-right">
							<view class="content-right-info">
							<view class="content-share-time" >{{content.time}}</view>
							<image class="content-share-more" src="../../static/ellipsis-h.png"
								@click="showactionsheet(content)"></image>
							</view>
						</view>
				</view>

				<view class="content-share-word">{{content.contenttext}}</view>
				<!-- 图片 -->
				<!-- <image class="content-share-image" mode="scaleToFill" src="../../static/1614174681858.jpg">
				</iamge> -->
				<view class="content-share-file" v-if="content.filename" @click="showactionsheet2(content.contentcreatedby)">
						<image class="content-share-file-img" v-if="content.filetype == 'doc'" src="../../static/W.png">
						</image>
						<image class="content-share-file-img" v-if="content.filetype == 'docx'" src="../../static/W.png">
						</image>
						<image class="content-share-file-img" v-if="content.filetype == 'pdf'" src="../../static/P.png">
						</image>
						<text class="content-share-file-word">{{content.filename}}</text>
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
					@change="CurrentTab"  style="width: 100%">
				</swiperNavBar>
			</view>
			
			<view v-if="likes_list.length == 0 && is_likes == 1"  class="nomessage">暂无点赞消息</view>
			<view v-if="comments_list.length == 0 && is_comments == 1"  class="nomessage">暂无评论消息</view>

			
			
			<view class="comment-list" v-if="is_comments == 1" v-for="(item,index) in comments_list" :key="index" @click="showactionsheet1(item)">
				<view class="comment-title">
					<view class="comment-avatar-view">
						<image :src="item.useravatarurl" class="comment-avatar" mode="scaleToFill" webp="true"></image>
					</view>

					<view class="comment-name-from">
						<view class="comment-username">{{item.username}}</view>

					</view>
					<view class="comment-share-time">
						<text>{{item.time}}</text>
					</view>
				</view>

				<view class="comment-share-word">{{item.commenttext}}</view>

			</view>
			
			<view class="comment-list" v-if="is_likes == 1" v-for="(item,index) in likes_list" :key="index">
				<view class="comment-title">
					<view class="comment-avatar-view">
						<image :src="item.useravatarurl" class="comment-avatar" mode="scaleToFill" webp="true"></image>
					</view>
			
					<view class="comment-name-from">
						<view class="comment-username">{{item.username}}</view>
			
					</view>

					<view class="content-plus-flex">
						<text class="icon icon-heart">&#xf013;</text>
					</view>			
				</view>
			</view>
		</scroll-view>


		<view class="content-operate">
			<view class="content-operate-likes">
				<image src="../../static/heart1.png" v-if="content.isliked == 0" class="content-operate-icon"
					@click="LikeContent(content.contentid,index)"></image>
				<image src="../../static/heart.png" v-if="content.isliked == 1" class="content-operate-icon"
					@click="UnlikeContent(content.contentid,index)"></image>
				<text class="content-operate-likes-number">{{content.contentlikes}}</text>
			</view>
			<view class="content-operate-comments">
				<image src="../../static/comments1.png" class="content-operate-icon" @click="toggleMask('show')">
				</image>
				<text class="content-operate-comments-number">{{content.contentcomments}}</text>
			</view>

			<view class="content-operate-collect">

				<image src="../../static/bookmark1.png" v-if="content.iscollected == 0" class="content-operate-icon"
					@click="CollectContent(content.contentid,index)">
				</image>
				<image src="../../static/bookmark.png" v-if="content.iscollected == 1" class="content-operate-icon"
					@click="UncollectContent(content.contentid,index)">
				</image>

			</view>
		</view>

	</view>




</template>

<script>
	import wybActionSheet from '@/components/wyb-action-sheet/wyb-action-sheet.vue';
	import ygcComment from '@/components/ygc-comment/ygc-comment.vue';
	import SOtime from '@/utils/fl-SOtime/SOtime.js'
	import swiperNavBar from "@/components/swiperNavBar/swiperNavBar.vue";
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
			ygcComment,
			swiperNavBar,
			wybActionSheet
		},
		data() {
			return {
				options: [],
				curcomment: [],
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
				likes_list: [],
				//导航
				scrollIntoView: 0, //设置哪个方向可滚动，则在哪个方向滚动到该元素
				swiperTabList: ['评论', '点赞'], //导航列表
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
			var data = JSON.parse(options.data) // 字符串转对象
			this.content = data
			// 加载定义好的方法
			this.content_height = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().windowWidth * (95 / 750) ;



			uni.getSystemInfo({
				success: function(res) { // res - 各种参数

					let obj = uni.createSelectorQuery().select('.content-list')

					obj.boundingClientRect(function(data) { // data - 各种参数
						this.height = data.height
					}).exec()
				}
			})
			
			this.getCommentList()

		},

		// onPageScroll : function(e) {
		// 	//获取距离顶部距离
		// 	const scrollTop = res.scrollTop;
		// 	// 获取屏幕宽高
		// 	let height = this.height;
		// 	 console.log("滚动距离为：" + e.scrollTop);
		// 	if (e.scrollTop > height) {
		// 		this.navbarpostion = 'fixed';
		// 		console.log(this.navbarpostion)
		// 	}
		// 	else {
		// 		this.navbarpostion = 'postion';

		// 	}

		// 	// console.log(scrollTop)
		// },

		methods: {
			showactionsheet(e) {
				let content = e
				
				this. options= [{
					label: '删除动态', // 显示的文字
					color: '#ff0000', // 文字颜色
					fontSize: '', // 文字大小
					disabled: false // 是否禁用
				}, {
					label: '投诉动态',
					color: '#000000',
					fontSize: '',
					disabled: false
				}]
				if(content.contentcreatedby == uni.getStorageSync("UserOpenid")){
					this.options[1].disabled = true
				}
				
				if(content.contentcreatedby != uni.getStorageSync("UserOpenid")){
					this.options[0].disabled = true
				}
				
				
				this.$refs.actionSheet.showActionSheet(); // 显示
			},
			
			
			showactionsheet1(e) {
				let comment = e
				
				this. options= [{
					label: '删除评论', // 显示的文字
					color: '#ff0000', // 文字颜色
					fontSize: '', // 文字大小
					disabled: false // 是否禁用
				}, {
					label: '投诉评论',
					color: '#000000',
					fontSize: '',
					disabled: false
				}]
				if(comment.commentcreatedby == uni.getStorageSync("UserOpenid")){
					this.options[1].disabled = true
				}
				if(comment.commentcreatedby != uni.getStorageSync("UserOpenid") || this.content.contentcreatedby != uni.getStorageSync("UserOpenid")){
					this.options[0].disabled = true
				}
				console.log(e)
				this.curcomment = e
				this.$refs.actionSheet.showActionSheet(); // 显示
			},
			
			showactionsheet2(e) {
				let contentcreatedby = e
				
				this. options= [{
					label: '打开文件', // 显示的文字
					color: '#000000', // 文字颜色
					fontSize: '', // 文字大小
					disabled: false // 是否禁用
				}, {
					label: '保存文件',
					color: '#000000',
					fontSize: '',
					disabled: false
				}]
				if(contentcreatedby == uni.getStorageSync("UserOpenid")){
					this.options[1].disabled = true
				}

				this.$refs.actionSheet.showActionSheet(); // 显示
			},
			
			
			onItemClick(e) {
				let index = e.index
				let label = e.label
				if (label == "删除动态") {
					this.deleteContent(this.content)
				}
				if (label == "删除评论") {
					this.deleteComment( )
				}
				if (label == "打开文件") {
					this.openfile()
				}
				if (label == "保存文件") {
					this.gotosavefile()
				}
				
			},
			
			toggleMask(type) {
				this.$refs.ygcComment.toggleMask(type);
			},
			//tab点击事件 自行完善需要的代码
			CurrentTab: function(index, item,content) {
				let _self = this
				this.swiperTabIdx = index;
				this.scrollIntoView = Math.max(0, index - 1);
				
				
				//查看回复
				if (this.swiperTabIdx == 0) {
					this.is_comments = 1 
					this.is_likes = 0
					this.getCommentList()

				}
				
				if (this.swiperTabIdx == 1 ){
					this.is_comments = 0
					this.is_likes = 1
					this.getLikeList()
				}

			},
			gotoUser(e) {
				let content = e;
				let _self = this;
			
				var navData = JSON.stringify(content);
				uni.navigateTo({
					url: '/pages/my/myinfo?data=' + navData
				})
			},
			openfile() {
				let content = this.content
				console.log("11")
				console.log(content)

				let downloadpath = 'https://shuwo.ltd/download/'
				console.log(downloadpath + content.contentshare + '.' +content.filetype)
				wx.downloadFile({
				  
				  url : downloadpath + content.contentshare + '.' +content.filetype,
				  header: {
				  'Content-Type': 'application/' + content.filetype
				  },
				  success: function (res) {
				    var filePath = res.tempFilePath;
					console.log(res)
				    wx.openDocument({
				      filePath: filePath,
					  fileType: content.filetype,
				      success: function (res) {
				        console.log('打开文档成功');
				      },
					  fail:function(res) {
					  	console.log(res)
					  }
				    });
				  },
				  
				});
			},
			
			gotosavefile() {
				let content = this.content;
				let _self = this;
			
				var navData = JSON.stringify(content);
				uni.navigateTo({
					url: '/pages/file/savefile?data=' + navData
				})
			},
			
			deleteContent(e) {
				let _self = this
				let content = e
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
							wx.navigateBack({
								delta: 1,
							})
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
			deleteComment(e) {
				let _self = this
				console.log("sdf")
				console.log(this.content.contentid)
				uni.request({
					url: _self.apiServer + 'deleteComment',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						commentcreatedby : this.curcomment.commentcreatedby,
						commentid : this.curcomment.commentid,
						commentcontentid : this.content.contentid
			
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
							this.content.contentcomments --
							this.getCommentList()
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
			getCommentList() {
				let _self = this
				
				uni.request({
					url: _self.apiServer + 'getCommentList',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						contentid: this.content.contentid
				
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
							
							for (var i = 0; i < res.data.comment.length; i++) {
								res.data.comment[i].time = SOtime.time1(res.data.comment[i].commentcreatedtimeunix)
							}
							
							this.comments_list = res.data.comment
							
							
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
			
			getLikeList() {
				let _self = this
				
				uni.request({
					url: _self.apiServer + 'getLikeList',
					header: {
						'content-type': 'application/json',
					},
					dataType: "json",
					data: {
						contentid: this.content.contentid
				
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
							
							this.likes_list = res.data.likelist
							
							
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
			
			//滑动事件  自行完善需要的代码
			SwiperChange: function(e) {
				console.log(e)
				console.log(e.detail)
				console.log(e.detail.current);
				this.swiperTabIdx = e.detail.current;
				this.scrollIntoView = Math.max(0, e.detail.current - 1);
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
							this.content.isliked = 1
							this.content.contentlikes++
							
							this.getLikeList()
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
							this.content.isliked = 0
							this.content.contentlikes--
							this.getLikeList()
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
							this.content.iscollected = 1
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
							this.content.iscollected = 0
							
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
							this.content.contentcomments++
							this.getCommentList()
							
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
		top: -1rpx;
		width: 100%;
		background-color: #FFFFFF;
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
		border-bottom: #e3e3e3 solid 1rpx;
		margin-top: 10rpx;
		padding-bottom: 20rpx;
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

		width: 100%;
		height: 100rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		box-shadow: 0px -5px 5px #d0d0d0;



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

	.icon-heart {
		color: #F0AD4E;
		font-size: 35rpx;
		position: relative;
		text-align: center;
		align-items: center;
		left: 200rpx;
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
		top: 20rpx;
		left: 20rpx;
		margin-bottom: 40rpx;
		text-align: center;
		align-items: center;

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


	.comment-list {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: auto;
		background-color: #FFFFFF;
		border-bottom: #e3e3e3 solid 0.5rpx;
		margin-top: 10rpx;
		padding-bottom: 10rpx;
	}


	.comment-title {
		display: flex;
		flex-direction: row;
		width: auto;
		height: 100rpx;

	}

	.comment-avatar {
		position: relative;
		width: 50rpx;
		height: 50rpx;

		border-radius: 50%;
		background-size: 100% 100%;

	}

	.comment-avatar-view {
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.comment-name-from {
		display: flex;
		flex-direction: column;
		margin-left: 10rpx;
		justify-content: center;
		width: 300rpx;
	}

	.comment-username {
		position: relative;
		height: 30rpx;
		width: auto;
		font-size: 24rpx;

		font-weight: bold;
	}

	.comment-share-from {
		position: relative;
		width: auto;
		height: 30rpx;
		font-size: 22rpx;
		font-weight: bold;
		top: 10rpx;
		color: #cdcdcd;

	}

	.comment-share-time {
		position: relative;
		justify-content: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: auto;
		height: 100%;
		font-size: 24rpx;
		left: 260rpx;
		font-weight: bold;
		color: #cdcdcd;

	}

	.comment-share-more {
		position: relative;
		width: 50rpx;
		height: 50rpx;
		top: 38rpx;
		left: 190rpx;
		margin-right: 20rpx;
	}

	.comment-share-word {
		font-size: medium;
		position: relative;
		padding-left: 20rpx;
		padding-right: 40rpx;
		margin-bottom: 20rpx;
		height: auto;
	}
	
	.nomessage {
		position: relative;
		top: 20rpx;
		color: #c7c7c7;
		text-align: center;
	}
</style>
