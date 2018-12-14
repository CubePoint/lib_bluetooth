;(function(global){
  var BtEnum = {
    CONN_DIS: 0,
    CONN_ING: 1,
    CONN_ED: 2,

    E_BT_SWITCH: 'bt_switch',
    E_CONN_CHANGE: 'conn_change',
  }

  function BtBaseService () {
    var self = this;
  }
  BtBaseService.prototype.openBt = function(completeCb) {
    throw Error("un override openBt");
  }
  BtBaseService.prototype.closeBt = function(completeCb) {
    throw Error("un override closeBt");
  }
  BtBaseService.prototype.connectBt = function(deviceId,completeCb) {
    throw Error("un override connectBt");
  }
  BtBaseService.prototype.disconnectBt = function(deviceId,completeCb) {
    throw Error("un override disconnectBt");
  }
  BtBaseService.prototype.onBtAvailChange = function(onCb) {
    throw Error("un override onBtAvailChange");
  }
  BtBaseService.prototype.onBtConnChange = function(onCb) {
    throw Error("un override onBtConnChange");
  }

  global.BtEnum = BtEnum;
  global.BtBaseService = BtBaseService;
})(this);
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
;(function(global) {
  var BtEnum = global.BtEnum;
  var BtService = global.BtService;

  function Bt() {
    var self = this;

    this.eventPools = {
        name: {},//{eName:[eCb,]}
        push(eName,eCb) {
            if (!this[eName]) 
                this[eName] = [];
            this[eName].push(eCb);
        },
        clear(eName) {
            this[eName] = undefined;
        },
        run(eName,eArgus) {
            if (!this[eName])
                return;
            this[eName].forEach(function(eCb) {
                eCb.apply(self,eArgus);
            })
        }
    }

    this._initable = false; 
    this._available = false;
    this._scanable = false;
    Object.defineProperties(this,{
      initable: {
        get() {
            return _initable;
        },
        set(val) {
            _initable = val;
        }
      },
      available: {
        get() {
            return _available;
        },
        set(val) {
            _available = val;
            self.emit(BtEnum.E_BT_SWITCH,[_available]);
        }
      },
      scanable: {
        get() {
            return _scanable;
        },
        set(val) {
            _scanable = val;
        }
      }
    })
    
    this.setting = {

    }

    this.connectTarget = {
      deviceId: null,
      _connState: BtEnum.CONN_DIS,
      get connState() {
          return this._connState;
      },
      set connState(val) {
          this._connState = val;
          self.emit(BtEnum.E_CONN_CHANGE,[this._connState]);
      }
    }
  }
  Bt.prototype.init = function(iObj) {
    // iObj: openBefore openAfter setting
    var self = this;
    this.setting = iObj.setting;
    iObj.openBefore&&iObj.openBefore();
    BtService.openBt(function(res) {
      self._initable = res.state;
      self._available = res.available;

      if (res.state) {
        BtService.onBtAvailChange(function(res) {
            self.available = res.state;
        });
      }

      iObj.openAfter&&iObj.openAfter(res);
    })
  }
  Bt.prototype.destroy = function(iObj) {
    // iObj: completeCb
    var self = this;
    BtService.closeBt(function(res) {
      if (res.state) {
        self.initable = false;
      }
      iObj.completeCb&&iObj.completeCb(res);
    });
  }
  Bt.prototype.connect = function(iObj) {
    // iObj: deviceId completeCb
    var self = this;
    self.connectTarget.deviceId = iObj.deviceId;
    self.connectTarget._connState = BtEnum.CONN_DIS;
    BtService.connectBt(iObj.deviceId,function(res) {
      if (res.state) {
        BtService.onBtConnChange(function(res) {
          self.connectTarget.connState = res.state;
        });
      }
      iObj.completeCb&&iObj.completeCb(res);
    });
  }
  Bt.prototype.disconnect = function(iObj) {
    // iObj: completeCb
    var self = this;
    var deviceId = self.connectTarget.deviceId;
    BtService.disconnectBt(deviceId,function(res) {
        iObj.completeCb&&iObj.completeCb(res);
    })
  }
  Bt.prototype.on = function(eName,eCb) {
    // 事件：蓝牙开关 连接状态
    this.eventPools.push(eName,eCb);
  }
  Bt.prototype.emit = function(eName,eArgus) {
    this.eventPools.run(eName,eArgus);
  }

  global.Bt = new Bt();
})(this);