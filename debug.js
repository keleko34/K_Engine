var settings = {
  time_engine:function(v){
    if(document.activeElement.id !== 'date_time_input'){
      var inp = document.querySelector('#date_time_input');
      if(inp) inp.value = v;
    }
  },
  time_daycycle:function(v){
    if(document.activeElement.id !== 'date_daycycle_input'){
      var inp = document.querySelector('#date_daycycle_input');
      v = v.toString();
      if(inp) inp.value = (v.length < 4 ? (new Array((5-v.length)).join("0")+v) : v);
    }
  },
  time_nightcycle:function(v){
    if(document.activeElement.id !== 'date_nightcycle_input'){
      var inp = document.querySelector('#date_nightcycle_input');
      v = v.toString();
      if(inp) inp.value = (v.length < 4 ? (new Array((5-v.length)).join("0")+v) : v);
    }
  },
  time_play:function(v){
    if(v){
      var inp = document.querySelector('#play');
    }
    else{
      var inp = document.querySelector('#pause');
    }
    if(document.activeElement.id !== inp.id){
      var texts = Array.prototype.slice.call(document.querySelectorAll('#game_time .btn_text'));
      texts.forEach(function(btn){
        btn.classList.remove('active')
      });
      inp.classList.add('active');
    }
  }
};

function setHeaderLines(){
  var lines = Array.prototype.slice.call(document.querySelectorAll('.section__title__line'));
  lines.forEach(function(line){
    line.style.width = ((window.innerWidth-10)-line.previousElementSibling.clientWidth-30)+'px';
  });
  
  window.addEventListener('resize',function(){
    lines.forEach(function(line){
      line.style.width = ((window.innerWidth-10)-line.previousElementSibling.clientWidth-30)+'px';
    });
  })
}

function adddropdowns(){
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll('.dropdown'));
  dropdowns.forEach(function(list){
    list.style.height = "0px";
    
    list.previousElementSibling.onclick = function(){
      if(list.style.height && parseInt(list.style.height,10) === 0){
        list.style.height = null;
      }
      else{
        list.style.height = "0px";
      }
    }
  });
}

function addNav(){
  var links = Array.prototype.slice.call(document.querySelectorAll('.link'));
  links.forEach(function(link){
    link.onclick = function(){
      if(this.className.indexOf('active') === -1)
      {
        var pages = Array.prototype.slice.call(document.querySelectorAll('.page'))
        links.forEach(function(l){
          l.classList.remove('active');
        });
        this.classList.add('active');
        
        pages.forEach(function(page){
          page.classList.remove('active');
        });
        document.querySelector('#'+this.innerHTML.toLowerCase()).classList.add('active');
        setHeaderLines();
      }
    }
  });
}

function addSettings(win){
  var timeInput = document.querySelector('#date_time_input'),
      timeReg = /(\d){2}:(\d){2}:(\d){2}/,
      timecycles = Array.prototype.slice.call(document.querySelectorAll('.time_cycle')),
      cycleReg = /(\d){1,4}/,
      playbtn = document.querySelector("#play"),
      pausebtn = document.querySelector("#pause");
  timeInput.onkeyup = function(){
    var val = this.value;
    if(val.match(timeReg)){
      var vals = val.split(':').map(function(v){return parseInt(v);}),
          legal = true;

      if(vals[0] < 0 || vals[0] > 23){
        legal = false;
      }
      else if(vals[1] < 0 || vals[1] > 59){
        legal = false;
      }
      else if(vals[2] < 0 || vals[2] > 59){
        legal = false;
      }
      if(legal){
        win.postMessage(JSON.stringify({
          time_engine:val
        }),"*");
      }
    }
  }

  timecycles.forEach(function(cycle){
    cycle.onkeyup = function(e){
      var val = this.value;
      if(val.match(cycleReg)){
        val = parseInt(val);
        if(val !== 0 && val < 1441){
          var obj = {};
          obj[this.name] = val;
            win.postMessage(JSON.stringify(obj),"*");
        }
      }
    }
  });

  playbtn.onclick = function(){
    pausebtn.classList.remove('active');
    this.classList.add('active');
    win.postMessage(JSON.stringify({time_play:true}),"*")
  }

  pausebtn.onclick = function(){
    playbtn.classList.remove('active');
    this.classList.add('active');
    win.postMessage(JSON.stringify({time_play:false}),"*")
  }
}