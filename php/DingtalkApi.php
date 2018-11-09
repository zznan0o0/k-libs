<?php 

namespace App\Libs;
use App\Libs\ClientRequest;


class DingtalkApi extends ClientRequest{

  public function gettoken(){
    $output = $this->get('https://oapi.dingtalk.com/gettoken',['corpid' => '','corpsecret' => '']);
    $output = json_decode($output, true);
    return $output;
  }

  public function getuserinfo($code){
    $access_token = $this->gettoken()['access_token'];
    $output = $this->get('https://oapi.dingtalk.com/user/getuserinfo',['access_token' => $access_token,'code' => $code]);
    $output = json_decode($output, true);
    $user_info = $this->get('https://oapi.dingtalk.com/user/get',['access_token' => $access_token,'userid' => $output['userid']]);
    return json_decode($user_info, true);
  }
}