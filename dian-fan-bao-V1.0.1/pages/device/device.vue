<template>
	<view class="body">
		<view class="title" >
			<view class="title-name" @click="t2">设备</view>
				
			<input class="search" placeholder="靠近可发现新设备" maxlength=15 />
			<view class="tian-jia" @click="tian_jia"  open-type="getUserInfo">
				<image src="../../static/saoyisao.png" class="tian-jia-img"></image>
			</view>			
		</view>
		
		<view class="list" >
			<view class="item-contain" @click="click_device(item.htd_id,item.htp_id)"  @longpress="long_press(item.htd_id)" v-for="(item) in device_arr" :key="item.htd_id">
				<image :src="item.p_icon" class="item_img"></image>
				<view class="items">
					{{item.p_name}}
				</view>
			</view>		
		</view>
		
		<view class="empty" v-if="device_arr.length==0">
			<image src="../../static/kong_xiang_zi.png"></image>
			<view>打开蓝牙，靠近可发现新设备...</view> 
			
		</view>
		
		<uni-popup ref="getUserInfo_popup" type="bottom">
			<view class="dialog-content" >
				<button  type="primary" open-type="getUserInfo" @click="getUserInfo" >微信授权登录 </button>
			</view>
		</uni-popup> 
		<uni-popup ref="find_new_popup" type="bottom">
			<view class="dialog-content" >
				<view class="find_new">发现新设备</view>
				<image :src="new_device.p_icon" class="new_img"></image>
				<view class="new_name"> {{new_device.p_name}}</view>
				<view class="new_buttx">
					<view class="btn1" @click="no_bind">取消</view>
					<view class="btn2" @click="bind(new_device.htd_id)">绑定</view>
				</view>
			</view>
		</uni-popup> 
		<uni-popup ref="delete_device_popup" type="bottom">
			<view class="dialog-content" >
				<view class="find_new">删除当前设备？</view>
				<view class="new_buttx">
					<view class="btn1" @click="cancel_delete">取消</view>
					<view class="del_btn2" @click="sure_delete">删除</view>
				</view>
			</view>
		</uni-popup> 
		<uni-popup ref="notice_open_ble_popup" type="center">
			 <uni-popup-dialog type="error" title="请打开手机蓝牙!" :duration="2000" :before-close="true" 
			 @close="close_open_ble_notice" @confirm="close_open_ble_notice"></uni-popup-dialog>
		</uni-popup> 
		<uni-popup ref="acount_login_popup" type="bottom" :maskClick="false">
				<emailLogin></emailLogin>				
		</uni-popup> 
		<button @click="open">打开弹窗</button>
	</view>
</template>

<script>
	import discover_ble from "../../js/discover_ble.js";
	import login from "../../js/login.js";
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
	import emailLogin from "../login/login.vue"
	
	var loop_id=-1;
	var count=0;
	var log_check=0;
	var search_count=0;
	var user_info;
	var device_list_num=0;
	var ble_inited=0;
	var del_htd_id='';
	var waiting_count=0;//find_new_popup;
	var find_new_device=0;
	export default {
		components: {
		        uniPopup,
		        uniPopupMessage,
		        uniPopupDialog ,
				emailLogin
		},
		data() {		
			return {
				new_device:[],
				device_arr:[]
			}
		},
		onLoad(){
			login.get_storage_user_info();
		},
		onShow(){			
			ble_inited=0;
			this.device_arr=login.get_binded_device();
			loop_id=setInterval(this.loop, 1000, '');			
		},
		onHide(){
			clearInterval(loop_id );
			discover_ble.stop_scan_ble();
		},
		methods: {

			loop(){
				count++;
				if(count%20==0){
					console.log('d1');				
				}				
				if(log_check==0)
				{
					user_info=login.get_user_info();
					console.log(user_info);
					if(user_info.waiting==1)
					{
						if(waiting_count++>8)
						{
							waiting_count=0;
							user_info.waiting=0;
						}
						return;
					}
					if(user_info.loged==0 )
					{
						//#ifdef MP-WEIXIN
						login.wx_login();
						//#endif

						//#ifdef APP-PLUS
						this.$refs.acount_login_popup.open();
						//#endif
						//
						return;
					}

					if(user_info.registed==0)
					{
						console.log('user_info.registed==0');
						this.$refs.getUserInfo_popup.open();
						return;
					}
					//#ifdef APP-PLUS
					this.$refs.acount_login_popup.close();
					//#endif
					
					login.request_binded_device();
					log_check=1;
				}	
				if(device_list_num!=login.get_binded_device().length)
				{					
					this.device_arr=login.get_binded_device();
					device_list_num=this.device_arr.length;
				}
				if(ble_inited==0)
				{
					discover_ble.start_scan_ble();
					ble_inited=1;
				}
				if(count%15==0){
					discover_ble.ble_rescan();
					login.request_binded_device();
					console.log(login.get_user_info());
					if(discover_ble.get_ble_adapter()==-1)
					{
						this.$refs.notice_open_ble_popup.open();
					}
				}
				if(count%5==0){
					if(discover_ble.get_ble_adapter()==-1)
					{
						this.$refs.notice_open_ble_popup.open();
					}
				}
				
				if(count>10 && find_new_device == 0 && discover_ble.check_find_device() == 1 )
				{					
					this.new_device=discover_ble.get_scan_device();			
					find_new_device=1;		
					this.$refs.find_new_popup.open();
					console.log(1012);					
				}

				
			},	
			getUserInfo(){
				this.$refs.getUserInfo_popup.close();
				login.user_regist();
				
			},
			tian_jia(){
				discover_ble.sao_yi_sao();
			},
			t1(){
				console.log('t1')
				
				
			},
			bind(htd_id){
				count=1;
				discover_ble.stop_scan_ble();
				find_new_device=0;
				this.$refs.find_new_popup.close();
				console.log('bind:'+htd_id);
				login.bind_device(htd_id);
				discover_ble.clear_scaned_device();
			},
			no_bind(){
				find_new_device=0;
				this.$refs.find_new_popup.close();
				discover_ble.clear_scaned_device();
			},
			t2(){
				uni.navigateTo({
				    url: '../test/test' 
				});
			},
			moveHandle(){
				
			},
			long_press(del_id){
				console.log("longpress");
				this.$refs.delete_device_popup.open();
				del_htd_id=del_id;
			},
			click_device(htd_id,htp_id){
				console.log('connect:htp_id='+htp_id+",htd_id="+htd_id);
				login.set_connect_htd_id(htd_id);
				uni.navigateTo({
				    url: '../p'+htp_id+'/p'+ htp_id
				}); 
			},
			cancel_delete(){
				this.$refs.delete_device_popup.close();
			},
			sure_delete(){
				this.$refs.delete_device_popup.close();
				login.delete_device(del_htd_id);
			},
			open(){
				this.$refs.acount_login_popup.open();
			},
			close_open_ble_notice(){
				this.$refs.notice_open_ble_popup.close();
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
		display: flex;
		align-items: center;
		flex-direction: column;
		border-radius:4.44vw 4.44vw 0 0;
		
	}
	.find_new{
		font-size: 5vw;
		margin-top: 5vw;
		margin-bottom: 5vw;
		color: rgba(0,0,0,0.9);
	}
	.new_name{
		font-size: 4vw;
		margin-top: 1vw;
		color: rgba(0,0,0,0.6);
	}
	.new_buttx{
		height: 20vw;
		width: 61.8vw;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5vw;
	}
	.new_img{
		height: 20vw;
		width: 20vw;
	}
	.btn1{
		height: 10vw;
		width: 20vw;
		background-color: rgba(0,0,0,0.1);
		display: flex;
		font-size: 4vw;
		color: #000;
		justify-content: center;
		align-items: center;
		border-radius: 1vw;
		border: solid 0.2px rgba(0,0,0,0.3);
	}
	.btn2{
		height: 10vw;
		width: 20vw;
		background-color: #007AFF;
		display: flex;
		font-size: 4vw;
		color: #fff;
		justify-content: center;
		align-items: center;
		border-radius: 1vw;
	}
	.del_btn2{
		height: 10vw;
		width: 20vw;
		background-color: #FA2A2D;
		display: flex;
		font-size: 4vw;
		color: #fff;
		justify-content: center;
		align-items: center;
		border-radius: 1vw;
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
		height: 12vw;
		width: 100vw;
		line-height: 5vw;	
		opacity: 0.8;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	
	}
	.search{
		font-size: 4vw;
		height: 9vw;
		width:65vw ;
		text-align: center;
		border: solid 0.2px rgba(0,0,0,0.2);
		background-color: #fff;
		border-radius: 1vw;
		background-image: url(../../static/shousuo.png);
		background-size:4vw 4vw ;
		background-repeat:no-repeat;
		background-position: 59vw center;
		
		
	}
	.title-name{
		margin-left: 4.44vw;
		margin-right: 5vw;
	}
	.tian-jia{
		height: 10vw;
		width: 15vw;
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
	.empty{
		height:70vw;
		width: 80vw;
		opacity: 0.1;
		font-size: 4.44vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

	}
	.empty image{
		margin-top: 5vw;
		height:50vw;
		width: 50vw;
		margin-bottom: 10vw;
	}

</style>
