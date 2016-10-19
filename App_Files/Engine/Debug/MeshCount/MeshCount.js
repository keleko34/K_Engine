module.exports = function(){
  var _vertices = 0,
      _faces = 0,
      _meshes = 0,
      _it = 0,
      _lodLow = 0,
      _lodMid = 0,
      _lodHigh = 0,
      _visMesh = [],
      _cMesh = {};

  function MeshCount(){
    //need scene class to complete this
    _vertices = 0;
    _faces = 0;
    _meshes = 0;
    _lodLow = 0;
    _lodMid = 0;
    _lodHigh = 0;
    _visMesh = getMeshes(Engine.Scene.scene().children);
    
    for(_it=0;_it<_visMesh.length;_it++){
      _cMesh = _visMesh[_it];
      _vertices += _cMesh.geometry.vertices.length;
      _faces += _cMesh.geometry.faces.length;
    }
    _meshes = _visMesh.length;
    _lodLow = getMeshes(Engine.Scene.LODS().Low).length;
    _lodMid = getMeshes(Engine.Scene.LODS().Mid).length;
    _lodHigh = getMeshes(Engine.Scene.LODS().High).length;
  }
                                             
  function getMeshes(list){
      var meshes = [];
      for(var x=0,len=list.length;x<len;x++)
      {
        if(list[x].geometry !== undefined && list[x].geometry.vertices !== undefined && list[x].geometry.faces !== undefined)
        {
          meshes.push(list[x]);
        }
      }
      return meshes;
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
  
  MeshCount.lodlow = function(){
    return _meshes;
  }
  
  MeshCount.lodmid = function(){
    return _meshes;
  }
  
  MeshCount.lodhigh = function(){
    return _meshes;
  }

  return MeshCount;
}
