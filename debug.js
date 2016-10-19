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
      }
    }
  });
}