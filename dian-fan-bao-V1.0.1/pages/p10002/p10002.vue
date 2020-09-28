<template>	
	<view class="content" >
		<view class="popup-lalay" :class="[pop_show]">
			<view class="dialog-connect-fail"  >
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
		</view>
		<view class="error-notice" :class="[ (errcode & 7) != 0 ? 'error-notice-show' : '']">
			<image class="error-notice-img" ></image>
			<view class="notic-text">
			{{(errcode & 1) ? lan['Lan07'] : (errcode & 2) ? lan['Lan33'] :  (errcode & 4) ? lan['Lan32'] : ''}}</view>
		</view>
		<image class="idimg" src="../../static/shuibei/jiuzan-m.png"></image>
		<image class="logo" ></image>
		
		<view class="cup-state" >
			<view class="connect-state" >
				{{ble_state==0 ? '未连接' : ble_state==1 ? '连接中...' : work_mode==0 ? lan['Lan26'] : work_mode==1 ? lan['Lan28'] : 
				work_mode==2 ? lan['Lan27'] : work_mode==3 ? lan['Lan29'] :  work_mode==4 ? lan['Lan26'] : ''}}
			</view>
			<view class="temp-state" :class="[ble_state == 2 ? 'temp-state-show' : '']">
				<view class="temp-num">
					<view class="temp-num-v" >{{temp}}</view>
					<view class="temp-num-c" >℃</view>
				</view>
				<view class="temp-shuiwen" >{{lan['Lan09']}}</view>
				
			</view>
			<view class="state-con">
				<view class="loading-state" :class="[ble_state == 1 ? 'loading-state-show' : '']" ><loading></loading></view>
				<view class="battery-state" :class="[ble_state == 2 ? 'battery-state-show' : '']">
					<view class="battery-container" :class="[battery <= 15 ? 'battery-low' : '']">
						<view class="battery-show" :class="[battery <= 15 ? 'battery-show-low':'']" v-bind:style="{width:(battery*31.25/100) + 'rpx'}"></view>
					</view>
					
					<image class="charging" :class="[charging ? 'charging-show':'']"></image>
					<view class="battrey_v" :class="[ battery <= 15 ? 'battrey_v-low':'']">{{battery}}%</view>
				</view>
				<view class="re-connect" :class="[ble_state == 0 ? 're-connect-show' : '']"  @click='re_connect'>{{lan['Lan31']}}</view>
			</view>
			
		</view>
		<view class="cup-set" :class="[ble_state != 2 ? 'cup-set-disabled':'']" >
			<view class="cup-set-title" >{{lan['Lan10']}}</view>
			<view class="cup-set-container">
				<view class="cup-set-item"  @click="cup_set(45)">
					<view class="set-icon" :class="[temp_set==45 ? 'set-icon-pressed' : '']">
						<image class="set-icon-ic_water" :class="[temp_set==45 ? 'set-icon-ic_water_pressed' : '']"></image>
					</view>
					<view class="item-name" >{{lan['Lan11']}}</view>
				</view>
				<view class="cup-set-item" @click="cup_set(50)">
					<view class="set-icon" :class="[temp_set==50 ? 'set-icon-pressed' : '']">
						<image class="set-icon-ic_milk" :class="[temp_set==50 ? 'set-icon-ic_milk_pressed' : '']"></image>
					</view>
					<view class="item-name" >{{lan['Lan12']}}</view>
				</view>
				<view class="cup-set-item" @click="cup_set(55)">
					<view class="set-icon" :class="[temp_set==55 ? 'set-icon-pressed' : '']">
						<image class="set-icon-ic_blacktea" :class="[temp_set==55 ? 'set-icon-ic_blacktea_pressed' : '']"></image>
					</view>
					<view class="item-name" >{{lan['Lan13']}}</view>
				</view>
				<view class="cup-set-item" @click="cup_set(60)">
					<view class="set-icon" :class="[temp_set==60 ? 'set-icon-pressed' : '']">
						<image class="set-icon-ic_greentea" :class="[temp_set==60 ? 'set-icon-ic_greentea_pressed' : '']"></image>
					</view>
					<view class="item-name" >{{lan['Lan14']}}</view>
				</view>
				<view class="cup-set-item" @click="cup_set(65)">
					<view class="set-icon" :class="[temp_set==65 ? 'set-icon-pressed' : '']">
						<image class="set-icon-ic_coffee" :class="[temp_set==65 ? 'set-icon-ic_coffee_pressed' : '']"></image>
					</view>
					<view class="item-name" >{{lan['Lan15']}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import loading from "../loading/loading";
	import lan_data from "../../static/language/language.js";
	// import VConsole from "../../static/vconsole.min.js"
	import ble from "../../js/connect_ble.js";  
	
	
	var main_count=0;
	var re_connect_counter=16;

	export default { 
		components: {
			loading
		},
		data() {
			return {
				pop_show: '',
				lan:'zh-cn' ,
				ble_state:0,
				temp:0,
				temp_set:0,
				work_mode:0,
				battery:0,				
				charging:0,
				errcode:0,
			}
		},
		onLoad() {

			// this.ble_state=1;

			
		},
		onHide(){
			// this.de_init_index();
			// console.log('index onHide');
		},
		onShow(){
			// this.init_index();	
			// this.ble_state=1;
			// console.log('index onShow');
		},
		methods: {
			shao_hou_retry(e){
				this.pop_show='';
			},
			like_chong_lian(e){
				this.pop_show='';
				this.re_connect();

			},
			cup_set(i){
				this.temp_set=i;				
				console.log(i);
				ble.cup_set_temp(i);
			},
			re_connect(){
				this.ble_state=1;
				re_connect_counter=0;
				ble.stop_ble();
				ble.start_ble()
			},
			index_loop(){
				console.log('index'+main_count++);
				
				if(this.ble_state==1 && re_connect_counter<30)
				{
					re_connect_counter++;	
					if(re_connect_counter%8==0){
						ble.stop_ble();
						ble.start_ble();
					}
					if(re_connect_counter==30)
					{
						this.ble_state=0;
						this.pop_show='popup-lalay-show';
					}
				}
				if(ble.get_ble_state()==0 && this.ble_state==1)
				{
					ble.stop_ble();
					ble.start_ble();
				}
				if(ble.get_ble_state()==0 && this.ble_state==2)
				{
					this.ble_state=1;
					this.temp_set=0;
					ble.stop_ble();
					ble.start_ble();
				}
				if(this.ble_state!=2 && ble.get_ble_state()==2)
				{
					this.ble_state=2;
					re_connect_counter=0;
				}
				if(this.ble_state==2)
				{
					this.check_cup_state();
				}
				
				
			},
			de_init_index()	{
				clearInterval(getApp().globalData.index_loop_id );
				getApp().globalData.index_loop_id =-1;
			},
			init_index(){
				if(getApp().globalData.index_loop_id ==-1)
				{
					getApp().globalData.index_loop_id = setInterval(this.index_loop, 1000, '');
				}	
			},
			check_cup_state(){
				var sta=ble.get_cup_state();
				if(sta.temp != this.temp)
				{
					this.temp=sta.temp;
				}
				if(sta.temp_set != this.temp_set)
				{
					this.temp_set=sta.temp_set;
				}
				if(sta.work_mode != this.work_mode)
				{
					this.work_mode=sta.work_mode;
				}
				if(sta.battery != this.battery)
				{
					this.battery=sta.battery;
				}
				if(sta.errcode != this.errcode)
				{
					this.errcode=sta.errcode;					
					if(sta.errcode & 0x08)
					{
						this.charging=1;
					}
					else{
						this.charging=0;
					}
					
				}
			},
			t1(){
				uni.redirectTo({
				    url: '../connect/connect'
				});
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
		display: none;
		background-color: rgba(0,0,0,0.2);
		justify-content: center;		
	}
	.popup-lalay-show{
		display: flex;		
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
		transition: all 3s;
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
	}
	.line{
		border-right: 1.04rpx solid rgba(0,0,0,0.20);
		height: 50rpx;
		width: 0.01rpx;
	}
	.like{
		height: 50rpx;
		width: 266.67rpx;
		text-align: center;
		/* background-color: #007AFF; */
	}

	.error-notice{
		width: 750rpx;
		height: 100rpx;
		background-color:rgba(251,42,45,0.05);
		display: none;
		align-items: center;
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
		height: 37.5rpx;
		width: 145.83rpx;
		background-image:url(../../static/xxhdpi/logo.png);
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
		width: 56.25rpx;
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
		display: flex;
		height: 456.25rpx;
		width: 683.33rpx;
		background-color: #FFFFFF;
		margin-top: 16.67rpx;
		border-radius: 16.67rpx;
		flex-direction: column;
		align-items: center;
		
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
	}
	.loading-state{
		height: 130.73rpx;
		/* width: 130.73rpx; */
		/* background-color: #999999; */
		display: none;
		justify-content: flex-end;
		align-items:center;
	}
	.loading-state-show{
		display: flex;
	}
	.battery-state{
		height: 48.96rpx;
		width: 182rpx;
		/* background-color: #999999; */
		display: none;
		flex-direction: row;	
		align-items: center;
		justify-content: flex-end;	
	}
	.battery-state-show{
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
		display: none;
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
	.set-icon-ic_water{
		background-image: url(../../static/xxhdpi/ic_water.png);		
	}
	.set-icon-ic_water_pressed{
		background-image: url(../../static/xxhdpi/ic_water_pressed.png);		
	}
	.set-icon-ic_milk{
		background-image:url(../../static/xxhdpi/ic_milk.png);		
	}
	.set-icon-ic_milk_pressed{
		background-image:url(../../static/xxhdpi/ic_milk_pressed.png);		
	}
	.set-icon-ic_blacktea{
		background-image:url(../../static/xxhdpi/ic_blacktea.png);		
	}
	.set-icon-ic_blacktea_pressed{
		background-image:url(../../static/xxhdpi/ic_blacktea_pressed.png);		
	}

	.set-icon-ic_greentea{
		background-image:url(../../static/xxhdpi/ic_greentea.png);		
	}
	.set-icon-ic_greentea_pressed{
		background-image:url(../../static/xxhdpi/ic_greentea_pressed.png);		
	}

	.set-icon-ic_coffee{
		background-image:url(../../static/xxhdpi/ic_coffee.png);		
	}
	.set-icon-ic_coffee_pressed{
		background-image:url(../../static/xxhdpi/ic_coffee_pressed.png);		
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
