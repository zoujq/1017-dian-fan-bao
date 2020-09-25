//#ifdef MP-WEIXIN
import wx_api from "./wx_login.js";

export default {  
	start_ble,
	stop_ble,
	get_ble_state,
	cup_set_temp,
	get_cup_state,
	start_scan_ble,
	get_scan_device_list,
	bind_device,
	clear_scaned_device
}
var scan_device_list={};
var scan_device_arr=[];
var user_info ='';
var binded_device_arr=[];
function start_ble(){
	
}
function stop_ble(){
	
}
function get_ble_state(){
	
}
function cup_set_temp(){
	
}
function get_cup_state(){
	
}

function start_scan_ble()
{
	wx.openBluetoothAdapter({
	  success (res) {
	    console.log(res)
		wx.startBluetoothDevicesDiscovery({
		  success (res) {
		    console.log(res)
		  }
		})
	  }
	})
	console.log('start_scan_ble');
	
	wx.onBluetoothDeviceFound(function(res) {
	  var devices = res.devices;
	  var d_hex=ab2hex(devices[0].advertisData);
		
	  if(d_hex.slice(0,4)=='c8c8')
	  {
		   if(scan_device_list[d_hex]==null)
		   {		  
			  add_to_scan_device_list(d_hex);	   
		   }
			
	  }
	})
	
}
function add_to_scan_device_list(d_hex)
{
	user_info=wx_api.get_user_info();

	wx.request({
	  url: 'https://server.huotiantech.com/device/get_product_info.php',
	  data: {
		p_id:hex2int(d_hex.slice(4,8)),
		htu_id:user_info.htu_id,
		ht_token:user_info.ht_token
	  },
		success (res) {
			console.log(res)
			scan_device_list[d_hex]=1;			
			scan_device_arr.push({htd_id:d_hex.slice(8),p_name:res.data.p_name,p_icon:res.data.p_icon});			
		}
	})
}
function get_scan_device_list()
{
	return scan_device_arr;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}
function hex2int(hex) {
    var len = hex.length, a = new Array(len), code;
    for (var i = 0; i < len; i++) {
        code = hex.charCodeAt(i);
        if (48<=code && code < 58) {
            code -= 48;
        } else {
            code = (code & 0xdf) - 65 + 10;
        }
        a[i] = code;
    }
    
    return a.reduce(function(acc, c) {
        acc = 16 * acc + c;
        return acc;
    }, 0);
}
function bind_device(htd_id){
	wx.request({
	  url: 'http://server.huotiantech.com/device/bind_device.php',
	  data: {
		htd_id:htd_id,
		htu_id:user_info.htu_id,
		ht_token:user_info.ht_token
	  },
		success (res) {
			console.log(res);			
		}
	})
}
function get_bind_device(){
	wx.request({
	  url: 'http://server.huotiantech.com/device/get_binded_device.php',
	  data: {
		htu_id:user_info.htu_id,
		ht_token:user_info.ht_token
	  },
		success (res) {
			binded_device_arr=res.data.list
			console.log(binded_device_arr);			
		}
	})
}
function clear_scaned_device(){
	scan_device_list={};
	scan_device_arr=[];
}

//#endif