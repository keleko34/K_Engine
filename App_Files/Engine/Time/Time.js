module.exports = function(){

  var _tickTracker = Date.now(),
      _nextTickTracker = Date.now(),
      _currentTick = 0,
      _currentTime = 0,
      _currentMinute = 0,
      _currentDay = 0,
      _currentMonth = 0,
      _currentSeason = 'summer',
      _tickInterval = 1000, //each second, controls how fast time goes, higher the faster time goes, lower the slower it goes
      _dayInterval = ((1000*60)*10), //day lasts 10 minutes
      _nightInterval = ((1000*60)*8), //night lasts 8 minutes
      _isDay = true,
      _monthInterval = 30,
      _seasonInterval = 2,
      _seasons = ['summer','fall','winter','spring'],
      _onTickUpdate = [],
      _it = 0,
      _onTickEvent = function(){
        for(_it=0;_it<_onTickUpdate.length;_it++){
          _onTickUpdate[_it]({month:(_seasons.indexOf(_currentSeason)*_seasonInterval),day:_currentDay,minute:_currentMinute,time:_currentTime,isDay:_isDay});
        }
      }

  function Time(){
    _nextTickTracker = Date.now();
    _currentTick += _nextTickTracker - _tickTracker;
    _tickTracker = _nextTickTracker;

    if(_currentTick > _tickInterval){
      _currentTime += _tickInterval;
      _currentTick = (_currentTick-_tickInterval);
      _currentMinute = _currentTime/(1000*60);
      //telling day or night
      if(_isDay){
        if(_currentTime >= _dayInterval){
          _isDay = false;
          _currentTime = (_currentTime-_dayInterval);
        }
      }
      else{
        if(_currentTime >= _nightInterval){
          _isDay = true;
          _currentTime = (_currentTime-_nightInterval);
        }
      }

      if(_currentDay >= _monthInterval){
        _currentMonth += 1;
        _currentDay = (_currentDay-_monthInterval);
      }

      if(_currentMonth >= _seasonInterval){
        _currentSeason = _seasons[((_seasons.indexOf(_currentSeason)+1) === (_seasons.length) ? 0 : (_seasons.indexOf(_currentSeason)+1))];
        _currentMonth = (_currentMonth - _seasonInterval);
      }
      _onTickEvent();
    }
  }

  Time.addTickEvent = function(func){
    if(typeof func === 'function'){
      _onTickUpdate.push(func);
    }
    return Time;
  }

  Time.removeTickEvent = function(func){
    loop:for(var x=0;x<_onTickUpdate.length;x++){
      if(func.toString() === _onTickUpdate[x].toString()){
        _onTickUpdate.splice(x,1);
        break loop;
      }
    }
    return Time;
  }

  Time.season = function(v){
    if(v === undefined){
      return _currentSeason;
    }
    _currentSeason = (_seasons.indexOf(v) > -1 ? v : _currentSeason);
    return Time;
  }

  Time.isDay = function(){
    return _isDay;
  }

  Time.day = function(){
    return _currentDay;
  }

  Time.minute = function(){
    return _currentMinute;
  }

  return Time;
}
