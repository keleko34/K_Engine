function CreateWindow(win){

var _Window = win,
    _Controls = CreateControls(),
    _keyCommands = function(e){
      if(e.keyCode === 122){
        e.preventDefault();
        e.stopImmediatePropagation();
        _Controls.toggleMaximize();
      }
    },
    _height = _Window.height,
    _width = _Window.width;

  function Window(){

    document.removeEventListener('keyup',_keyCommands);

    document.addEventListener('keyup',_keyCommands);
    _Controls.Window(_Window).call();
  }

  Window.get = function(){
    return _Window;
  }

  Window.Controls = function(){
    return _Controls;
  }

  Window.height = function(v){
    if(v === undefined) return _height;
    _height = v;
    return Window;
  }

  Window.width = function(v){
    if(v === undefined) return _width;
    _width = v;
    return Window;
  }

  return Window;
}
