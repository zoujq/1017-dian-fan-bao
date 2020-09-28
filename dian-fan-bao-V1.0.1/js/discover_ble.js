
import wx_api from "./login.js";


export default {  	
	start_scan_ble,	
	clear_scaned_device,
	sao_yi_sao,
	ble_rescan,
	get_scan_device,
	check_find_device,
	stop_scan_ble,
}
var find_device=0;
var scan_device=[];
var wait_http=0;
var count=0;
function start_scan_ble()
{
	wait_http =0;
	console.log('start_scan_ble');
	uni.closeBluetoothAdapter({
	  complete(res) {
	    console.log(res)
		uni.openBluetoothAdapter({
		  complete(res) {
		    console.log(res)
			uni.startBluetoothDevicesDiscovery({
			  allowDuplicatesKey:true,
			  success (res) {
			    console.log(res)
			  }
			})
		  }
		})
	  }
	})
	
	uni.onBluetoothDeviceFound(function(res) {
	  var devices = res.devices;
	  var d_hex=ab2hex(devices[0].advertisData);
	  if(count++>30)
	  {
		  console.log('fd');
		  count=0;
	  }
	  
	  if(wait_http ==0 && devices[0].RSSI>-50 && d_hex.slice(0,4)=='c8c8')
	  {
		  if(check_device_is_binged(d_hex)==0)
		  {
			wait_http=1;
			console.log(devices[0].RSSI);	
			get_scan_device_info(d_hex.slice(8,20),hex2int(d_hex.slice(4,8)));
		  }
		  else{
			  console.log('device:'+d_hex.slice(8,20)+'is already binged!');
		  }
	  }
	})
	
}
function check_device_is_binged(d_hex)
{
	var htd_id=d_hex.slice(8,20);
	var i=0;
	var binded_d=wx_api.get_binded_device();
	for(i=0;i<binded_d.length;i++)
	{
		if(binded_d[i].htd_id==htd_id)
		{
			return 1;
		}
	}
	
	return 0;
}
function stop_scan_ble()
{
	uni.stopBluetoothDevicesDiscovery({
	  success (res) {
	    console.log(res)
	  }
	})
}
function ble_rescan()
{
	wait_http =0;
	uni.stopBluetoothDevicesDiscovery({
	  success (res) {
	    console.log(res)
		uni.openBluetoothAdapter({
		  success (res) {
		    console.log(res)
			uni.startBluetoothDevicesDiscovery({
			  allowDuplicatesKey:true,
			  success (res) {
			    console.log(res)
			  }
			})
		  }
		})
	  }
	})
}
function get_scan_device_info(htd_id,htp_id)
{
	var user_info=wx_api.get_user_info();
	console.log(`htd_id: ${htd_id} , htp_id: ${htp_id}`);
	uni.request({
	  url: 'https://server.huotiantech.com/device/get_product_info.php',
	  data: {			
			htd_id:htd_id, 
			htp_id:htp_id,
			htu_id:user_info.htu_id,
			ht_token:user_info.ht_token
		},
		complete() {
			wait_http=0;
		},
		success (res) {
			console.log(res)
			if(res.data.errCode==0)
			{
				scan_device={htd_id:htd_id,p_name:res.data.p_name,p_icon:res.data.p_icon};
				if(scan_device.p_name!=null)
				{
					find_device=1;	
				}				
			}
				
			
		}
	})
}
function check_find_device(){
	return find_device;
}
function get_scan_device()
{
	return scan_device;
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

function clear_scaned_device(){
	find_device=0;
	scan_device=[];
	wait_http=0;
}

function sao_yi_sao(){
	uni.scanCode({
	  success: (res) => {
	    console.log(res)
	  }
	})
}

