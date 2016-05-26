var path = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine/Renderer",
    CreateViewPort = require(path+"/ViewPort/ViewPort")

module.exports = function(){
  var _resolution = {w:1920,h:1080},
      _resolutionEnum = [{w:3840,h:2160},{w:2560,h:1440},{w:1920,h:1080},{w:1600,h:900},{w:1280,h:720}],
      _renderer = {},
      _renderElement = {},
      _renderContext = {},
      _ViewPort = CreateViewPort(),
      _antialias = true;

  function Renderer(){
    _ViewPort.call();

    _renderer = new THREE.WebGLRenderer({antialias:(_antialias)});
    _renderer.setSize(_resolution.w,_resolution.h);
    _renderElement = _renderer.domElement;
    _renderContext = _renderElement.getContext('webgl');

    _renderContext.clearColor(0.0, 0.0, 0.0, 1.0);
    _renderContext.enable(_renderContext.DEPTH_TEST);
    _renderContext.depthFunc(_renderContext.LEQUAL);
    _renderContext.clear(_renderContext.COLOR_BUFFER_BIT|_renderContext.DEPTH_BUFFER_BIT);
  }

  Renderer.render = function(s,c){
    if(s instanceof THREE.Scene && c instanceof THREE.PerspectiveCamera){
      _renderer.render(s,c);
      _ViewPort.context().drawImage(_renderElement,0,0,_ViewPort.width(),_ViewPort.height());
    }
  }

  Renderer.renderer = function(){
    return _renderer;
  }

  Renderer.viewport = function(){
    return _ViewPort;
  }

  Renderer.resolution = function(v){
    if(v === undefined){
      return _resolution;
    }
    if(typeof v === 'number' && v < _resolutionEnum.length){
      _resolution = _resolutionEnum[v];
    }
    return Renderer;
  }

  Renderer.antialias = function(v){
    if(v === undefined){
      return _antialias;
    }
    _antialias = !!v;
    return Renderer;
  }

  return Renderer;
}
