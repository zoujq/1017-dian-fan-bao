<template>
	<view class="body">
		<view class="title">
		<view>设备</view>	
		<image class="tian-jia" @click="tian_jia"></image>
		</view>
		<view class="list">
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
			<view class="item-contain">
				<view class="items"></view>
			</view>
		</view>
	</view>
</template>

<script>
	const udp = wx.createUDPSocket()
	udp.bind()
	udp.onMessage(on_message)
	function on_message(e)
	{
		console.log('on_message')
		console.log(e)
	}
	function send(){
		console.log('ok')
		udp.send({
		    address: 'server.huotiantech.com',
		    port: 5000,
		    message: 'hello, how are you'
		 })
	}

	export default {
		data() {
			
			
			return {
			}
		},
		onLoad(){

		},
		methods: {
			tian_jia(){
				send()
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
	.title{
		font-size: 5vw;
		color: #000000;
		height: 5vw;
		width: 91.11vw;
		line-height: 5vw;	
		margin-top: 3.47vw;
		opacity: 0.8;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	
	}
	.tian-jia{
		background-image: url(../../static/tian_jia.png);
		background-size: cover;
		height: 5vw;
		width: 5vw;
	}
	.list{
		display: flex;
		flex-direction: row;
		width: 91.11vw;
		flex-wrap:wrap;
		margin-top: 3.47vw;
		
	}
	.item-contain{
		height: 30.37vw;
		width:  30.37vw;
		background-color: #007AFF;
		
	}
	.items{
		
	}
	
</style>
