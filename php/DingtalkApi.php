<?php 

namespace App\Libs;
use App\Libs\ClientRequest;


class DingtalkApi extends ClientRequest{

  public function gettoken(){
    $output = $this->get('https://oapi.dingtalk.com/gettoken',['corpid' => 'ding1887a471cb42a0bf','corpsecret' => 'EqV1H7Ul97QYSS-C8F0lvKRg_urxF1g3tp7PoyR72xX7uz80XIuu2jJdo8kDO5vD']);
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