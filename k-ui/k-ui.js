var KUI = function(){}

KUI.prototype = {
  constructor: KUI,

  mobileBottomNaviBarRender: function(){
    document.querySelectorAll('.k-mobole-nav-bar-item').forEach(function(v){
      v.addEventListener('click', function(){
        v.parentElement.querySelectorAll('.k-mobole-nav-bar-item').forEach(function(vv){
          vv.classList.remove('active');
        })
        
        v.classList.add('active');
      });
    });
  }
}

var kui = new KUI();

window.addEventListener('load', function(){
  kui.mobileBottomNaviBarRender();
})
