const os = require('os');
var ifaces = os.networkInterfaces();

module.exports={
  verifyPollArray:function(fromUser,fromMongo){
    
  },
  generateRandomNumbers:function(){
    return (Math.round(Math.random()*10000)+2)
  },
  getIp:function(){
      ipArray=[];
      Object.keys(ifaces).forEach(function(ifname){
        ifaces[ifname].forEach(function (iface) {
            var alias=0;
            if ('IPv4' !== iface.family || iface.internal !== false) {
              // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
              return;
            }

            if (alias >= 1) {
              // this single interface has multiple ipv4 addresses
              ipArray.push(iface.address);
            } else {
              // this interface has only one ipv4 adress
              ipArray.push(iface.address);
            }
            ++alias;
          });
      });
      return ipArray.length>0?ipArray[0]:null
  }
}
