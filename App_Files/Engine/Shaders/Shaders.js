var path = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine/Shaders",
    CreateVertex = require(path+"/Vertex/Vertex"),
    CreateFragment = require(path+"/Fragment/Fragment");

module.exports = function(){
  var _vertex = CreateVertex(),
      _fragment = CreateFragment(),
      _shader = {},
      _uniforms = {},
      _side = THREE.FrontSide

  function Shader(){
    _vertex.call();
    _fragment.call();

    _shader = new THREE.ShaderMaterial({
      vertexShader : _vertex.rules(),
      fragmentShader : _fragment.rules(),
      uniforms : THREE.UniformsUtils.clone(_uniforms),
      side : _side
    });
  }

  Shader.Uniform = function(n,v){
    if(n === undefined){
      return _uniforms;
    }
    if(typeof n === 'string'){
      _uniforms[n] = v;
    }
    return Shader;
  }
  Shader.clearUniforms = function(){
    _uniforms = {};
    return Shader;
  }

  Shader.side = function(v){
    if(v === undefined){
      return _side;
    }
    _side = (v === THREE.FrontSide || v === THREE.BackSide ? v : _side);
    return Shader;
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
