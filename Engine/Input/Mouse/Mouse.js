module.exports = function(){
  var _holding = false,
      _holdTimer = null,
      _code = 0,
      _key = '',
      _movementX = 0,
      _movementY = 0,
      _shift = false,
      _alt = false,
      _ctrl = false,
      _toggle = false,
      _mouseCodes = ['left','middle','right'],
      _onMouseEvents = [],
      _it = 0,
      _loopEvents = function(e){
        _code = e.button;
        _key = _mouseCodes[_code];
        _shift = !!e.shiftKey;
        _alt = !!e.altKey;
        _ctrl = !!e.ctrlKey;

        for(_it=0;_it<_onMouseEvents.length;_it++){
           if(typeof _onMouseEvents[_it] === 'function'){
             _onMouseEvents[_it]({shift:_shift,ctrl:_ctrl,alt:_alt,moveX:e.movementX,moveY:e.movementY,code:_code,key:_key,type:e.type,holding:(e._holding !== undefined ? true : false)});
           }
        }
      },
      _MouseEvent = function(e){
        e.preventDefault();
        e.stopPropagation();
        if(e.type === 'mousedown' && !_holding){
          /* Single Mouse Down Event Without holding */
           _loopEvents(e);
          _holding = true;
          e._holding = true;
          _holdTimer = setTimeout(function(){_MouseEvent(e);},1);
        }
        else if(_holding && (e.type === 'mouseup' || e.type === 'click' || e.type === 'dblclick')){
          _holding = false;
        }

        if(!_holding){
          /* Standard Mouse Event */
          _loopEvents(e);
        }
        else if(_holding && e._holding && e.type === 'mousedown'){
          /* Our Holding Events as we ignore all mousedown events during Holding */
          if(_holdTimer){
            clearTimeout(_holdTimer);
          }
          _loopEvents(e);
          if(_holding){
            _holdTimer = setTimeout(function(){_MouseEvent(e);},1);
          }
        }
        else if(_holding && !e._holding && e.type === 'mousemove'){
          _loopEvents(e);
        }
      }

  function Mouse(){
    Mouse.toggleEventListener(true);
  }

  Mouse.toggleMouseMove = function(toggle){
    WindowElements.viewport.removeEventListener('mousemove',_MouseEvent);
    if(toggle){
      WindowElements.viewport.addEventListener('mousemove',_MouseEvent);
    }
  }

  Mouse.toggleMouseDown = function(toggle){
    WindowElements.viewport.removeEventListener('mousedown',_MouseEvent);
    if(toggle){
      WindowElements.viewport.addEventListener('mousedown',_MouseEvent);
    }
  }

  Mouse.toggleEventListener = function(toggle){
    if(typeof toggle === 'boolean'){
      _toggle = !toggle;
    }
    WindowElements.viewport.removeEventListener('mousemove',_MouseEvent);
    WindowElements.viewport.removeEventListener('mousedown',_MouseEvent);
    WindowElements.viewport.removeEventListener('mouseup',_MouseEvent);
    WindowElements.viewport.removeEventListener('click',_MouseEvent);
    WindowElements.viewport.removeEventListener('dblclick',_MouseEvent);

    if(!_toggle){
      WindowElements.viewport.addEventListener('mousemove',_MouseEvent);
      WindowElements.viewport.addEventListener('mousedown',_MouseEvent);
      WindowElements.viewport.addEventListener('mouseup',_MouseEvent);
      WindowElements.viewport.addEventListener('click',_MouseEvent);
      WindowElements.viewport.addEventListener('dblclick',_MouseEvent);
    }
    _toggle = !_toggle;
  }

  Mouse.removeMouseListener = function(func){
    if(typeof func === 'function'){
      loop:for(var x=0;x<_onMouseEvents.length;x++){
        if(func.toString() === _onMouseEvents[x].toString()){
          _onMouseEvents.splice(x,1);
          break loop;
        }
      }
    }
    return Mouse;
  }

  Mouse.addMouseListener = function(func){
    if(typeof func === 'function'){
      _onMouseEvents.push(func);
    }
    return Mouse;
  }

  Mouse.holding = function(v){
    if(v === undefined){
      return _holding;
    }
    _holding = !!v;
    return Mouse;
  }

  Mouse.movementX = function(v){
    if(v === undefined){
      return _movementX;
    }
    _movementX = (typeof v === 'number' ? v : _movementX);
    return Mouse;
  }

  Mouse.movementY = function(v){
    if(v === undefined){
      return _movementY;
    }
    _movementY = (typeof v === 'number' ? v : _movementY);
    return Mouse;
  }

  Mouse.code = function(v){
    if(v === undefined){
      return _code;
    }
    _code = (typeof v === 'number' && v < 3 ? v : _code);
    return Mouse;
  }

  Mouse.key = function(v){
    if(v === undefined){
      return _key;
    }
    _key = (_mouseCodes.indexOf(v) > -1 ? v : _key);
    return Mouse;
  }

  Mouse.shift = function(v){
    if(v === undefined){
      return _shift;
    }
    _shift = !!v;
    return Mouse;
  }

  Mouse.ctrl = function(v){
    if(v === undefined){
      return _ctrl;
    }
    _ctrl = !!v;
    return Mouse;
  }

  Mouse.alt = function(v){
    if(v === undefined){
      return _alt;
    }
    _alt = !!v;
    return Mouse;
  }

  return Mouse;
}
