var path = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine/Shaders",
    CreateVertex = require(path+"/Vertex/Vertex"),
    CreateFragment = require(path+"/Fragment/Fragment");

module.exports = function(){
  var _vertex = CreateVertex(),
      _fragment = CreateFragment(),
      _shader = {};

  function Shader(){
    _vertex.call();
    _fragment.call();

    _shader = new THREE.ShaderMaterial({
      vertexShader : _vertex.rules(),
      fragmentShader : _fragment.rules()
    });
  }

  Shader.shader = function(){
    return _shader;
  }

  Shader.vertex = function(){
    return _vertex;
  }

  Shader.fragment = function(){
    return _fragment;
  }

  return Shader;
}
