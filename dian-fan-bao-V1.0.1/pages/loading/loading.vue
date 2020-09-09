<template>
	<view id="loading3">
		<view class="demo3"></view>
		<view class="demo3"></view>
		<view class="demo3"></view>
		<view class="demo3"></view>
		<view class="demo3"></view>
		<view class="demo3"></view>
		<view class="demo3"></view>
		<view class="demo3"></view>
		<view class="demo3"></view>
		<view class="demo3"></view>
		<view class="demo3"></view>
		<view class="demo3"></view>

	</view>
</template>

<script>

	export default {
		name: "loading",	
		data() {
			return {
				dark:0
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	 #loading3 {
	     position: relative;
	     width: 73rpx;
	     height: 65.1rpx;
	 }
	 .demo3 {
	    width: 7rpx;
	    height: 7rpx;
	    border-radius: 50%;
	    background: #D0D0D0;
	    position: absolute;
		animation: demo3 linear 1.2s infinite;
	    -webkit-animation: demo3 linear 1.2s infinite;
	 }
	 .demo3:nth-child(1){
	     left: 56.69rpx;
	     top: 45.57rpx;
	     animation-delay:0s;
	 }
	 .demo3:nth-child(2){
	     left: 45.57rpx;
	     top: 56.69rpx;
	     animation-delay:0.1s;
	 }
	 .demo3:nth-child(3){
	     left: 30.38rpx;
	     top: 60.76rpx;
	     animation-delay:0.2s;
	 }
	 .demo3:nth-child(4){
	     left: 15.19rpx;
	     top: 56.69rpx;
	     animation-delay:0.3s;
	 }
	 .demo3:nth-child(5){
	     left: 4.07rpx;
	     top: 45.57rpx;
	     animation-delay:0.4s;
	 }
	 .demo3:nth-child(6){
	     left: 0rpx;
	     top: 30.38rpx;
	     animation-delay:0.5s;
	 }
	 .demo3:nth-child(7){
	     left: 4.07rpx;
	     top: 15.19rpx;
	     animation-delay:0.6s;
	 }
	 .demo3:nth-child(8){
	     left: 15.19rpx;
	     top: 4.07rpx;
	     animation-delay:0.7s;
	 }
	 .demo3:nth-child(9){
	     left: 30.38rpx;
	     top: 0rpx;
	     animation-delay:0.8s;
	 }
	 .demo3:nth-child(10){
	     left: 45.57rpx;
	     top: 4.07rpx;
	     animation-delay:0.9s;
	 }
	 .demo3:nth-child(11){
	     left: 56.7rpx;
	     top: 15.2rpx;
	     animation-delay:1.0s;
	 }
	 .demo3:nth-child(12){
	     left: 60.76rpx;
	     top: 30.38rpx;
	     animation-delay:1.1s;
	 }
	
	 @keyframes demo3 
	 {
	     0%,40%,100% {transform: scale(1);}
	     20% {
			 transform: scale(2.17);
			 background-color: #666666;
		 }
	 }
	 @-webkit-keyframes demo3 
	 {
	     0%,40%,100% {transform: scale(1);}
	     20% {transform: scale(2.17);
			background-color: #666666;
		 }
	 }
	
	
</style>
