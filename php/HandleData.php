<?php

namespace App\Libs;

class HandleData{
  public function arrayPage($d, $page, $limit){
    $count = count($d);
    $cur_idx = ($page - 1) * $limit;

    $new_d = array_slice($d, $cur_idx, $limit);
    return ['count' => $count, 'data' => $new_d];
  }

  public function distributePropsArrayTwoWay($d1, $d2, $k1, $k2, $p1, $p2){
    return $this->mapTwoWayDictDict($d1, $d2, $k1, $k2, function($v1, $v2) use ($k1, $k2, $p1, $p2){
      $item = [];

      foreach ($k1 as $key => $v) {
        if(array_key_exists($v, $v1)){
          $item[$v] = $v1[$v];
        }
      }

      foreach ($k2 as $key => $v) {
        if(array_key_exists($v, $v2)){
          $item[$v] = $v2[$v];
        }
      }

      foreach ($p1 as $key => $v) {
        $item[$v[0]] = $this->getVal($v1, $v[1], $v[2]);
      }
      foreach ($p2 as $key => $v) {
        $item[$v[0]] = $this->getVal($v2, $v[1], $v[2]);
      }

      return $item;
    });
  }

  
  public function distributePropsArray($d1, $d2, $k1, $k2, $p){
    return $this->mapDictDict($d1, $d2, $k1, $k2, function($v1, $v2) use ($p){
      foreach ($p as $key => $v) {
        $v1[$v[0]] = $this->getVal($v2, $v[1], $v[2]);
      }

      return $v1;
    });
  }


  public function mapTwoWayDictDict($d1, $d2, $k1, $k2, $fn){
    $arr = [];
    $dict1 = $this->convertDict($d1, $k1);
    $dict2 = $this->convertDict($d2, $k2);

    $keys = array_keys($dict1);
    $keys = array_merge($keys, array_keys($dict2));
    $keys = array_flip(array_flip($keys));

    foreach ($keys as $keys_v) {
      $arr[] = $fn($this->getVal($dict1, $keys_v, []), $this->getVal($dict2, $keys_v, []), $keys);
    }
    return $arr;
  }


  public function mapDictsDicts($d1, $d2, $k1, $k2, $fn){
    $arr = [];
    $dict1 = $this->convertDicts($d1, $k1);
    $dict2 = $this->convertDicts($d2, $k2);
    
    foreach ($dict1 as $key => $v) {
      $arr[] = $fn($v, $this->getVal($dict2, $key, []), $key);
    }

    return $arr;
  }



  public function mapDictDicts($d1, $d2, $k1, $k2, $fn){
    $arr = [];
    $dict2 = $this->convertDicts($d2, $k2);
    
    foreach ($d1 as $key => $v) {
      $key = $this->convertKey($v, $k1);
      $arr[] = $fn($v, $this->getVal($dict2, $key, []), $key);
    }

    return $arr;
  }

  public function mapDictDict($d1, $d2, $k1, $k2, $fn){
    $arr = [];
    $dict2 = $this->convertDict($d2, $k2);
    
    foreach ($d1 as $key => $v) {
      $key = $this->convertKey($v, $k1);
      $arr[] = $fn($v, $this->getVal($dict2, $key, []), $key);
    }

    return $arr;
  }

  public function mapDicts($d, $k, $fn){
    $arr = [];
    $dicts = $this->convertDicts($d, $k);
    foreach ($dicts as $k => $v) {
      $arr[] = $fn($v, $k);
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
    if($d === null) return $initval;
    if(array_key_exists($k, $d)){
      return $d[$k];
    }
    return $initval;
  }


  public function parseJson($obj){
    return json_decode(json_encode($obj), true);
  }
}
