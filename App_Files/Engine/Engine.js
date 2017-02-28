var localPath = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine",
    InsertMath = require(process.cwd().replace(/\\/g,"/")+"/App_Files/Assets/js"+"/math"),
    CreateDebug = require(localPath+"/Debug/Debug"),
    CreateInput = require(localPath+"/Input/Input"),
    CreateCamera = require(localPath+"/Camera/Camera"),
    CreateScene = require(localPath+"/Scene/Scene"),
    CreateRenderer = require(localPath+"/Renderer/Renderer"),
    CreateTime = require(localPath+"/Time/Time"),
    CreateShader = require(localPath+"/Shaders/Shaders"),
    CreateSkyBox = require(localPath+"/SkyBox/SkyBox"),
    CreateConfig = require(localPath+"/Config/Config"),
    CreateTest = require(localPath+"/test");


module.exports = function(){
  var _Config = CreateConfig(),
      _Renderer = CreateRenderer(),
      _Input = CreateInput(),
      _isRunning = true,
      _Debug = CreateDebug(),
      _Camera = CreateCamera(),
      _Scene = CreateScene(),
      _Time = CreateTime()
      .setTime.apply({},_Config.get('timedate').time.split(':').map(function(n){return parseInt(n);}))
      .setDate(_Config.get('timedate').year,_Config.get('timedate').month,_Config.get('timedate').day,_Config.get('timedate').weekday),
      _SkyBox = CreateSkyBox(),
      _resolution = {w:1920,h:1080},
      _test = CreateTest(),
      _togglePointer = function(){
        Win.ViewPort().togglePointerLock(true);
      }

  function Engine(){
    _Input.call();
    _Debug.call();
    _Camera.width(_resolution.w)
    .height(_resolution.h)
    .degrees(_Config.get('rotation').degreesX,_Config.get('rotation').degreesY)
    .position(_Config.get('position').x,_Config.get('position').y,_Config.get('position').z)
    .call();

    _Scene.scene().add(_Camera.perspectiveCamera());

    _Renderer.call();

    _SkyBox.call();

     /* REGION Test Code */
    _test.create();
    _Scene.addHighPoly(_test.mesh())
    .addHighPoly(_test.floor())
    .addLowPoly(_SkyBox.sky())
    .addLowPoly(_SkyBox.sunMesh())
    .addLowPoly(_SkyBox.skyNight())
    .addLowPoly(_SkyBox.starMesh());
    
    _test.walls().forEach(function(v){
      _Scene.addHighPoly(v);
    });
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
  Engine.Config = _Config;

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
      _Debug.window(true).fps().position().meshes().system().time().resolution();
      
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

    _Time.call();
    _Scene.call();

    _SkyBox.sun().updateTime(_Time.rotation());
    _SkyBox.stars().updateTime(_Time.rotation())
    return Engine;
  }

  Engine.render = function(){
    _Renderer.render(_Scene.scene(),_Camera.perspectiveCamera());
    return Engine;
  }

  return Engine;
}
