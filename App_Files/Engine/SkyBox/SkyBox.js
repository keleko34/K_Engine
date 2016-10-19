/* SKYBOX will control the settings of the shaders based on the time of day, debug should allow for altering these as well */

var fs = require('fs'),
    localPath = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine/SkyBox",
    CreateSun = require(localPath+"/Sun/Sun");

module.exports = function(){
      var _skyBox = {},
      _sunMesh = {},
      _Sun = CreateSun();


  function SkyBox(){
    _Sun.call();
    _skyBox = _Sun.sky();
    _sunMesh = _Sun.mesh();
  }

  SkyBox.sky = function(){
    return _skyBox;
  }
  
  SkyBox.sunMesh = function(){
    return _sunMesh;
  }

  SkyBox.sun = function(){
    return _Sun;
  }

  return SkyBox;
}
