module.exports = function(){
  var _Window = WindowElements.gui.Window.get(),
      _onResize = [],
      _onClose = [],
      _onMinimize = [],
      _toggleMax = false;

  function WindowControls()
  {
    var x=0;
    WindowElements.close.onclick = function(){
      _Window.close();
    }

    WindowElements.minimize.onclick = function(){
      _Window.minimize();
    }

    WindowElements.maximize.onclick = function(){
      WindowControls.toggleMaximize();
    }

    _Window.removeAllListeners('close');
    _Window.removeAllListeners('minimize');
    _Window.removeAllListeners('resize');
    _Window.removeAllListeners('maximize');
    _Window.removeAllListeners('unmaximize');

    for(x=0;x<_onClose.length;x++){
      _Window.on('close',_onClose[x]);
    }

    for(x=0;x<_onMinimize.length;x++){
      _Window.on('minimize',_onMinimize[x]);
    }

    for(x=0;x<_onResize.length;x++){
      _Window.on('resize',_onResize[x]);
    }

    _Window.on('maximize',function(){
      _toggleMax = true;
    })

    _Window.on('unmaximize',function(){
      _toggleMax = false;
    })
  }

  WindowControls.Window = function(){
    return _Window;
  }

  WindowControls.toggleMaximize = function(){
    if(!_toggleMax){
        _toggleMax = !_toggleMax;
        _Window.maximize();
      }
      else{
        _toggleMax = !_toggleMax;
        _Window.unmaximize();
      }
    return WindowControls;
  }

  WindowControls.addControlListener = function(type,func){
    switch(type){
      case 'resize':
        _onResize.push(func);
      break;
      case 'close':
        _onClose.push(func);
      break;
      case 'minimize':
        _onMinimize.push(func);
      break;
    }
    return WindowControls;
  }

  WindowControls.removeControlListener = function(type,func){
    var x=0;
    switch(type){
      case 'resize':
        for(x=0;x<_onResize.length;x++){
          if(_onResize[x].toString() === func.toString()){
            _onResize.splice(x,1);
          }
        }
      break;
      case 'close':
        for(x=0;x<_onClose.length;x++){
          if(_onClose[x].toString() === func.toString()){
            _onClose.splice(x,1);
          }
        }
      break;
      case 'minimize':
        for(x=0;x<_onMinimize.length;x++){
          if(_onMinimize[x].toString() === func.toString()){
            _onMinimize.splice(x,1);
          }
        }
      break;
    }
    return WindowControls;
  }

  return WindowControls;
}
