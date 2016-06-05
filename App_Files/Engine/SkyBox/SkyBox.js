var fs = require('fs'),
    path = process.cwd().replace(/\\/g,"/")+"/App_Files/Assets/skybox"

module.exports = function(){
  var _box = new THREE.CubeGeometry(10000,10000,10000,1,1,1,null),
      _currentSkyBox = 'evening',
      _currentSet = fs.readdirSync(path+"/"+_currentSkyBox).map(function(k,i){return path+"/"+_currentSkyBox+"/"+k}),
      _textures = THREE.CubeTextureLoader(_currentSet),
      _material = {},
      _shader = {},
      _uniform = {},
      _setEnum = fs.readdirSync(path),
      _skyBox = {};


  function SkyBox(){

    _shader = THREE.ShaderLib["cube"];
    _uniform = THREE.UniformsUtils.clone(_shader.uniforms);

    _uniform['tCube'].texture = _textures;
    _material = new THREE.ShaderMaterial({
        fragmentShader:_shader.fragmentShader,
        vertexShader:_shader.vertexShader,
        uniforms:_uniform
    });

    _skyBox = new THREE.Mesh(_box,_material);
  }

  SkyBox.sky = function(){
    return _skyBox;
  }

  SkyBox.textures = function(){
    return _textures;
  }

  SkyBox.material = function(){
    return _material;
  }

  SkyBox.currentSkyBox = function(v){
    if(v === undefined){
      return _currentSkyBox;
    }
    _currentSkyBox = (_setEnum.indexOf(v) > -1 ? v : _currentSkyBox);
    return SkyBox;
  }

  return SkyBox;
}
