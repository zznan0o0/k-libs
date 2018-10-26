<?php 

namespace App\Libs;

use App\Libs\FormatData;
class ModelAssist extends FormatData{

  public function isWhereState($model, $wehre_arr){
    $wehre_arr[] = ['state', 'invalid', '!='];
    return $this->isWhere($model, $wehre_arr);
  }

  public function isWhere($model, $wehre_arr){
    $new_model = $model;
    foreach ($wehre_arr as $k => $v) {
      if($v[1] && $v[1] != '%%'){
        if(array_key_exists(2, $v)){
          $s = $v[1];
          if($v[2] == 'like'){
            $s = '%'.$s.'%';
          }
          $new_model = $new_model->where($v[0], $v[2], $s);
        }
        else{
          $new_model = $new_model->where($v[0], $v[1]);
        }
      }
    }

    return $new_model;
  }
}