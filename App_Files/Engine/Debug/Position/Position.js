module.exports = function(){
  var _x = 0,
      _y = 0,
      _z = 0;

  function Position(){
    _x = Engine.Camera.perspectiveCamera().position.x;
    _y = Engine.Camera.perspectiveCamera().position.y;
    _z = Engine.Camera.perspectiveCamera().position.z;
  }

  Position.z = function(){
    return _z;
  }

  Position.y = function(){
    return _y;
  }

  Position.x = function(){
    return _x;
  }

  return Position;
}
