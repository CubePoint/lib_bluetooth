(function(global){
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
})