module.exports = function(){
  var _scene = new THREE.Scene(),
      _LODS = {High:[],Mid:[],Low:[]},
      _HighpolyDistance = 30,
      _MidPolyDistance = 50,
      _LowPolyDistance = 50,
      _cameraLoadArea = 20,
      _currentPosition = {x:0,y:0,z:0},
      _currentViewAngle = 45,
      _it = 0;

  function Scene(){
    /* Lods loaded based on vertice positions contained within viewAngle (Must use maths), loadarea based on position */
    for(_it=_scene.children.length-1;_it>=0;_it--){
      _scene.remove(_scene.children[_it]);
    }

    for(_it=0;_it<_LODS.High.length;_it++){
      _scene.add(_LODS.High[_it]);
    }
    for(_it=0;_it<_LODS.Mid.length;_it++){
      _scene.add(_LODS.Mid[_it]);
    }
    for(_it=0;_it<_LODS.Low.length;_it++){
      _scene.add(_LODS.Low[_it]);
    }
  }

  Scene.scene = function(){
    return _scene;
  }

  Scene.LODS = function(){
    return _LODS;
  }

  Scene.addHighPoly = function(m){
    _LODS.High.push(m);
    return Scene;
  }

  Scene.addMidPoly = function(m){
    _LODS.Mid.push(m);
    return Scene;
  }

  Scene.addLowPoly = function(m){
    _LODS.Low.push(m);
    return Scene;
  }

  Scene.highPolyDistance = function(v){
    if(v === undefined){
      return _HighpolyDistance;
    }
    _HighpolyDistance = (typeof v === 'number' ? v : _HighpolyDistance);
    return Scene;
  }

  Scene.midPolyDistance = function(v){
    if(v === undefined){
      return _MidPolyDistance;
    }
    _MidPolyDistance = (typeof v === 'number' ? v : _MidPolyDistance);
    return Scene;
  }

  Scene.lowPolyDistance = function(v){
    if(v === undefined){
      return _LowPolyDistance;
    }
    _LowPolyDistance = (typeof v === 'number' ? v : _LowPolyDistance);
    return Scene;
  }

  Scene.cameraLoadArea = function(v){
    if(v === undefined){
      return _cameraLoadArea;
    }
    _cameraLoadArea = (typeof v === 'number' ? v : _cameraLoadArea);
    return Scene;
  }

  Scene.position = function(v){
    if(v === undefined){
      return _currentPosition;
    }
    if(typeof v === 'object'){
      _currentPosition.x = (typeof v.x === 'number' ? v.x : _currentPosition.x);
      _currentPosition.y = (typeof v.y === 'number' ? v.y : _currentPosition.y);
      _currentPosition.z = (typeof v.z === 'number' ? v.z : _currentPosition.z);
    }
    return Scene;
  }

  Scene.currentViewAngle = function(v){
    if(v === undefined){
      return _currentViewAngle;
    }
    _currentViewAngle = (typeof v === 'number' ? v : _currentViewAngle);
    return Scene;
  }

  return Scene;
}
