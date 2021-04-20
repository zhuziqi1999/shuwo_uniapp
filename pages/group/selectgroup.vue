<template>
	<view class="container">
		<!-- 顶部面板 -->
		<view class="content-title">
			<text>选择你的小组</text>
		</view>
		<!-- 滚动区域 -->
		<view class="scroll-panel" id="scroll-panel">
			<view class="list-box">
				<!-- <view class="left">
					<scroll-view scroll-y="true" :style="{ 'height':scrollHeight + 'px' }"
						:scroll-into-view="leftIntoView">
						<view class="item" v-for="(item,index) in leftArray" :key="index"
							:class="{ 'active':index==leftIndex }" :id="'left-'+index" :data-index="index"
							@tap="leftTap">{{item}}</view>
					</scroll-view>
				</view> -->
				<view class="main">
					<scroll-view scroll-y="true" :style="{ 'height':scrollHeight + 'px' }" @scroll="mainScroll"
						:scroll-into-view="scrollInto" scroll-with-animation="true">
					<view v-if="group_list.length == 0 "  class="nomessage">
					<text>您尚未加入小组</text>
					<view class="gotoadd" @click="gotoAdd">前往加入小组</view>
					</view>	
						<view class="item main-item" v-for="(item,index) in group_list" :key="index" :id="'item-'+index">

							
							<view class="goods" @click="itemClick(item)">
								<view class="goods-top">
									<image class="goods-image" :src="item.groupavatarurl"
										mode="">
									</image>
									<view style="width: 560rpx;" >
										<view class="number">{{item.groupname}}</view>
									</view>

									<text class="icon icon-delete" >&#xef6f;</text>


							
								</view>
								<view class="goods-bottom" @click="gotogroup(item)">
									<text class="icon icon-search"
										style="color: #ff8522;font-size: 25rpx;margin-left: 7rpx;margin-top: 6rpx;height: 25rpx;">&#xef7e;</text>
									<view class="group-remark" style="color: #515151; font-weight: bold; margin-left: 15rpx;font-size: 25rpx;height: 30rpx;">
										{{item.groupremark}}
									</view>
								</view>
							</view>
							
						</view>
						<!-- <view class="fill-last" :style="{ 'height':fillHeight + 'px' }"></view> -->
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- 底部面板 -->
		<!-- 		<view class="bottom-panel"> -->
		<!-- 底部面板，可添加所需要放在页面底部的内容代码。比如购物车栏目 -->
		<!-- 			<view style="background-color: #ffaa00;text-align: center;font-size: 28rpx;padding: 10px 0;color: #fff;">
				<view>这里底部内容占位区域，不需要则删除</view>
				<view>可添加需放在页面底部的内容，比如购物车栏目</view>
			</view> -->
		<!-- 		</view> -->
	</view>
</template>

<script>
	import mSearch from '@/components/mehaotian-search/mehaotian-search.vue'
	export default {
		components: {
			mSearch
		},

		data() {
			return {
				val0: '',
				val1: '',
				val2: '',
				val3: '',
				placeholder: '动态占位内容',
				scrollHeight: 400,
				scrollTopSize: 0,
				fillHeight: 0, // 填充高度，用于最后一项低于滚动区域时使用
				leftArray: [],
				group_list: [],
				topArr: [],
				leftIndex: 0,
				scrollInto: '',
				isplus: 1
			}
		},
		computed: {
			/* 计算左侧滚动位置定位 */
			leftIntoView() {
				return `left-${this.leftIndex > 3 ? (this.leftIndex-3):0}`;
			}
		},
		mounted() {
			/* 等待DOM挂载完成 */
			this.$nextTick(() => {
				/* 在非H5平台，nextTick回调后有概率获取到错误的元素高度，则添加200ms的延迟来减少BUG的产生 */
				setTimeout(() => {
					/* 等待滚动区域初始化完成 */
					this.initScrollView().then(() => {
						/* 获取列表数据，你的代码从此处开始 */
						this.getListData();
					})
				}, 200);
			})
		},
		onShow() {
			this.getListData()
		},
		methods: {
			search(e, val) {
				console.log(e, val);
				this['val' + val] = e;
			},
			/* 初始化滚动区域 */
			initScrollView() {
				return new Promise((resolve, reject) => {
					let view = uni.createSelectorQuery().select('#scroll-panel');
					view.boundingClientRect(res => {
						this.scrollTopSize = res.top;
						this.scrollHeight = res.height;
						this.$nextTick(() => {
							resolve();
						})
					}).exec();
				});
			},

			gotogroup(e) {
				let group = e;
				let _self = this;

				var navData = JSON.stringify(group);
				uni.navigateTo({
					url: '/pages/group/groupinfo?data=' + navData
				})
			},

			itemClick: function(e) {
				let group = e
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				
				prevPage.setData({
					group: group
				})
				wx.navigateBack({
					delta: 1,
				})
			},


			/* 获取列表数据 */
			getListData() {
				// Promise 为 ES6 新增的API ，有疑问的请自行学习该方法的使用。
				new Promise((resolve, reject) => {
					/* 因无真实数据，当前方法模拟数据。正式项目中将此处替换为 数据请求即可 */
					uni.showLoading();
					setTimeout(() => {


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
								let main = res.data.content;


								resolve({
									main
								});
							},
						})



					}, 1000);
				}).then((res) => {
					console.log('-----------请求接口返回数据示例-------------');
					console.log(res);

					uni.hideLoading();
					this.group_list = res.main;
					console.log(this.group_list)
					// DOM 挂载后 再调用 getElementTop 获取高度的方法。
					this.$nextTick(() => {
						this.getElementTop();
					});
				});
			},
			/* 获取元素顶部信息 */
			getElementTop() {
				new Promise((resolve, reject) => {
					let view = uni.createSelectorQuery().selectAll('.main-item');
					view.boundingClientRect(data => {
						resolve(data);
					}).exec();
				}).then((res) => {
					let topArr = res.map((item) => {
						return item.top - this.scrollTopSize; /* 减去滚动容器距离顶部的距离 */
					});
					this.topArr = topArr;

					/* 获取最后一项的高度，设置填充高度。判断和填充时做了 +-20 的操作，是为了滚动时更好的定位 */
					let last = res[res.length - 1].height;
					if (last - 20 < this.scrollHeight) {
						this.fillHeight = this.scrollHeight - last + 20;
					}
				});
			},
			/* 主区域滚动监听 */
			mainScroll(e) {
				let top = e.detail.scrollTop;
				let index = 0;
				/* 查找当前滚动距离 */
				for (let i = (this.topArr.length - 1); i >= 0; i--) {
					/* 在部分安卓设备上，因手机逻辑分辨率与rpx单位计算不是整数，滚动距离与有误差，增加2px来完善该问题 */
					if ((top + 2) >= this.topArr[i]) {
						index = i;
						break;
					}
				}
				this.leftIndex = (index < 0 ? 0 : index);
			},
			/* 左侧导航点击 */
			leftTap(e) {
				let index = e.currentTarget.dataset.index;
				this.scrollInto = `item-${index}`;
			},
			
			gotoAdd () {
				uni.switchTab({
				    url: '/pages/group/group'
				});
			},
			
			inGroup(e, id) {
				let _self = this;
				let groupid = e
				let index = id

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

							this.group_list[index].IsInGroup = 1
							console.log(this.group_list[index].IsInGroup)
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

			outGroup(e, id) {
				let _self = this;
				let groupid = e
				let index = id

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

							this.group_list[index].IsInGroup = 0
							console.log(this.group_list[index].IsInGroup)
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
	};
</script>

<style lang="scss">
	page,
	.container {
		height: 100%;
	}

	.content-title {
		font-weight: bold;
		font-size: 40rpx;
		display: flex;
		flex-direction: row;
		width: 100%;
		margin: 20rpx;

	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

	}

	.top--panel {
		justify-content: center;

	}

	.container {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;

		&>view {
			width: 100%;
		}

		.scroll-panel {
			flex-grow: 1;
			height: 0;
			overflow: hidden;
		}

		.bottom-panel {
			padding-bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
		}
	}


	.list-box {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		font-size: 28rpx;

		.left {
			width: 150rpx;
			background-color: #f6f6f6;
			line-height: 80rpx;
			box-sizing: border-box;
			font-size: 28rpx;

			.item {
				padding-left: 20rpx;
				position: relative;

				&:not(:first-child) {
					margin-top: 1px;

					&::after {
						content: '';
						display: block;
						height: 0;
						border-top: #d6d6d6 solid 1px;
						width: 620upx;
						position: absolute;
						top: -1px;
						right: 0;
						transform: scaleY(0.5);
						/* 1px像素 */
					}
				}

				&.active {
					color: #1E8DD5;
					background-color: #fff;
					font-weight: bold;
				}
			}

			.fill-last {
				height: 0;
				width: 100%;
				background: none;
			}
		}

		.main {
			background-color: #fff;
			padding-left: 20rpx;
			width: 0;
			flex-grow: 1;
			box-sizing: border-box;



			.title {
				line-height: 64rpx;
				font-size: 24rpx;
				font-weight: bold;
				color: #666;
				background-color: #fff;
				position: sticky;
				top: 0;
				z-index: 19;
			}

			.item {
				padding-bottom: 10rpx;
				border-bottom: #eee solid 1px;
			}

			.content-title {
				font-weight: bold;
				font-size: 40rpx;
				display: flex;
				flex-direction: row;
				width: 100%;
				height: 100rpx;


			}

			.goods {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: center;
				align-content: center;
				margin-bottom: 20rpx;
				margin-top: 20rpx;


				.goods-image {
					width: 100rpx;
					height: 100rpx;
					margin-right: 16rpx;
					margin-left: 2px;
				}

				.goods-top {
					width: 100%;
					display: flex;
					flex-direction: row;

					align-items: center;

				}

				.goods-plus {
					position: relative;
					display: flex;
					width: 150rpx;
					height: 50rpx;
					line-height: 25px;
					flex-direction: row;
					background-color: $theme-color;
					border-radius: 9.05rpx;
					align-content: center;
					text-align: center;
					vertical-align: middle;


				}

				.number {
					position: relative;
					top: -20rpx;
					font-size: 30rpx;
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
			}
		}
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


	.icon-right {
		position: relative;
		left: 120rpx;
		padding-top: 20rpx;
		height: 50rpx;
	}
	
	
	.icon-delete {
		color: #bfbfbf;
		font-size: 30rpx;
		position: relative;
		text-align: center;
		align-items: center;
	}
	
	.nomessage {
		position: relative;
		top: 500rpx;
		color: #c7c7c7;
		font-size: 40rpx;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.gotoadd {
		background-color: #1E8DD5;
		border-radius: 50rpx;
		width: 200rpx;
		height: 50rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		font-weight: bold;
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.group-remark {
		width: 600rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
