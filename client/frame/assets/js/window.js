function CreateWindowControls(){

  var _Window = window.require('nw.gui').Window.get(),
      _onResize = [],
      _onClose = [],
      _onMinimize = [];

  function WindowControls()
  {
    var x=0;
    document.getElementById('close').onclick = function(){
      _Window.close();
    }

    document.getElementById('minimize').onclick = function(){
      _Window.minimize();
    }

    _Window.removeAllListeners('close');
    _Window.removeAllListeners('minimize');
    _Window.removeAllListeners('resize');

    for(x=0;x<_onClose.length;x++){
      _Window.on('close',_onClose[x]);
    }

    for(x=0;x<_onMinimize.length;x++){
      _Window.on('minimize',_onMinimize[x]);
    }

    for(x=0;x<_onResize.length;x++){
      _Window.on('resize',_onResize[x]);
    }

  }

  WindowControls.Window = function(){
    return _Window;
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
