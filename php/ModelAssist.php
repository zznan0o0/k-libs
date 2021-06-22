<?php 

namespace App\Libs;

use App\Libs\FormatData;
class ModelAssist extends FormatData{

  /**
   * model分页
   */

  static public function page($model, $limit, $page, $fn=null){
    $count = $model->count();
    if($limit >= 0){
        $data = $model->offset($page-1)->limit($limit)->get()->toArray();
    }
    else{
        $data = $model->get()->toArray();
    }
    if($fn){
        return $fn($data, $count);
    }

    return [
        'Count' => $count,
        'Data' => $data,
    ];
}

  static public function isWhereState($model, $wehre_arr){
    $wehre_arr[] = ['state', 'invalid', '!='];
    return $this->isWhere($model, $wehre_arr);
  }

  static public function isWhere($model, $wehre_arr){
    $new_model = $model;

    if(gettype($wehre_arr) == 'string'){
      $new_model = $new_model->whereRaw($wehre_arr);
    }
    else{
      foreach ($wehre_arr as $k => $v) {
        if($v[1] && $v[1] != '%%'){
          if(array_key_exists(2, $v)){
            $s = $v[1];
            if($v[2] == 'like'){
              $s = '%'.$s.'%';
              $new_model = $new_model->where($v[0], $v[2], $s);
            }
            else if ($v[2] == 'in'){
              $new_model = $new_model->whereIn($v[0], $v[1]);
            }
            else{
              $new_model = $new_model->where($v[0], $v[2], $s);
            }
          }
          else{
            $new_model = $new_model->where($v[0], $v[1]);
          }
        }
      }
    }

    return $new_model;
  }
}