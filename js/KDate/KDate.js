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
      '%H': this.preFixNum(+date.getHours(), 2),
      '%i': this.preFixNum(+date.getMinutes(), 2),
      '%s': this.preFixNum(+date.getSeconds(), 2),
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

  calMonth: function(month, date){
    var date = date || new Date();
    return  new Date(date.getFullYear(), date.getMonth() + month);
  },

  calDay: function(day, date){
    var date = date || new Date();
    return  new Date(date.getFullYear(), date.getMonth(), date.getDate() +  day);
  },

  getTheLastMonth: function(month, date){
    var date = date || new Date();
    return  new Date(date.getFullYear(), date.getMonth() - month);
  },

  getTheLastDay: function(day, date){
    var date = date || new Date();
    return  new Date(date.getFullYear(), date.getMonth(), date.getDate() -  day);
  },


  getWeekRange: function(date){
    date = date || new Date();

    var pre_date  = this.getTheLastDay(7, date);

    return this.format(pre_date, '%Y-%m-%d') + ' - ' + this.format(date, '%Y-%m-%d');
  }
}