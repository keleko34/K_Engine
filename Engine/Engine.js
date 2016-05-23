var localPath = process.cwd().replace(/\\/g,"/")+"/Engine",
    CreateFPS = require(localPath+"/FPS"),
    CreateTest = require(localPath+"/test");

module.exports = function(){
  var _threeRenderer = new THREE.WebGLRenderer({antialias:true}),
      _renderBuffer = _threeRenderer.domElement,
      _bufferContext = _renderBuffer.getContext('webgl'),
      _View = {},
      _ViewContext = {},
      _isRunning = true,
      _fps = CreateFPS(),
      _debug = false,
      _resolution = {w:1920,h:1080},
      _test = CreateTest();

  function Engine(){
    _threeRenderer.setSize(_resolution.w,_resolution.h);
    _bufferContext.clearColor(0.0, 0.0, 0.0, 1.0);
    _bufferContext.enable(_bufferContext.DEPTH_TEST);
    _bufferContext.depthFunc(_bufferContext.LEQUAL);
    _bufferContext.clear(_bufferContext.COLOR_BUFFER_BIT|_bufferContext.DEPTH_BUFFER_BIT);

    _test.width(_resolution.w).height(_resolution.h).create().camera().updateProjectionMatrix();
  }

  Engine.isRunning = function(v){
    if(v === undefined){
      return _isRunning;
    }
    _isRunning = !!v;
    return Engine;
  }

  Engine.threeRenderer = function(){
    return _threeRenderer;
  }

  Engine.renderBuffer = function(){
    return _renderBuffer;
  }

  Engine.fps = function(){
    return _fps;
  }

  Engine.resolution = function(w,h){
    if(w === undefined){
      return _resolution;
    }
    _resolution.w = (typeof w === 'number' ? w : _resolution.w);
    _resolution.h = (typeof h === 'number' ? h : _resolution.h);
    return Engine;
  }

  Engine.debug = function(d){
    if(d === undefined && _debug){
      _fps.call();
      WindowElements.fps.min.innerHTML = _fps.min();
      WindowElements.fps.max.innerHTML = _fps.max();
      WindowElements.fps.avg.innerHTML = _fps.avg();
      WindowElements.fps.current.innerHTML = _fps.current();
    }
    else{
      _debug = !!d;
    }
    return Engine;
  }

  Engine.draw = function(){
    //_test.call();

    //_threeRenderer.render(_test.scene(),_test.camera());

    return Engine;
  }

  Engine.render = function(){

    if(_ViewContext.drawImage !== undefined){
      _ViewContext.drawImage(_threeRenderer.domElement,0,0,parseInt(_View.getAttribute('width')),parseInt(_View.getAttribute('height')));
    }
    return Engine;
  }

  Engine.View = function(v){
    if(v === undefined){
      return _View;
    }
    _View = (typeof v === 'object' && v.getContext !== undefined ? v : _View);
    _ViewContext = (_View.getContext !== undefined ? _View.getContext('2d') : {});
    return Engine;
  }

  Engine.ViewContext = function(){
    return _ViewContext;
  }

  return Engine;
}
