import login from "./login.js";

export default {  
	start_ble,
	stop_ble,
	get_ble_state,
	send_to_device,
	set_on_received_data_callback

}
var is_connect_ble=0;
var find_device=0;
var connecting=0;
var scan_device=[];
var wait_http=0;

var ble_state=0;//0-未连接  1-连接中  2-已连接
var bang_ding_state=0;
var os='';
var ble_deviceId='';
// var SERVICE_UUID ='00010203-0405-0607-0809-0A0B0C0DFFE0';
// var NOTIFY_CHARA_UUID ='00010203-0405-0607-0809-0A0B0C0DFFE1';
// var WRITE_CHARA_UUID ='00010203-0405-0607-0809-0A0B0C0DFFE2';
var SERVICE_UUID = '0000FFE0-0000-1000-8000-00805F9B34FB';
var NOTIFY_CHARA_UUID ='0000FFE1-0000-1000-8000-00805F9B34FB';
var WRITE_CHARA_UUID ='0000FFE2-0000-1000-8000-00805F9B34FB';
 

function start_ble(){
	is_connect_ble=1;
	console.log('start_ble()');
	start_scan_ble();
}
function stop_ble(){
	is_connect_ble=0;
	close_ble();
	stop_scan_ble();
}
function get_ble_state(){
	return ble_state;
}
function send_to_device(js_arr){
	const buffer = new ArrayBuffer(js_arr.length)
	const dataView = new DataView(buffer)
	var i=0;
	console.log(`send:${js_arr}`)
	for(i=0;i<js_arr.length;i++)
	{
		dataView.setUint8(i, js_arr[i]);
	}	
	uni.writeBLECharacteristicValue({
	  // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
	  deviceId:ble_deviceId,
	  // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
	  serviceId:SERVICE_UUID,
	  // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
	  characteristicId:WRITE_CHARA_UUID,
	  // 这里的value是ArrayBuffer类型
	  value: buffer,
	  success(res) {
	    // console.log('writeBLECharacteristicValue success', res.errMsg)
	  }
	})
}
function get_cup_state(){
	
}
function close_ble()
{
	console.log('close_ble');
	uni.closeBLEConnection({
	  deviceId:ble_deviceId,
	  complete(res) {
	    console.log(res)
	  }
	})
}
function start_scan_ble()
{
	console.log('start_scan_ble');
	ble_state=1;
	uni.closeBluetoothAdapter({
	  complete(res) {
	    //console.log(res)
		uni.openBluetoothAdapter({
		  complete(res) {
		   // console.log(res)
			uni.startBluetoothDevicesDiscovery({
			  // allowDuplicatesKey:true,
			  success (res) {
			   // console.log(res)
			  }
			})
		  } 
		})	
	  }
	})
	
	uni.onBluetoothDeviceFound(function(res) { 
	  if(is_connect_ble==0)
	  {
		  return; 
	  }
	  var devices = res.devices; 
	  var d_hex=ab2hex(devices[0].advertisData);
	  console.log('kkkkk'); 
	  console.log(d_hex);  
	  if(d_hex.slice(4,8)=='88a0')
	  {
		  var connect_htd_id=login.get_user_info().connect_htd_id;
		  if(d_hex.slice(8,20)==connect_htd_id && connecting==0)
		  {
			  connecting=1;
			  console.log('connect_htd_id find:'+connect_htd_id);
			  ble_deviceId=devices[0].deviceId; 
			  console.log('ble_deviceId:'+ble_deviceId)
			  stop_scan_ble();
			  uni.createBLEConnection({
			    deviceId:ble_deviceId,
				complete(res) {
				  connecting=0;
			      console.log(res) 
				  var inter_counts=0;
				  var inter_id=setInterval(function() {
					  uni.getBLEDeviceServices({
					    // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					    deviceId:ble_deviceId,
						complete(res) {
					      console.log('device services:', res.services);
							  if(res.services.length==0)
							  {
								   console.log('inter_counts:',inter_counts)	
								  if(inter_counts++>10)
								  {
									  inter_counts=0;
									  clearInterval(inter_id);
								  }
								  return;
							  }
							  clearInterval(inter_id);
							  uni.getBLEDeviceCharacteristics({
								// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
								deviceId:ble_deviceId,
								// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
								serviceId:SERVICE_UUID,
								complete(res) {
								  console.log('device getBLEDeviceCharacteristics:', res.characteristics)
								  uni.notifyBLECharacteristicValueChange({ 
									state: true, // 启用 notify 功能
									// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
									deviceId:ble_deviceId,
									// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
									serviceId:SERVICE_UUID,
									// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
									characteristicId:NOTIFY_CHARA_UUID,
									complete(res) {
										console.log('notifyBLECharacteristicValueChange success', res.errMsg)
										if(res.errMsg=="notifyBLECharacteristicValueChange:ok")
										{
											ble_state=2;
										} 
										 									
									}
								  })
								}
							  })			  					  
					  						
					    }
					  })
				  }, 500); 
				  
			    }
			  })
		  }
	  }
	})
	uni.onBLEConnectionStateChange(function (res) {
	  // 该方法回调中可以用于处理连接意外断开等异常情况
	  // console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
	  if(res.connected==false &&  ble_state==2)
	  {
		  ble_state=0;
	  }
	})
	uni.onBLECharacteristicValueChange(function (res) {
	  // console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
	  // console.log(ab2hex(res.value))
	  on_received_data(res.value);
	})
}
function on_received_data(data)
{
	var a8=new Uint8Array(data);
	var i=0;
	var js_arr=[];
	for(i=0;i<a8.length;i++)
	{
		js_arr[i]=a8[i];
	}
	//console.log(js_arr);
	received_cb(js_arr);
}
var received_cb={};
function set_on_received_data_callback(cb)
{
	received_cb=cb;
}
function stop_scan_ble()
{
	uni.stopBluetoothDevicesDiscovery({
	  success (res) {
	    // console.log(res) 
	  }
	})
}
function ble_rescan()
{
	uni.stopBluetoothDevicesDiscovery({
	  success (res) {
	    // console.log(res)
		uni.openBluetoothAdapter({
		  success (res) {
		    // console.log(res)
			uni.startBluetoothDevicesDiscovery({
			  // allowDuplicatesKey:true,
			  success (res) {
			    // console.log(res) 
			  }
			})
		  }
		})
	  }
	})
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



