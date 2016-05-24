var base = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine/Input",
    CreateKeyBoard = require(base+"/Keyboard/Keyboard"),
    CreateMouse = require(base+"/Mouse/Mouse");

module.exports = function(){
  var _environments = {
        default:{

        }
      },
      _mouse = CreateMouse(),
      _keyboard = CreateKeyBoard(),
      _environment = 'default',
      _onBindingUpdateEvents = {"*":[]},
      _onEnvironmentChange = [],
      _itb = 0,
      _nameb = "*",
      _bindingUpdateEvent = function(e){
        /* e = name(String), added(object info), removed(String), environment(String) */

        /* Global listener */
        _nameb = "*";
        for(_itb=0;_itb<_onBindingUpdateEvents[_nameb].length;_itb++){
          if(typeof _onBindingUpdateEvents[_nameb][x] === 'function'){
            _onBindingUpdateEvents[_nameb][x](e);
          }
        }

        /* added name listener */
        _nameb = e.name;
        if(_onBindingUpdateEvents[_nameb] !== undefined){
          for(_itb=0;_itb<_onBindingUpdateEvents[_nameb].length;_itb++){
            if(typeof _onBindingUpdateEvents[_nameb][x] === 'function'){
              _onBindingUpdateEvents[_nameb][x](e);
            }
          }
        }

        /* removed name listener */
        _nameb = e.removed;
        if(_onBindingUpdateEvents[_nameb] !== undefined){
          for(_itb=0;_itb<_onBindingUpdateEvents[_nameb].length;_itb++){
            if(typeof _onBindingUpdateEvents[_nameb][x] === 'function'){
              _onBindingUpdateEvents[_nameb][x](e);
            }
          }
        }

      },
      _itI = 0,
      _keyList = [],
      _inputEvent = function(e){
        /* e = type(String), code(Int), key(String), shift(Bool), ctrl(Bool), alt(Bool), moveX(Int), moveY(Int) */
        _keyList = _environments[_environment][e.key];
        if(_keyList){
          loop:for(_itI=0;_itI<_keyList.length;_itI++){
            if(_keyList[_itI].type === e.type && _keyList[_itI].shift === e.shift && _keyList[_itI].ctrl === e.ctrl && _keyList[_itI].alt === e.alt){
              e.name = _keyList[_itI].name;
              e.readable = _keyList[_itI].readable;
              _keyList[_itI].func(e);
              break loop;
            }
          }
        }
      }


  function Inputs(){
    Inputs.toggleListening('mouse',true);
    Inputs.toggleListening('keyboard',true);
  }

  Inputs.copyBinding = function(environment,name){
    var __environment = (typeof name === 'string' ? environment : 'default'),
        __name = (typeof name === 'string' ? name : environment),
        __keys = [],
        __key = {},
        __k = "";

    if(_environments[__environment] !== undefined){
      __keys = Object.keys(_environments[__environment]);
      loop:for(var x=0;x<__keys.length;x++){
        __k = __keys[x];
        __key = _environments[__environment][__k];
        for(var i=0;i<__key.length;i++){
          if(__key[i].name === __name){
            Inputs.removeBinding(_environment,__key[i].name)
            .addBinding(_environment,__key[i].name,__key[i].type,__k,__key[i].func,__key[i].shift,__key[i].ctrl,__key[i].alt);
            break loop;
          }
        }
      }
    }
    return Inputs;
  }

  Inputs.addEnvironmentListener = function(func){
    _onEnvironmentChange.push(func);
    return Inputs;
  }

  Inputs.removeEnvironmentListener = function(func){
    loop:for(var x=0;x<_onEnvironmentChange.length;x++){
      if(_onEnvironmentChange[x].toString() === func.toString()){
        _onEnvironmentChange.splice(x,1);
        break loop;
      }
    }
    return Inputs;
  }

  Inputs.addBindingUpdateListener = function(name,func){
    if(typeof name === 'function'){
      _onBindingUpdateEvents["*"].push(name);
    }
    else if(typeof name === 'string'){
      if(_onBindingUpdateEvents[name] === undefined){
        _onBindingUpdateEvents[name] = [];
      }
      _onBindingUpdateEvents[name].push(func);
    }
    return Inputs;
  }

  Inputs.removeBindingUpdateListener = function(name,func){
    if(typeof name === 'function'){
      func = name;
      name = "*";
    }
    if(typeof name === 'string' && _onBindingUpdateEvents[name] !== undefined){
      loop:for(var x=0;x<_onBindingUpdateEvents[name].length;x++){
        if(func.toString() === _onBindingUpdateEvents[name][x].toString()){
          _onBindingUpdateEvents[name].splice(x,1);
        }
      }
    }
    return Inputs
  }

  Inputs.toggleRenderHeavyEvents = function(toggle){
    _mouse.toggleMouseMove(toggle);
    _mouse.toggleMouseDown(toggle);
  }

  Inputs.toggleListening = function(type,toggle){
    if(typeof type === 'string'){
      switch(type){
        case 'mouse':
          if(toggle){
            _mouseToggle = !toggle;
          }
          _mouse.removeMouseListener(_inputEvent);
          if(!_mouseToggle){
            _mouse.addMouseListener(_inputEvent).call();
          }
          _mouseToggle = !_mouseToggle;
        break;
        case 'keyboard':
          if(toggle){
            _keyboardToggle = !toggle;
          }
          _keyboard.removeKeyListener(_inputEvent);
          if(!_keyboardToggle){
            _keyboard.addKeyListener(_inputEvent).call();
          }
          _keyboardToggle = !_keyboardToggle;
        break;
      }
    }
    return Inputs;
  }

  Inputs.environment = function(v){
    if(v === undefined){
      return _environment;
    }
    if(typeof v === 'string' &&  _environments[v]){
      for(var x=0;x<_onEnvironmentChange.length;x++){
        _onEnvironmentChange[x]({old:_environment,new:v});
      }
      _environment = v;
    }
    return Inputs;
  }

  Inputs.currentBindings = function(){
    return _environments[_environment];
  }

  Inputs.addEnvironment = function(v){
    if(typeof v === 'string' && !_environments[v]){
      _environments[v] = {};
    }
    return Inputs;
  }

  Inputs.removeEnvironment = function(v){
    if(typeof v === 'string' && v !== 'default'){
      _environments[v] = null;
    }
    return Inputs;
  }

  Inputs.addBinding = function(environment,name,type,key,func,shift,ctrl,alt){

    /* Overload for environment */
    var __environment = (typeof func === 'function' ? environment : 'default'),
        __name = (typeof func === 'function' ? name : environment),
        __type = (typeof func === 'function' ? type : name),
        __key = (typeof func === 'function' ? key : type),
        __func = (typeof func === 'function' ? func : key),
        __shift = (typeof func === 'function' ? shift : func),
        __ctrl = (typeof func === 'function' ? ctrl : shift),
        __alt = (typeof func === 'function' ? alt : ctrl),
        __readable,
        __bindings = {},
        __bindingKeys = [],
        __bindingKey = {},
        __removal = "",
        __added = {},
        __found = false;

    __readable = (__shift ? "Shift ": "")+(__ctrl ? "Ctrl " : "")+(__alt ? "Alt " : "")+__key;
    if(_environments[__environment]){
      __bindings = _environments[__environment];

      /* Flag Existing if There */
      __bindingKeys = __bindings[__key];
      if(!__bindingKeys){
        __bindings[__key] = [];
        __bindingKeys = __bindings[__key];
      }
      loop:for(var x=0;x<__bindingKeys.length;x++){
        __bindingKey = __bindingKeys[x];
        if(__bindingKey.type === __type && __bindingKey.shift === !!__shift && __bindingKey.ctrl === !!__ctrl && __bindingKey.alt === !!__alt){
          __removal = __bindingKey.name;
          __bindingKey.name = __name;
          __bindingKey.func = __func;
          __added = __bindingKey;
          __found = true;
          break loop;
        }
      }
      if(!__found){
        __bindingKeys.push({readable:__readable,name:__name,type:__type,func:__func,shift:!!__shift,ctrl:!!__ctrl,alt:!!__alt});
        __added = __bindingKeys[(__bindingKeys.length-1)];
      }
      _bindingUpdateEvent({key:__key,name:__name,added:__added,removed:__removal,environment:__environment});
    }
    return Inputs;
  }

  Inputs.removeBinding = function(environment,name){
    var __environment = (name === undefined ? 'default' : environment),
        __name = (name === undefined ? environment : name),
        __keys = [],
        __key = {},
        __k = "";

    if(_environments[__environment]){
      __keys = Object.keys(_environments[__environment]);
      loop:for(var x=0;x<__keys.length;x++){
        __k = __keys[x];
        __key = _environments[__environment][__k];
        for(var i=0;i<__key.length;i++){
          if(__key[i].name === __name){
            __key.splice(i,1);
            break loop;
          }
        }
      }
      _bindingUpdateEvent({added:undefined,key:__k,name:__name,removed:__name,environment:__environment});
    }
    return Inputs;
  }

  Inputs.replaceBinding = function(environment,name,type,key,func,shift,ctrl,alt){
    var __environment = (typeof func === 'function' ? environment : 'default'),
        __name = (typeof func === 'function' ? name : environment),
        __type = (typeof func === 'function' ? type : name),
        __key = (typeof func === 'function' ? key : type),
        __func = (typeof func === 'function' ? func : key),
        __shift = (typeof func === 'function' ? shift : func),
        __ctrl = (typeof func === 'function' ? ctrl : shift),
        __alt = (typeof func === 'function' ? alt : ctrl);
    Inputs.removeBinding(__environment,__name);
    Inputs.addBinding(__environment,__name,__type,__key,__func,__shift,__ctrl,__alt);
    return Inputs;
  }

  Inputs.clearHolds = function(){
    _keyboard.clearHoldings();
    _mouse.clearHoldings();
    return Inputs;
  }

  return Inputs;
}
