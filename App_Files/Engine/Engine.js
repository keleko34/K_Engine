var localPath = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine",
    CreateDebug = require(localPath+"/Debug/Debug"),
    CreateInput = require(localPath+"/Input/Input"),
    CreateTest = require(localPath+"/test");

module.exports = function(){
  var _threeRenderer = new THREE.WebGLRenderer({antialias:true}),
      _renderBuffer = _threeRenderer.domElement,
      _bufferContext = _renderBuffer.getContext('webgl'),
      _Input = CreateInput(),
      _View = Win.ViewPort().view(),
      _ViewContext = Win.ViewPort().context(),
      _isRunning = true,
      _Debug = CreateDebug(),
      _resolution = {w:1920,h:1080},
      _test = CreateTest(),
      _togglePointer = function(){
        Win.ViewPort().togglePointerLock(true);
      }

  function Engine(){
    _threeRenderer.setSize(_resolution.w,_resolution.h);
    _bufferContext.clearColor(0.0, 0.0, 0.0, 1.0);
    _bufferContext.enable(_bufferContext.DEPTH_TEST);
    _bufferContext.depthFunc(_bufferContext.LEQUAL);
    _bufferContext.clear(_bufferContext.COLOR_BUFFER_BIT|_bufferContext.DEPTH_BUFFER_BIT);

    /* REGION Test Code */
    _test.width(_resolution.w).height(_resolution.h).create().camera().updateProjectionMatrix();
    /* ENDREGION Test Code */

    _Input.call();
    _Debug.call();
  }

  Engine.Input = _Input;
  Engine.Debugger = _Debug;

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
    if(d === undefined && _Debug.debugging()){
      _Debug.fps();
    }
    else{
      _Debug.debugging(d);
    }
    return Engine;
  }

  Engine.draw = function(){
    _test.call();

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
