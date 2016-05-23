module.exports = function(){

  var _freemode = false,
      _camera = {};

  function Camera(){
    _camera = new THREE.PerspectiveCamera( 45, (Engine.resolution().w / Engine.resolution().h), 1, 10000 );
    _camera.position.z = 1000;

    Engine.Input.addEnvironment('freemode')
    .addBinding('Toggle FreeMode','keyup','p',Camera.toggleFreeMode,true);
  }

  Camera.toggleFreeMode = function(){
    _freemode = !_freemode;
    if(_freemode){
       Engine.Input.environment('freemode');
    }
    return Camera;
  }


  return Camera;
}
