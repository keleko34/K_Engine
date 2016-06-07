/* SKYBOX will control the settings of the shaders based on the time of day, debug should allow for altering these as well */

var fs = require('fs'),
    localPath = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine/SkyBox",
    path = process.cwd().replace(/\\/g,"/")+"/App_Files/Assets/skybox",
    CreateSun = require(localPath+"/Sun/Sun");

module.exports = function(){
  var _box = new THREE.CubeGeometry(10000, 10000, 10000,1,1,1,null,true),
      _currentSkyBox = 'evening',
      _currentSet = fs.readdirSync(path+"/"+_currentSkyBox).map(function(k,i){return path+"/"+_currentSkyBox+"/"+k}),
      _textureLoader = new THREE.CubeTextureLoader(),
      _textures = {},
      _material = {},
      _shader = {},
      _uniform = {},
      _setEnum = fs.readdirSync(path),
      _skyBox = {},
      _Sun = CreateSun();


  function SkyBox(){
    _shader = THREE.ShaderLib["cube"];
    _uniform = THREE.UniformsUtils.clone(_shader.uniforms);

    _textures = _textureLoader.load(_currentSet,function(tx){
      _uniform['tCube'].texture = tx;
    });

    _material = new THREE.ShaderMaterial({
        fragmentShader:_shader.fragmentShader,
        vertexShader:_shader.vertexShader,
        uniforms:_uniform,
        side: THREE.BackSide
      });
    _Sun.call();

    _skyBox = _Sun.mesh();

  }

  SkyBox.renderTexture = function(){
    if(_uniform['tCube'].texture){
      _material = new THREE.ShaderMaterial({
        fragmentShader:_shader.fragmentShader,
        vertexShader:_shader.vertexShader,
        uniforms:_uniform,
        side: THREE.BackSide
      });

      _skyBox.material = _material;
    }
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
