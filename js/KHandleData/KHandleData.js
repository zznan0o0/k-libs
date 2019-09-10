var KHandleData = function(){}

KHandleData.prototype = {
  constructor: KHandleData,

  // addArrayProps: function(d1, d2, k1, k2, p){

  // },
  
  // matchOneMany: function(d1, d2, ks1, ks2){
  //   var d1 = this.convertJson(d1);
  //   var d2 = this.convertJson(d2);

  //   $arr = [];
  //   this.eachOneMany(d1, d2, ks1, ks2, function(v1, v2){
  //     v1[kn] = v2;
  //   });
  //   return d1;
  // },

  matchDictDicts: function(d1, d2, ks1, ks2){
    $arr = [];
    this.eachDictDicts(d1, d2, ks1, ks2, function(v1, v2){
      v1[kn] = v2;
    });
    return d1;
  },

  belongDicts: function(d1, d2, ks1, ks2, kn){
    d1 = this.eachDictDicts(d1, d2, ks1, ks2, function(v1, v2){
      v1[kn] = v2;
    });
    return this.convertArray(d1);
  },

  
  distributeDictsProps: function(d1, d2, ks1, ks2, ps){
    this.eachDictDict(d1, d2, ks1, ks2, function(v1, v2){
      this.each(ps, function(pv){
        v1[pv[0]] = this.getVal(v2, pv[1], pv2);
      });
    });
    return this.convertArray(d1);
  },

  mapDictsDictsTwoWay: function(d1, d2, k1, k2, fn){
    var d1 = this.convertDicts(d1, k1);
    var d2 = this.convertDicts(d2, k2);
    var ks = this.getKey(d1);
    ks = ks.concat(this.getKey(d2))
    ks = this.unique(ks);
    var arr = [];
    ks.forEach(function(k, i){
      arr.push(fn.call(this, this.getVal(d1, k, []), this.getVal(d2, k, []), k));
    });
    return arr;
  },

  mapDictsDicts: function(d1, d2, k1, k2, fn){
    var d1 = this.convertDicts(d1, k1);
    var d2 = this.convertDicts(d2, k2);
    var arr = [];

    this.eachDict(d1, function(v, k){
      arr.push(fn.call(this, v, this.getVal(d2, k, []), k));
    });
    return arr;
  },
  
  mapDictDicts: function(d1, d2, ks1, ks2, fn){
    var d1 = this.convertDict(d1, ks1);
    var d2 = this.convertDicts(d2, ks2);
    var arr = [];

    this.eachDict(d1, function(v, k){
      arr.push(fn.call(this, v, this.getVal(d2, k, []), k));
    });
    return arr;
  },

  mapDictDict: function(d1, d2, ks1, ks2, fn){
    var d1 = this.convertDict(d1, ks1);
    var d2 = this.convertDict(d2, ks2);
    var arr = [];

    this.eachDict(d1, function(v, k){
      arr.push(fn.call(this, v, this.getVal(d2, k, {}), k));
    });
    return arr;
  },

  eachDictsDicts: function(d1, d2, k1, k2, fn){
    var d1 = this.convertDicts(d1, k1);
    var d2 = this.convertDicts(d2, k2);

    this.eachDict(d1, function(v, k){
      fn.call(this, v, this.getVal(d2, k, null), k);
    });
    return d1;
  },
  
  eachDictDicts: function(d1, d2, ks1, ks2, fn){
    var d1 = this.convertDict(d1, ks1);
    var d2 = this.convertDicts(d2, ks2);

    this.eachDict(d1, function(v, k){
      fn.call(this, v, this.getVal(d2, k, null), k);
    });
    return d1;
  },

  eachDictDict: function(d1, d2, ks1, ks2, fn){
    var d1 = this.convertDict(d1, ks1);
    var d2 = this.convertDict(d2, ks2);

    this.eachDict(d1, function(v, k){
      fn.call(this, v, this.getVal(d2, k, null), k);
    });
    return d1;
  },

  eachDict: function(d, fn){
    for(var k in d){
      fn.call(this, d[k], k);
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

  unique: function(d){
    var dict = {};
    d.forEach(function(v, i){
      dict[v] = i;
    });
    return this.getKey(dict);
  },

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
    if(this.isNull(d)) return false;
    for(var kk in d){
      if (k == kk) return true;
    }
    return false;
  },

  isVal: function(d, v){
    if(this.isNull(d)) return false;
    for(var k in d){
      if(v === d[k]) return true;
    }

    return false;
  },

  isNull: function(d){
    if(d === null || d === undefined || d === NaN){
      return true;
    }
    return false;
  },

  convertDicts: function(d, ks){
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
      fn.call(this, d[i], i);
    }
    return d;
  },

  convertJson: function(d){
    return JSON.parse(JSON.stringify(d));
  }
}