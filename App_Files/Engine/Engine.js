var localPath = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine",
    CreateDebug = require(localPath+"/Debug/Debug"),
    CreateInput = require(localPath+"/Input/Input"),
    CreateCamera = require(localPath+"/Camera/Camera"),
    CreateScene = require(localPath+"/Scene/Scene"),
    CreateRenderer = require(localPath+"/Renderer/Renderer"),
    CreateTime = require(localPath+"/Time/Time"),
    CreateShader = require(localPath+"/Shaders/Shaders"),
    CreateSkyBox = require(localPath+"/SkyBox/SkyBox"),
    CreateTest = require(localPath+"/test");

module.exports = function(){
  var _Renderer = CreateRenderer(),
      _Input = CreateInput(),
      _isRunning = true,
      _Debug = CreateDebug(),
      _Camera = CreateCamera(),
      _Scene = CreateScene(),
      _Time = CreateTime(),
      _SkyBox = CreateSkyBox(),
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

    _Time.call();
    _Renderer.call();

    _SkyBox.call();

     /* REGION Test Code */
    _test.create();
    _Scene.addHighPoly(_test.mesh())
    .addHighPoly(_test.floor())
    .addLowPoly(_SkyBox.sky())
    .addLowPoly(_SkyBox.sunMesh());
    
    _test.walls().forEach(function(v){
      _Scene.addHighPoly(v);
    });
    
    _test.startTestTime(_SkyBox.sun())
    //_Scene.scene().add(_test.light());
    /* ENDREGION Test Code */
  }

  /* localize Engine Components */
  Engine.Input = _Input;
  Engine.Debugger = _Debug;
  Engine.Renderer = _Renderer;
  Engine.Camera = _Camera;
  Engine.Scene = _Scene;
  Engine.Time = _Time;
  Engine.CreateShader = CreateShader;
  Engine.Skybox = _SkyBox;

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
      _Debug.window(true).fps().position().meshes().system();
      
    }
    else{
      
      _Debug.window(false).debugging(d);
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
