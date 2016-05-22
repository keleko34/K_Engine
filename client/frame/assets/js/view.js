module.exports = function(){
  console.log();
  var _View = WindowElements.viewport,
      _Context = _View.getContext('2d'),
      _width = 0,
      _height = 0,
      _renderBuffer = document.createElement('canvas');

  function View()
  {
    _View.setAttribute('height',_height);
    _View.setAttribute('width',_width);
    View.render();
    console.log(process.pid);
  }

  View.render = function(){
    _Context.drawImage(_renderBuffer,0,0,_width,_height);
    return View;
  }

  View.ViewPort = function(){
    return _View;
  }

  View.Context = function(){
    return _Context;
  }

  View.height = function(h){
    if(h === undefined){
      return _height;
    }
    _height = (typeof h === 'number' ? (h-20) : _height);
    return View;
  }

  View.width = function(w){
    if(w === undefined){
      return _width;
    }
    _width = (typeof w === 'number' ? (w) : _width);
    return View;
  }

  View.renderBuffer = function(b){
    if(b === undefined){
      return _renderBuffer;
    }
    _renderBuffer = (b.nodeName !== undefined && b.nodeName === 'CANVAS' ? b : _renderBuffer);
    return View;
  }

  return View;
}
