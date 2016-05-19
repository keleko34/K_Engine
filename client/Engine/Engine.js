function CreateEngine(){
  var _renderBuffer = document.createElement('canvas'),
      _bufferContext = _renderBuffer.getContext('webgl');

  function Engine(){
    _bufferContext.clearColor(0.0, 0.0, 0.0, 1.0);
    _bufferContext.enable(_bufferContext.DEPTH_TEST);
    _bufferContext.depthFunc(_bufferContext.LEQUAL);
    _bufferContext.clear(_bufferContext.COLOR_BUFFER_BIT|_bufferContext.DEPTH_BUFFER_BIT);
  }

  Engine.renderBuffer = function(){
    return _renderBuffer;
  }

  Engine.draw = function(){

  }

  return Engine;
}
