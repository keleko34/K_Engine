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
      _debugging = false,
      _loading = false,
      _window;

  function Debug(){
    Engine.Input
    .removeEnvironmentListener(Debug.environment)
    .addEnvironmentListener(Debug.environment)
    .replaceBinding("Debug","keyup","f3",Debug.toggleDebugging)
    .replaceBinding("Mouse Debug","mousemove","left",Debug.mouse);
  }

  var _once = false;
  Debug.fps = function(){
    if(_debugging && _window){
      _fps.call();
      
      _window.window.postMessage(JSON.stringify({
        fps_min:_fps.min(),
        fps_max:_fps.max(),
        fps_avg:_fps.avg(),
        fps_current:_fps.current()
      }),"*");
    }
    return Debug;
  }

  Debug.position = function(){
    if(_debugging && _window){
      _pos.call();
      
      _window.window.postMessage(JSON.stringify({
        pos_x: _pos.x(),
        pos_y:_pos.y(),
        pos_z:_pos.z()
      }),"*");
    }
    return Debug;
  }

  Debug.mouse = function(e){
    if(e.moveX && e.moveY && _debugging && _window){
      
      _window.window.postMessage(JSON.stringify({
        mouse_x: e.moveX,
        mouse_y:e.moveY
      }),"*");
    }
    return Debug;
  }

  Debug.meshes = function(){
    if(_debugging && _window){
      _meshcount.call();
      
      _window.window.postMessage(JSON.stringify({
        scene_vertices: _meshcount.vertices(),
        scene_faces: _meshcount.faces(),
        scene_meshes: _meshcount.meshes()
      }),"*");
    }
    return Debug;
  }

  Debug.system = function(){
    if(_debugging && _window){
      _system.call();
      
      _window.window.postMessage(JSON.stringify({
        system_ram: parseInt(_system.totalRam()/1000000)+"MB",
        system_app: _system.appRam()+"MB",
        system_cpu: _system.cpuAvg()+"%"
      }),"*");
    }
  }
  
  Debug.window = function(v){
    if(v && !_loading && _window === undefined){
      _loading = true;
        global.WindowElements.gui.Window.open('debug.html',{
          position: 'center',
          width: 400,
          height: 800
        },function(win){
          _window = win;
          _loading = false;
        });
    }
    else if(!v && _window !== undefined){
      _window.close();
      _window = undefined;
    }
    return Debug;
  }
  
  Debug.isOpen = function(){
    return (_window !== undefined);
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
