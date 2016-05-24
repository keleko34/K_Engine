var path = process.cwd().replace(/\\/,"/")+"/App_Files/Engine/Debug",
    CreateFPS = require(path+"/FPS/FPS"),
    CreatePosition = require(path+"/Position/Position");

module.exports = function(){
  var _fps = CreateFPS(),
      _pos = CreatePosition(),
      _debugging = false;

  function Debug(){
    Engine.Input
    .removeEnvironmentListener(Debug.environment)
    .addEnvironmentListener(Debug.environment)
    .replaceBinding("Debug","keyup","f3",Debug.toggleDebugging)
    .replaceBinding("Mouse Debug","mousemove","left",Debug.mouse);
  }


  Debug.fps = function(){
    if(_debugging){
      _fps.call();
      WindowElements.debug.fps.min.innerHTML = _fps.min();
      WindowElements.debug.fps.max.innerHTML = _fps.max();
      WindowElements.debug.fps.avg.innerHTML = _fps.avg();
      WindowElements.debug.fps.current.innerHTML = _fps.current();
    }
    return Debug;
  }

  Debug.position = function(){
    if(_debugging){
      _pos.call();
      WindowElements.debug.pos.x.innerHTML = _pos.x();
      WindowElements.debug.pos.y.innerHTML = _pos.y();
      WindowElements.debug.pos.z.innerHTML = _pos.z();
    }
  }

  Debug.mouse = function(e){
    if(e.moveX && e.moveY && _debugging){
      WindowElements.debug.mouse.x.innerHTML = e.moveX;
      WindowElements.debug.mouse.y.innerHTML = e.moveY;
    }
    return Debug;
  }

  Debug.toggleDebugging = function(){
    _debugging = !_debugging;
    if(_debugging){
      WindowElements.debug.container.classList.remove('hide');
    }
    else{
      WindowElements.debug.container.classList.add('hide');
    }
  }

  Debug.environment = function(e){
    WindowElements.debug.environment.innerHTML = e.new;
  }

  Debug.debugging = function(v){
    if(v === undefined){
      return _debugging;
    }
    _debugging = !!v;
    return Debug;
  }

  return Debug;
}
