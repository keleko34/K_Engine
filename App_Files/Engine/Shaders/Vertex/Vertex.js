module.exports = function(){
  var _shaderRules = [],
      _injectedVars = [],
      _injectedRules = [],
      _rules = [];

  function VertexShader(){
    _shaderRules = [
      "varying vec3 vWorldPosition;",
      "varying vec3 vNormal;",
      "varying vec3 vPosition;",
      "varying vec2 vUv;",
		"void main() {",
            "vUv = uv;",
            "vPosition = position;",
			"vec4 worldPosition = (modelMatrix * vec4( position, 1.0 ));",
			"vWorldPosition = worldPosition.xyz;",
            "vNormal = normal;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
    ];
    _rules = _injectedVars.concat(_shaderRules);
    _rules.splice((_rules.length-2),0,_injectedRules);
    _rules = Array.prototype.concat.apply([],_rules);
  }

  VertexShader.clearInjects = function(t){
    if(t === undefined){
      _injectedVars = [];
      _injectedRules = [];
      return VertexShader;
    }
    switch(t){
      case 'vars':
        _injectedVars = [];
      break;
      case 'rules':
        _injectedRules = [];
      break;
    }
    return VertexShader;
  }

  VertexShader.injectVars = function(v){
    if(v === undefined){
      return _injectedVars;
    }
    if(typeof v === 'string'){
      _injectedVars.push(v);
    }
    else if(v.constructor.toString() === Array.toString()){
      _injectedVars.push(v);
      _injectedVars = Array.prototype.concat.apply([],_injectedVars);
    }
    return VertexShader;
  }

  VertexShader.injectRules = function(v){
    if(v === undefined){
      return _injectedRules;
    }
    if(typeof v === 'string'){
      _injectedRules.push(v);
    }
    else if(v.constructor.toString() === Array.toString()){
      _injectedRules.push(v);
      _injectedRules = Array.prototype.concat.apply([],_injectedRules);
    }
    return VertexShader;
  }

  VertexShader.rules = function(){
    return _rules.join("\n");
  }

  return VertexShader;
}
