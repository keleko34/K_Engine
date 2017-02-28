var localPath = process.cwd().replace(/\\/g,"/")+"/App_Files/Engine",
    configJSON = require(localPath+"/Config/Config.json"),
    fs = require('fs');

module.exports = function(){
  var _config = configJSON;
  function Config(){

    return _config;
  }

  Config.set = function(key,values){
    _config[key] = values;
    fs.writeFile(localPath+"/Config/Config.json",JSON.stringify(_config,{},2)+"\n",{},function(err,success){
      if(err) console.error("ERR! Config failed to save");
    });
    return Config;
  }

  Config.get = function(key){
    return _config[key];
  }

  return Config;
}
