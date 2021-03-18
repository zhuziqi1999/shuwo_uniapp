<template>
	
	
	<view class="content">
		<mSearch @search="search($event,0)" ></mSearch>
		
		<view class="content-plus">
			<view class="content-plus-flex">
				<text class="icon icon-plus">&#xf081;</text>
			</view>
			
		</view>
		
		<ren-dropdown-filter :filterData='filterData' :defaultIndex='defaultIndex'
		@onSelected='onSelected' @dateChange='dateChange' style="width: 100%;"></ren-dropdown-filter>
		
		
		<scroll-view white-space=nowrap; scroll-x="false" enable-back-to-top="true" refresher-background="#cdcdcd"
			scroll-y :style="{height:content_height+'px',}" class="content-scroll">
			<view class="content-list" hover-class="content-list-hover" v-for="(item,index) in content_list"
				:key="index" >
				<image v-if="item.is_filefold == 1 && item.file_type==0" src="../../static/fold.png" class="file-img" mode="scaleToFill"></image>
				<image v-if="item.is_filefold == 0 && item.file_type==1" src="../../static/W.png" class="file-img" mode="scaleToFill"></image>
				<image v-if="item.is_filefold == 0 && item.file_type==2" src="../../static/P.png" class="file-img" mode="scaleToFill"></image>

				<view class="file-infor">
					<view class="file-name">{{item.file_name}}</view>
					<view class="file-time">{{item.file_time}}</view>
				</view>
			</view>
		</scroll-view>	
	</view>
</template>

<script>
	import mSearch from '@/components/mehaotian-search/mehaotian-search.vue'
	import RenDropdownFilter from '@/components/ren-dropdown-filter/ren-dropdown-filter.vue'
	export default {
		components: {
		        mSearch,
				RenDropdownFilter
		    },
		
		data() {
			return {
				content_height: '',
				val0: '',
				val1: '',
				val2: '',
				val3: '',
				placeholder:'动态占位内容',
				// 筛选
				filterData:[
				    [{ text: '排序', value: '' }, { text: '按修改时间', value: 1 }, { text: '按文件名', value: 2 }],
				    [{ text: '文件类型', value: '' }, { text: 'Word文件', value: 1 }, { text: 'PDF文件', value: 2 }]
				],
				content_list:[{
					id: 1,
					is_filefold: 1,
					file_type : 0,
					file_name : '奥里给1',
					file_time : '2020/03/17'
				},
				{
					id: 2,
					is_filefold: 1,
					file_type : 0,
					file_name : '奥里给2',
					file_time : '2020/03/17'
				},
				{
					id: 3,
					is_filefold: 1,
					file_type : 0,
					file_name : '奥里给3',
					file_time : '2020/03/17'
				},
				{
					id: 4,
					is_filefold: 0,
					file_type : 1,
					file_name : 'word文件1',
					file_time : '2020/03/17'
				},
				{
					id: 5,
					is_filefold: 0,
					file_type : 1,
					file_name : 'word文件2',
					file_time : '2020/03/17'
				},
				{
					id: 6,
					is_filefold: 0,
					file_type : 2,
					file_name : 'PDF文件1',
					file_time : '2020/03/17'
				},
				{
					id: 7,
					is_filefold: 0,
					file_type : 2,
					file_name : 'PDF文件2',
					file_time : '2020/03/17'
				}
				
				],
				defaultIndex:[0,0]
			}
		},
		onLoad() {
			this.content_height = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().windowWidth * (95 / 750);
		},
		methods: {
			search(e, val) {
				console.log(e, val);
				this['val'+val] = e;
			},
			onSelected(res){
			    uni.showToast({
			        icon:'none',
			        title:'控制台查看筛选结果'
			    })
			},
			dateChange(d){
			   uni.showToast({
			       icon:'none',
			       title:d
			   })
			},
		},
	};
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
	}
	
	.content-list {
		display: flex;
		flex-direction: row;
		
		width: 100%;
		background-color: #FFFFFF;
		position: relative;
		top: 59px;
		height: 110rpx;
	}
	
	.file-img {
		padding-left: 20rpx;
		width: 100rpx;
		height: 110rpx;
	}
	
	.file-infor {
		display: flex;
		flex-direction: column;
		text-align: left;
		padding-top: 20rpx;
	}
	
	.file-name {
		font-weight: bold;
		font-size: 30rpx;
		padding-left: 20rpx;
	}
	
	.file-time {
		font-size: 22rpx;
		font-weight: bold;
		color: #808080;
		padding-left: 20rpx;
		padding-top: 10rpx;
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
