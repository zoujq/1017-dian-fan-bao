var ble_state=0;//0-未连接  1-连接中  2-已连接
var bang_ding_state=0;
var os='';
/*********************************get os***********************************/  
function get_os()
{
	var os = navigator.userAgent;
	if(os.indexOf('Android') > -1 || os.indexOf('Adr') > -1)
	{
		os='android';
	}
	else{
		os='ios';
	}
	return os;
}
/*********************************regist***********************************/                                     
function start_regist()
{	
	bang_ding_state=0;
	console.log('get_adapter');
	// window.hilink.getBluetoothAdapterState('window.get_adapter_cb');
	window.hilink.getCurrentUnregisteredDevice('window.get_dev_cb');
}
window.get_adapter_cb = (res)=>{
	if(JSON.parse(res).available==true)
	{
		console.log('adapter is ture');
		window.hilink.getCurrentUnregisteredDevice('window.get_dev_cb');
	}
	else{
		bang_ding_state=-1;
		window.hilink.openBluetoothAdapter('window.open_adapter_cb');
		window.hilink.onBluetoothAdapterStateChange('window.adapter_change_cb');
	}
 
}
window.open_adapter_cb = (res)=>{
	console.log(res)
}
window.window.adapter_change_cb = (res)=>{
	console.log(res)
}
window.get_dev_cb = (res)=>{
	console.log(res);
	let json_obj=JSON.parse(res)
	
	if(json_obj.errCode==0)
	{		
		if(get_os()=='android')
		{
			window.hilink.registerBleDevice(json_obj.advertisData.substring(22,34),
			'V1.0.1', 'V1.0.1', 'window.regist_cb');
			console.log('android registerBleDevice');
		}
		else
		{
			window.hilink.registerBleDevice(json_obj.advertisData.replace(/ /,'').replace(/</,'').replace(/>/,''),
			'V1.0.1', 'V1.0.1', 'window.regist_cb');
			console.log('ios registerBleDevice');
		}
	}	
	else
	{
		bang_ding_state=-1;
	}
	
 }
 window.regist_cb = (res)=>{
	 console.log(res);
	 if(res==0)
	 {
		 bang_ding_state=1;
	 }
	 else{
		 bang_ding_state=-1;
	 }
	 //bang_ding_state
}
function get_bangding_state(){
	return bang_ding_state;
}
/****************************************ble connect **********************************/
var hilink_sys_devId="";
var ble_deviceId='';
var IOS_SERVICE_UUID ='00010203-0405-0607-0809-0A0B0C0DFFE0';
var IOS_NOTIFY_CHARA_UUID ='00010203-0405-0607-0809-0A0B0C0DFFE1';
var IOS_WRITE_CHARA_UUID ='00010203-0405-0607-0809-0A0B0C0DFFE2';
function start_ble()
{
	ble_state=1;
	window.hilink.getCurrentRegisteredDevice('window.get_registed_dev_cb');
	window.hilink.onBLEConnectionStateChange('window.ble_sta_change_cb');
	window.hilink.onBluetoothDeviceFound('window.dev_find_cp');	
	// andriod err
	if(get_os()=='android')
	{
		window.hilink.startBluetoothDevicesDiscovery([],true,0);
	}
	else{
		 window.hilink.startBluetoothDevicesDiscovery([],false,0);	
	}			
	window.hilink.onBluetoothAdapterStateChange('window.adapter_change_cp_2')
}
window.adapter_change_cp_2 = (res)=>{
	console.log('adapter_change_cp_2:'+res);
	if(JSON.parse(res).available==false){
		ble_state=0;
	}
}
window.get_registed_dev_cb = (res)=>{	
	hilink_sys_devId=JSON.parse(res).deviceId;
	console.log('hilink_sys_devId:'+hilink_sys_devId);
}
window.dev_find_cp = (res)=>{
	console.log(res);
	var js_obj=JSON.parse(res);
	if(get_os()=='android')
	{
		if(js_obj[0].localName=='Hi-06B-12ARA00XXXX')
		{
			console.log(js_obj[0].advertisData.substring(22,34));
			if(js_obj[0].advertisData.substring(22,34)==hilink_sys_devId)
			{
				console.log('android dev is ok');
				ble_deviceId=js_obj[0].deviceId;
				window.hilink.createBLEConnection(ble_deviceId);
				window.hilink.onBLEServicesDiscovered('window.service_find_cb');
				
			}
		}
	}
	else{		
		if(js_obj.advertisData.replace(/ /,'').replace(/</,'').replace(/>/,'')==hilink_sys_devId)
		{
			console.log('ios dev is ok');
			ble_deviceId=js_obj.deviceId;
			window.hilink.createBLEConnection(ble_deviceId);
			window.hilink.onBLEServicesDiscovered('window.service_find_cb');
		}
	}	
}
window.ble_sta_change_cb  = (res)=>{
	console.log('ble_sta_change_cb'+res)
	if(JSON.parse(res).connected==true)
	{
		console.log('connected success' );
		window.hilink.onBLECharacteristicValueChange('window.char_change_cb');		
	}
	else{
		ble_state=0;
		stop_ble();
	}
}
window.service_find_cb = (res)=>{
	console.log('service_find_cb:'+ res)
	if(window.hilink.notifyBLECharacteristicValueChange(ble_deviceId, IOS_SERVICE_UUID, IOS_NOTIFY_CHARA_UUID, true)==0)
	{
		console.log('notity:ok') ;
		window.hilink.stopBluetoothDevicesDiscovery();
		ble_state=2;
	}else{
		ble_state=0;
		stop_ble();
	}
	
}

window.char_change_cb = (res)=>{
	console.log('char_change_cb:'+res);
	var rec=str16_to_byteArr(JSON.parse(res).data)
	if(rec[0]==1 && rec[1]==0x55 && rec.length==19)
	{
		cup_state.temp=rec[5];
		cup_state.temp_set=rec[6];
		cup_state.work_mode=rec[7];
		cup_state.battery=rec[8];
		cup_state.errcode=rec[10];
		data_send(0x5A);
		console.log('received data ok');
	}
}

function get_ble_state()//0-未连接  1-连接中  2-已连接
{
	return ble_state;
}
function stop_ble()
{
	ble_state=0;
	window.hilink.stopBluetoothDevicesDiscovery();
	window.hilink.closeBLEConnection(ble_deviceId);
	
}
function send_data_to_mcu(arr)
{	
	if(get_os()=='android')
	{
		window.hilink.writeBLECharacteristicValue(ble_deviceId,IOS_SERVICE_UUID,IOS_WRITE_CHARA_UUID,byteArr_to_str16(arr),
			'window.write_cb');
	}
	else{
		window.hilink.writeBLECharacteristicValue(ble_deviceId,IOS_SERVICE_UUID,IOS_WRITE_CHARA_UUID,byteArr_to_str16(arr));
	}
	
}
window.write_cb = (res)=>{
	
}
function str16_to_byteArr(str) 
{ 
    var pos = 0; 
    var len = str.length; 
    if(len %2 != 0) 
    { 
       return null;  
    } 
    len /= 2; 
    var hexA = new Array(); 
    for(var i=0; i<len; i++) 
    { 
       var s = str.substr(pos, 2); 
       var v = parseInt(s, 16); 
       hexA.push(v); 
       pos += 2; 
    } 
    return hexA; 
} 
//字节数组转十六进制字符串 
function byteArr_to_str16(arr) 
{ 
    var str = ""; 
    for(var i=0; i<arr.length; i++) 
    { 
       var tmp = arr[i].toString(16); 
       if(tmp.length == 1) 
       { 
           tmp = "0" + tmp; 
       } 
       str += tmp; 
    } 
    return str; 
}
/****************************************data work**************************/
//0-factery,1-rw,2/3/4-生产,5-temp,6-temp_set,7-cup_mode,8-battery,9-power
//10-errcode,11/12/13/14/15/16-MAC,17-hardware,18-software
var send_buff=new Array(1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
var cup_state={ 'temp':0,'temp_set':0,'work_mode':0,'battery':0,'errcode':0};
function data_send(write55_reply5a)
{
	send_buff[1]=write55_reply5a;
	send_buff[5]=cup_state.temp;
	send_buff[6]=cup_state.temp_set;
	send_buff[7]=cup_state.work_mode;
	send_buff[8]=cup_state.battery;
	send_buff[10]=cup_state.errcode;
	send_data_to_mcu(send_buff);
}
function cup_set_temp(temp)
{
	cup_state.temp_set=temp;
	data_send(0x55);
}
function get_cup_state()
{
	return cup_state;
}

/****************************************change title**************************/
function change_nav_title()
{
	window.hilink.modifyTitleBar(false, '#000000', '');
}
	
/****************************************port**********************************/
export default {  
	start_regist,
	get_bangding_state,
	start_ble,
	stop_ble,
	get_ble_state,
	change_nav_title,
	cup_set_temp,
	get_cup_state
}