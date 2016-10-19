module.exports = function(){
  var _scene = {},
      _camera = {},
      _mesh = {},
      _floorMesh = {},
      _wallRightMesh = {},
      _light = {};

  function Test(){
    _mesh.rotation.x += 0.01;
    _mesh.rotation.y += 0.02;
  }

  Test.create = function(){
     var  _geometry = new THREE.BoxGeometry( 200, 200, 200 ),
     material = new THREE.MeshBasicMaterial( { color: 0x2194ce, wireframe: true } );

    var _floor = new THREE.BoxGeometry(3000,50,4000),
        _floorMaterial = new THREE.MeshBasicMaterial({color: 0xc5c4c4});
        _floorMesh = new THREE.Mesh(_floor,_floorMaterial);
    
    var _wallRight = new THREE.BoxGeometry(50,800,2000),
        _wallRightMaterial = new THREE.MeshBasicMaterial({color: 0xc5c4c4});
        _wallRightMesh = new THREE.Mesh(_wallRight,_wallRightMaterial);

    _floorMesh.position.y -= 200;
    _floorMesh.position.z += 600;
    
    _wallRightMesh.position.z -= 400;
    _wallRightMesh.position.y += 200;
    _wallRightMesh.position.x += 1475;

    _mesh = new THREE.Mesh( _geometry, material );

    _floorMesh.recieveShadow = true;
    _mesh.recieveShadow = true;
    _wallRightMesh.recieveShadow = true;

    //_light = new THREE.PointLight(0xffffff);
    //_light.position.set(-50,50,50);
    return Test;
  }
  
  Test.startTestTime = function(Sun)
  {
    var currTime = Sun.time();
    
    Sun.updateTime((currTime === 1 ? 0 : (currTime += 0.0001)));
    
    setTimeout(function(){
      Test.startTestTime(Sun);
    },10);
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
  
  Test.walls = function(){
    return [_wallRightMesh];
  }

  Test.light = function(){
    return _light;
  }

  return Test;
}
