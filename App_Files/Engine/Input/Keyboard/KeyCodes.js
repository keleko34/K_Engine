module.exports = function(){
  var _codes = [];

  function KeyCodes(){
    var x =0,
        i = 0;

    /* Insert Char Codes a-z */
    for(x=65;x<91;x++){
      if(_codes[x] === undefined){
        _codes[x] = String.fromCharCode(x).toLowerCase();
      }
    }

    /* Insert Digits 0-9 */
    for(x=48;x<58;x++){
      if(_codes[x] === undefined){
        _codes[x] = String.fromCharCode(x);
      }
    }

    /* Insert NumPad 0-9 */
    for(x=96;x<106;x++){
      if(_codes[x] === undefined){
        _codes[x] ="numpad"+i;
        i++;
      }
    }

    /* Insert F Keys 1-24 */
    i = 1;
    for(x=112;x<136;x++){
      if(_codes[x] === undefined){
        _codes[x] ="f"+i;
        i++;
      }
    }

    /* Arrows */
    _codes[37] = (_codes[37] === undefined ? 'left' : _codes[37]);
    _codes[38] = (_codes[38] === undefined ? 'up' : _codes[38]);
    _codes[39] = (_codes[39] === undefined ? 'right' : _codes[39]);
    _codes[40] = (_codes[40] === undefined ? 'down' : _codes[40]);

    /* Lower Specials */
    _codes[32] = (_codes[32] === undefined ? 'spacebar' : _codes[32]);
    _codes[91] = (_codes[91] === undefined ? 'command' : _codes[91]);
    _codes[18] = (_codes[18] === undefined ? 'alt' : _codes[18]);
    _codes[17] = (_codes[17] === undefined ? 'ctrl' : _codes[17]);
    _codes[93] = (_codes[93] === undefined ? 'context' : _codes[93]);

    /* Side Specials */
    _codes[16] = (_codes[16] === undefined ? 'shift' : _codes[16]);
    _codes[20] = (_codes[20] === undefined ? 'caps' : _codes[20]);
    _codes[13] = (_codes[13] === undefined ? 'enter' : _codes[13]);
    _codes[9] = (_codes[93] === undefined ? 'tab' : _codes[9]);
    _codes[220] = (_codes[93] === undefined ? '\\' : _codes[220]);

    /* Top Specials */
    _codes[8] = (_codes[8] === undefined ? 'backspace' : _codes[8]);
    _codes[61] = (_codes[61] === undefined ? '=' : _codes[61]);
    _codes[109] = (_codes[109] === undefined ? '-' : _codes[109]);
    _codes[176] = (_codes[176] === undefined ? '`' : _codes[176]);

    /* Mid Specials */
    _codes[221] = (_codes[221] === undefined ? ']' : _codes[221]);
    _codes[219] = (_codes[219] === undefined ? '[' : _codes[219]);
    _codes[222] = (_codes[222] === undefined ? "'" : _codes[222]);
    _codes[186] = (_codes[186] === undefined ? ';' : _codes[186]);
    _codes[191] = (_codes[191] === undefined ? '/' : _codes[191]);
    _codes[190] = (_codes[190] === undefined ? '.' : _codes[190]);
    _codes[188] = (_codes[188] === undefined ? ',' : _codes[188]);

    /* F Key Specials */
    _codes[27] = (_codes[27] === undefined ? 'esc' : _codes[27]);
    _codes[44] = (_codes[44] === undefined ? 'printscreen' : _codes[44]);
    _codes[145] = (_codes[145] === undefined ? 'scrolllock' : _codes[145]);
    _codes[19] = (_codes[19] === undefined ? 'pause' : _codes[19]);

    /* Page Keys */
    _codes[45] = (_codes[45] === undefined ? 'insert' : _codes[45]);
    _codes[46] = (_codes[46] === undefined ? 'delete' : _codes[46]);
    _codes[36] = (_codes[36] === undefined ? 'home' : _codes[36]);
    _codes[35] = (_codes[35] === undefined ? 'end' : _codes[35]);
    _codes[33] = (_codes[33] === undefined ? 'pageup' : _codes[33]);
    _codes[34] = (_codes[34] === undefined ? 'pagedown' : _codes[34]);

    /* Num Pad Specials */
    _codes[144] = (_codes[144] === undefined ? 'numlock' : _codes[144]);
    _codes[111] = (_codes[111] === undefined ? 'divide' : _codes[111]);
    _codes[106] = (_codes[106] === undefined ? 'multiply' : _codes[106]);
    _codes[109] = (_codes[109] === undefined ? 'subtract' : _codes[109]);
    _codes[107] = (_codes[107] === undefined ? 'add' : _codes[107]);
  }

  KeyCodes.codes = function(){
    return _codes;
  }

  KeyCodes.clear = function(){
    _codes = [];
    return KeyCodes;
  }

  KeyCodes.setKeyCode = function(code,str){
    if(typeof code === 'number' && typeof str === 'string' && code < 255 && code > -1){
      _codes[code] = str;
    }
    return KeyCodes;
  }

  return KeyCodes;
}
