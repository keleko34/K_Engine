module.exports = function(){
    var _pointerlock = false,
      _ViewPort = WindowElements.viewport,
      _Context = _ViewPort.getContext('2d'),
      _width = parseInt(_ViewPort.getAttribute('width'),10),
      _height = parseInt(_ViewPort.getAttribute('height'),10),
      _onPointerLock = [],
      _pointerLockEvent = function(){
        if(WindowElements.document.pointerLockElement){
          if(WindowElements.document.pointerLockElement.nodeName === 'CANVAS'){
            _pointerlock = true;
          }
        }
        else{
          _pointerlock = false;
        }
        Engine.Input.toggleRenderHeavyEvents(_pointerlock);
        for(var x=0;x<_onPointerLock.length;x++){
          _onPointerLock[x](_pointerlock);
        }
      },
      _pointerLockOn = function(){
        ViewPort.togglePointerLock(true);
      },
      _pointerLockOff = function(){
        ViewPort.togglePointerLock(false);
        Engine.Input.clearHolds();
      }


  function ViewPort(){
    WindowElements.document.removeEventListener('pointerlockchange',_pointerLockEvent);
    WindowElements.document.addEventListener('pointerlockchange',_pointerLockEvent);
    ViewPort.resize(Win.get().width,Win.get().height);
    ViewPort.togglePointerLock(true);
    Engine.Input
    .replaceBinding("Toggle PointerLock","dblclick","left",_pointerLockOn)
    .replaceBinding("PointerLock Off","keyup","esc",_pointerLockOff);

    Win.Controls().removeControlListener('resize',ViewPort.resize)
    .addControlListener('resize',ViewPort.resize);
  }

  ViewPort.resize = function(w,h){
    _width = w;
    _height = h;
    _ViewPort.setAttribute('height',h);
    _ViewPort.setAttribute('width',w);
  }

  ViewPort.view = function(){
    return _ViewPort;
  }

  ViewPort.context = function(){
    return _Context;
  }

  ViewPort.addPointerLockListener = function(func){
    _onPointerLock.push(func);
    return ViewPort;
  }

  ViewPort.removePointerLockListener = function(func){
    loop:for(var x=0;x<_onPointerLock.length;x++){
      if(_onPointerLock[x].toString() === func.toString()){
        _onPointerLock.slice(x,1);
      }
    }
    return ViewPort;
  }

  ViewPort.togglePointerLock = function(toggle){
    if(toggle !== undefined){
      _pointerlock = !toggle;
    }
    if(!_pointerlock){
      _ViewPort.requestPointerLock();
    }
    else{
      WindowElements.document.exitPointerLock();
    }
    return ViewPort;
  }

  ViewPort.width = function(v){
    if(v === undefined){
      return _width;
    }
    _width = (typeof v === 'number' ? v : _width);
    return ViewPort;
  }

  ViewPort.height = function(v){
    if(v === undefined){
      return _height;
    }
    _height = (typeof v === 'number' ? v-20 : _height);
    return ViewPort;
  }

  return ViewPort;
}
