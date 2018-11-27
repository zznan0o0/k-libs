var KDate = function(){}

KDate.prototype = {
  constructor: KDate,

  preFixNum: function(num, length){
    return (Array(length).join('0') + num).slice(-length);
  },

  format: function(date, str){
    var weekday=["周日","周一","周二","周三","周四","周五","周六"];

    var date_json = {
      '%Y': date.getFullYear(),
      '%m': this.preFixNum(+date.getMonth() + 1, 2),
      '%d': this.preFixNum(+date.getDate(), 2),
      '%w': weekday[date.getDay()],
    }


    for(var k in date_json){
      var reg = RegExp(k, 'g');
      str = str.replace(reg, date_json[k]);
    }

    return str;
  },

  getCurMonthFirstLastDay: function(date){
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    var first_day  = new Date(y, m, 1);
    var last_day = new Date(y, m + 1, 0);
    var first_day_str = first_day.getFullYear() + '-' + (+first_day.getMonth() + 1) + '-' + first_day.getDate();
    var last_day_str = last_day.getFullYear() + '-' + (+last_day.getMonth() + 1) + '-' + last_day.getDate();
    
    return {
      'first_day_stamp': first_day,
      'last_day_stamp': last_day,
      'first_day': first_day_str,
      'last_day': last_day_str
    }
  },

  getTheLastMonth: function(month){
    var cur_date = new Date();
    return  the_last_month = new Date(cur_date.getFullYear(), cur_date.getMonth() - month);
  },

  getTheLastDay: function(day){
    var cur_date = new Date();
    return  the_last_month = new Date(cur_date.getFullYear(), cur_date.getMonth(), cur_date.getDate() -  day);
  },
}