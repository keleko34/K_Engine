module.exports = function(){
  var _Window = WindowElements.gui.Window.get(),
      _maximized = false,
      _minimized = false,
      _onResize = [],
      _onClose = [],
      _onMinimize = [],
      _onMaximize = [];

  function Controls(){

  }

  controls.Window = function(w){
      return _Window;
  }

  Controls.toggleMaximize = function(toggle){
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

  return Controls;
}
