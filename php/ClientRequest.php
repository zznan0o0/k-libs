<?php 

namespace App\Libs;
use App\Libs\FormatData;


class ClientRequest extends FormatData{
  private $ApiUserId = 'bbb';
  private $token = 'aaa';
  private $host = 'http://127.0.0.1:9091/';
  


  private function urlGo($url){
    return $this->host.$url;
  }

  private function mergeToken($arr){
    $need_arr = [
      'ApiUserId' => $this->ApiUserId,
      'token' => $this->token,
      'UserID' => session('userId')
    ];

    $new_arr = array_merge($arr, $need_arr);
    return $new_arr;
  }

  public function postGo($url, $submit_data=null){
    $url = $this->urlGo($url);
    $submit_data = $submit_data ? $submit_data : [];
    $submit_data = $this->mergeToken($submit_data);
    return $this->post($url, $submit_data);    
  }

  public function post($url, $submit_data){
    $submit_data = http_build_query($submit_data);    
    $options = [
      'http' => [
        'method' => 'POST',    
        'header' => 'Content-type:application/x-www-form-urlencoded',    
        'content' => $submit_data,    
        'timeout' => 15 * 60 
      ]    
    ];
    $context = stream_context_create($options);    
    $result = file_get_contents($url, false, $context);             
    return $result;   
  }
}