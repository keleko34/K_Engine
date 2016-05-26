module.exports = function(){
  var _scene = {},
      _LODS = {},
      _HighpolyDistance = 30,
      _MidPolyDistance = 50,
      _LowPolyDistance = 50,
      _cameraLoadArea = 20,
      _currentPosition = {},
      _currentViewAngle = 45;

  function Scene(){

  }

  Scene.scene = function(){
    return _scene;
  }

  return Scene;
}
