var path = process.cwd().replace(/\\/,"/")+"/App_Files/Window",
    CreateControls = require(path+"/Controls/Controls");

module.exports = function(){

var _Window = WindowElements.gui.Window.get(),
    _Controls = CreateControls(),
    _keyCommands = function(e){
      if(e.keyCode === 122){
        e.preventDefault();
        e.stopImmediatePropagation();
        _Controls.toggleMaximize();
      }
    }

  function Window(){

    WindowElements.document.removeEventListener('keyup',_keyCommands);

    WindowElements.document.addEventListener('keyup',_keyCommands);

    _Controls.Window(_Window).call();
  }

  Window.get = function(){
    return _Window;
  }

  Window.Controls = function(){
    return _Controls;
  }

  return Window;
}
