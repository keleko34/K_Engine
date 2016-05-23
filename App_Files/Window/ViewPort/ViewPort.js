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
        for(var x=0;x<_onPointerLock.length;x++){
          _onPointerLock[x](_pointerlock);
        }
      }

  function ViewPort(){
    WindowElements.document.removeEventListener('pointerlockchange',_pointerLockEvent);
    WindowElements.document.addEventListener('pointerlockchange',_pointerLockEvent);

    _ViewPort.setAttribute('height',_height);
    _ViewPort.setAttribute('width',_width);

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
