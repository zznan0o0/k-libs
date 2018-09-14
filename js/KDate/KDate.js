var KDate = function(){}

KDate.prototype = {
  constructor: KDate,

  getCurMonthFirstLastDay: function(){
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
  }
}