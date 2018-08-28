var StringOperate = function(){}

StringOperate.prototype = {
  constructor: StringOperate,
  protected: {
    match_reg: /\${(.*?)}/g
  },

  //<a href="${href}">${context}</a>
  replace: function(s, d){
    return s.replace(this.protected.match_reg, function(w){
      return d[w.slice(2, -1)]
    });
  },

  eachReplace: function(s, ds){
    var _this = this;
    var ss = '';
    ds.forEach(function(v){
      ss += _this.replace(s, v);
    });
    
    return ss;
  },

  __eval: function(s, $v){
    return s.replace(this.protected.match_reg, function(w){
      return eval(w.slice(2, -1));
    });
  },

  eval: function(s){
    return s.replace(this.protected.match_reg, function(w){
      return eval(w.slice(2, -1));
    });
  },

  eachEval: function(s, ds){
    var _this = this;
    var ss = '';
    ds.forEach(function($v){
      ss += _this.__eval(s, $v);
    });
    return ss;
  }
}