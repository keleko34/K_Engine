module.exports = function(){
  var _min = 100,
      _max = 0,
      _avg = 0,
      _arr = [],
      _lastTime = 0,
      _currentFPS = 0,
      _loopIt = 0

  function FPS(){
    var i = 0,
        now = Date.now();
    _avg = 0;

    if (_lastTime !== 0 && _lastTime !== now) {
        _currentFPS = Math.round(1000 / (now - _lastTime));

        _arr.push(_currentFPS);
        if (_arr.length > 100) {
            _arr.shift();
        }
        for (i = 0; i < _arr.length; i++) {
            _avg += _arr[i];
        }
        _avg /= _arr.length;
        _avg = Math.round(_avg);

        if (++_loopIt > 1) {
            if (_currentFPS < _min) {
                _min = _currentFPS;
            }
            if (_currentFPS > _max) {
                _max = _currentFPS;
            }
        }
    }
      _lastTime = now;
  }

  FPS.current = function(){
    return _currentFPS;
  }

  FPS.min = function(){
    return _min;
  }

  FPS.max = function(){
    return _max;
  }

  FPS.avg = function(){
    return _avg;
  }

  return FPS;
}
