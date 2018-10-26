<?php 

namespace App\Libs;

class FormatData{
  public function formatObjToArray($obj){
    return json_decode(json_encode($obj), true);;
  }

  public function formatObjsToArrays($objs){
    $arrs = [];
    foreach ($objs as $k => $v) {
      $arrs[] = $this->formatObjToArray($v);
    }

    return $arrs;
  }

  public function isKey($k, $array, $v=''){
    return array_key_exists($k, $array) ? $array[$k] : $v;
  }

  public function belongArray($main_list, $detial_list, $main_prop, $detail_prop=null){
    $detail_prop = $detail_prop ? $detail_prop : $main_prop;
    $main_list = $this->formatObjToArray($main_list, $main_prop);
    $detail_dict = $this->convertDict($detial_list, $detail_prop);

    $res_array = [];
    foreach ($main_list as $k => $v) {
      $key = $this->convertKey($v, $main_prop);
      $detial = $this->isKey($key,  $detail_dict, []);
      $res_array[] = ['main' => $v, 'detail' => $detial];
    }
    return $res_array;
  }

  public function belongArrays($main_list, $detial_list, $main_prop, $detail_prop=null){
    $detail_prop = $detail_prop ? $detail_prop : $main_prop;
    $main_dict = $this->convertDict($main_list, $main_prop);
    $detail_dict = $this->convertDict($detial_list, $detail_prop);

    $res_array = [];
    foreach ($main_dict as $k => $v) {
      $detial = array_key_exists($k, $detail_dict) ? $detail_dict[$k] : [];
      $res_array[] = ['main' => $v, 'detail' => $detial];
    }
    return $res_array;
  }

  public function getPropArray($data, $property){
    $res_array = [];
    foreach ($data as $k => $v) {
      $res_array[] = $v[$property];
    }
    return $res_array;
  }

  public function convertDict($data, $property){
    $dict = [];

    foreach ($data as $k => $v) {
      $key_array = [];
      $key = $key = $this->convertKey($v, $property);

      if(array_key_exists($key, $dict)){
        $dict[$key][] = $v;
      }
      else{
        $dict[$key] = [$v];
      }
    }

    return $dict;
  }

  public function convertDictOne($data, $props){
    $dic = [];
    foreach ($data as $k => $v) {
      $key = $this->convertKey($v, $props);

      $dic[$key] = $v;
    }

    return $dic;
  }

  public function convertKey($d, $p){
    $key_array = [];
    foreach ($p as $k => $v) {
      $key_array[] = $d[$v];
    }

    return $key = join(',', $key_array);
  }

  public function getPropsArray($d, $p){
    $d = $this->formatObjToArray($d);
    $arr = [];
    foreach ($d as $k => $v) {
      $tmp_arr = [];
      foreach ($p as $pk => $pv) {
        $tmp_arr[$pv[0]] = $this->isKey($pv[1], $v, $pv[2]);
      }
      $arr[] = $tmp_arr;
    }
    return $arr;
  }

  //(barcode_list,purchase_list,['purchase_bill_id','brand'...],purchase_list的['purchase_bill_id',...],[['container_fee','container_fee','0'],....])
  public function distrubuteProps($d1, $d2, $k1_props, $k2_props, $props){
    $d1 = $this->formatObjToArray($d1);
    $d2 = $this->formatObjToArray($d2);
    $d2_dic = $this->convertDictOne($d2, $k2_props);
    foreach ($d1 as $k => $v) {
      $key = $this->convertKey($v, $k1_props);
      if(array_key_exists($key, $d2_dic)){
        foreach ($props as $p_k => $p_v) {
          $d1[$k][$p_v[0]] = $this->isKey($p_v[1], $d2_dic[$key], $p_v[2]);
        }
      }
      else{
        foreach ($props as $p_k => $p_v) {
          $d1[$k][$p_v[0]] = $p_v[2];
        }
      }
    }

    return $d1;
  }

  public function aliasArray($d, $n1, $n2){
    foreach ($d as $key => &$v) {
      $v[$n2] = $v[$n1];
    }
    return $d;
  }

  public function distrubuteExistProps($d1, $d2, $k1_props, $k2_props, $props){
    $d1 = $this->formatObjToArray($d1);
    $d2 = $this->formatObjToArray($d2);
    $d2_dic = $this->convertDictOne($d2, $k2_props);
    foreach ($d1 as $k => $v) {
      $key = $this->convertKey($v, $k1_props);
      if(array_key_exists($key, $d2_dic)){
        foreach ($props as $p_k => $p_v) {
          $d1[$k][$p_v[0]] = $this->isKey($p_v[1], $d2_dic[$key], $p_v[2]);
        }
      }
    }

    return $d1;
  }

  public function distrubutePropsByNum($d1, $d2, $k1, $k2, $nn1, $nn2, $pk){
    $d1 = $this->formatObjToArray($d1);
    $d2 = $this->formatObjToArray($d2);

    $d1 = $this->aliasArray($d1, $nn1, '__count');
    $d2_dic = $this->convertDict($d2, $k2);
    $d3 = [];

    foreach ($d1 as $k => &$v) {
      $key = $this->convertKey($v, $k1);
      if(array_key_exists($key, $d2_dic)){
        foreach ($d2_dic[$key] as $k => &$d2v) {
          if($d2v[$nn2] > 0){
            $count = 0;
            if($v['__count'] > $d2v[$nn2]){
              $count = $d2v[$nn2];
              $v['__count'] -= $d2v[$nn2];
              $d2v[$nn2] = 0;
            }
            else{
              $count = $v['__count'];
              $d2v[$nn2] -= $v['__count'];
              $v['__count'] = 0;
            }

            $vv = $this->formatObjToArray($v);
            foreach ($pk as $p_k => $p_v) {
              $vv[$p_v[0]] = $this->isKey($p_v[1], $d2v, $p_v[2]);
            }
            $vv[$nn1] = $count;
            unset($vv['__count']);
            $d3[] = $vv;
          }

          if($d2v[$nn2] == 0) unset($d2_dic[$key][$k]);
        }
      }
    }

    return $d3;
  }

  public function additionPropArray($d, $p_k, $p, $p_n=null){
    $d = $this->formatObjToArray($d);
    $p_n = $p_n ? $p_n : $p;
    $d_dic = $this->convertDict($d, $p_k);
    $dic = [];
    foreach ($d_dic as $k => $v) {
      $dic[$k] = $v[0];
      $dic[$k][$p_n] = 0;
      foreach ($v as $key => $v_v) {
        $dic[$k][$p_n] += $this->isKey($p, $v_v, 1);
      }
    }
    return $this->convertIndexArray($dic);
  }

  public function additionPropsArray($d, $p_k, $ps, $ps_n=null){
    $d = $this->formatObjToArray($d);
    $ps_n = $ps_n ? $ps_n : $ps;
    $d_dic = $this->convertDict($d, $p_k);
    $dic = [];
    foreach ($d_dic as $k => $v) {
      $dic[$k] = $v[0];

      foreach ($ps_n as $ps_n_k => $ps_n_v) {
        $dic[$k][$ps_n_v] = 0;
      }

      foreach ($v as $key => $v_v) {
        foreach ($ps_n as $ps_n_k => $ps_n_v) {
          $dic[$k][$ps_n_v] += $this->isKey($ps[$ps_n_k], $v_v, 1);
        }
      }
    }

    return $this->convertIndexArray($dic);
  }



  public function additionPropNumOneToOneArray($d1, $d2, $k_p1, $p1, $k_p2=null, $p2=null){
    if(!$k_p2) $k_p2 = $k_p1;
    if(!$p2) $p2 = $p1;
    $d1 = $this->formatObjToArray($d1);
    $d2 = $this->formatObjToArray($d2);
    $d2_dic = $this->convertDictOne($d2, $k_p2);
    foreach ($d1 as $k => &$v) {
      $key = $this->convertKey($v, $k_p1);
      $v[$p1] = $this->isKey($p1, $v, 0);

      if(array_key_exists($key, $d2_dic)){
        $v[$p1] += $d2_dic[$key][$p2];
      }
    }

    return $d1;
  }

  public function convertInvalidField($d, $p, $init_val=null){
    $init_val = $init_val ? $init_val : '';
    $d = $this->formatObjToArray($d);

    foreach ($d as $key => &$v) {
      foreach ($p as $key => $pv) {
        $v[$pv] = $this->isKey($pv, $v, $init_val);
      }
    }
    return $d;
  }

  public function initVal($d, $p, $init_val=null){
    $init_val = $init_val ? $init_val : '';
    $d = $this->formatObjToArray($d);

    foreach ($d as $key => &$v) {
      foreach ($p as $key => $pv) {
        $v[$pv] = $init_val;
      }
    }
    return $d;
  }

  public function initVals($d, $ps, $int_vals){
    $d = $this->formatObjToArray($d);

    foreach ($d as $dk => &$v) {
      foreach ($ps as $pk => $pv) {
        $v[$pv] = $int_vals[$pk];
      }
    }
    return $d;
  }

  public function convertIndexArray($d){
    // $d = $this->formatObjToArray($d);
    $arr = [];
    foreach ($d as $k => $v) {
      $arr[] = $v;
    }

    return $arr;
  }




  public function isEach($d, $fn){
    $istrue = true;
    foreach ($d as $key => $v) {
      if(!$fn($v)) $istrue = false;
    }

    return $istrue;
  }

  function NumToCNMoney($num,$mode = true,$sim = true){
    if(!is_numeric($num)) return '含有非数字非小数点字符！';
    $char  = $sim ? array('零','一','二','三','四','五','六','七','八','九')
    : array('零','壹','贰','叁','肆','伍','陆','柒','捌','玖');
    $unit  = $sim ? array('','十','百','千','','万','亿','兆')
    : array('','拾','佰','仟','','萬','億','兆');
    $retval = $mode ? '元':'点';
    //小数部分
    if(strpos($num, '.')){
      list($num,$dec) = explode('.', $num);
      $dec = substr($dec,0, 2);
      $dec = str_pad($dec, 2, 0, STR_PAD_RIGHT);
      if($mode){
        $retval .= "{$char[$dec['0']]}角{$char[$dec['1']]}分";
      }else{
        for($i = 0,$c = strlen($dec);$i < $c;$i++) {
          $retval .= $char[$dec[$i]];
        }
      }
    }
    //整数部分
    $str = $mode ? strrev(intval($num)) : strrev($num);
    for($i = 0,$c = strlen($str);$i < $c;$i++) {
      $out[$i] = $char[$str[$i]];
      if($mode){
        $out[$i] .= $str[$i] != '0'? $unit[$i%4] : '';
          if($i>1 and $str[$i]+$str[$i-1] == 0){
          $out[$i] = '';
        }
          if($i%4 == 0){
          $out[$i] .= $unit[4+floor($i/4)];
        }
      }
    }
    $retval = join('',array_reverse($out)) . $retval;
    return $retval;
  }

  public function count($d, $p){
    $d = $this->formatObjToArray($d);
    $c = [];
    foreach ($p as $key => $v) {
      $c[$v[0]] = 0;
    }

    foreach ($d as $key => $v) {
      foreach ($p as $key => $p_v) {
        $num = floatval($this->isKey($p_v[1], $v, 0));
        $c[$p_v[0]] += $num;
      }
    }
  return $c;
  }

  public function convertArrayToDict($d, $ks){
    $dic_arr = [];
    foreach ($d as $key => $v) {
      $dic = [];
      foreach ($ks as $i => $k_v) {
        if($k_v != null){
          $dic[$k_v] = $v[$i];
        }
      }

      $dic_arr[] = $dic;
    }

    return $dic_arr;
  }

  public function getPropsArrays($d, $p){
    $arr = [];

    foreach ($d as $key => $v) {
      $tmp_arr = [];
      foreach ($p as $key => $pv) {
        $tmp_arr[] = $v[$pv];
      }
      $arr[] = $tmp_arr;
    }

    return $arr;
  }
}