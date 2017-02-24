module.exports = function(){
  var _Window = {},
      _maximized = false,
      _minimized = false,
      _onResize = [],
      _onClose = [],
      _onMinimize = [],
      _onMaximize = [];

  function Controls(){

    _Window.removeAllListeners('close');
    _Window.removeAllListeners('minimize');
    _Window.removeAllListeners('resize');
    _Window.removeAllListeners('maximize');
    _Window.removeAllListeners('restore');

    _Window.on('maximize',function(e){
      _maximized = true;
      for(var x=0;x<_onMaximize.length;x++){
        _onMaximize[x](_maximized);
      }
      for(var x=0;x<_onResize.length;x++){
        _onResize[x](_Window.width,_Window.height);
      }
    });

    _Window.on('minimize',function(e){
      _minimized = true;
      for(var x=0;x<_onMinimize.length;x++){
        _onMinimize[x](_minimized);
      }
    });

    _Window.on('restore',function(e){
      if(_minimized){
        _minimized = false;
      }
      else{
        _maximized = false;
      }
      for(var x=0;x<_onMinimize.length;x++){
        _onMinimize[x](_minimized);
      }
      for(var x=0;x<_onMaximize.length;x++){
        _onMaximize[x](_maximized);
      }
      for(var x=0;x<_onResize.length;x++){
        _onResize[x](_Window.width,_Window.height);
      }
    });

    _Window.on('resize',function(e){
      for(var x=0;x<_onResize.length;x++){
        _onResize[x](_Window.width,_Window.height);
      }
    });

    WindowElements.Controls.close.onclick = function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      for(var x=0;x<_onClose.length;x++){
        _onClose[x]();
      }
      _Window.close(true);
    }

    WindowElements.Controls.maximize.onclick = function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      Controls.toggleMaximize();
    }

    WindowElements.Controls.minimize.onclick = function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      Controls.toggleMinimize();
    }

    WindowElements.Controls.topbar.ondblclick = function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      Controls.toggleMaximize();
    };
  }

  Controls.addControlListener = function(type,func){
    if(typeof type === 'string' && typeof func === 'function'){
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
        case 'maximize':
          _onMaximize.push(func);
        break;
      }
    }
    return Controls;
  }

  Controls.removeControlListener = function(type,func){
    if(typeof type === 'string' && typeof func === 'function'){
      var __arr = [];
      switch(type){
        case 'resize':
          __arr = _onResize;
        break;
        case 'close':
          __arr = _onClose;
        break;
        case 'minimize':
          __arr = _onMinimize;
        break;
        case 'maximize':
          __arr = _onMaximize;
        break;
      }

      loop:for(var x=0;x<__arr.length;x++){
        if(__arr[x].toString() === func.toString()){
          __arr.splice(x,1);
          break loop;
        }
      }
    }
    return Controls;
  }

  Controls.Window = function(w){
      if(w === undefined){
        return _Window;
      }
    _Window = (typeof w === 'object' && w.on !== undefined ? w : _Window);
    return Controls;
  }

  Controls.toggleMaximize = function(toggle){
    if(toggle !== undefined){
      _maximized = !toggle;
    }
    if(!_maximized){
        _Window.maximize();
      }
      else{
        _Window.restore();
      }
    return Controls;
  }

  Controls.toggleMinimize = function(toggle){
    if(toggle !== undefined){
      _minimized = !toggle;
    }
    if(!_minimized){
      _Window.minimize();
    }
    else{
      _Window.restore();
    }
    return Controls;
  }

  return Controls;
}
