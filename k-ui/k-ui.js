var KUI = function(){
  this.__LeftTag = '[%';
  this.__RightTag = '%]';
  this.__EqualTag = '=';
  this.__popup_idx = 0;
}

KUI.prototype = {
  constructor: KUI,

  query: function(selector){
    return document.querySelectorAll(selector);
  },

  remove: function(elms){
    elms.forEach(function(v){
      v.remove();
    });
  },

  bind: function(elms, event, fn){
    elms.forEach(function(item){
      item.addEventListener(event, fn);
    });
  },

  prop: function(elms, p, val){
    if(val == undefined){
      var arr = [];
      elms.forEach(function(item){
        arr.push(item[p]);
      });
      return arr;
    }
    
    elms.forEach(function(item){
      item[p] = val;
    });
    return elms;
  },

  attr: function(elms, p, val){
    if(val == undefined){
      var arr = [];
      elms.forEach(function(item){
        arr.push(item.getAttribute(p));
      });
      return arr;
    }
    
    elms.forEach(function(item){
      item.setAttribute(p, val);
    });
    return elms;
  },

  addClass: function(elms, classname){
    elms.forEach(function(v){
      v.classList.add(classname);
    });
  },

  removeClass: function(elms, classname){
    elms.forEach(function(v){
      v.classList.remove(classname);
    });
  },

  toggleClass: function(elms, classname){
    elms.forEach(function(v){
      v.classList.toggle(classname);
    });
  },

  createElm: function(s){
    var div = document.createElement('div');
    div.innerHTML = s;
    return div.querySelector('*');
  },

  alert: function(txt, fn){
    this.__popup_idx ++;
    var s = 
      '<div data-popup="'+this.__popup_idx+'" class="k-curtain k-anim k-anim-fadein">\
        <div class="k-popup-container">\
          <div class="k-popup-context">'+txt+'</div>\
          <div class="k-pop-btn-group">\
            <div class="k-popup-btn k-popup-btn-red">是</div>\
          </div>\
        </div>\
      </div>';
    var elm = this.createElm(s);
    var _this = this;
    var idx = this.__popup_idx;
    if(fn){
      elm.querySelector('.k-popup-btn.k-popup-btn-red').addEventListener('click', fn);
    }
    else{
      elm.querySelector('.k-popup-btn.k-popup-btn-red').addEventListener('click', function(){
        _this.closePopup(idx);
      });
    }
    document.body.appendChild(elm);
    return idx; 
  },

  confirm: function(txt, fn){
    this.__popup_idx ++;
    var s = 
      '<div data-popup="'+this.__popup_idx+'" class="k-curtain k-anim k-anim-fadein">\
        <div class="k-popup-container">\
          <div class="k-popup-context">'+txt+'</div>\
          <div class="k-pop-btn-group">\
            <div class="k-popup-btn">否</div>\
            <div class="k-popup-btn k-popup-btn-red">是</div>\
          </div>\
        </div>\
      </div>';
    var elm = this.createElm(s);
    var _this = this;
    var idx = this.__popup_idx;
    var btn = elm.querySelectorAll('.k-popup-btn');
    btn[0].addEventListener('click', function(){
      _this.closePopup(idx);
    });

    if(fn){
      btn[1].addEventListener('click', fn);
    }
    else{
      btn[1].addEventListener('click', function(){
        _this.closePopup(idx);
      });
    }
    document.body.appendChild(elm);
    return idx; 
  },

  closePopup: function(index){
    if(index){
      this.remove(this.query('[data-popup="'+index+'"]'));
      return;
    }
    
    this.remove(this.query('[data-popup]'));
  },

  ktplConfigTag: function(l, r, c){
    this.__LeftTag = l;
    this.__RightTag = r;
    this.__EqualTag = c;
  },

  ktplInnert: function(n1, n2,  d){
    var o1 = document.querySelector(n1),
      o2s = document.querySelectorAll(n2),
      s = this.ktplConvert(o1.innerHTML, d);
    o2s.forEach(function(item){
      item.innerHTML = s;
    }.bind(this));
  },

  ktplConvert: function(s, d){
    try{
      var str = "var s = '';";

      var s_arr = s.split(this.__LeftTag);
      str += "s += '" + s_arr[0] + "';";
      if(s_arr.length <= 1) return str;
      for(var i = 1; i < s_arr.length; i++){
        var s_r_arr = s_arr[i].split(this.__RightTag);
        if(s_r_arr[0][0] == this.__EqualTag){
          str += "s += " + s_r_arr[0].substring(1) + ";";
        }
        else{
          str += s_r_arr[0] + ";";
        }

        str += "s += '" + s_r_arr[1] + "';";
        str = str.replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n');
      }

      str += 'return s;'
      return this.makeFunction(str,d);
    }
    catch(e){
      console.log(e);
      return e;
    }
  },

  makeFunction: function(s, d){
    var k = [], v = [];
    for (var i in d){
      k.push(i);
      v.push(d[i]);
    }

    return (new Function(k, s)).apply(d, v);
  },

  mobileBottomNaviBarRender: function(){
    document.querySelectorAll('.k-mobole-nav-bar-item').forEach(function(v){
      v.addEventListener('click', function(){
        v.parentElement.querySelectorAll('.k-mobole-nav-bar-item').forEach(function(vv){
          vv.classList.remove('active');
        })
        
        v.classList.add('active');
      });
    });
  },

  checkboxGroup: function(){
    var elm_group = document.querySelectorAll('[data-checkbox-group]');
    var elm_item = document.querySelectorAll('[data-checkbox-item]');

    elm_parent.forEach(function(item){
      item.addEventListener('click', function(){
        var group_name = item.dataset['checkbox-group'];
        var checkbox_item = document.querySelectorAll('[data-checkbox-item="'+group_name+'"]');
        var istrue = item.checked;
        checkbox_item.forEach(function(item){
          item.checked = istrue;
        });
      });
    });

    elm_item.forEach(function(item){
      item.addEventListener('change', function(){
        var group_name = item.dataset['checkbox-group'];
        var checkbox_item = document.querySelectorAll('[data-checkbox-item="'+group_name+'"]');
        var istrue = true;
        checkbox_item.forEach(function(item){
          if(!item.checked){
            istrue = false;
          }
        })
        var elm_groups = document.querySelectorAll('[data-checkbox-group="'+group_name+'"]');
        elm_groups.forEach(function(item){item.checked = istrue});
      })
    });
  },

  inputClear: function(){
    var elms = this.query('.k-input-block>.off');
    this.bind(elms, 'click', function(){
      this.parentNode.querySelector('input.k-input-seach').value = '';
    })
  },

  linkManage: function(d){
    var src = this.query('[data-src]'),
      href = this.query('[data-href]');
    src.forEach(function(v){v.src = d[v.dataset.src]});
    href.forEach(function(v){v.href = d[v.dataset.href]});
  },

}

var kui = new KUI();

// window.addEventListener('load', function(){
//   kui.mobileBottomNaviBarRender();
//   kui.inputClear();
// })
