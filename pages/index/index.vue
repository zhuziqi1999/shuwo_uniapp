<template>

	<view class="content" >


		<mSearch @search="search($event,0)"></mSearch>
		
		<scroll-view white-space=nowrap; scroll-y="true" scroll-x="false" enable-back-to-top="true" refresher-background="#cdcdcd"  class="content-scroll">
		
		<view class="content-list" hover-class="content-list-hover" v-for="(item,index) in content_list" :key="index">
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
			
			<image class="content-share-image" mode="scaleToFill" src="../../static/1614174681858.jpg"></iamge>
		</view>
		</scroll-view>
		<navigator url="../login/login" v-if="loginRes == 0"><button type="default">授权登录界面</button></navigator>
	</view>

</template>

<script>
	import mSearch from '@/components/mehaotian-search/mehaotian-search.vue';
	var loginRes = uni.getStorageSync('loginRes')
	var SynsUserOpenid = uni.getStorageSync('UserOpenid')
	var SynsUserName = uni.getStorageSync('UserName')
	var loginflag = 0
	export default {
		components: {
			mSearch
		},
		
		data() {
			return {
				loginRes,
				SynsUserOpenid,
				SynsUserName,
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
					word: "在黎明前最黑暗的时刻，贝丝依偎在温暖的怀抱中，在她来到人世后吸进第一口气的地方，静静地咽下了最后一口气，没有道别，只有深情的一瞥，加上一声轻叹。"
				},{
					id: 2,
					name: "小尘埃呀。",
					from: "推理世界",
					time: "14:10",
					word: "在黎明前最黑暗的时刻，贝丝依偎在温暖的怀抱中，在她来到人世后吸进第一口气的地方，静静地咽下了最后一口气，没有道别，只有深情的一瞥，加上一声轻叹。"
				},{
					id: 3,
					name: "小尘埃呀。",
					from: "推理世界",
					time: "14:10",
					word: "在黎明前最黑暗的时刻，贝丝依偎在温暖的怀抱中，在她来到人世后吸进第一口气的地方，静静地咽下了最后一口气，没有道别，只有深情的一瞥，加上一声轻叹。"
				},{
					id: 4,
					name: "小尘埃呀。",
					from: "推理世界",
					time: "14:10",
					word: "在黎明前最黑暗的时刻，贝丝依偎在温暖的怀抱中，在她来到人世后吸进第一口气的地方，静静地咽下了最后一口气，没有道别，只有深情的一瞥，加上一声轻叹。"
				}]

			}


		},
		onLoad() {
			// 加载定义好的方法
			
			console.log(windowheight)
			if (SynsUserOpenid == null || SynsUserName == null || loginRes == 0) {
				loginRes = this.checkLogin('../index/index', 2);
			}

			// 没有登录成功，返回空
			if (!loginRes) {
				console.log("fail")
				return;
			}

		},
		methods: {
			search(e, val) {
				console.log(e, val);
				this['val' + val] = e;
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

	.content-scroll {
		width: 100%;
		height: var(windowheight);
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
		margin-bottom: 40rpx;
	}
</style>
