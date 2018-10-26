<?php 

namespace App\Libs;

class AtjuboPWD {
  public function byteMD5($str){
    $md5hex = md5($str);
    $len=strlen($md5hex)/2;
    $md5raw = '';

    for($i=0;$i<$len;$i++) {
      //chr 函数从指定的 ASCII 值返回字符。
      //hexdec 十六进制转换为十进制
      $md5raw = $md5raw . chr(hexdec(substr($md5hex, $i*2, 2))); 
    }

    return $md5raw;
  }

  public function atjuboEncrypt($str, $keycode){
    $md5raw = $this->byteMD5($str);
    $pwd = base64_encode($md5raw).$keycode;
    $pwd = $this->byteMD5($pwd);
    return str_replace('/', '', base64_encode($pwd));
  }
}