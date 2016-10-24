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
        scene_meshes: _meshcount.meshes(),
        scene_lodlow: _meshcount.lodlow(),
        scene_lodmid: _meshcount.lodmid(),
        scene_lodhigh: _meshcount.lodhigh()
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
    return Debug;
  }

  Debug.time = function(){
    if(_debugging && _window){
      var currentTime = new Date();
      _window.window.postMessage(JSON.stringify({
        time_local: (Engine.Time.formatTime(currentTime.getHours())+":"+Engine.Time.formatTime(currentTime.getMinutes())+":"+Engine.Time.formatTime(currentTime.getSeconds())),
        time_engine: Engine.Time.getTime(),
        time_isday: Engine.Time.isDay(),
        time_daycycle: Engine.Time.rateDay(),
        time_nightcycle: Engine.Time.rateNight(),
        time_play:!Engine.Time.isPaused()
      }),"*");
    }
    return Debug;
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
    
    if(_window && _window.window.closed){
      _debugging = false;
      _window = undefined;
    }
    
    return Debug;
  }
  
  Debug.isOpen = function(){
    return (_window !== undefined);
  }

  Debug.toggleDebugging = function(){
    _debugging = !_debugging;
  }

  Debug.environment = function(e){
    if(_debugging && _window){
      _window.window.postMessage(JSON.stringify({
        environment_mode: e.new
      }),"*");
    }
  }

  Debug.filterMessages = function(data){
    Object.keys(data).forEach(function(v){
      switch(v){
        case 'time_engine':
          Engine.Time.setTime.apply({},data[v].split(":").map(function(v){return parseInt(v);}));
        break;
        case 'time_daycycle':
          Engine.Time.setDayRateInMinutes(data[v]);
        break;
        case 'time_nightcycle':
          Engine.Time.setNightRateInMinutes(data[v]);
        break;
        case 'time_play':
          Engine.Time.togglePause(!data[v]);
        break;
      }
    });
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
