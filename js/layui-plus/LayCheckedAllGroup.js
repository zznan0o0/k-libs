layui.LayCheckedAllGroup = function(filter_checkedall, filtercheckedone){
  layui.form.on('checkbox('+filter_checkedall+')', function(obj){
    $('[lay-filter="'+filtercheckedone+'"]').prop('checked', $(obj.elem).prop('checked'))
    layui.form.render();
  });

  layui.form.on('checkbox('+filtercheckedone+')', function(obj){
    var ischecked = true;

    $('[lay-filter="'+filtercheckedone+'"]').each(function(){
      if(!$(this).prop('checked')){
        ischecked = false;
        return false;
      }
    });
    $('[lay-filter="'+filter_checkedall+'"]').prop('checked', ischecked);
    layui.form.render();
  });
}