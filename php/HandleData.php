<?php

namespace App\Libs;

class HandleData{
  public function mapDictDict($d1, $d2, $k1, $k2, $fn){
    $arr = [];
    $dict2 = $this->convertDict($d2, $k2);
    foreach ($d1 as $key => $v) {
      $key = $this->convertKey($v, $k1);

      $fn->bindTo($this);

      $arr[] = $fn($v, $this->getVal($dict2, $key, null), $key);
    }

    return $arr;
  }


  public function convertDicts($d, $k){
    $dict = [];

    foreach ($d as $key => $v) {
      $key = $this->convertKey($v, $k);
      $dict[$key] = $this->getVal($dict, $key, []);
      $dict[$key][] = $v;
    }

    return $dict;
  }

  public function convertDict($d, $k){
    $dict = [];

    foreach ($d as $key => $v) {
      $dict[$this->convertKey($v, $k)] = $v;
    }

    return $dict;
  }


  public function convertKey($d, $p){
    $key_array = [];
    foreach ($p as $k => $v) {
      $key_array[] = $d[$v];
    }

    return $key = join(',', $key_array);
  }

  public function getVal($d, $k, $initval){
    if(array_key_exists($k, $d)){
      return $d[$k];
    }
    return $initval;
  }

  public function parseJson(){
    return json_decode(json_encode($obj), true);
  }
}