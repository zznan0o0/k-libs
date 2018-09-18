var KTpl = function(){
  this.__LeftTag = '[%';
  this.__RightTag = '%]';
  this.__EqualTag = '=';
}

KTpl.prototype = {
  constructor: KTpl,

  configTag: function(l, r, c){
    this.__LeftTag = l;
    this.__RightTag = r;
    this.__EqualTag = c;
  },

  innert: function(n1, n2,  d){
    var o1 = document.querySelector(n1),
      o2s = document.querySelectorAll(n2);
    o2s.forEach(function(item){
      item.innerHTML = this.convert(o1.innerHTML, d);
    }.bind(this));
  },

  convert: function(s, d){
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
  }
}