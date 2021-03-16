<script>


var windowheight =  wx.getSystemInfoSync().windowHeight    // 获取当前窗口的高度

	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		onError: function(e) {
			console.log('error', e)
		},
		
		
		methods: {
		appLoginWx() {
			// #ifdef MP-WEIXIN
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					if (~res.provider.indexOf('weixin')) {
						uni.login({
							provider: 'weixin',
							success: (res2) => {
		
								uni.getUserInfo({
									provider: 'weixin',
									success: (info) => { //这里请求接口
										console.log(res2);
										console.log(info);
		
									},
									fail: () => {
										uni.showToast({
											title: "微信登录授权失败",
											icon: "none"
										});
									}
								})
		
							},
							fail: () => {
								uni.showToast({
									title: "微信登录授权失败",
									icon: "none"
								});
							}
						})
		
					} else {
						uni.showToast({
							title: '请先安装微信或升级版本',
							icon: "none"
						});
					}
				}
			});
			//#endif
		}
	}


	
	}
</script>

<style>

</style>
