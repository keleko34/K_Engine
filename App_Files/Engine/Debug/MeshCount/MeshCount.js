module.exports = function(){
  var _vertices = 0,
      _faces = 0,
      _meshes = 0,
      _it = 0,
      _cMesh = {};

  function MeshCount(){
    //need scene class to complete this
    _vertices = 0;
    _faces = 0;
    _meshes = 0;
    for(_it=0;_it<Engine.Scene.scene().children.length;_it++){
      _cMesh = Engine.Scene.scene().children[_it];
      if(_cMesh instanceof THREE.Mesh){
        _vertices += _cMesh.geometry.vertices.length;
        _faces += _cMesh.geometry.faces.length;
        _meshes += 1;
      }
    }
  }

  MeshCount.vertices = function(){
    return _vertices;
  }

  MeshCount.faces = function(){
    return _faces;
  }

  MeshCount.meshes = function(){
    return _meshes;
  }

  return MeshCount;
}
