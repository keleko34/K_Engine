module.exports = function(){

  var _freemode = false,
      _prevEnv = 'default',
      _camera = {},
      _width = 0,
      _height = 0,
      _lookXSpeed = 10,
      _lookYSpeed = 20,
      _moveSpeed = 4,
      _forwardMultiplier = 0,
      _lon = 95,
      _lat = 450;

  function Camera(){
    _camera = new THREE.PerspectiveCamera( 45, (_width / _height), 1, 10000 );
    _camera.position.z += 800;
    _camera.rotation.set( 0, 0, 0 );

    Engine.Input.addEnvironment('freemode')
    .replaceBinding('Toggle FreeMode','keyup','f5',Camera.toggleFreeMode)
    .replaceBinding("freemode","LookAround","mousemove","left",Camera.lookaround)
    .replaceBinding("freemode",'Toggle FreeMode','keyup','f5',Camera.toggleFreeMode)
    .replaceBinding("freemode","moveforward","keydown","w",Camera.move)
    .replaceBinding("freemode","moveright","keydown","d",Camera.move)
    .replaceBinding("freemode","moveback","keydown","s",Camera.move)
    .replaceBinding("freemode","moveleft","keydown","a",Camera.move)
    .replaceBinding("freemode","movedown","keydown","q",Camera.move)
    .replaceBinding("freemode","moveup","keydown","e",Camera.move)

    _camera.updateProjectionMatrix();
  }

  Camera.perspectiveCamera = function(){
    return _camera;
  }

  Camera.width = function(v){
    if(v === undefined){
      return _width;
    }
    _width = (typeof v === 'number' ? v : _width);
    return Camera;
  }

  Camera.height = function(v){
    if(v === undefined){
      return _height;
    }
    _height = (typeof v === 'number' ? v : _height);
    return Camera;
  }

  Camera.toggleFreeMode = function(){
    _freemode = !_freemode;
    if(_freemode){
      _prevEnv = Engine.Input.environment();
       Engine.Input.environment('freemode')
        .copyBinding('Debug')
        .copyBinding("Toggle PointerLock");
    }
    else{
      Engine.Input.environment(_prevEnv);
    }
    return Camera;
  }

  Camera.setLatLon = function(){
    /* need to create reverse look at position matrix for lat and lon */
    var __lookat = _camera.getWorldDirection(),
        __revPhi = function(n){
          return (n / (Math.PI/180) - 90) * -1;
        },
        __revTheta = function(n){
          return n / (Math.PI/180);
        }


  }

  Camera.lookaround = function(e){
    _lon += Math.min(Math.max(e.moveX, -_lookXSpeed), _lookXSpeed); //Here we limit the speed the user can look on X axis
    _lat -= -Math.min(Math.max(e.moveY, -_lookYSpeed), _lookYSpeed); //Here we limit the speed the user can look on Y axis

    var __phi = (90 - _lat) * Math.PI / 180,
        __theta = _lon * Math.PI / 180,
        __target = _camera.getWorldDirection()
    //console.log(__target,"lon",_lon,"lat",_lat,__phi,__theta);
    __phi = THREE.Math.mapLinear(__phi, 0, Math.PI, 0, Math.PI/4);

    __target.x = _camera.position.x + 100 * Math.sin(__phi) * Math.cos(__theta);
    __target.y = _camera.position.y + 100 * Math.cos(__phi);
    __target.z = _camera.position.z + 100 * Math.sin(__phi) * Math.sin(__theta);

    _camera.lookAt(__target);
    Engine.Debugger.mouse(e);
  }

  Camera.move = function(e){
    switch(e.key){
      case "w":
        _camera.translateZ(-(_moveSpeed + _forwardMultiplier));
      break;
      case "d":
       _camera.translateX(_moveSpeed);
      break;
      case "s":
        _camera.translateZ(_moveSpeed);
      break;
      case "a":
        _camera.translateX(-_moveSpeed);
      break;
      case "q":
        _camera.translateY(-_moveSpeed);
      break;
      case "e":
        _camera.translateY(_moveSpeed);
      break;
    }
  }

  return Camera;
}
