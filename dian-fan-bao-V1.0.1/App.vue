<script>	
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			index_loop_id:-1
		}
	}
</script>

<style>
	/*每个页面公共css */
	body{
		background-color: #F7F7F7;
	}
	@media (prefers-color-scheme: dark) {
		body{
			background-color: #000000;
		}
	}
	
</style>
