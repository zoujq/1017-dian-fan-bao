<template>
	<view class="content" >
		<image class="idimg"  src="../../static/xxhdpi/idimg.png"></image>
		<view class="connecting" :class="[regist_state==0 ? '' : 'connecting-no-show']">
			<view class="jin-du">
				<view class="num" >{{counter}}</view>
				<view class="bai-fen" >%</view>
			</view>
			<view class="bang-ding-ing" >{{lan['Lan16']}}</view>
		</view>
		<view class="fail-tip" :class="[regist_state==0 ? '' : 'fail-tip-show']">
			<image class="icon-error" src="../../static/xxhdpi/ic_tips_filled.png"></image>
			<view class="lian-jie-shi-bai" >{{lan['Lan17']}}</view>
			<view class="tip-title" >{{lan['Lan18']}}</view>
			<view class="tip-content" >{{lan['Lan19']}}</view>
			<view class="tip-content" >{{lan['Lan20']}}</view>
			<view class="tip-content" >{{lan['Lan21']}}</view>
			<view class="tip-content" >{{lan['Lan22']}}</view>
			<view class="footer" @click="re_regist">{{lan['Lan23']}}</view>
			
		</view>
	</view>
</template>

<script>
	import lan_data from "../../static/language/language.js";
	import VConsole from "../../static/vconsole.min.js"
	import ble from '../../ble/ble.js';  
	
	
	export default {
		data() {
			return {
				lan:navigator.language=='zh-cn' ? lan_data.cn : lan_data.en,
				regist_state:0,
				counter:0
			}
		},
		onLoad(){
			new VConsole();
			ble.start_regist();
			start_regist();
			setTimeout(this.loop,300,'')
		},
		methods: {
			re_regist(){
				ble.start_regist();
				this.counter=0;		
				this.regist_state=0;
				setTimeout(this.loop,300,'');
			},
			loop(){
				this.counter++;
				// if(ble.get_bangding_state()==1){
				// 	return 0;
				// }
				// if(ble.get_bangding_state()==-1)
				// {
				// 	this.regist_state=-1;
				// 	return 0;
				// }
				// if(this.counter>=100)
				// {
				// 	this.regist_state=-1;
				// 	return 0;
				// }
				setTimeout(this.loop,300,'')
			}

		}
	}
</script>

<style>
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;		
	}

	.connecting{
		margin-top: 83.33rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.connecting-no-show{
		display: none;
	}
	.connecting .jin-du{
		height: 105.21rpx;
		/* width: 500rpx; */
		display: flex;
		justify-content: center;
	}
	.num{
		height: 105.21rpx;
		/* width: 89.58rpx; */
		font-size: 79.17rpx;
		color: #191919;
		line-height: 105.21rpx;
		text-align: right;
		
	}

	@media (prefers-color-scheme: dark) {
		.num{
			opacity: 0.86;
			color: #FFFFFF;
		}
	}
	.bai-fen{
		width: 30.73rpx;
		height: 55.73rpx;
		color: #191919;
		margin-top: 45.31rpx;
		margin-left: 4.17rpx;
		
	}

	@media (prefers-color-scheme: dark) {
		.bai-fen{
			opacity: 0.86;
			color: #FFFFFF;
		}
	}
	.connecting .bang-ding-ing{
		height: 40.63rpx;
		width: 683.33rpx;
		font-size: 29.17rpx;
		text-align: center;
		margin-top: 16.15rpx;
	}
	
	@media (prefers-color-scheme: dark) {
		.bang-ding-ing{
			color: #FFFFFF;
		}
	}
	.fail-tip{	
		margin-top: 83.33rpx;
		display: none;
		flex-direction: column;
		align-items: center;
	}
	.fail-tip-show{
		display: flex;
	}
	.idimg{
		height: 525rpx;
		width:  525rpx;	
		margin-top: 195.31rpx;
	}
	.icon-error{
		height: 96rpx;
		width: 96rpx;
	}
	.lian-jie-shi-bai{
		margin-top: 20.83rpx;
		height: 55.73rpx;
		width: 683.33rpx;
		line-height: 55.73rpx;
		text-align: center;
		font-size: 41.67rpx;
	}
	@media (prefers-color-scheme: dark) {
		.lian-jie-shi-bai{
			color: #FFFFFF;
		}
	}
	.tip-title{
		height: 44.80rpx;
		width: 683.33rpx;
		text-align: left;
		font-size: 33.33rpx;
		margin-top: 50rpx;
		margin-left: 50rpx;
		margin-bottom: 8.85rpx;
	}	
	@media (prefers-color-scheme: dark) {
		.tip-title{
			color: #FFFFFF;
		}
	}
	.tip-content{
		height: 44.80rpx;
		width: 683.33rpx;
		text-align: left;
		font-size: 33.33rpx;
		margin-top: 8.33rpx;
		margin-left: 50rpx;
	}
	
	@media (prefers-color-scheme: dark) {
		.tip-content{
			color: #FFFFFF;
		}
	}
	.footer{
		margin-top: 213.02rpx;
		height: 75rpx;
		width: 375rpx;
		border-radius: 37.5rpx;
		background: rgba(0,0,0,0.05);
		line-height: 75rpx;
		text-align: center;
		color: #007DFF;
		font-size: 33.33rpx;
	}

	@media (prefers-color-scheme: dark) {
		.footer{
			background: rgba(255,255,255,0.10);
		}
	}
</style>
