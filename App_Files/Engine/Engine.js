var localPath = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine",
    CreateDebug = require(localPath+"/Debug/Debug"),
    CreateInput = require(localPath+"/Input/Input"),
    CreateCamera = require(localPath+"/Camera/Camera"),
    CreateScene = require(localPath+"/Scene/Scene"),
    CreateRenderer = require(localPath+"/Renderer/Renderer"),
    CreateTest = require(localPath+"/test");

module.exports = function(){
  var _Renderer = CreateRenderer(),
      _Input = CreateInput(),
      _isRunning = true,
      _Debug = CreateDebug(),
      _Camera = CreateCamera(),
      _Scene = CreateScene(),
      _resolution = {w:1920,h:1080},
      _test = CreateTest(),
      _togglePointer = function(){
        Win.ViewPort().togglePointerLock(true);
      }

  function Engine(){
    _Input.call();
    _Debug.call();
    _Camera.width(_resolution.w).height(_resolution.h).call();

    _Scene.scene().add(_Camera.perspectiveCamera());

    _Renderer.call();

     /* REGION Test Code */
    _test.create();
    _Scene.addHighPoly(_test.mesh()).addHighPoly(_test.floor());
    _Scene.scene().add(_test.light());
    /* ENDREGION Test Code */
  }

  /* localize Engine Components */
  Engine.Input = _Input;
  Engine.Debugger = _Debug;
  Engine.Renderer = _Renderer;
  Engine.Camera = _Camera;
  Engine.Scene = _Scene;

  Engine.isRunning = function(v){
    if(v === undefined){
      return _isRunning;
    }
    _isRunning = !!v;
    return Engine;
  }

  Engine.renderer = function(){
    return _Renderer;
  }

  Engine.debug = function(d){
    if(d === undefined && _Debug.debugging()){
      _Debug.fps().position().meshes().system();
    }
    else{
      _Debug.debugging(d);
    }
    return Engine;
  }

  Engine.draw = function(){
    /* REGION Test */
    _test.call();
    /* ENDREGION Test */

    _Scene.call();
    return Engine;
  }

  Engine.render = function(){
    _Renderer.render(_Scene.scene(),_Camera.perspectiveCamera());
    return Engine;
  }

  return Engine;
}
