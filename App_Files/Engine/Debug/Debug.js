var path = process.cwd().replace(/\\/,"/")+"/App_Files/Engine/Debug",
    CreateFPS = require(path+"/FPS/FPS");

module.exports = function(){
  var _fps = CreateFPS(),
      _debugging = false;

  function Debug(){
    Engine.Input.removeBinding("Debug")
    .addBinding("Debug","keyup","f3",Debug.toggleDebugging,true)
    .removeBinding("Mouse Debug")
    .addBinding("Mouse Debug","mousemove","left",Debug.mouse);
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

  Debug.debugging = function(v){
    if(v === undefined){
      return _debugging;
    }
    _debugging = !!v;
    return Debug;
  }

  return Debug;
}
