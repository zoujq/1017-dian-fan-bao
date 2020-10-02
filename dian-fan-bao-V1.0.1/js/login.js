export default {  
	wx_login,
	user_regist,
	check_login,
	get_user_info,
	get_storage_user_info,
	set_storage_user_info,
	get_binded_device,
	request_binded_device,
	bind_device,
	delete_device,
	set_connect_htd_id

}
var user_info={
	inited:1, 
	called:0,
	waiting:0,
	loged:0,
	registed:0,
	session_key:'',
	openid:'',
	htu_id:0,
	ht_token:0,
	device_arr:[],
	connect_htd_id:''
	};
function get_storage_user_info(){
	try {
	  var value = uni.getStorageSync('user_info')
	  if (value.inited==1 && value.htu_id>10000 && value.ht_token.length==32) {
			user_info=value;		    
	  }
	  else{
		set_storage_user_info();  
	  }
	} catch (e) {
	  set_storage_user_info();
	}
}
function set_storage_user_info(){
	try {
	  uni.setStorageSync('user_info',user_info)
	} catch (e) { }
}
function get_user_info(){
	return user_info;	
}
function set_user_info(user_info){
	
}
function set_connect_htd_id(htd_id){
	user_info.connect_htd_id=htd_id;
	set_storage_user_info();
}
function check_login(){
	if(user_info.called==0)
	{
		return -1;
	}
	if(user_info.htu_id==0)
	{
		return 0;
	}
	return 1;
}
function wx_login(){
	user_info.waiting=1;
	uni.login({
	  success (res) {
		console.log(res)
	    if (res.code) {
	      //发起网络请求
	      uni.request({
	        url: 'https://server.huotiantech.com/auth/exchange_access_token.php',
	        data: {
				js_code: res.code
	        },
			complete() {
				user_info.waiting=0;
			},
			success (res) {
				console.log('uni_login 2')
				console.log(res)
				user_info.called=1;
				user_info.htu_id=res.data.htu_id;
				user_info.ht_token=res.data.ht_token;
				user_info.session_key=res.data.session_key;
				user_info.openid=res.data.openid;
				user_info.loged=1;
				if(user_info.htu_id!=0)
				{
					user_info.registed=1;
					set_storage_user_info();
					request_binded_device();
				}
			}
	      })
	    } else {
	      console.log('登录失败！' + res.errMsg) 
	    }
	  }
	})
}

function user_regist(){
	user_info.waiting=1;
	uni.getSetting({
	  success(res) {
	    if (!res.authSetting['scope.userInfo']) {
	      uni.authorize({
	        scope: 'scope.userInfo',
	        success () {
	          	uni.getUserInfo({
	            success: function(res) {
				  //console.log(res)				  
				  uni.request({
				    url: 'https://server.huotiantech.com/auth/wx_jiemi/wx_regist.php',
				    data: {
						sessionKey: user_info.session_key,
						openid:user_info.openid,
						encryptedData:res.encryptedData,
						iv:res.iv,
						
				    },
					success (res) {
						//console.log(res)
						if(res.data.errCode==0)
						{
							user_info.htu_id=res.data.htu_id;
							user_info.ht_token=res.data.ht_token;
							user_info.registed=1;
							request_binded_device();
						}							
					}
				  })
	            },
				fail:function(res){
				  console.log(res) 
				}
	          })
	        }
	      })
	    }
		else{
			uni.getUserInfo({
			  success: function(res) {
				  uni.request({
					url: 'https://server.huotiantech.com/auth/wx_jiemi/wx_regist.php',
					data: {
						sessionKey: user_info.session_key,
						openid:user_info.openid,
						encryptedData:res.encryptedData,
						iv:res.iv,
						
					},
					success (res) {
						if(res.data.errCode==0)
						{
							user_info.htu_id=res.data.htu_id;
							user_info.ht_token=res.data.ht_token;
							user_info.registed=1;
							request_binded_device();
						}	
						
					}
				  })
				},
				fail:function(res){
				  console.log(res); 
				}
			})
		}
	  }
	})
}

function request_binded_device(){
	uni.request({
	  url: 'https://server.huotiantech.com/device/get_binded_device.php',
	  data: {
		htu_id:user_info.htu_id,
		ht_token:user_info.ht_token
	  },
	  complete() {
	  	user_info.waiting=0;
	  },
		success (res) {
			console.log(res)
			try{
				user_info.device_arr=[];
				res.data.list.forEach(function (item) {					
					user_info.device_arr.push({htd_id:item[0],htp_id:item[1],p_name:item[2],p_icon:item[3]})
				});
			}catch(e)
			{
				
			}		
			user_info.waiting=0;
			set_storage_user_info();
		}
	})
}
function get_binded_device(){
	return user_info.device_arr;
}
function bind_device(htd_id){
	user_info.waiting=1;
	uni.request({
	  url: 'https://server.huotiantech.com/device/bind_device.php',
	  data: {
		htd_id:htd_id,
		htu_id:user_info.htu_id,
		ht_token:user_info.ht_token
	  },
		success (res) {
			console.log(res);
			request_binded_device();
		}
	})
}
function delete_device(htd_id)
{
	uni.request({
	  url: 'https://server.huotiantech.com/device/unbind_device.php',
	  data: {
		htd_id:htd_id,
		htu_id:user_info.htu_id,
		ht_token:user_info.ht_token
	  },
		success (res) {
			console.log(res);
			request_binded_device();
		}
	})
}


