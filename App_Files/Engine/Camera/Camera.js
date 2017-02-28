module.exports = function(){

  var _freemode = false,
      _prevEnv = 'default',
      _camera = {},
      _width = 0,
      _height = 0,
      _lookXSpeed = 6,
      _lookYSpeed = 8,
      _moveSpeed = 4,
      _forwardMultiplier = 0,
      _posX = 0,
      _posY = 100,
      _posZ = 2000,
      //degrees in relation to camera angle
      _degreesY = 0,
      _degreesX = 90;

  function Camera(){
    _camera = new THREE.PerspectiveCamera( 60, (_width / _height), 100, 2000000 );
    _camera.position.set( _posX, _posY, _posZ );
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
    .replaceBinding("freemode","moveup","keydown","e",Camera.move);

    _camera.updateProjectionMatrix();

    Camera.lookaround({moveX:0,moveY:0});
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

  Camera.degrees = function(x,y){
    if(x === undefined && y === undefined){
      return {degreesX:_degreesX,degreesY:_degreesY};
    }
    _degreesX = (typeof x === 'number' ? x : _degreesX);
    _degreesY = (typeof y === 'number' ? y : _degreesY);
    return Camera;
  }

  Camera.position = function(x,y,z){
    if(x === undefined && y === undefined && z === undefined){
      return {x:_posX,y:_posY,z:_posZ};
    }
    _posX = (typeof x === 'number' ? x : _posX);
    _posY = (typeof y === 'number' ? y : _posY);
    _posZ = (typeof z === 'number' ? z : _posZ);
    return Camera;
  }

  Camera.toggleFreeMode = function(){
    _freemode = !_freemode;
    if(_freemode){
      _prevEnv = Engine.Input.environment();
       Engine.Input.environment('freemode')
        .copyBinding('Debug')
        .copyBinding("Toggle PointerLock")
        .copyBinding("PointerLock Off");
    }
    else{
      Engine.Input.environment(_prevEnv);
    }
    return Camera;
  }

  Camera.setLookat = function(x,y){
    _degreesX = x;
    _degreesY = y;
    Camera.lookaround({moveX:0,moveY:0});
  }

  Camera.lookaround = function(e){
    var __target = _camera.getWorldDirection(),
        __adjacent = 100,
        __opposite,
        __hypotenuse;

    /* clamp max camera angle turn limit by speed */
    _degreesY += Math.clamp((-1*e.moveY),-_lookYSpeed,_lookYSpeed);
    _degreesX += Math.clamp(e.moveX,-_lookXSpeed,_lookXSpeed);
    _degreesY = Math.clamp(_degreesY,-90,90);

    __hypotenuse = Math.cos(_degreesY) * __adjacent;
    __opposite = Math.sin(_degreesY) * __hypotenuse;

    var __phi = ((90 - _degreesY) * Math.PI / 180),
        __theta = _degreesX * Math.PI / 180;

    __target.x = _camera.position.x + __adjacent * Math.sin(__phi) * Math.cos(__theta);
    __target.y = _camera.position.y + __adjacent * Math.cos(__phi);
    __target.z = _camera.position.z + __adjacent * Math.sin(__phi) * Math.sin(__theta);

    _camera.lookAt(__target);

    Engine.Config.set('rotation',Camera.degrees());

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

    Camera.position(_camera.position.x,_camera.position.y,_camera.position.z);
    Engine.Config.set('position',Camera.position());
  }

  return Camera;
}
