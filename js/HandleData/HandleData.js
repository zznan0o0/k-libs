var HandleData = function(){}

HandleData.prototype = {
  constructor: HandleData,

  // addArrayProps: function(d1, d2, k1, k2, p){

  // },

  eachDict: function(d, fn){
    for(var k in d){
      fn(d[k], k);
    }
  },

  getDictsByKey: function(d, ks){
    var arr = [];

    this.each(d, function(v){
      arr.push(this.getDictByKey(v, ks));
    });
    return arr;
  },
  
  getDictByKey: function(d, ks){
    var dict = {};
    this.each(ks, function(v, k){
      dict[k] = d[v];
    })
    return dict;
  },

  getValByKey: function(d, k){
    var arr = [];
    this.each(d, function(v){
      arr.push(v[k]);
    });
    return arr;
  },

  getKey: function(d){
    var ks = [];
    this.eachDict(d, function(v, k){
      ks.push(k);
    });

    return ks;
  },

  getVal: function(d){
    var vs = [];
    this.eachDict(d, function(v){
      vs.push(v);
    });

    return vs;
  },

  getVals: function(d){
    var vs = [];
    this.eachDict(d, function(v){
      var arr = [];
      this.eachDict(v, function(vv){
        arr.push(vv);
      });
      vs.push(arr);
    });

    return vs;
  },


  isKey: function(d, k){
    if(d[k] !== undefined) return false
    return true;
  },

  isVal: function(d, k, intval){
    if(!this.isKey(d, k)) return intval;
    return d[k];
  },

  convertDictArray: function(d, ks){
    var dict = {};

    this.each(d, function(v){
      var key = this.convertKey(v, ks); 
      if(this.isKey(dict, key)){
        dict[key].push(v)
      }
      else{
        dict[key] = [];
      }
    });
    return dict;
  },

  convertDict: function(d, ks){
    var dict = {};

    this.each(d, function(v){
      var key = this.convertKey(v, ks);
      dict[key] = v;
    });

    return dict;
  },

  convertKey: function(d, ks){
    var key = '';
    this.each(ks, function(v){
      key += d[v];
    });

    return key;
  },

  each: function(d, fn){
    for(var i = 0; i < d.length; i++){
      fn(d[i], i);
    }
  }
}