var MobileAjaxer = function(layer){
  this.layer = layer;
  this.role = {}
}

MobileAjaxer.prototype = {
  contructor: MobileAjaxer,

  ajax: function(url, data, fn1, fn2){
    $.ajax({
      url: url,
      type: 'post',
      data: data,
      dataType: 'json',
      success: function(data){
        if(data.state == 1){
          fn1(data);
        }
        else{
          if(fn2){
            fn2(data)
          }
          else{
            if(data.state == 0){
              kui.alert(data.notice);
            }
            else if(data['state'] == -1){
              location.href = route_json['nav_frame'];
            }
            else{
              kui.alert('出现问题了请联系技术人员！！！');
            }
          }
        }
      },
      error: function(err){
        kui.alert('出现问题了请联系技术人员！！！');
      }
    })
  },

  getArgs: function(){
    var search_str = decodeURI(location.search);
    var arg_str = search_str.substring(1, search_str.length);
    var arg_arr = arg_str.split('&');
    var args = {};
    for (var i = 0; i < arg_arr.length; i++){
      var single_arg = arg_arr[i].split('=');
      args[single_arg[0]] = single_arg[1];
    }

    return args;
  },

  formdataAjax: function(url, formdata, fn1, fn2){

    $.ajax({
      url: url,
      type: 'POST',
      data: formdata,
      processData: false,
      contentType: false,
      success: function(data){
        if(data.state == 1){
          fn1(data);
        }
        else{
          if(fn2){
            fn2(data)
          }
          else{
            if(data.state == 0){
              kui.alert(data.notice);
            }
            else if(data['state'] == -1){
              location.href = route_json['nav_frame'];
            }
            else{
              kui.alert('出现问题了请联系技术人员！！！');
            }
          }
        }
      },
      error: function(err){
        kui.alert('出现问题了请联系技术人员！！！');
      }
    })
  },
}
