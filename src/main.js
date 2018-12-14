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