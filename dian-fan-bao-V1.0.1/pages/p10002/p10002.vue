<template>	
	<view class="content" >
		<view class="popup-lalay" v-show="pop_show!=0" @touchmove.stop.prevent="moveHandle">
			<view class="dialog-connect-fail" v-show="pop_show==1" >
				<view class="d-title">{{lan['Lan01']}}</view>
				<view class="d-content">
					<view class="please">{{lan['Lan02']}}</view>
					<view>
						{{lan['Lan03']}}<br/>
						{{lan['Lan04']}}
					</view>					
				</view>
				<view class="d-footer-container">
					<view class="chongshi" @click="shao_hou_retry">{{lan['Lan05']}}</view>
					<view class="line"></view>
					<view class="like" @click="like_chong_lian">{{lan['Lan06']}}</view>
				</view>
			</view>
			<view class="set-food-mode" v-show="pop_show==2" @touchmove.stop.prevent="moveHandle">
				<view class="d-title1">饮水提醒</view>
				<view class="detail">设置每天提醒喝水杯数</view>
				<view class="d-content1">	
					<picker-view   indicator-class="pick-select" mask-class='mask-c'  value="0" @change="notice_change">
						<picker-view-column>
							<view  class="item"  v-for="(item,index) in notice_mode" :key="index">{{item}} </view>
						</picker-view-column>						
					</picker-view>				
				</view>
				<view class="d-footer-container">
					<view class="chongshi" @click="qu_xiao">取消</view>
					<view class="line"></view>
					<view class="like" @click="que_ding_notice">确定</view>
				</view>
			</view>
			<view class="set-food-mode" v-show="pop_show==3" @touchmove.stop.prevent="moveHandle">
				<view class="d-title1">灯光时长</view>
				<view class="detail">设置触摸后温度显示时长</view>
				<view class="d-content1">	
					<picker-view   indicator-class="pick-select" mask-class='mask-c'  value="0" @change="light_change">
						<picker-view-column>
							<view  class="item"  v-for="(item,index) in light_mode" :key="index">{{item}}S</view>
						</picker-view-column>						
					</picker-view>				
				</view>
				<view class="d-footer-container">
					<view class="chongshi" @click="qu_xiao">取消</view>
					<view class="line"></view>
					<view class="like" @click="que_ding_light">确定</view>
				</view>
			</view>
		</view>
		<view class="error-notice" v-show="ble_state == 2 && battery<15 && charging==0">
			<image class="error-notice-img" ></image>
			<view class="notic-text">
			电量过低，请及时充电！</view>
		</view>
		<image class="idimg" src="../../static/shuibei/jiuzan-m.png"></image>
		<image class="logo" ></image>
		
		<view class="cup-state" >
			<view class="connect-state" >
				{{ble_state==0 ? '未连接' : ble_state==1 ? '连接中...' : '已连接'}}
			</view>
			<view class="temp-state" :class="[ble_state == 2 ? 'temp-state-show' : '']">
				<view class="temp-num">
					<view class="temp-num-v" :style="{color:temp<30? '#007DFF' : temp<50? '#FFBF00' : '#FA2A2D' }" >{{temp}}</view>
					<view class="temp-num-c" >℃</view>
				</view>
				<view class="temp-shuiwen" >{{lan['Lan09']}}</view>
				
			</view>
			<view class="state-con">
				<view class="loading-state" v-show ="ble_state==1" ><loading></loading></view>
				<view class="battery-state" v-show ="ble_state==2">
					<view class="battery-container"  :class="[battery <= 15 ? 'battery-low' : '']">
						<view class="battery-show" :class="[battery <= 15 ? 'battery-show-low':'']" v-bind:style="{width:(battery*31.25/100) + 'rpx'}"></view>
					</view>
					
					<image class="charging" :class="[charging ? 'charging-show':'']"></image>
					<view class="battrey_v" :class="[ battery <= 15 ? 'battrey_v-low':'']">{{battery}}%</view>
				</view>
				<view class="re-connect" v-show="ble_state==0"  @click='re_connect'>立即重连</view>
			</view>
			
		</view>
		<view class="cup-set"  :class="[ble_state != 2 ? 'cup-set-disabled':'']" >
			<view class="water-notice" @click="set_notice">
				<view class="notice-text">饮水提醒</view>
				<image class="notice-icon" :class="[notice_value==0 ? 'not-notice':'']"></image>
			</view>
			<view class="light-set" @click="set_light">
				<view class="light-text">
					<view class="light-title">灯光时长</view>
					<view class="light-value">{{light_value}}秒</view>
				</view>
				<image class="light-icon"></image>
			</view>
			
		</view>
	</view>
</template>

<script>
	import loading from "../loading/loading";
	import lan_data from "../../static/language/language.js";
	import connect_ble from "../../js/connect_ble.js";
	import login from "../../js/login.js";
	
	
	var main_count=0;
	var re_connect_counter=16;
	var loop_id=-1;
	var light_value;
	var notice_value;
	export default { 
		components: {
			loading
		},
		data() {
			return {
				pop_show: 0,
				lan:lan_data.cn ,
				ble_state:2,
				temp:0,
				battery:0,				
				charging:0,
				errcode:0,
				notice_mode:['关闭提醒','健康饮水(6杯)','养生饮水(8杯)','美容饮水(10杯)'],
				light_mode:[2,3,4,5,6,7,8,9,10],
				light_value:3,
				notice_value:0,
				
			}
		},
		onUnload() {
			clearInterval(loop_id );
			connect_ble.stop_ble();			
		},
		onHide(){
			clearInterval(loop_id );
			connect_ble.stop_ble();
			console.log('index onHide');
			
		},
		onShow(){
			loop_id= setInterval(this.loop, 1000, '');
			this.ble_state=1;
			console.log('index onShow');
			connect_ble.start_ble();
			re_connect_counter=0;
			connect_ble.set_on_received_data_callback(this.on_received_data);
		},
		methods: {
			loop(){
				console.log('p2:'+re_connect_counter);				
				if(this.ble_state==1 && re_connect_counter<30)
				{
					re_connect_counter++;	
					if(re_connect_counter%8==0){
						connect_ble.stop_ble();
						connect_ble.start_ble();
					}
					if(re_connect_counter==30)
					{
						this.ble_state=0;
						this.pop_show=1;
					}
				}
				if(connect_ble.get_ble_state()==0 && this.ble_state==1)
				{
					connect_ble.stop_ble();
					connect_ble.start_ble();
				}
				if(connect_ble.get_ble_state()==0 && this.ble_state==2)
				{
					this.ble_state=1;
					this.food_mode=0;
					connect_ble.stop_ble();
					connect_ble.start_ble();
				}
				if(this.ble_state!=2 && connect_ble.get_ble_state()==2)
				{
					this.ble_state=2;
					re_connect_counter=0;
				}
				if(this.ble_state==2)
				{
					this.check_cup_state();
				}			
			},
			on_received_data(js_arr){
				console.log(js_arr);
				if(js_arr[0]!=0xC8 || js_arr[1]!=3){
					return;
				}
				this.temp=js_arr[2];
				this.battery=js_arr[3];
				this.charging=js_arr[4];
				this.notice_value=js_arr[5];
				this.light_value=js_arr[6];			
				
			},
			shao_hou_retry(e){
				this.pop_show='';
			},
			like_chong_lian(e){
				this.pop_show='';
				this.re_connect();

			},
			re_connect(){
				this.ble_state=1;
				re_connect_counter=0;
				connect_ble.stop_ble();
				connect_ble.start_ble()
			},			
			check_cup_state(){
				connect_ble.send_to_device([0xC8,0x03]);
			},
			t1(){
				uni.redirectTo({
				    url: '../connect/connect'
				});
			},
			qu_xiao(){
				this.pop_show=0;
			},
			notice_change(e){
				const val = e.detail.value
				notice_value=val[0];
			},
			light_change(e){
				const val = e.detail.value
				light_value=val[0]+2;
			},
			que_ding_light(){
				this.pop_show=0;
				connect_ble.send_to_device([0xC8,0x02,light_value]);
			},
			que_ding_notice(){
				this.pop_show=0;
				connect_ble.send_to_device([0xC8,0x01,notice_value]);
			},
			set_notice(){
				this.pop_show=2;
			},
			set_light(){
				this.pop_show=3;
			},
			moveHandle(){
				
			}
			
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;		
	}
	.nav{
		height: 166.67rpx;
		width: 750rpx;
	}
	.popup-lalay{
		position: absolute;
		height: 100vh;
		width: 100vw;
		z-index: 2;
		background-color: rgba(0,0,0,0.2);
		justify-content: center;	
		display: flex;
	}
	.d-title1{
		margin-top: 3.33vw;
		height: 7.4vw;
		width: 583.33rpx;
		font-size: 5.56vw;
		line-height: 7.4vw;
		opacity: 0.9;
	}
	.detail{
		font-size: 4.44vw;
		text-align: left;
		width: 583.33rpx;
		opacity: 0.6;
		margin-top: 0.5vw;
	}
	.d-content1{
		height: 55.55vw;
		width: 38.89vw;
		font-size: 4.44vw;
		/* background-color: #007AFF; */
		margin-top: 1.67vw;
	
	}
	.set-food-mode{
		height: 600rpx;
		width: 683.33rpx;
		background-color: #FFFFFF;
		bottom: 33.33rpx;
		position: fixed;
		border-radius: 33.33rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.d-footer-container{
		height: 50rpx;
		width: 583.33rpx;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		font-size: 33.33rpx;
		color: #007DFF;
		margin-top: 100rpx;
		margin-bottom: 36rpx;
	}
	picker-view {
	    width: 38.89vw;
	    height: 43vw;
		padding: 0;
	}
	picker-view .item{
		width: 38.89vw;
		height: 10vw;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 5vw;
	}
	.pick-select{
		height: 15.7vw;
		line-height: 15.7vw;
		font-size: 5vw;
		color: #007DFF;
	}
	.dialog-connect-fail{
		height: 392.71rpx;
		width: 683.33rpx;
		background-color: #FFFFFF;
		bottom: 33.33rpx;
		position: fixed;
		border-radius: 33.33rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.d-title{
		height: 116.67rpx;
		width: 583.33rpx;
		font-size: 41.67rpx;
		line-height: 116.67rpx;
	}
	.please{
		margin-bottom: 1.5rpx;
	}
	
	.d-content{
		height: 142.71rpx;
		width: 583.33rpx;
		font-size: 33.33rpx;

	}
	.d-footer-container{
		height: 50rpx;
		width: 583.33rpx;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		font-size: 33.33rpx;
		color: #007DFF;
		margin-top: 52.60rpx;
	}
	.chongshi{
		height: 50rpx;
		width: 266.67rpx;
		text-align: center;
		line-height: 50rpx;
	}
	.line{
		border-right: 1px solid #e5e5e5;
		height: 50rpx;
		width: 1px;
		transform: scaleX(0.5);
	}
	.like{
		height: 50rpx;
		width: 266.67rpx;
		text-align: center;
		line-height: 50rpx;
		/* background-color: #007AFF; */
	}

	.error-notice{
		width: 750rpx;
		height: 100rpx;
		background-color:rgba(251,42,45,0.05);
		align-items: center;
		display: flex;
	}

	.error-notice-img{
		height: 45.83rpx;
		width: 45.83rpx;
		margin-left: 52.08rpx;
		background-image: url(../../static/error_notice.png);
		background-size: cover;
	}
	.error-notice-show{
		display: flex;
	}

	.notic-text{
		font-size: 33.33rpx;
		margin-left: 35.42rpx;
		color: #FB2A2D;
	}

	.idimg{
		height: 525rpx;
		width:  525rpx;
/* 		background-image: url(../../static/xxhdpi/idimg.png) ; */
		background-size:cover;
	}

	.logo {
		height: 36rpx;
		width: 145.83rpx;
		background-image:url(../../static/shuibei/jiuzan.png);
		background-size:cover;
	}
	.cup-state{
		width: 583.33rpx;
		height: 183.33rpx;
		background-color: #FFFFFF;
		margin-top:20.83rpx ;
		box-shadow: 0 6.25rpx 12.5rpx 0 rgba(0,0,0,0.03);
		border-radius: 16.67rpx;
		display: flex;
		flex-direction: row;
		justify-content:space-between;
		align-items: center;
		padding-left: 50rpx;
		padding-right: 50rpx;
	}	
	.connect-state{
		height: 50rpx;
		width: 182rpx;
		/* background-color: #999999; */
		opacity: 0.9;
		font-size: 37.5rpx;
		color: #0000000;
		line-height: 52rpx;
	}
	.temp-state{
		height: 104.69rpx;
		width: 163.54rpx;
		/* background-color: #999999; */
	/* 	margin-left: 97.4rpx;
		margin-right: 79.17rpx; */
		display: flex;
		flex-direction: column;
		visibility: hidden;
		
	}
	.temp-state-show{
		visibility:visible;
	}
	.temp-num{
		height: 66.66rpx;
		width: 163.54rpx;
		/* background-color:#007AFF; */
		display: flex;
		flex-direction: row;
		justify-content: center;
		text-align: right;
	}
	.temp-num-v{
		font-size:50rpx ;
		font-weight: bold;
		/* width: 56.25rpx; */
		height:66.66rpx;
		color: #000;
		margin-right:5rpx ;
	}
	.temp-num-c{
		font-size: 25rpx;
		opacity: 0.6;
		width: 25rpx;
		height: 33.33rpx;
		line-height: 33.33rpx;
		align-self: flex-end;
		margin-bottom:7.81rpx;
		color: #000;
	}
	.temp-shuiwen{
		font-size: 25rpx;
		height: 32.3rpx;
		width: 163.54rpx;
		text-align: center;
		margin-top: -5.7rpx;
		color: #000000;
		opacity: 0.6;
	}
	.cup-set {
		margin-top: 2.22vw;
		display: flex;
		height: 17.78vw;
		width: 91.11vw;
		flex-direction: row;
		justify-content: space-between;
		
	}
	.water-notice{
		height: 17.78vw;
		width: 44.44vw;
		background-color: #FFF;
		box-shadow: 0.35vw 0.69vw 1.39vw 0 rgba(0,0,0,0.05);
		border-radius: 2.22vw;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.notice-text{
		font-size: 4.44vw;
		margin-left: 6.67vw;
	}
	.notice-icon{
		background-image: url(../../static/shuibei/ic_tishi.png);
		background-size: cover;
		height: 6.11vw;
		width: 5.29vw;
		margin-right: 7.36vw;
		
	}
	.not-notice{
		background-image: url(../../static/shuibei/img_tixing.png);
	}
	.light-set{
		height: 17.78vw;
		width: 44.44vw;
		background-color: #FFF;
		box-shadow: 0.35vw 0.69vw 1.39vw 0 rgba(0,0,0,0.05);
		border-radius: 2.22vw;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.light-text{
		margin-left: 6.67vw;
		
	}
	.light-title{
		font-size: 4.44vw;
	}
	.light-value{
		font-size: 3.33vw;
		color: #007DFF;
	}
	.light-icon{
		background-image: url(../../static/shuibei/ic_zhishideng_pre.png);
		background-size: cover;
		height: 6.11vw;
		width: 6.11vw;
		margin-right: 6.94vw;
	}
	.cup-set-disabled{
		 pointer-events: none;
		 opacity: 0.6;
	}
	.state-con{
		height: 130.73rpx;
		width: 182rpx;
		display: flex;
		justify-content: flex-end;	
		align-items:center;
		flex-direction: row;
	}
	.loading-state{
		height:63rpx;
		width: 63rpx;
		/* background-color: #999999; */
		justify-content: flex-end;
		align-items:center;
		position: absolute;
		top:643rpx;
		right:83.6rpx;
	}

	.battery-state{
		height: 48.96rpx;
		width: 182rpx;
		/* background-color: #999999; */
		flex-direction: row;	
		align-items: center;
		justify-content: flex-end;	
		display: flex;
	}
	.battery-container
	{
		height: 23rpx;
		width: 43.8rpx;
		background-image: url(../../static/battery.png) ;
		background-repeat:no-repeat;
		/* background-color: #F0AD4E; */
		background-size: cover;
		display: flex;
		justify-content: left;
		align-items: center;		
	}	
	.battery-low{
		background-image: url(../../static/battery_low.png) ;
	}
	.battery-show{
		height: 16rpx;
		width: 0rpx;
		background-color: #1A1A1A;
		border-radius: 2rpx;
		margin-left: 5.2rpx;
		
	}
	.battery-show-low{
		background-color: #FB2A2D;
	}
	.charging{
		width: 17.19rpx;
		height: 22.91rpx;
		display: none;
		background-image: url(../../static/charging.png);
		background-size: cover;
		margin-left: 5rpx;
	}
	.charging-show{
		display: flex;
	}
	.battrey_v{
		font-size: 37.5rpx;
		margin-left: 15.1rpx;	
	}
	.battrey_v-low{
		color:#FB2A2D; 
	}
	.re-connect{
		font-size: 29.17rpx;
		color: #007DFF;
		height: 40.63rpx;
		width: 132.3rpx;
		justify-content: flex-end;	
	}
	.re-connect-show{
		display: flex;
	}
	.cup-set-title{
		height:48.96rpx ;
		width: 583.34rpx;
		/* background-color: #4CD964; */
		margin-top: 30.73rpx;
		font-size: 37.5rpx;
	}
	.cup-set-container{
		width: 650rpx;
		height: 333.34rpx;
		display: flex;
		flex-direction: row;
		/* background-color:#555555; */
		margin-top: 41rpx;
		flex-wrap: wrap;
	}
	.cup-set-item{
		width: 162.5rpx;
		height: 133.84rpx;
		/* background-color: #DD524D; */
		margin-bottom: 32.81rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.set-icon{
		height: 78.65rpx;
		width: 78.65rpx;
		border-radius: 50%;
		/* background-color: #4CD964; */
		border:2.09rpx solid rgba(0,0,0,0.2);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.set-icon-pressed{
		border:2.09rpx solid rgba(0,125,255,0.2);
	}
	.set-icon image{
		height: 56rpx;
		width: 56rpx;
		background-size: cover;
	}

	.item-name
	{
		height: 32.81rpx;
		width: 145.83rpx;
		color: #1A1A1A;
		font-size: 25rpx;
		text-align: center;
		line-height: 32.81rpx;
		margin-top: 18.23rpx;
	}
	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

</style>
