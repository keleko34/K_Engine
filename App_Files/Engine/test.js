module.exports = function(){
  var _scene = {},
      _camera = {},
      _mesh = {},
      _floorMesh = {},
      _light = {};

  function Test(){
    _mesh.rotation.x += 0.01;
    _mesh.rotation.y += 0.02;
  }

  Test.create = function(){
     var  _geometry = new THREE.BoxGeometry( 200, 200, 200 ),
     material = new THREE.MeshBasicMaterial( { color: 0x2194ce, wireframe: true } );

    var _floor = new THREE.BoxGeometry(1000,50,3000),
        _floorMaterial = new THREE.MeshBasicMaterial({color: 0xc5c4c4});
        _floorMesh = new THREE.Mesh(_floor,_floorMaterial);

    _floorMesh.position.y -= 200;

    _mesh = new THREE.Mesh( _geometry, material );

    _floorMesh.castShadow = true;
    _mesh.castShadow = true;

    _floorMesh.recieveShadow = true;
    _mesh.recieveShadow = true;

    _light = new THREE.PointLight(0xffffff);
    _light.position.set(-50,50,50);
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

  Test.floor = function(){
    return _floorMesh;
  }

  Test.light = function(){
    return _light;
  }

  return Test;
}
