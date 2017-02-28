var path = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine/Shaders",
    CreateVertex = require(path+"/Vertex/Vertex"),
    CreateFragment = require(path+"/Fragment/Fragment");

module.exports = function(){
  var _vertex = CreateVertex(),
      _fragment = CreateFragment(),
      _shader = {},
      _uniforms = {},
      _baseUniforms = {
        iGlobalTime:{type:'f',value: 0.1}
      },
      _loadeduniforms = {},
      _side = THREE.FrontSide,
      _clock = new THREE.Clock();

  function Shader(){
    _vertex.call();
    _fragment.call();
    
    Object.keys(_baseUniforms).forEach(function(v){
      if(_uniforms[v] === undefined) _uniforms[v] = _baseUniforms[v];
    });

    _loadeduniforms = THREE.UniformsUtils.clone(_uniforms);

    Object.keys(_loadeduniforms).forEach(function(v){
      _loadeduniforms[v].value = _uniforms[v];
    });
    
    _shader = new THREE.ShaderMaterial({
      vertexShader : _vertex.rules(),
      fragmentShader : _fragment.rules(),
      //vertexColors: THREE.VertexColors,
      uniforms : _loadeduniforms,
      side : _side,
      blending : THREE.NormalBlending,
      transparent : true
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
  
  Shader.loadedUniforms = function(){
    return _loadeduniforms;
  }
  
  Shader.clearUniforms = function(){
    _uniforms = {};
    return Shader;
  }

  Shader.updateUniforms = function()
  {
    Shader.Uniform('iGlobalTime',_clock.elapsedTime);
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
