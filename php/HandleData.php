<?php

namespace App\Libs;

class HandleData{
  public function arrayPage($d, $page, $limit){
    $count = count($d);
    $cur_idx = ($page - 1) * $limit;

    $new_d = array_slice($d, $cur_idx, $limit);
    return ['count' => $count, 'data' => $new_d];
  }

  public function complementaryData($d1, $d2, $k1, $k2, $cd1, $cd2)
  {
    $dk1 = [];
    $dk2 = [];
    foreach ($cd2 as $v) {
      $dk1[$v[1]] = $v[2];
    }

    foreach ($cd1 as $v) {
      $dk2[$v[1]] = $v[2];
    }

    $d1d = $this->convertDicts($d1, $k1);
    $d2d = $this->convertDicts($d2, $k2);

    $dd = [];

    foreach ($d1d as $k => $v) {
      if (array_key_exists($k, $d2d)) {
        $arr = [];

        $max_length = max([count($v), count($d2d[$k])]);
        $d1d_v = $v;
        $d2d_v = $d2d[$k];

        for ($i = 0; $i < $max_length; $i++) {
          if (!array_key_exists($i, $d1d_v)) {
            $d1di_v = $dk1;
            foreach ($k1 as $k1_v) {
              $d1di_v[$k1_v] = $d1d_v[0][$k1_v];
            }
          }
          else{
            $d1di_v = $d1d_v[$i];
          }
          $d2di_v = $this->getVal($d2d_v, $i, $dk2);

          foreach ($cd1 as $cd1_v) {
            $d1di_v[$cd1_v[0]] = $this->getVal($d2di_v, $cd1_v[1], $cd1_v[2]);
          }
          $arr[] = $d1di_v;
        }

        $dd[$k] = $arr;
      } else {
        $arr = [];

        foreach ($v as $vv) {
          foreach ($cd1 as $cd1_v) {
            $vv[$cd1_v[0]] = $cd1_v[2];
          }
          $arr[] = $vv;
        }

        $dd[$k] = $arr;
      }
    }

    $k1_length = count($k1);

    foreach ($d2d as $k => $v) {
      if (!array_key_exists($k, $dd)) {
        $arr = [];
        $key = [];
        for($i = 0; $i < $k1_length; $i++){
          $key[$k1[$i]] = $v[0][$k2[$i]];
        }

        foreach ($v as $vv) {
          foreach ($cd2 as $cd2_v) {
            $vv[$cd2_v[0]] = $cd2_v[2];
            $vv = array_merge($vv, $key);
          }
          $arr[] = $vv;
        }

        $dd[$k] = $arr;
      }
    }

    $arr = [];
    foreach ($dd as $v) {
      foreach ($v as $vv) {
        $arr[] = $vv;
      }
    }

    return $arr;
  }
  
  public function distributePropsArray($d1, $d2, $k1, $k2, $p){
    return $this->mapDictDict($d1, $d2, $k1, $k2, function($v1, $v2) use ($p){
      foreach ($p as $key => $v) {
        $v1[$v[0]] = $this->getVal($v2, $v[1], $v[2]);
      }

      return $v1;
    });
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
