module.exports = function(){

  var _dateStart = new Date(),
      _startTick = Date.now(),
      _tickTracker = Date.now(),
      _nextTickTracker = Date.now(),
      _prevTicks = 0,
      _ticks = 0,
      _change = 0,
      _currentRate = 0,
      _rateDay = 10,
      _rateDayMs = parseFloat((1000/((60 * 24)/_rateDay)).toFixed(3)),
      _rateNight = 8,
      _rateNightMs = parseFloat((1000/((60 * 24)/_rateNight)).toFixed(3)),
      _isDay = false,
      _update = 0,
      _seconds = 0,
      _minutes = _dateStart.getMinutes(),
      _hours = 0,
      _day = 1,
      _dayEnum = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      _weekday = _dateStart.getDay(),
      _day_readable = _dayEnum[_weekday],
      _monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"],
      _monthEnum = [
        {name:"January",days:31},
        {name:"February",days:28},
        {name:"March",days:31},
        {name:"April",days:30},
        {name:"May",days:31},
        {name:"June",days:30},
        {name:"July",days:31},
        {name:"August",days:31},
        {name:"September",days:30},
        {name:"October",days:31},
        {name:"November",days:30},
        {name:"December",days:31}],
      _month = _dateStart.getMonth(),
      _month_readable = _monthEnum[_month],
      _season = 0,
      _seasonMonths = [[8,9,10],[11,0,1],[2,3,4],[5,6,7]],
      _season_readable = 'Winter',
      _seasonsEnum = ['Fall','Winter','Spring','Summer'],
      _year = _dateStart.getFullYear(),
      _daytime_milleseconds = 0,
      _time_readable = '',
      _standardtime_readable = '',
      _isStandard = false,
      _date_readable = '',
      _timedate_readable = '',
      _isPaused = false,
      _onTickUpdate = [],
      _onTickEvent = function(){
        for(var _it=0,len = _onTickUpdate.length;_it<len;_it++){
          _onTickUpdate[_it]({timeStamp:_timedate_readable,isStandardTime:_isStandard,isDay:_isDay,scene:Engine.Scene().scene,daytime:_daytime_milleseconds});
        }
      }

  function Time(){
    _nextTickTracker = Date.now();
    
    _change += (_nextTickTracker - (_tickTracker === 0 ? _nextTickTracker : _tickTracker));
    _currentRate = (_isDay ? _rateDayMs : _rateNightMs);
    _update = (_currentRate <= _change ? Math.floor(_change/_currentRate) : 0);
    _change = (_change - (_currentRate*_update));
    _tickTracker = _nextTickTracker;

    if(!_isPaused)
    {

      _prevTicks = _ticks;
      _ticks = (_nextTickTracker - _startTick)/1000;
      
      _seconds += _update;
      _minutes += (_seconds >= 60 ? Math.floor(_seconds/60) : 0);
      
      _seconds = (_seconds >= 60 ? Math.floor(_seconds - (60 * _seconds/60)) : Math.floor(_seconds));
      _hours += (_minutes >= 60 ? Math.floor(_minutes/60) : 0);
      
      _minutes = (_minutes >= 60 ? Math.floor(_minutes - (60 * _minutes/60)) : _minutes);
      _day += (_hours >= 24 ? Math.floor(_hours/24) : 0);
      
      _weekday = (_hours >= 24 ? (_weekday+1 === _dayEnum.length ? 0 : _weekday+1) : _weekday);
      _day_readable = _dayEnum[_weekday];
      
      _hours = (_hours >= 24 ? Math.floor(_hours - (24 * _hours/24)) : _hours);
      _month += (_day >= (_monthEnum[_month].days) ? Math.floor(_day/(_monthEnum[_month].days)) : 0);
      
      _isDay = ((_hours > 5) && (_hours < 18));
      
      _day = (_day > (_monthEnum[_month].days) ? Math.floor(_day - ((_monthEnum[_month].days) * _day/(_monthEnum[_month].days))) : _day);
      _year += (_month >= 12 ? Math.floor(_month/12) : 0);
      
      _month = (_month >= 12 ? Math.floor(_month - (12 * _month/12)) : _month);
      
      _month_readable = _monthEnum[_month].name;
      
      _season = (_seasonMonths.reduce(function(o,v,i){
        o = (v.indexOf(_month) !== -1 ? i : o);
        return o;
      },0));
      
      _season_readable = _seasonsEnum[_season];
      
      _daytime_milleseconds = (1000 * _seconds * _minutes * _hours);
      
      _time_readable = Time.getTime();
      
      _standardtime_readable = Time.getStandardTime();
      
      _date_readable = (Time.formatTime(_day)+" "+_day_readable+", "+_month_readable+" "+_year);
      
      _timedate_readable = (_isStandard ? _standardtime_readable+" "+_date_readable : _time_readable+" "+_date_readable);

      if((Math.floor(_ticks)-Math.floor(_prevTicks)) !== 0){
        _onTickEvent();
      }

      global.WindowElements.time.innerHTML = Time.getStandardTime(true,true,false);
      global.WindowElements.date.innerHTML = _date_readable;

      Engine.Config.set('timedate',{
        year: _year,
        month: _month_readable,
        day: _day,
        weekday:_day_readable,
        time: _time_readable.replace(/\s/,'')
      });

    }
  }

  Time.formatTime = function(v){
    return (v < 10 ? "0"+v : v);
  }

  Time.getStandardTime = function(h,m,s){
    var h = (h === undefined || h === !0 ? Time.formatTime((_hours > 12) ? (_hours - 12) : (_hours === 0 ? 12 : _hours)) : null),
        m = (m === undefined || m === !0 ? Time.formatTime(_minutes) : null),
        s = (s === undefined || s === !0 ? Time.formatTime(_seconds) : null);

    return (h ? h+(m ? ":" : (s ? " - " : " ")) : "")+(m ? m+(s ? ":" : " ") : "")+(s ? s+" " : "")+(_hours > 12 ? "PM" : "AM");
  }

  Time.getTime = function(h,m,s){
    var h = (h === undefined || h === !0 ? Time.formatTime(_hours) : null),
        m = (m === undefined || m === !0 ? Time.formatTime(_minutes) : null),
        s = (s === undefined || s === !0 ? Time.formatTime(_seconds) : null);

    return (h ? h+(m ? ":" : (s ? " - " : " ")) : "")+(m ? m+(s ? ":" : " ") : "")+(s ? s+" " : "");
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

  Time.rateDay = function(){
    return _rateDay;
  }

  Time.rateNight = function(){
    return _rateNight;
  }

  Time.setDayRateInMinutes = function(min){
    min = (min === 0 ? 0.001 : min);
    _rateDay = min;
    _rateDayMs = parseFloat((1000/((60 * 24)/_rateDay)).toFixed(3),10);
    return Time;
  }

  Time.setNightRateInMinutes = function(min){
    min = (min === 0 ? 0.001 : min);
    _rateNight = min;
    _rateNightMs = parseFloat((1000/((60 * 24)/_rateNight)).toFixed(3),10);
    return Time;
  }

  Time.setStandard = function(v){
    _isStandard = !!v;
    return Time;
  }

  Time.isDay = function(){
    return _isDay;
  }

  Time.setTime = function(h,m,s){
    _hours = (typeof h === 'number' && h < 24 ? h : _hours);
    _minutes = (typeof h === 'number' && m < 60 ? m : _minutes);
    _seconds = (typeof h === 'number' && s < 60 ? s : _seconds);
    return Time;
  }

  Time.setDate = function(y,m,d,dr){
    _year = (typeof y === 'number' ? y : _year);
    if(typeof m === 'number'){
      _month = (m < _monthEnum.length ? m : _month);
      _month_readable = (_monthEnum[_month].name);
    }
    else if(typeof m === 'string'){
      _month_readable = m;
      _month = _monthNames.indexOf(m);
    }
    _day = (typeof d === 'number' && d <= _monthEnum[_month].days ? d : _day);
    _day_readable = (_dayEnum.indexOf(dr) !== -1 ? dr : _day_readable);
    _weekday = _dayEnum.indexOf(_day_readable);
    _season = (_seasonMonths.reduce(function(o,v,i){
      o = (v.indexOf(_month) !== -1 ? i : o);
      return o;
    },0));
    
    _season_readable = _seasonsEnum[_season];
    return Time;
  }

  Time.readableTimeDate = function(){
    return _timedate_readable;
  }

  Time.readableDate = function(){
    return _date_readable;
  }

  Time.readableTime = function(){
    return _time_readable;
  }

  Time.seconds = function(){
    return _seconds;
  }

  Time.minutes = function(){
    return _minutes;
  }

  Time.hours = function(){
    return _hours;
  }

  Time.day = function(r){
    return (r ? _day_readable : _day);
  }

  Time.month = function(r){
    return (r ? _month_readable : _month);
  }

  Time.season = function(r){
    return (r ? _season_readable : _season);
  }

  Time.dayTimeMilleseconds = function(){
    return _daytime_milleseconds;
  }

  Time.rotation = function(){
    var _rotation = ((_seconds + 60 * _minutes + 60 * 60 * _hours)/(60*60*24))+0.25;
    return (_rotation > 1 ? (_rotation-1) : _rotation);
  }

  Time.togglePause = function(v)
  {
    _isPaused = !!v;
    return Time;
  }

  Time.isPaused = function(){
    return _isPaused;
  }

  return Time;
}
