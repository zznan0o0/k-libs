<?php 

namespace App\Libs;
use App\Libs\FormatData;


class ClientRequest extends FormatData{
  private $ApiUserId = 'U548163';
  private $token = 'yYkf3y1P7CeRV3i9C89cMXgjpq3aN0Qt';
  // private $host = 'http://192.168.10.229:9091/';
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
        'header' => 'Content-type:application/x-www-form-urlencoded;charset=utf-8',    
        'content' => $submit_data,    
        'timeout' => 15 * 60 
      ]    
    ];
    $context = stream_context_create($options);    
    $result = file_get_contents($url, false, $context);             
    return $result;   
  }

  public function order_gen($data){
    $url = "http://192.168.10.120/webapi/atapi/SubmitProduct/";
    //http://api3.atjubo.com/atapi/SubmitProduct/?UserID=7445&yp_id=1078,&fl_id=&buycount=1&isptwl=0&addrid=&Toywytel=
    return $this->get($url,$data);
  }

  public function get($url,$data){
    $url = $url . "?";
    $arr = [];
    foreach ($data as $k => $v) {
      $arr[] = $k . '=' . $v;
    }
    $url .= join('&',$arr);
    $curl = curl_init(); // 启动一个CURL会话
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HEADER, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);//绕过ssl验证
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);

    //执行并获取HTML文档内容
    $output = curl_exec($curl);

    //释放curl句柄
    curl_close($curl);
    return $output;
  }
}