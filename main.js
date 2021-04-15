import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

// 封装全局登录函数
// backpage, backtype 2个参数分别代表：
// backpage : 登录后返回的页面
// backtype : 打开页面的类型[1 : redirectTo 2 : switchTab]
Vue.prototype.checkLogin = function( backpage, backtype ){
	// 同步获取本地数据（openid、用户名）
	var SynsUserOpenid = uni.getStorageSync('UserOpenid');
	var SynsUserName = uni.getStorageSync('UserName');
	var loginRes = uni.getStorageSync('loginRes')
	if( SynsUserOpenid == '' || SynsUserName == '' || loginRes == 0){
		// 使用重定向的方式跳转至登录页面
		uni.navigateTo({url:'../login/login?backpage='+backpage+'&backtype='+backtype});

		return true;
	}
	// 登录成功、已经登录返回数组 [用户 id, 用户随机码, 用户昵称, 用户表情]
	return [SynsUserOpenid, SynsUserName, ];
}
// 定义一个全局的请求地址
// Vue.prototype.apiServer = 'http://localhost:8090/'
Vue.prototype.apiServer = 'https://shuwo.ltd/'

var windowheight =  wx.getSystemInfoSync().windowHeight    // 获取当前窗口的高度


var formatDate = function (date) {  
    var y = date.getFullYear();  
    var m = date.getMonth() + 1;  
    m = m < 10 ? ('0' + m) : m;  
    var d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    var h = date.getHours();  
    var minute = date.getMinutes();  
    minute = minute < 10 ? ('0' + minute) : minute; 
    var second= date.getSeconds();  
    second = minute < 10 ? ('0' + second) : second;  
    return y + '-' + m + '-' + d;  
}; 
