;(function(global){
  var BtEnum = global.BtEnum;
  var BtBaseService = global.BtBaseService;
  
  function BtService() {
    var self = this;
    BtBaseService.apply(self,arguments);
  }
  BtService.prototype = Object.create(BtBaseService.prototype);
  BtService.prototype.openBt = function(completeCb) {

  }
  BtService.prototype.closeBt = function(completeCb) {

  }
  BtService.prototype.connectBt = function(deviceId,completeCb) {

  }
  BtService.prototype.disconnectBt = function(deviceId,completeCb) {

  }
  BtService.prototype.onBtAvailChange = function(onCb) {

  }
  BtService.prototype.onBtConnChange = function(onCb) {

  }

  global.BtService = new BtService();
})(this);