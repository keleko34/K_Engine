/* SKYBOX will control the settings of the shaders based on the time of day, debug should allow for altering these as well */

var fs = require('fs'),
    localPath = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine/SkyBox",
    CreateSun = require(localPath+"/Sun/Sun"),
    CreateStars = require(localPath+"/Stars/Stars");

module.exports = function(){
      var _skyBox = {},
          _skyBoxNight = {},
          _sunMesh = {},
          _starMesh = {},
          _Sun = CreateSun(),
          _Stars = CreateStars();


  function SkyBox(){
    _Sun.call();
    _skyBox = _Sun.sky();
    _sunMesh = _Sun.mesh();

    _Stars.call();
    _skyBoxNight = _Stars.sky();
    _starMesh = _Stars.mesh();
  }

  SkyBox.sky = function(){
    return _skyBox;
  }
  
  SkyBox.skyNight = function(){
    return _skyBoxNight;
  }

  SkyBox.starMesh = function(){
    return _starMesh;
  }

  SkyBox.sunMesh = function(){
    return _sunMesh;
  }

  SkyBox.sun = function(){
    return _Sun;
  }

  SkyBox.stars = function(){
    return _Stars;
  }

  return SkyBox;
}
