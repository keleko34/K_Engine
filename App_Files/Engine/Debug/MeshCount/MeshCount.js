module.exports = function(){
  var _vertices = 0,
      _faces = 0,
      _meshes = 0;

  function MeshCount(){
    //need scene class to complete this
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
