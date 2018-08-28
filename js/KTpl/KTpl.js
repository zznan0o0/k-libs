var KTpl = function(){}

KTpl.prototype = {
  constructor: KTpl,

  convert: function(s, d){
    var str = "var s = '';";

    var s_arr = s.split('[%');
    str += "s += '" + s_arr[0] + "';";
    if(s_arr.length <= 1) return str;
    for(var i = 1; i < s_arr.length; i++){
      var s_r_arr = s_arr[i].split('%]');
      if(s_r_arr[0][0] == '='){
        str += "s += " + s_r_arr[0].substring(1) + ";";
      }
      else{
        str += s_r_arr[0];
      }

      str += "s += '" + s_r_arr[1] + "';";
      str = str.replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n');
    }

    str += 'return s;'
    return this.makeFunction(str,d);
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