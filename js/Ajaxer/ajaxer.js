var Ajaxer = function(layer){
  this.layer = layer;
  this.role = {}
}

Ajaxer.prototype = {
  contructor: Ajaxer,

  ajax: function(url, data, fn1, fn2, fn3){
    var load_index = layer.load();

    $.ajax({
      url: url,
      type: 'post',
      data: data,
      dataType: 'json',
      success: function(data){
        if(data.state == 1){
          layer.close(load_index);
          fn1(data);
        }
        else{
          fn2 && fn2();
          layer.close(load_index);
          if(data.state == 0){
            layer.alert(data.notice);
          }
          else if(data.state == -1){
            if( window.parent){
              window.parent.window.location.href = '/login.html';
            }
            else{
              window.location.href = '/login.html';
            }
          }
        }
      },
      error: function(err){
        fn3 && fn3();
        layer.close(load_index);
        layer.alert('出现问题了请联系技术人员！！！');
      }
    })
  },

  ajax2: function(url, data, fn1, fn2, fn3){
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
          fn2 && fn2();
          if(data.state == 0){
            layer.alert(data.notice);
          }
          else if(data.state == -1){
            if( window.parent){
              window.parent.window.location.href = '/login.html';
            }
            else{
              window.location.href = '/login.html';
            }
          }
        }
      },
      error: function(err){
        fn3 && fn3();
        layer.alert('出现问题了请联系技术人员！！！');
      }
    })
  },


  checkUserAjax: function(fn){
     $.ajax({
      url: '/checkUser',
      type: 'post',
      data: {},
      dataType: 'json',
      success: function(data){
        if(data.state != 1){
          if( window.parent){
              window.parent.window.location.href = '/login.html';
            }
            else{
              window.location.href = '/login.html';
            }
        }
        else{
          fn && fn();
        }
      },
      error: function(err){
        layer.alert('出现问题了请联系技术人员！！！');
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

  formdataAjax: function(url, formdata, fn1, fn2, fn3){
    var load_index = layer.load();

    $.ajax({
      url: url,
      type: 'POST',
      data: formdata,
      processData: false,
      contentType: false,
      success: function(data){
        if(data.state == 1){
          layer.close(load_index);
          fn1(data);
        }
        else{
          fn2 && fn2();
          layer.close(load_index);

          if(data.state == 0){
            layer.alert(data.notice);
          }
          else if(data.state == -1){
            if( window.parent){
              window.parent.window.location.href = '/login.html';
            }
            else{
              window.location.href = '/login.html';
            }
          }
        }
      },
      error: function(err){
        fn3 && fn3();
        layer.close(load_index);
        layer.alert('出现问题了请联系技术人员！！！');
      }
    })
  },

  formatMoney: function(number, places, symbol, thousand, decimal) {
    number = number || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var negative = number < 0 ? "-" : "",
      i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
      j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
  },

  requireHtml: function(url, id){
    id = id || '';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if (xhr.readyState==4){
        if (xhr.status==200){
          $('head').append('<script type="text/html" id="'+id+'">'+xhr.responseText+'</script>');
        }
        else{
          console.log(e);
        }
      }
    }
    xhr.open("GET",url,false);
    xhr.send(null);
  },

  isYY: function(role_id){
    if(role_id !== '1'){
      $('[data-role="1"]').remove();
    }
  },

  isCG: function(role_id){
    if(role_id !== '2'){
      $('[data-role="2"]').remove();
    }
  },

  isXS: function(role_id){
    if(role_id != '3'){
      $('[data-role="3"]').remove();
    }
  },

  isCK: function(role_id){
    if(role_id != '4'){
      $('[data-role="4"]').remove();
    }
  },

  isRole: function(role_id){
    $('[data-role]').each(function(){
      var r = $(this).data('role');
      if(role_id != r) $(this).remove();
    });
  },

  isRoles: function(role_id){
    $('[data-roles]').each(function(){
      var arr = $(this).data('roles');
      arr = eval(arr);
      var istrue = false;
      arr.forEach(function(item){
        if(role_id == item){
          istrue = true;
        }
      });

      if(!istrue) $(this).remove();
    });
  },

  isNotRole: function(role_id){
    $('[data-not-role]').each(function(){
      var r = $(this).data('not-role');
      if(role_id == r) $(this).remove();
    });
  }
}
