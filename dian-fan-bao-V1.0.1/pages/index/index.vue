<template>	
	<view class="content" >
		<view class="popup-lalay" v-show="pop_show!=0" @touchmove.stop.prevent="moveHandle">
			<view class="dialog-content" >
				<view class="connect-fail" v-show="pop_show==1">
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
				<view class="set-food-mode" v-show="pop_show==2">
					<view class="d-title">{{food_name}}</view>
					<view class="d-content">
						<view class="yong-shi">约{{use_minute}}分钟</view>
						<view class="yuyue">							
								<view>自动保温</view>							
								<switch @change="" ></switch>
						</view>
						<view class="yuyue">
							<view class="yuyue-contain">
								<view>预约</view><view  v-show="yuyue_switch==1"> {{day}}天{{time}}:{{minute}}开饭</view> 
							</view>
								<switch @change="On_yuyue_change" ></switch>
						</view>
						<view class="time-pick" v-show="yuyue_switch==1">
							<picker-view indicator-style="height:50rpx;" mask-class='mask-c'  :value="value" @change="bindChange">
								<picker-view-column>
									<view class="item" v-for="(item,index) in days" :key="index">{{item}}天</view>
								</picker-view-column>
								<picker-view-column>
									<view class="item" v-for="(item,index) in times" :key="index">{{item}}时</view>
								</picker-view-column>
								<picker-view-column>
									<view class="item" v-for="(item,index) in minutes" :key="index">{{item}}分</view>
								</picker-view-column>
							</picker-view>
						</view>					
					</view>
					<view class="d-footer-container">
						<view class="chongshi" @click="qu_xiao">取消</view>
						<view class="line"></view>
						<view class="like" @click="kai_shi">开始</view>
					</view>
				</view>
			</view>
		</view>
		<view class="nav"></view>
		<view class="error-notice" :class="[ (errcode & 7) != 0 ? 'error-notice-show' : '']">
			<image class="error-notice-img" ></image>
			<view class="notic-text">
			{{(errcode & 1) ? lan['Lan07'] : (errcode & 2) ? lan['Lan33'] :  (errcode & 4) ? lan['Lan32'] : ''}}</view>
		</view>
		<image class="idimg" src="../../static/xxhdpi/idimg.png" ></image>
		<view class="logo-qie" @click="On_qie_huan">
			<image class="logo" ></image>
			<image class="qiehuan"></image>
		</view>
		
		<view class="cup-state" >
			<view class="connect-state" >
				{{ble_state==0 ? lan['Lan30'] : ble_state==1 ? lan['Lan25'] : work_mode==0 ? '空闲中' : work_mode==1 ? '烹饪中' : 
				work_mode==2 ? '预约中' : ''}}
			</view>
			<view class="temp-state" :class="[ble_state == 2 ? 'temp-state-show' : '']">
				<view class="temp-num">
					<view class="temp-num-v" >12:58</view>
					<view class="temp-num-c" >开饭</view>
				</view>
				<view class="temp-shuiwen" >煮粥</view>
				
			</view>
			<view class="state-con">
				<view class="loading-state" v-show="ble_state == 1" >
					<loading></loading>
				</view>	
				<view class="stop-img" v-show="ble_state==2 && work_mode!=0">
					<image></image>
				</view>
				
				<view class="re-connect" v-show="ble_state == 0"  @click='re_connect'>{{lan['Lan31']}}</view>
			</view>
			
		</view>
		<view class="cup-set" :class="[ble_state != 2 ? 'cup-set-disabled':'']" >
			<view class="cup-set-title" >{{lan['Lan10']}}</view>
			<view class="cup-set-container">
				<view class="cup-set-item"  @click="On_set_food_mode('精煮饭',60)">
					<view class="set-icon" >
						<image class="set-icon-ic_water" ></image>
					</view>
					<view class="item-name" >精煮饭</view>
				</view>
				<view class="cup-set-item" @click="On_set_food_mode('快煮饭',25)">
					<view class="set-icon" >
						<image class="set-icon-ic_milk" ></image>
					</view>
					<view class="item-name" >快煮饭</view>
				</view>
				<view class="cup-set-item" @click="On_set_food_mode('煮粥',45)">
					<view class="set-icon" >
						<image class="set-icon-ic_blacktea" ></image>
					</view>
					<view class="item-name" >煮粥</view>
				</view>
				<view class="cup-set-item" @click="On_set_food_mode('热饭',25)">
					<view class="set-icon" >
						<image class="set-icon-ic_greentea" ></image>
					</view>
					<view class="item-name" >热饭</view>
				</view>
				<view class="cup-set-item" @click="On_set_food_mode('酸奶',480)">
					<view class="set-icon" >
						<image class="set-icon-ic_coffee" ></image>
					</view>
					<view class="item-name" >酸奶</view>
				</view>
				<view class="cup-set-item" @click="On_set_food_mode('煲鸡汤',90)">
					<view class="set-icon" >
						<image class="set-icon-ji" ></image>
					</view>
					<view class="item-name" >煲鸡汤</view>
				</view>
				<view class="cup-set-item" @click="On_set_food_mode('煲鸭汤',120)">
					<view class="set-icon" >
						<image class="set-icon-ya" ></image>
					</view>
					<view class="item-name" >煲鸭汤</view>
				</view>
				<view class="cup-set-item" @click="On_set_food_mode('煲排骨汤',75)">
					<view class="set-icon" >
						<image class="set-icon-gu" ></image>
					</view>
					<view class="item-name" >煲排骨汤</view>
				</view>
				<view class="cup-set-item" @click="On_set_food_mode('焖猪蹄',90)">
					<view class="set-icon" >
						<image class="set-icon-ti" ></image>
					</view>
					<view class="item-name" >焖猪蹄</view>
				</view>
				<view class="cup-set-item" @click="On_set_food_mode('蛋糕',30)">
					<view class="set-icon" >
						<image class="set-icon-dan" ></image>
					</view>
					<view class="item-name" >蛋糕</view>
				</view>
				<view class="cup-set-item" @click="On_set_food_mode('银耳莲子粥',50)">
					<view class="set-icon" >
						<image class="set-icon-yin" ></image>
					</view>
					<view class="item-name" >银耳莲子粥</view>
				</view>
				<view class="cup-set-item" @click="On_set_food_mode('鱼',45)">
					<view class="set-icon" >
						<image class="set-icon-yu" ></image>
					</view>
					<view class="item-name" >鱼</view>
				</view>
				<view class="cup-set-item" @click="On_set_food_mode(保温,480)">
					<view class="set-icon" >
						<image class="set-icon-baowen" ></image>
					</view>
					<view class="item-name" >保温</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import loading from "../loading/loading.vue";
	import lan_data from "../../static/language/language.js";
	//import VConsole from "../../static/vconsole.min.js"
	import ble from "../../ble/wx_ble.js";  
	
	
	var main_count=0;
	var re_connect_counter=0;

	export default { 
		components: {
			loading
		},
		data() {
			const days = ['今','明']
			const day ='今'
			const times = []
			const time = 1
			const minutes = []
			const minute = 1
			

			for (let i = 0; i <= 23; i++) {
				times.push(i)
			}
			for (let i = 0; i <= 59; i++) {
				minutes.push(i)
			}
			return {
				pop_show: 0,
				// lan:navigator.language=='zh-cn' ? lan_data.cn : navigator.language=='zh-CN'? lan_data.cn : lan_data.en,
				lan:lan_data.cn ,
				ble_state:2,
				temp:0,
				food_mode:0,
				work_mode:1,
				battery:0,				
				charging:0,
				errcode:0,
				yuyue_switch:0,
				use_minute:0,
				food_name:'',
				days,
				day,
				times,
				time,
				minutes,
				minute,
				value: [0, 0, 0],			
			}
		},
		onLoad() {
			//new VConsole();
			//this.ble_state=1;
			// ble.change_nav_title();
			// console.log(navigator.language)			
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
				this.pop_show=0;
			},
			like_chong_lian(e){
				this.pop_show=0;
				this.re_connect();

			},
			cup_set(i){
				this.food_mode=i;				
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
				console.log('index'+re_connect_counter);
				
				if(this.ble_state==1 && re_connect_counter<3)
				{
					re_connect_counter++;	
					if(re_connect_counter%8==0){
						ble.stop_ble();
						ble.start_ble();
					}
					if(re_connect_counter==3)
					{
						this.ble_state=0;
						this.pop_show=1;
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
					this.food_mode=0;
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
				if(sta.food_mode != this.food_mode)
				{
					this.food_mode=sta.food_mode;
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
			},
			moveHandle(){
				
			},
			bindChange: function (e) {
				const val = e.detail.value
				this.day = this.days[val[0]]
				this.time = this.times[val[1]]
				this.minute = this.minutes[val[2]]
				this.check_time_vaild(this.use_minute,this.day,this.time,this.minute)
			},
			On_yuyue_change(e){
				if(e.target.value)
				{
					this.yuyue_switch=1;
				}
				else{
					this.yuyue_switch=0;
				}
				console.log('this.yuyue_switch='+this.yuyue_switch)
			},
			On_set_food_mode(food_name,food_time){		
				this.food_name=food_name;
				this.use_minute=food_time;
				this.pop_show=2;
				this.check_time_vaild(this.use_minute,'今',0,0)
			},
			qu_xiao(){
				this.pop_show=0;
			},
			kai_shi(){
				this.pop_show=0;
			},
			check_time_vaild(use_time,day,time,minute){
				var date = new Date()
				var min_date = new Date()
				var mid_day='今'
				var err=0
				min_date.setTime(date.getTime()+use_time*60000)
				if(min_date.getDate()!=date.getDate())
				{
					mid_day='明'
				}
				if(day=='今')
				{
					if(mid_day=='今')
					{
						if(min_date.getHours()>time)
						{
							err=1
						}else if(min_date.getHours()==time){
							if(min_date.getMinutes()>minute)
							{
								err=1
							}
						}
					}
					else
					{
						err=1
					}
				}else if(day=='明'){
					if(mid_day=='明')
					{
						if(min_date.getHours()>time)
						{
							err=1
						}else if(min_date.getHours()==time){
							if(min_date.getMinutes()>minute)
							{
								err=1
							}
						}
					}
				}
				if(err)
				{					
					this.day=mid_day
					this.time=min_date.getHours()
					this.minute=min_date.getMinutes()
					this.value=[mid_day=='今'?0:1,this.time,this.minute]
				}
			},
			On_qie_huan(){
				uni.redirectTo({
				    url: '../device/device' 
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
	@media (prefers-color-scheme: dark) {
		.content{
			background-color: #000000;
		}	
	}
	.nav{
		/* height: 166.67rpx; */
		width: 750rpx;
	}
	.popup-lalay{
		position: absolute;
		height: 120vh;
		width: 100vw;
		z-index: 2;
		display: flex;
		background-color: rgba(0,0,0,0.2);
		justify-content: center;	
	}
	.dialog-content{
		width: 683.33rpx;
		background-color: #FFFFFF;
		bottom: 33.33rpx;
		position: fixed;
		border-radius: 33.33rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		transition: all 0.3s;
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
		width: 583.33rpx;
		font-size: 33.33rpx;
		/* background-color: #007AFF; */
	}
	.connect-fail{
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.set-food-mode{
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
		margin-top: 52.60rpx;
		margin-bottom: 36rpx;
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
	.yuyue{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
	}
	.yuyue-contain{
		display: flex;
		flex-direction: row;
		justify-content: left;
	}
	.yong-shi{
		display: flex;
		justify-content: center;
		font-size: 41.67rpx;
		color: #FF7500;
	}
	.yuyue switch{
		margin-right: -11rpx;
	}
	.time-pick{
		height: 200rpx;
		width: auto;
		/* background-color: #E64548; */
	}
	.mask-c{
		/* opacity: 0.6;
		background-color: #000000; */
		
	}
	@media (prefers-color-scheme: dark) {
		.mask-c{
			opacity: 0;
/* 			background-color: #000000; */
			
		}
	}
	picker-view {
	    width: 100%;
	    height: 200rpx;
	}
	
	.item {
	    height: 50rpx;
		line-height: 70rpx;
	    text-align: center;
	}
	@media (prefers-color-scheme: dark) {
		.dialog-content{
			background: #262626;
			color: #FFFFFF;
		}
		.d-footer-container{
			color: #3F97E9;
		}
	}
	.error-notice{
		width: 750rpx;
		height: 100rpx;
		background-color:rgba(251,42,45,0.05);
		display: none;
		align-items: center;
	}
	@media (prefers-color-scheme: dark) {
		.error-notice{
			background-color:rgba(211,0,3,0.1);
		}
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
	@media (prefers-color-scheme: dark) {
		..error-notice-img{
			background-image: url(../../static/error_notice_dark.png);
		}
	}
	.notic-text{
		font-size: 33.33rpx;
		margin-left: 35.42rpx;
		color: #FB2A2D;
	}
	@media (prefers-color-scheme: dark) {
		.error-notice{
			color: #E64548;
		}
	}
	.idimg{
		height: 525rpx;
		width:  525rpx;
		/* background-image: url(../../static/xxhdpi/idimg.png) ; */
		background-size:cover;
	}
	.logo-qie{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.logo {
		height: 37.5rpx;
		width: 145.83rpx;
		background-image:url(../../static/xxhdpi/logo.png);
		background-size:cover;
	}
	.qiehuan{
		height: 30rpx;
		width: 30rpx;
		background-image: url(../../static/qiehuan.png);
		background-size: cover;
		margin-left: 10rpx;
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
	@media (prefers-color-scheme: dark) {
		.cup-state{
			background-color: #262626;
		}
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
	
	@media (prefers-color-scheme: dark) {
		.connect-state{
			opacity: 0.86;
			color: #FFFFFF;
		}
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
		width: 184rpx;
		/* background-color:#007AFF; */
		display: flex;
		flex-direction: row;
		justify-content: center;
		text-align: right;
	}
	.temp-num-v{
		font-size:50rpx ;
		height:66.66rpx;
		color: #47CC47;
		opacity: 0.86;
	}
	
	@media (prefers-color-scheme: dark) {
		.temp-num-v{
			opacity: 0.86;
			color: #FFFFFF;
		}
	}
	.temp-num-c{
		font-size: 25rpx;
		opacity: 0.6;
		height: 33.33rpx;
		line-height: 33.33rpx;
		align-self: flex-end;
		margin-bottom:7.81rpx;
		color: #000;
	}

	@media (prefers-color-scheme: dark) {
		.temp-num-c{
			opacity: 0.6;
			color: #fff;
		}
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
	@media (prefers-color-scheme: dark) {
		.temp-shuiwen{
			opacity: 0.6;
			color: #FFFFFF;
		}
	}
	.cup-set {
		display: flex;
		width: 683.33rpx;
		background-color: #FFFFFF;
		margin-top: 16.67rpx;
		border-radius: 16.67rpx;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30rpx;
		
	}
	@media (prefers-color-scheme: dark) {
		.cup-set{
			background: #262626;
		}
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
		height:63rpx;
		width: 63rpx;
		/* background-color: #999999; */
		display: none;
		justify-content: flex-end;
		align-items:center;
		position: absolute;
		top:808rpx;
		right:83.6rpx;
	}
	.stop-img{		
		height: 90rpx;
		width: 90rpx;
		background-color: #007DFF;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		box-shadow: 0 6.25rpx 12.5rpx 0 rgba(0,0,0,0.2);
	}
	.stop-img image{
		background-image:url(../../static/stop.png);
		background-size: cover;
		height: 45rpx;
		width: 45rpx;
		
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

	@media (prefers-color-scheme: dark) {
		.cup-set-title{
			opacity: 0.9;
			color: #FFFFFF;
		}
	}
	.cup-set-container{
		width: 650rpx;
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
		display: flex;
		justify-content: center;
		align-items: center;
		border:2.09rpx solid rgba(0,125,255,0.2);
	}
	
	
	.set-icon image{
		height: 51.56rpx;
		width: 51.56rpx;
		background-size: cover;
	}
	.set-icon-ic_water{
		background-image: url(../../static/jing.png);
	}
	.set-icon-ic_milk{
		background-image: url(../../static/kuai.png);		
	}
	.set-icon-ic_blacktea{
		background-image: url(../../static/zhou.png);		
	}

	.set-icon-ic_greentea{
		background-image: url(../../static/refan.png);		
	}
	.set-icon-ic_coffee{
		background-image: url(../../static/shuannai.png);		
	}
	.set-icon-ji{
		background-image: url(../../static/ji.png);		
	}
	.set-icon-ya{
		background-image: url(../../static/ya.png);		
	}
	.set-icon-gu{
		background-image: url(../../static/gu.png);		
	}
	.set-icon-ti{
		background-image: url(../../static/ti.png);		
	}
	.set-icon-dan{
		background-image: url(../../static/dan.png);		
	}
	.set-icon-yin{
		background-image: url(../../static/yin.png);		
	}
	.set-icon-yu{
		background-image: url(../../static/yu.png);		
	}
	.set-icon-baowen{
		background-image: url(../../static/baowen.png);		
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
	@media (prefers-color-scheme: dark) {
		.item-name{
			opacity: 0.86;
			color: #FFFFFF;
		}
	}
	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

</style>
