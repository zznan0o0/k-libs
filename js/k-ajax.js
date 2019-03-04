var KAjax = function(){}

KAjax.prototype = {
  constructor: KAjax,

  /*
    option = {
      type            请求方式
      url             请求地址
      async           异步
      dataType        返回类型
      withCredentials 跨域带上cookie
      mimeType        ContentType
      head            Access-Control-Allow-Headers
      data            data
    }
   */
  ajax: function(option){
    var s = this.params(option.data);
    var url = option.url;
    if(option.type == 'GET' || option.type == 'get'){
      url += '?' + s;
    }

    var xhr = new XMLHttpRequest();
    xhr.open(option.type || 'GET', url, option.async || true);

    xhr.responseType = option.dataType || 'text';
    xhr.withCredentials = option.withCredentials || false;
    xhr.overrideMimeType(option.mimeType || 'text/plain');
    xhr.setRequestHeader("Content-Type", option.head || "application/x-www-form-urlencoded");
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { 
        var data = xhr.responseText;
        if(option.dataType == 'json'){
          data = JSON.parse(data);
        }
        option.success && option.success(data);
      }
      else{
        option.error && option.error(xhr.responseText);
      }
    };
    if(option.type == 'POST' || option.type == 'post'){
      xhr.send(s);
    }
    else{
      xhr.send(null);
    }
  },

  params: function(d){
    var dic = {}
    for (k in d){
      var key = k;
      if(typeof(d[k]) == 'object'){
        this.recParams(d[k], dic, key);
      }
      else{
        dic[key] = d[k];
      }
    }

    var arr = [];

    for(k in dic){
      arr.push(encodeURIComponent(k)+'='+encodeURIComponent(dic[k]));
    }

    return arr.join('&');
  },

  recParams(d, dic, key) {
    for (let k in d) {
      var kk = key + '[' + k + ']';
      if (typeof (d[k]) == 'object') {
        this.recParams(d[k], dic, kk);
      }
      else {
        dic[kk] = d[k];
      }
    }
    return dic;
  }

};

var kajax = new KAjax();

var data = {
  a: [{a:1}]
}

kajax.ajax({
  url: '/test',
  type: 'post',
  data: data,
  success: function(data){console.log(data)}
});
