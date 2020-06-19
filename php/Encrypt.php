<?php

namespace App\Libs;

class Encrypt
{
  private $KEY = 'atjubo';

  function encrypt($data, $key=null)
  {
    $key = $key ? $key : $this->KEY;
    //将key转为md5
    $key = md5($key);
    $x = 0;
    //被加密字符长度
    $len = strlen($data);
    //key md5 长度
    $l = strlen($key);
    //key对应 被加密字符 的字符
    $char = '';
    $str = '';
    //将md5 key按照被加密字符长度进行重复排列
    for ($i = 0; $i < $len; $i++) {
      if ($x == $l) {
          $x = 0;
        }
      $char .= $key{
      $x};
      $x++;
    }


    for ($i = 0; $i < $len; $i++) {
      //将每个字符转ascii 
      //对应的key md5 转ascii
      //俩者相加取256 的余
      //ascii转回对应值
      $str .= chr(ord($data{
      $i}) + (ord($char{
      $i})) % 256);
    }
    //base64 加密
    return base64_encode($str);
  }

  function decrypt($data, $key=null)
  {
    $key = $key ? $key : $this->KEY;
    //将key转为md5
    $key = md5($key);
    $x = 0;
    //base64解密
    $data = base64_decode($data);
    $len = strlen($data);
    $l = strlen($key);
    $char = '';
    $str = ''; 
    //将md5 key按照被加密字符长度进行重复排列
    for ($i = 0; $i < $len; $i++)
    {
      if ($x == $l) 
      {
        $x = 0;
      }
      $char .= substr($key, $x, 1);
      $x++;
    }
    for ($i = 0; $i < $len; $i++)
    {
      //判断加密值ascii 是否大于 对应 key ascii，如果大于加256
      // 将 加密值ascii减去对应 对应 key ascii后转回真正的值
      if (ord(substr($data, $i, 1)) < ord(substr($char, $i, 1)))
      {
        $str .= chr((ord(substr($data, $i, 1)) + 256) - ord(substr($char, $i, 1)));
      }
      else
      {
        $str .= chr(ord(substr($data, $i, 1)) - ord(substr($char, $i, 1)));
      }
    }
    return $str;
  }

}
