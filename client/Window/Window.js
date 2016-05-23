var path = process.cwd().replace(/\\/,"/")+"/client/Window",
    CreateControls = require(path+"/Controls/Controls"),
    CreateViewPort = require(path+"/ViewPort/ViewPort");

module.exports = function(){

var _Window = WindowElements.gui.Window.get(),
    _Controls = CreateControls(),
    _ViewPort = CreateViewPort(),
    _keyCommands = function(e){
      if(e.keyCode === 122 && e.shiftKey){
        e.preventDefault();
        e.stopImmediatePropagation();
        _Controls.toggleMaximize();
      }
      if(e.keyCode === 27 && e.shiftKey){
        e.preventDefault();
        e.stopImmediatePropagation();
        _ViewPort.togglePointerLock(false);
      }
    },
    _resizeEvent = function(w,h){
      _ViewPort.width(w).height(h).call();
    }

  function Window(){

    WindowElements.document.removeEventListener('keyup',_keyCommands);

    WindowElements.document.addEventListener('keyup',_keyCommands);

    _Controls.removeControlListener('resize',_resizeEvent)
    .addControlListener('resize',_resizeEvent)
    .Window(_Window)
    .call();

    WindowElements.document.ondblclick = function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      _ViewPort.togglePointerLock(true);
    }

    _ViewPort.width(_Window.width)
    .height(_Window.height)
    .togglePointerLock(true)
    .call();
  }

  Window.Controls = function(){
    return _Controls;
  }

  Window.View = function(){
    return _ViewPort;
  }

  return Window;
}
