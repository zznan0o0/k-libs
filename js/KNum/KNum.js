var KNum = function(){}

KNum.prototype = {
  constructor: KNum,

  //replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  //replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  formatMoney: function(num){
    parseFloat()
    var num = (parseFloat(num) || 0) + '';
    var symbol = symbol || '';

    var num_arr = num.split('.');
    var format_num = num_arr[0].replace(/\B(?=(\d{3})+$)/g, ',');
    if(num_arr.length > 1){
      format_num = format_num + '.' + num_arr[1];
    }

    return format_num;
  },

  formatNum: function(num_str){
    return num_str.replace(/[^\d^\.]/g, '') * 1;
  }
}