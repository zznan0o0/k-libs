var KHandleData = function(){}

KHandleData.prototype = {
  constructor: KHandleData,

  // addArrayProps: function(d1, d2, k1, k2, p){

  // },
  
  belongDicts: function(d1, d2, ks1, ks2, kn){
    var d1 = this.convertJson(d1);
    var d2 = this.convertJson(d2);

    this.eachOneMany(d1, d2, ks1, ks2, function(v1, v2){
      v1[kn] = v2;
    });
    return d1;
  },

  eachOneMany: function(d1, d2, ks1, ks2, fn){
    var d1 = this.convertDict(d1, ks1);
    var d2 = this.convertDicts(d2, ks2);

    this.eachDict(d1, function(v, k){
      fn(v, this.getVal(d2, k, []), k);
    });
    return d1;
  },

  distributeDictsProps: function(d1, d2, ks1, ks2, ps){
    this.eachDictDict(d1, d2, ks1, ks2, function(v1, v2){
      this.each(ps, function(pv){
        v1[pv[0]] = this.getVal(v2, pv[1], pv2);
      });
    });
    return this.convertArray(d1);
  },

  eachDictDict: function(d1, d2, ks1, ks2, fn){
    var d1 = this.convertDict(d1, ks1);
    var d2 = this.convertDict(d2, ks2);

    this.eachDict(d1, function(v, k){
      fn(v, this.getVal(d2, k, {}), k);
    });
    return d1;
  },



  eachDict: function(d, fn){
    for(var k in d){
      fn(d[k], k);
    }
    return d;
  },

  // getDictsByKey: function(d, ks){
  //   var arr = [];

  //   this.each(d, function(v){
  //     arr.push(this.getDictByKey(v, ks));
  //   });
  //   return arr;
  // },
  
  // getDictByKey: function(d, ks){
  //   var dict = {};
  //   this.each(ks, function(v, k){
  //     dict[k] = d[v];
  //   })
  //   return dict;
  // },

  // getValByKey: function(d, k){
  //   var arr = [];
  //   this.each(d, function(v){
  //     arr.push(v[k]);
  //   });
  //   return arr;
  // },

  getKey: function(d){
    var ks = [];
    this.eachDict(d, function(v, k){
      ks.push(k);
    });

    return ks;
  },

  getVal: function(d, k, initval){
    if(this.isKey(d, k)) return d[k];
    return initval;
  },

  convertArray: function(d){
    var d = this.convertJson(d);
    var vs = [];
    this.eachDict(d, function(v){
      vs.push(v);
    });

    return vs;
  },

  // getVals: function(d){
  //   var vs = [];
  //   this.eachDict(d, function(v){
  //     var arr = [];
  //     this.eachDict(v, function(vv){
  //       arr.push(vv);
  //     });
  //     vs.push(arr);
  //   });

  //   return vs;
  // },


  isKey: function(d, k){
    for(var kk in d){
      if (k == kk) return true;
    }
    return false;
  },

  isVal: function(d, v){
    for(var k in d){
      if(v === d[k]) return true;
    }

    return false;
  },

  convertDictArray: function(d, ks){
    var d = this.convertJson(d);
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

  convertDicts: function(d, ks){
    var d = this.convertJson(d);
    var dicts = {};

    this.each(d, function(v){
      var key = this.convertKey(v, ks);
      if(this.isKey(dicts, key)){
        dicts[key].push(v);
      }
      else{
        dicts[key] = [v];
      }
    });

    return dicts;
  },

  convertDict: function(d, ks){
   var d = this.convertJson(d);
    var dict = {};

    this.each(d, function(v){
      var key = this.convertKey(v, ks);
      dict[key] = v;
    });

    return dict;
  },

  convertKey: function(d, ks){
    var d = this.convertJson(d);
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
    return d;
  },

  convertJson: function(d){
    return JSON.parse(JSON.stringiy(s));
  }
}