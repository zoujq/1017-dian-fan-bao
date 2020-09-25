//#ifdef MP-WEIXIN
export default {  
	wx_login,
	user_regist,
	check_login,
	get_user_info

}
var user_info={called:0,registed:0,session_key:'',openid:'',htu_id:0,ht_token:0};
function get_user_info(){
	return user_info;	
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
	wx.login({
	  success (res) {
		console.log(res)
	    if (res.code) {
	      //发起网络请求
	      wx.request({
	        url: 'https://server.huotiantech.com/auth/exchange_access_token.php',
	        data: {
				js_code: res.code
	        },
			success (res) {
				//console.log(res)
				user_info.called=1;
				user_info.htu_id=res.data.htu_id;
				user_info.ht_token=res.data.ht_token;
				user_info.session_key=res.data.session_key;
				user_info.openid=res.data.openid;
			}
	      })
	    } else {
	      console.log('登录失败！' + res.errMsg)
	    }
	  }
	})
}

function user_regist(){
	wx.getSetting({
	  success(res) {
	    if (!res.authSetting['scope.userInfo']) {
	      wx.authorize({
	        scope: 'scope.userInfo',
	        success () {
	          	wx.getUserInfo({
	            success: function(res) {
				  //console.log(res)				  
				  wx.request({
				    url: 'https://server.huotiantech.com/auth/wx_jiemi/wx_regist.php',
				    data: {
						sessionKey: user_info.session_key,
						openid:user_info.openid,
						encryptedData:res.encryptedData,
						iv:res.iv,
						
				    },
					success (res) {
						//console.log(res)
						user_info.htu_id=res.data.htu_id;
						user_info.ht_token=res.data.ht_token;
						
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
			wx.getUserInfo({
			  success: function(res) {
				  wx.request({
					url: 'https://server.huotiantech.com/auth/wx_jiemi/wx_regist.php',
					data: {
						sessionKey: user_info.session_key,
						openid:user_info.openid,
						encryptedData:res.encryptedData,
						iv:res.iv,
						
					},
					success (res) {
						//console.log(res)
						user_info.htu_id=res.data.htu_id;
						user_info.ht_token=res.data.ht_token;
					}
				  })
				},
				fail:function(res){
				  console.log(res)
				}
			})
		}
	  }
	})
}

//#endif