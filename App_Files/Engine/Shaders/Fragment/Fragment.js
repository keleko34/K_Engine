module.exports = function(){
  var _shaderRules = [],
      _injectedVars = [],
      _injectedRules = [],
      _rules = [];

  function FragmentShader(){
    _shaderRules = [
        "varying vec3 vWorldPosition;",
        "varying vec3 vPosition;",
        "varying vec3 vColor;",
		"void main() {",
		"}"
    ];
    _rules = _injectedVars.concat(_shaderRules);
    _rules.splice((_rules.length-1),0,_injectedRules);
    _rules = Array.prototype.concat.apply([],_rules);
  }

  FragmentShader.clearInjects = function(t){
    if(t === undefined){
      _injectedVars = [];
      _injectedRules = [];
      return FragmentShader;
    }
    switch(t){
      case 'vars':
        _injectedVars = [];
      break;
      case 'rules':
        _injectedRules = [];
      break;
    }
    return FragmentShader;
  }

  FragmentShader.injectVars = function(v){
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
    return FragmentShader;
  }

  FragmentShader.injectRules = function(v){
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
    return FragmentShader;
  }

  FragmentShader.rules = function(){
    return _rules.join("\n");
  }

  return FragmentShader;
}
