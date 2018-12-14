;(function(global){

  function foundDeviceId(deviceId,completeCb) {
    function getValidDeviceId(devices, deviceName) {
      for (let i = 0; i < devices.length; i++) {
        const device = devices[i];
        let localName = '';
        if (device['name'] != undefined && device['name'] != '') {
          localName = device['name'];
        }
        if (device['localName'] != undefined && device['localName'] != '') {
          localName = device['localName'];
        }

        if (localName != '') {
          if (localName.indexOf(deviceName) != -1) {
            return device['deviceId'];
          }
        }
      }
      return false;
    }
    function startBtDiscovery(deviceId,completeCb) {
      wx.onBluetoothDeviceFound(function (res) {
        let wx_deviceId = getValidDeviceId(res.devices,deviceId);
        if (wx_deviceId !== false) {
          wx.stopBluetoothDevicesDiscovery({
            success (res) {
            }
          });
          completeCb(wx_deviceId);
        }
      });
      wx.startBluetoothDevicesDiscovery({
        services: [],
        success: function (res) {
        },
        fail: function (res) {
        },
        complete: function (res) {
        }
      });
    }


    wx.getBluetoothDevices({
      success (res) {
        let wx_deviceId = getValidDeviceId(res.devices,deviceId);
        if (wx_deviceId !== false) {
          completeCb(wx_deviceId);
        }else {
          startBtDiscovery(deviceId,completeCb);
        }
      }
    });
  }

  var BtEnum = global.BtEnum;
  var BtBaseService = global.BtBaseService;
  
  function BtService() {
    var self = this;
    BtBaseService.apply(self,arguments);
  }
  BtService.prototype = Object.create(BtBaseService.prototype);
  BtService.prototype.openBt = function(completeCb) {
    var dinfres = {
      state: undefined,
      available: undefined,
    };
    wx.openBluetoothAdapter({
      success(res) {
        console.log('蓝牙模块开启：'+JSON.stringify(res));
        dinfres.state = true;
        dinfres.available = true;
        completeCb&&completeCb(dinfres);
      },
      fail(res) {
        console.log('蓝牙模块开启：'+JSON.stringify(res));
        dinfres.state = true;
        dinfres.available = false;
        completeCb&&completeCb(dinfres);
      },
      complete() {
      }
    })
  }
  BtService.prototype.closeBt = function(completeCb) {
    wx.closeBluetoothAdapter({
      success (res) {
        console.log('蓝牙模块关闭：'+JSON.stringify(res));
        var dinfres = {
          state: undefined
        };
        dinfres.state = true;
        completeCb&&completeCb(dinfres);
      },
      complete (res) {
      }
    })
  }
  BtService.prototype.connectBt = function(deviceId,completeCb) {
    var dinfres = {
      state: undefined,
    };
    foundDeviceId(deviceId,function(wx_deviceId) {
      Wz.createBLEConnection({
        deviceId: wx_deviceId,
        // timeout: connect_timeout,
        success (res) {
          console.log('蓝牙连接：'+JSON.stringify(res));
          dinfres.state = true;
          completeCb&&completeCb(dinfres);
        },
        fail (res) {
          console.log('蓝牙连接：'+JSON.stringify(res));
          dinfres.state = false;
          completeCb&&completeCb(dinfres);
        },
        complete (res) {
        },
      })
    });
  }
  BtService.prototype.disconnectBt = function(deviceId,completeCb) {
    wx.closeBLEConnection({
      deviceId: deviceId,
      success (res) {
        console.log('蓝牙断开连接：'+JSON.stringify(res));
        var dinfres = {
          state: undefined,
        };
        dinfres.state = true;
        completeCb&&completeCb(dinfres);
      },
      complete (res) {
      }
    });
  }
  BtService.prototype.onBtAvailChange = function(onCb) {
    wx.onBluetoothAdapterStateChange(function (res) {
      console.log('蓝牙状态变化：'+JSON.stringify(res));
      var dinfres = {
        state: undefined,
      };
      dinfres.state = res.available;
      onCb&&onCb(dinfres);
    });
  }
  BtService.prototype.onBtConnChange = function(onCb) {
    wx.onBLEConnectionStateChange(function (res) {
      console.log('蓝牙连接变化：'+JSON.stringify(res));
      var dinfres = {
          state: undefined,
      };
      if (res.connected) {
        dinfres.state = BtEnum.CONN_DIS;
      }else {
        dinfres.state = BtEnum.CONN_ED;
      }
      onCb&&onCb(dinfres);
    });
  }

  global.BtService = new BtService();
})(this);