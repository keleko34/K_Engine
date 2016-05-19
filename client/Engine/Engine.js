var localPath = process.cwd().replace(/\\/g,"/")+"/client/Engine",
    CreateFPS = require(localPath+"/FPS")

module.exports = function(){
  var _renderBuffer = document.createElement('canvas'),
      _bufferContext = _renderBuffer.getContext('webgl'),
      _fps = CreateFPS(),
      _debug = false;

  function Engine(){
    _bufferContext.clearColor(0.0, 0.0, 0.0, 1.0);
    _bufferContext.enable(_bufferContext.DEPTH_TEST);
    _bufferContext.depthFunc(_bufferContext.LEQUAL);
    _bufferContext.clear(_bufferContext.COLOR_BUFFER_BIT|_bufferContext.DEPTH_BUFFER_BIT);
  }

  Engine.renderBuffer = function(){
    return _renderBuffer;
  }

  Engine.fps = function(){
    return _fps;
  }

  Engine.debug = function(d){
    console.log("debugging",_debug);
    if(d === undefined && _debug){
      _fps.call();
      WindowElements.fps.min.innerHTML = _fps.min();
      WindowElements.fps.max.innerHTML = _fps.max();
      WindowElements.fps.avg.innerHTML = _fps.avg();
      WindowElements.fps.current.innerHTML = _fps.current();
    }
    else{
      _debug = !!d;
      return Engine;
    }
  }

  Engine.draw = function(){
    Engine.debug();
  }

  return Engine;
}
