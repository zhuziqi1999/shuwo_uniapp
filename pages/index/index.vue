<template>

	<view class="content" >
		
		<ygc-comment ref="ygcComment" 
		        :placeholder="'发布评论'" 
		        @pubComment="pubComment" style="z-index: 999;"></ygc-comment>
		
		<view class="content-plus">
			<view class="content-plus-flex">
				<text class="icon icon-plus">&#xf081;</text>
			</view>
			
		</view>

		<mSearch @search="search($event,0)" style="justify-content: center;width: 100%;"></mSearch>
		<scroll-view white-space=nowrap; scroll-x="false" enable-back-to-top="true" refresher-background="#cdcdcd"
			scroll-y :style="{height:content_height+'px',}" class="content-scroll">

			<view class="content-list" hover-class="content-list-hover" v-for="(item,index) in content_list"
				:key="index">
				<view class="content-title">

					<image class="content-avatar" src="../../static/go.jpg"></image>
					<view class="content-name-from">
						<view class="content-username">{{item.name}}</view>
						<view class="content-share-from">发布自{{item.from}}</view>
					</view>
					<view class="content-share-time">{{item.time}}</view>
					<image class="content-share-more" src="../../static/ellipsis-h.png"></image>

				</view>

				<view class="content-share-word">{{item.word}}</view>

				<image class="content-share-image" mode="scaleToFill" src="../../static/1614174681858.jpg">
					</iamge>

					<view class="content-operate">
						<image src="../../static/heart1.png" v-if="item.like == 0" class="content-operate-icon"></image>
						<image src="../../static/heart.png" v-if="item.like == 1" class="content-operate-icon"></image>
						<image src="../../static/comments1.png" v-if="comments == 0" class="content-operate-icon" @click="toggleMask('show')">
						</image>
						<image src="../../static/bookmark1.png" v-if="item.bookmark == 0" class="content-operate-icon">
						</image>
						<image src="../../static/bookmark.png" v-if="item.bookmark == 1" class="content-operate-icon">
						</image>
					</view>

			</view>
		</scroll-view>
		<navigator url="../login/login" v-if="loginRes == 0"><button type="default">授权登录界面</button></navigator>
	</view>

</template>

<script>
	import mSearch from '@/components/mehaotian-search/mehaotian-search.vue';
	import ygcComment from '@/components/ygc-comment/ygc-comment.vue';
	
	var loginRes = uni.getStorageSync('loginRes')
	var SynsUserOpenid = uni.getStorageSync('UserOpenid')
	var SynsUserName = uni.getStorageSync('UserName')
	var windowheight = wx.getSystemInfoSync().windowHeight + 'px'
	var loginflag = 0
	var comments = 0
	export default {
		components: {
			mSearch,
			ygcComment
		},

		data() {
			return {
				// spanStyle: {
				//    "--windowheight": uni.getSystemInfoSync().windowHeight
				// },
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

				content_list: [{
					id: 1,
					name: "小尘埃呀。",
					from: "推理世界",
					time: "14:10",
					word: "在黎明前最黑暗的时刻，贝丝依偎在温暖的怀抱中，在她来到人世后吸进第一口气的地方，静静地咽下了最后一口气，没有道别，只有深情的一瞥，加上一声轻叹。",
					like: 1,
					bookmark: 1
				}, {
					id: 2,
					name: "小尘埃呀。",
					from: "推理世界",
					time: "14:10",
					word: "在黎明前最黑暗的时刻，贝丝依偎在温暖的怀抱中，在她来到人世后吸进第一口气的地方，静静地咽下了最后一口气，没有道别，只有深情的一瞥，加上一声轻叹。",
					like: 0,
					bookmark: 0
				}, {
					id: 3,
					name: "小尘埃呀。",
					from: "推理世界",
					time: "14:10",
					word: "在黎明前最黑暗的时刻，贝丝依偎在温暖的怀抱中，在她来到人世后吸进第一口气的地方，静静地咽下了最后一口气，没有道别，只有深情的一瞥，加上一声轻叹。",
					like: 1,
					bookmark: 1
				}, {
					id: 4,
					name: "小尘埃呀。",
					from: "推理世界",
					time: "14:10",
					word: "在黎明前最黑暗的时刻，贝丝依偎在温暖的怀抱中，在她来到人世后吸进第一口气的地方，静静地咽下了最后一口气，没有道别，只有深情的一瞥，加上一声轻叹。",
					like: 0,
					bookmark: 0
				}]

			}


		},
		onLoad() {
			// 加载定义好的方法
			this.content_height = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().windowWidth * (95 / 750);
			if (SynsUserOpenid == null || SynsUserName == null || loginRes == 0) {
				loginRes = this.checkLogin('../index/index', 2);
			}

			// 没有登录成功，返回空
			if (!loginRes) {
				console.log("fail")
				return;
			}

		},
		// onReady() {
		// 	 let _this = this;
		// 	        uni.getSystemInfo({
		// 	            success(res) {
		// 	                _this.phoneHeight = res.windowHeight;
		// 	                console.log(res.windowHeight);
		// 	                // 计算组件的高度
		// 	                let view = uni.createSelectorQuery().select('.hd-height');
		// 	                view.boundingClientRect(data => {
		// 	                    _this.navHeight = data.height;
		// 	                    console.log(_this.navHeight);
		// 	                    _this.scrollviewHigh = _this.phoneHeight - _this.navHeight;
		// 	                }).exec();
		// 	            }
		// 	        });
		// 	        console.log('w' + this.scrollviewHigh);
		// },
		methods: {
			toggleMask(type) {
				this.$refs.ygcComment.toggleMask(type);
			},
			search(e, val) {
				console.log(e, val);
				this['val' + val] = e;
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
		border: #333333 1rpx;

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
		width: auto;
		height: 30rpx;
		font-size: 27rpx;
		left: 280rpx;
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
</style>
