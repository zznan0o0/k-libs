<?php

namespace App\Libs;
use App\Libs\FormatData;

class FileProcess extends FormatData{
  public function txtArrayProcess($file_path){
    $txt_str = file_get_contents($file_path);
    $txt_str = mb_convert_encoding($txt_str, 'UTF-8', 'UTF-8,GBK,GB2312,BIG5');
    $txt_str = preg_replace('/\n|\r\n/',',',$txt_str);
    $txt_arr = explode(",", $txt_str);
    foreach ($txt_arr as $k => &$v) {
      $v = trim($v);
    }

    return $txt_arr;
  }
}