var path = process.cwd().replace(/\\/,"/")+"/App_Files/Engine/Debug",
    CreateFPS = require(path+"/FPS/FPS"),
    CreatePosition = require(path+"/Position/Position"),
    CreateMeshCount = require(path+"/MeshCount/MeshCount"),
    CreateSystem = require(path+"/System/System");

module.exports = function(){
  var _fps = CreateFPS(),
      _pos = CreatePosition(),
      _meshcount = CreateMeshCount(),
      _system = CreateSystem(),
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
    return Debug;
  }

  Debug.mouse = function(e){
    if(e.moveX && e.moveY && _debugging){
      WindowElements.debug.mouse.x.innerHTML = e.moveX;
      WindowElements.debug.mouse.y.innerHTML = e.moveY;
    }
    return Debug;
  }

  Debug.meshes = function(){
    if(_debugging){
      _meshcount.call();
      WindowElements.debug.mesh.vertices.innerHTML = _meshcount.vertices();
      WindowElements.debug.mesh.faces.innerHTML = _meshcount.faces();
      WindowElements.debug.mesh.meshes.innerHTML = _meshcount.meshes();
    }
    return Debug;
  }

  Debug.system = function(){
    if(_debugging){
      _system.call();
      WindowElements.debug.system.cpuavg.innerHTML = _system.cpuAvg().reduce(function(o,k,i){return o+(i+1)+":"+k+"% ";},"");
      WindowElements.debug.system.totalram.innerHTML = parseInt(_system.totalRam()/1000000)+"MB";
      WindowElements.debug.system.appram.innerHTML = _system.appRam()+"%";
    }
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
