<template>
	<view>
		<!-- login view html start -->
		<view>
			<view>
				<view class="header">
					<image src="/static/logo5.png"></image>
				</view>
				<view class="content">
					<view>申请获取以下权限</view>
					<text>获得你的公开信息(昵称，头像、地区等)</text>
				</view>
				<button class="bottom" type="primary" open-type="getUserInfo" withCredentials="true" lang="zh_CN"
					@getuserinfo="wxGetUserInfo">授权登录</button>
			</view>
		</view>
		<!-- login view html end -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				appid: 'wx4de56d6b47216c84',
				secret: '5f3c5d0f8341e036a11cb4d15f8c2ccf',
				code: '',
				sessionKey: '',
				openId: '',
				userInfo: {
					avatarUrl: '',
					city: '',
					country: '',
					gender: 1,
					language: '',
					nickName: ''
				},
				pageOption: {}
			};
		},
		onLoad(options) {
			// 接收跳转的参数
			this.pageOption = options
			//默认加载
			this.login();
		},
		methods: {
			// 第一授权获取用户信息 ===》按钮触发
			wxGetUserInfo() {
				let _self = this;
				// 1.获取用户的信息
				uni.getUserInfo({
					provider: 'weixin',
					success: (infoRes) => {
						_self.userInfo = infoRes.userInfo
						

						// 2.提交数据到后台、写入数据库
						uni.request({
							url: _self.apiServer + 'appletsUserInfo',
							header: {
								'content-type': 'application/json',
							},
							dataType: "json",
							data: {
								useropenid: _self.openId,
								username: _self.userInfo.nickName,
								useravatarurl: _self.userInfo.avatarUrl
								
							},
							method: 'POST',
							success: res => {
								
								
									uni.hideLoading();
									uni.showToast({
										title: '登录成功',
										icon: 'success',
										duration: 2000
									})
								if (res.data.code == 0) {
									uni.showToast({
										title: res.data.message,
										icon: 'none'
									});
									return false;
								}
								// 用户信息写入缓存
								
								// 已经授权了、查询到用户的数据了
								if (res.data.code == 1) {
									// 用户信息写入缓存
									
									uni.setStorageSync('loginRes', 1);
								
									uni.switchTab({
										url: '../index/index'
									})

								}

								console.log(res.data)
								
							},
							fail: () => {
								uni.showToast({
									title: '用户信息操作失败',
									icon: 'none'
								});
							}
						});
					},
					fail: () => {
						uni.showToast({
							title: '获取用户信息失败',
							icon: 'none'
						});
					}
				});
				return false
			},
			login() {
				let _self = this;

				// 0. 显示加载的效果
				uni.showLoading({
					title: '加载中...'
				});
				uni.login({
					provider: 'weixin',
					success: loginRes => {
						_self.code = loginRes.code;
						console.log(_self.appid)
						console.log(_self.secret)
						console.log(_self.code)
						// 2. 将用户登录code传递到后台置换用户SessionKey、OpenId等信息
						uni.request({

							url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' +
								_self.appid + '&secret=' + _self.secret + '&js_code=' + _self.code +
								'&grant_type=authorization_code',
							success: codeRes => {
								console.log(codeRes);

								_self.openId = codeRes.data.openid;
								_self.sessionKey = codeRes.data.session_key;

								uni.setStorageSync('UserOpenid', _self.openId);
								uni.setStorageSync('UserSession', _self.sessionKey);

								// 3.通过 openId 判断用户是否授权
								uni.request({
									url: _self.apiServer + 'loginApplets',
									header: {
										'content-type': 'application/json',
									},
									dataType: "json",
									data: {
										"username": _self.nickName,
										"useropenid": _self.openId,
										
									},
									
									method: 'POST',
									success: openIdRes => {
										console.log(openIdRes);
										// 隐藏loading
										uni.hideLoading();
										// 还没授权登录、请先授权然后登录
										if (openIdRes.data.code == 0) {
											// 提示消息、让用户授权
											uni.showToast({
												title: openIdRes.data.msg,
												icon: 'none'
											});
										}
										
									},
									fail: () => {
										uni.showToast({
											title: '获取授权信息失败',
											icon: 'none'
										});
										return false;
									}
								});
							},
							fail: (codeRes) => {
								console.log(codeRes.errMsg)
								uni.showToast({
									title: '获取 SesssionKey OpenId 失败',
									icon: 'none'
								});
								return false;
							}
						});
					},
					fail: () => {
						uni.showToast({
							title: '获取 code 失败',
							icon: 'none'
						});
						return false;
					}
				});
				return false;
			}
		}

	};
</script>
<style>
	.header {
		margin: 90rpx 0 90rpx 50rpx;
		border-bottom: 1px solid #ccc;
		text-align: center;
		width: 650rpx;
		height: 300rpx;
		line-height: 450rpx;
	}

	.header image {
		width: 200rpx;
		height: 200rpx;
	}

	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.bottom {
		border-radius: 80rpx;
		margin: 70rpx 50rpx;
		font-size: 35rpx;
	}
</style>
