var os = require('os');

module.exports = function(){
  var _cpus = os.cpus(),
      _totlaIdle = 0,
      _totalTick = 0,
      _cpuAvg = 0,
      _ramTime = {},
      _totalRam = 0,
      _appRam = 0,
      _it = 0,
      _itKeys = [],
      _itK = 0;

  function System(){
    _ramTime = process.memoryUsage();
    System.getcpuTime();

    _totalRam = os.totalmem();
    _appRam = (~~(_ramTime.rss / 1000000));
    _cpuAvg = System.getcpuTime();
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
    _totlaIdle = 0;
    _totalTick = 0;

    for(_it=0;_it<_cpus.length;_it++) {
      _itKeys = Object.keys(_cpus[_it].times);
      for(_itK=0;_itK<_itKeys.length;_itK++){
        _totalTick += _cpus[_it].times[_itKeys[_itK]];
      }
      _totlaIdle += _cpus[_it].times.idle;
    }
    return (100 - ~~(100 * (_totlaIdle / _cpus.length) / (_totalTick / _cpus.length)));
  }

  return System;
}
