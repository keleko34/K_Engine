module.exports = function(){
  var _scene = {},
      _camera = {},
      _mesh = {},
      _height = 1080,
      _width = 1920;

  function Test(){
    _mesh.rotation.x += 0.01;
    _mesh.rotation.y += 0.02;
  }

  Test.create = function(){

    _scene = new THREE.Scene();

    _camera = new THREE.PerspectiveCamera( 45, _width / _height, 1, 10000 );
    _camera.position.z = 1000;

   var geometry = new THREE.BoxGeometry( 200, 200, 200 ),
       material = new THREE.MeshBasicMaterial( { color: 0x2194ce, wireframe: true } );

    _mesh = new THREE.Mesh( geometry, material );
    _scene.add( _mesh );
  }

  Test.width = function(w){
    if(w === undefined){
      return _width;
    }
    _width = (typeof w === 'number' ? w : _width);
    return Test;
  }

  Test.height = function(h){
    if(h === undefined){
      return _height;
    }
    _height = (typeof h === 'number' ? h : _height);
    return Test;
  }

  Test.scene = function(){
    return _scene;
  }

  Test.camera = function(){
    return _camera;
  }

  Test.mesh = function(){
    return _mesh;
  }

  return Test;
}
