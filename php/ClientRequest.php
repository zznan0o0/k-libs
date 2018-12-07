<?php 

namespace App\Libs;
use App\Libs\FormatData;


class ClientRequest extends FormatData{
  private $ApiUserId = 'U548163';
  private $token = 'yYkf3y1P7CeRV3i9C89cMXgjpq3aN0Qt';
  // private $host = 'http://116.62.34.164:9091/';
  


  private function urlGo($url){
    return config('WebConfig.api_ip.go_api').$url;
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

  public function postJson($url, $submit_data){
    // $submit_data = http_build_query($submit_data);    
    $submit_data = json_encode($submit_data);
    $options = [
      'http' => [
        'method' => 'POST',    
        'header' => 'Content-Type:application/json; charset=utf-8',    
        'content' => $submit_data,    
        'timeout' => 15 * 60 
      ]    
    ];
    $context = stream_context_create($options);    
    $result = file_get_contents($url, false, $context);             
    return $result;   
  }


  public function covertUrl($url,$data){
    $url = $url . "?";
    $arr = [];
    foreach ($data as $k => $v) {
      $arr[] = $k . '=' . $v;
    }
    $url .= join('&',$arr);

    return $url;
  }


  public function get($url,$data){

    if($data){
      $url = $url . "?";
      $arr = [];
      foreach ($data as $k => $v) {
        $arr[] = $k . '=' . $v;
      }
      $url .= join('&',$arr);
    }

    $curl = curl_init(); // 启动一个CURL会话
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HEADER, 0);
    // curl_setopt($curl, CURLOPT_ENCODING, "gzip" );
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);//绕过ssl验证
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);

    //执行并获取HTML文档内容
    $output = curl_exec($curl);

    //释放curl句柄
    curl_close($curl);
    return $output;
  }

  public function formdataUpload($url, $param) {
    $delimiter = uniqid();
    $post_data = $this->buildData($param, $delimiter);
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
    curl_setopt($curl, CURLOPT_HTTPHEADER, [
        "Content-Type: multipart/form-data; boundary=" . $delimiter,
        "Content-Length: " . strlen($post_data)
    ]);

    $response = curl_exec($curl);
    curl_close($curl);
    return $info = json_decode($response, true);
  }

  public function buildData($param, $delimiter){
    $data = '';
    $eol = "\r\n";
    $upload = $param['upload'];
    unset($param['upload']);

    foreach ($param as $name => $content) {
      $data .= "--" . $delimiter . "\r\n"
        . 'Content-Disposition: form-data; name="' . $name . "\"\r\n\r\n"
        . $content . "\r\n";
    }
    // 拼接文件流
    $data .= "--" . $delimiter . $eol
      . 'Content-Disposition: form-data; name="' . $param['upload_file_name'] . '"; filename="' . $param['filename'] . '"' . "\r\n"
      . 'Content-Type:application/octet-stream'."\r\n\r\n";

    $data .= $upload . "\r\n";
    $data .= "--" . $delimiter . "--\r\n";
    return $data;
  }

  public function postXML($url, $xml){
    $curl = curl_init();

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $xml);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $res = curl_exec($curl);
    curl_close($curl);
    return $res;
  }

  public function parseXML($xml){
    libxml_disable_entity_loader(true);
    return json_decode(json_encode(simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA)), true);
  }

}