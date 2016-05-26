var os = require('os');

module.exports = function(){
  var _cpus = os.cpus(),
      _cpuTime = {},
      _cpuAvg = 0,
      _ramTime = {},
      _totalRam = 0,
      _appRam = 0;

  function System(){
    _ramTime = process.memoryUsage();
    _cpuTime = System.getcpuTime();

    _totalRam = os.totalmem();
    _appRam = (100 - ~~(100 * _ramTime.heapUsed / _ramTime.heapTotal));
    _cpuAvg = _cpuTime.map(function(k,i){return k.percentage;});
  }

  System.cpus = function(){
    return _cpus;
  }

  System.cpuAvg = function(){
    return _cpuAvg;
  }

  System.totalRam = function(){
    return _totalRam;
  }

  System.appRam = function(){
    return _appRam;
  }

  System.getcpuTime = function(){
    var totalIdle = 0, totalTick = 0,cpus = [];

    for(var i = 0, len = _cpus.length; i < len; i++) {
      var cpu = _cpus[i];
      for(type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
      cpus.push({idle: totalIdle,  total: totalTick, percentage: (100 - ~~(100 * totalIdle / totalTick))});
    }
    return cpus;
  }

  return System;
}
