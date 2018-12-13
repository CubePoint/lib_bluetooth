(function(global){
  var BtEnum = global.BtEnum;
  var BtBaseService = global.BtBaseService;
  
  function BtService() {
    var self = this;
    BtBaseService.apply(self,arguments);
  }
  BtService.prototype = Object.create(BtBaseService.prototype);
  BtService.prototype.openBt = function(completeCb) {
    wx.invoke('openWXDeviceLib',{} ,function(res) {
      console.log('蓝牙模块开启：'+JSON.stringify(res));
      var dinfres = {
        state: undefined,
        available: undefined,
      };
      dinfres.state = res.err_msg == 'openWXDeviceLib:ok';
      dinfres.available = res.bluetoothState == 'on';
      completeCb&&completeCb(dinfres);
    });
  }
  BtService.prototype.closeBt = function(completeCb) {
    wx.invoke('closeWXDeviceLib',{} ,function(res) {
      console.log('蓝牙模块关闭：'+JSON.stringify(res));
      var dinfres = {
        state: undefined
      };
      dinfres.state = res.err_msg == 'closeWXDeviceLib:ok';
      completeCb&&completeCb(dinfres);
    });
  }
  BtService.prototype.connectBt = function(deviceId,completeCb) {
    wx.invoke('connectWXDevice',{'deviceId':deviceId},function(res) {
      console.log('蓝牙连接：'+JSON.stringify(res));
      var dinfres = {
        state: undefined,
      };
      dinfres.state = res.err_msg == 'connectWXDevice:ok';
      completeCb&&completeCb(dinfres);
    });
  }
  BtService.prototype.disconnectBt = function(deviceId,completeCb) {
    wx.invoke('disconnectWXDevice',{'deviceId':deviceId},function(res) {
      console.log('蓝牙断开连接：'+JSON.stringify(res));
      var dinfres = {
        state: undefined,
      };
      dinfres.state = res.err_msg == 'disconnectWXDevice:ok';
      completeCb&&completeCb(dinfres);
    });
  }
  BtService.prototype.onBtAvailChange = function(onCb) {
    wx.on('onWXDeviceBluetoothStateChange',function(res) {
      console.log('蓝牙状态变化：'+JSON.stringify(res));
      var dinfres = {
        state: undefined,
      };
      dinfres.state = res.state == 'on';
      onCb&&onCb(dinfres);
    });
  }
  BtService.prototype.onBtConnChange = function(onCb) {
    wx.on('onWXDeviceStateChange',function(res) {
      console.log('蓝牙连接变化：'+JSON.stringify(res));
      var dinfres = {
          state: undefined,
      };
      if (res.state == 'disconnected') {
          dinfres.state = BtEnum.CONN_DIS;
      }else if(res.state == 'connecting') {
          dinfres.state = BtEnum.CONN_ING;
      }else if(res.state == 'connected') {
          dinfres.state = BtEnum.CONN_ED;
      }
      onCb&&onCb(dinfres);
    });
  }

  global.BtService = new BtService();
})