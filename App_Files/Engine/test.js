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



   var geometry = new THREE.BoxGeometry( 200, 200, 200 ),
       material = new THREE.MeshBasicMaterial( { color: 0x2194ce, wireframe: true } );

    var _floor = new THREE.BoxGeometry(1000,50,3000),
        _floorMaterial = new THREE.MeshBasicMaterial({color: 0xc5c4c4}),
        _floorMesh = new THREE.Mesh(_floor,_floorMaterial);

    _floorMesh.position.y -= 200;

    _mesh = new THREE.Mesh( geometry, material );

    _floorMesh.castShadow = true;
    _mesh.castShadow = true;

    _floorMesh.recieveShadow = true;
    _mesh.recieveShadow = true;

    _scene.add(_floorMesh);
    _scene.add( _mesh );


    var light = new THREE.PointLight(0xffffff);
    light.position.set(-50,50,50);
    _scene.add(light);
    return Test;
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
