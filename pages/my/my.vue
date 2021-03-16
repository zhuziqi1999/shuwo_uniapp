<template>
	<view class="center">
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

				</view>
				<view class="order_status">
					<view class="status" v-for="item in status">
						<image class="icon" :src="item.url" mode="aspectFill"></image>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<view class="baiban">

			</view>
			<view class="center_menu">
				<view class="menu_item" v-for="item in menus">
					<image :src="item.icon" mode="aspectFill"></image>
					<text>{{item.name}}</text>
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
	export default {
		data() {
			return {
				jiaonang : ''
			};
		},
		onReady() {

			let capsuleButtonInfo = wx.getMenuButtonBoundingClientRect();
			let gap = capsuleButtonInfo.top - statusBarHeight;
			
			this.jiaonang = gap * 2 + capsuleButtonInfo.height + 4 + 'px'
			
			
		},
		methods: {

		},
		computed: {

		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.profily,
	.profily_header {
		display: flex;
		flex-direction: row;
		border-radius: 8px;
		width: 100%;
		align-items: center;
		position: relative;
		top: -50rpx;
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
		padding-left: 50rpx;
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
				width: 90%;
				// border:1px solid #F7F7F7;
				height: 300rpx;
				margin: 0 auto;
				top: -100upx;
				left: 5%;
				background: #FEFEFE;
				padding: 35upx;
				box-sizing: border-box;
				box-shadow: 0px 2px 5px #EDEDED;
			}
		}
	}

	.base {
		display: flex;
		align-items: center;
		border-bottom: 2px solid #F6F6F6;
		padding-bottom: 20rpx;
		position: relative;
		width: 100%;
		height: 40rpx;

		.profily_header {
			height: 120upx;
			width: 100%;
			background-size: 100%;
		}

		text {
			margin-left: 20px;
			font-size: 30upx;
		}

		image {
			position: absolute;
			height: 40upx;
			width: 40upx;
			right: 0px;
			top: 0px;
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
</style>
