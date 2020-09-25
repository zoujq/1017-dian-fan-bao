<template>
	<view class="body">
		<view class="popup-lalay" v-show="scope_userInfo==0"  @touchmove.stop.prevent="moveHandle">
			<view class="dialog-content" >
				<button  type="primary" open-type="getUserInfo" @click="getUserInfo" >微信授权登录 </button>
			</view>
		</view>
		<view class="notice" v-show="searching==1">
			<view class="notice-img">
				<view class="loader1"></view>
			</view>			
			<view class="notic-text" >
				正在扫描附近的可添加设备...
			</view>
			
		</view>
		<view class="find_device" v-if="scan_device_num!=0">
			<view class="find_items" v-for="(item,index) in scan_list" :key="item.htd_id">
				<image :src="item.p_icon" class="d_img" ></image>
				<view class="find_content" :style="{border: index==(scan_device_num-1)?'none':''}">
					<view>{{item.p_name}}</view>
					<view class="bind_butt" @click="bind(item.htd_id)">绑定</view>
				</view>
			</view>
<!-- 			<view class="find_items">
				<image src="../../static/dianfanbao.png" class="d_img"></image>
				<view class="find_content" style="border: none;">
					<view>S1 POR</view>
					<view class="bind_butt">绑定</view>
				</view>
			</view> -->
			
		</view>
		<view class="title" >
			<view class="title-name">设备</view>	
			<view class="tian-jia" @click="tian_jia"  open-type="getUserInfo">
				<image src="../../static/tian_jia.png" class="tian-jia-img"></image>
			</view>			
		</view>
		
		<view class="list" >
			<view class="item-contain" @click="t1">
				<image src="https://server.huotiantech.com/icon/baowenbei.png" class="item_img"></image>
				<view class="items">
					电饭煲
				</view>
			</view>
			<view class="item-contain">
				<view class="items"></view>
			</view>
			<view class="item-contain">
				<view class="items"></view>
			</view>
			<view class="item-contain">
				<view class="items"></view>
			</view>
			<view class="item-contain">
				<view class="items"></view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import ble from "../../js/wx_ble.js";
	import wx_api from "../../js/wx_login.js";
	
	var loop_id=-1;
	var count=0;
	var log_check=0;
	var search_count=0;
	var last_scan_num=0;
	export default {
		data() {
		
			return {
				searching:0,
				scope_userInfo:1,
				scan_device_num:0,
				scan_list:[]
			}
		},
		onLoad(){
			wx_api.wx_login();	
		},
		onShow(){
			loop_id=setInterval(this.loop, 1000, '');
		},
		onHide(){
			clearInterval(loop_id );
		},
		methods: {
			loop(){
				count++;
				if(log_check==0)
				{
					console.log('3');
					if(wx_api.check_login()==0)
					{
						this.scope_userInfo=0;
						log_check=1;
					}
					else if(wx_api.check_login()==1)
					{
						log_check=1;
					}
				}
				if(this.searching==1)
				{
					search_count++;
					if(search_count>15)
					{
						search_count=0;
						this.searching=0;
					}
					this.scan_device_num=ble.get_scan_device_list().length;
					if(last_scan_num!=this.scan_device_num)
					{
						last_scan_num=this.scan_device_num;
						this.scan_list=ble.get_scan_device_list();
					}
					
				}
				
				
			},		
			tian_jia(){
				this.searching=1;
				last_scan_num=0;
				ble.start_scan_ble();
			},
			t1(){
				console.log('t1')
				console.log(ble.get_scan_device_list());
			}, 
			getUserInfo(){
				this.scope_userInfo=1;
				wx_api.user_regist();
				
			},
			bind(htd_id){
				console.log('bind:'+htd_id);
				ble.bind_device(htd_id);
				ble.clear_scaned_device();
			}
			
			
		}
	}
</script>

<style>
	.body{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.popup-lalay{
		position: absolute;
		height: 100vh;
		width: 100vw;
		z-index: 2;
		display: flex;
		background-color: rgba(0,0,0,0.2);
		justify-content: center;	
	}
	.dialog-content{
		width: 100vw;
		background-color: #FFFFFF;
		bottom: 0;
		position: fixed;
		display: flex;
		align-items: center;
		flex-direction: column;
		border-radius:4.44vw 4.44vw 0 0;
	}
	.notice{
		width: 100vw;
		height: 13.33vw;
		background-color:#007AFF;
		display: flex;
		align-items: center;
	}
	.notice-img{
		height: 6.11vw;
		width: 6.11vw;
		margin-left: 6.94vw;
	}

	
	
	/* -------------- loader1 -------------- */
	
	.loader1{
		position: relative;
		height: 5.55vw;
		width: 5.55vw;
		border-radius: 5.55vw;
		border: 0.21vw solid  rgba(255,255,255, .7);
	
		top: 28%;
		top: -webkit-calc(50% - 2.99vw);
		top: calc(50% - 2.99vw);
		left: 35%;
		left: -webkit-calc(50% - 2.99vw);
		left: calc(50% - 2.99vw);
	
		-webkit-transform-origin: 50% 50%;
				transform-origin: 50% 50%;
		-webkit-animation: loader1 1s linear infinite;
				animation: loader1 1s linear infinite;
	}
	
	.loader1:after{
		content: "";
		position: absolute;
		top: 0.35vw;
		left: 4.39vw;
		width: 0.76vw;
		height: 0.76vw;
		border-radius: 0.69vw;
		background-color: #fff;
	}
	
	@-webkit-keyframes loader1{
	    0%{-webkit-transform:rotate(0deg);}
	    100%{-webkit-transform:rotate(360deg);}
	}
	
	@keyframes loader1{
	    0%{transform:rotate(0deg);}
	    100%{transform:rotate(360deg);}
	}

/* -------------- loader1 end-------------- */
	
	.seraching{
		width: 10vw;
		height: 3vh;
		position: relative;  /* 注意需要为加载器定义一个相对定位的父容器 */
	}
	.notic-text{
		font-size: 33.33rpx;
		margin-left: 35.42rpx;
		color: #ffffff;
	}
	.title{
		font-size: 5vw;
		color: #000000;
		height: 10vw;
		width: 100vw;
		line-height: 5vw;	
		opacity: 0.8;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	
	}
	.title-name{
		margin-left: 4.44vw;
	}
	.tian-jia{
		height: 10vw;
		width: 20vw;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.tian-jia-img{
		height: 5vw;
		width: 5vw;
		margin-right: 4.44vw;
	}
	button{
		width: 88vw;
		margin-top: 8vw;
		margin-bottom: 8vw;
	}
	.find_device{
		width: 100vw;
		margin-top: 2.22vw;
		margin-bottom: 2.22vw;
		font-size: 5vw;
	}
	.find_items{
		width: 100vw;
		height: 13.33vw;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		align-items: center;
		
	}
	.d_img{
		height: 8.24vw;
		width: 8.24vw;
		margin-left: 4.44vw;
	}
	.find_content{
		font-size: 4vw;
		width: 82.88vw;
		margin-left: 4.44vw;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 13.33vw;
		border-bottom: 0.05vw solid rgba(0,0,0,0.3);
		
	}	

	.bind_butt{
		height: 8.24vw;
		width: 16.48vw;
		background-color: #007AFF;
		display: flex;
		font-size: 4vw;
		color: #fff;
		justify-content: center;
		align-items: center;
		margin-right: 4.44vw;
		border-radius: 1vw;
		
	}
	.list{
		display: flex;
		flex-direction: row;
		width: 91.11vw;
		flex-wrap:wrap;
		margin-top: 3.47vw;
		justify-content: space-between;
		
		
	}
	.item-contain{
		height: 26.78vw;
		width:  43.33vw;
		background-color: #fff;
		margin-bottom: 4.44vw;
		border-radius: 2.22vw;
		box-shadow: 0 0.83vw 1.67vw 0  rgba(0,0,0,0.03);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		
	}
	.item_img{
		height: 8.24vw;
		width: 8.24vw;
	}
	.items{
		font-size: 4vw;
		margin-top: 2.22vw;
	}
	
</style>
