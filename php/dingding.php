<?php 

namespace App\Libs;
use App\Libs\ClientRequest;
use DB;
use App\Model\User\AccessTokenModel;

class DingtalkApi extends ClientRequest{

  public function get_wxtoken(){
    $WeChatUrl = config('WebConfig.WeChat.WeChatUrl');
    // $output = $this->get('https://api.weixin.qq.com/cgi-bin/token',['grant_type'=>'client_credential','appid'=>config('WebConfig.WeChat.appid'),'secret'=>config('WebConfig.WeChat.secret')]);
    $output = $this->get($WeChatUrl.'/cgi-bin/token',['grant_type'=>'client_credential','appid'=>config('WebConfig.WeChat.appid'),'secret'=>config('WebConfig.WeChat.secret')]);
    $output = json_decode($output, true);
    return $output;
  }
  public function gettoken(){
    $output = $this->get('https://oapi.dingtalk.com/gettoken',['corpid' => 'ding1887a471cb42a0bf','corpsecret' => 'EqV1H7Ul97QYSS-C8F0lvKRg_urxF1g3tp7PoyR72xX7uz80XIuu2jJdo8kDO5vD']);
    $output = json_decode($output, true);
    return $output;
  }

  public function getDingtalkUser($user_id, $access_token){
    $user_info = $this->get('https://oapi.dingtalk.com/user/get',['access_token' => $access_token,'userid' => $user_id]);
    return json_decode($user_info, true);
  }

  public function gettokenwx(){
    $get_data = AccessTokenModel::get(); 
    // return $get_data;
    date_default_timezone_set('PRC');
    $time = time();
    // return date('Y-m-d H:i:s', $time);
    // dd(date('Y-m-d H:i:s', $time));
    // return $get_data;
    if(!count($get_data)){    
      // return 111;
      $output = $this->get_wxtoken();
      AccessTokenModel::insert([
        'id' => 1,
        'access_token' => $output['access_token'],
        'updated_at' => date('Y-m-d H:i:s', $time),
      ]);
      return $output;
    }
    // return 222;
    // return $time - strtotime($get_data[0]['updated_at']);
    elseif(($time - strtotime($get_data[0]['updated_at'])) > 5400){
      // return $time - strtotime($get_data[0]['updated_at']);
      // return 333;
      $output = $this->get_wxtoken();
      AccessTokenModel::where('id',1)->update([
        'access_token' => $output['access_token'],
        'updated_at' => date('Y-m-d H:i:s', $time),
      ]);
  
      return $output;
    }
    // $wx_access_token = $get_data[0]['access_token'];
    // $wx_time = $get_data[0]['updated_at'];
    // $wx_time = strtotime($wx_time);
    // return 111;
    // return 444;
    return $get_data[0];
  }


  /*$data = [
    'type' => 'file',
    'filename' => 'aaa.xlsx', //钉钉上传名
    'filesize' => 0,
    'offset' => 0,
    'filetype' => 'application/octet-stream',
    'originName' => 'aaa.xlsx',
    'upload'=>file_get_contents('storage/aaa.xlsx'),
    'upload_file_name' => 'media',
    'access_token' => $access_token,
  ];*/
  public function uploadFile($data){
    $url = 'https://oapi.dingtalk.com/media/upload';
    return $this->formdataUpload($url, $data);
  }

  /*$data = [
    'touser' => '091716111036380986',//群员id
    'msgtype' => 'file',
    'agentid' => '196445025',
    'file' => ['media_id' => '@lAzPDeC2tvyFUo7OATw-A84sSxtz'], 上传到钉钉的文件id
  ];*/
  public function send_file($file_path,$user_id,$start_date,$end_date,$originName){
    $c = new ClientRequest();
    $access_token = $this->gettoken()['access_token'];
    $file_data = [
      'type' => 'file',
      'filename' => $start_date.'_'.$end_date.'.pdf', //钉钉上传名
      'filesize' => 0,
      'offset' => 0,
      'filetype' => 'application/octet-stream',
      'originName' => $originName,
      'upload'=>file_get_contents($file_path),
      'upload_file_name' => 'media',
      'access_token' => $access_token,
    ];
    $url = 'https://https://oapi.dingtalk.com/media/upload';
    $file_id = $this->uploadFile($file_data);
    if($file_id['errmsg'] == 'ok'){
      $file_id = $file_id['media_id'];
    }else{
      return 'error';
    }
    $url2 = 'https://oapi.dingtalk.com/message/send?access_token='.$access_token;
    $receive_data = [
      // 'touser' => '3924200829492203',
      'touser' => $user_id,
      'msgtype' => 'file',
      'agentid' => '196445025',
      'file' => ['media_id' => $file_id],
      'access_token' => $access_token,
    ];

    return $c->postJson($url2, $receive_data);
  }

  public function getuserinfo($code){
    $access_token = $this->gettoken()['access_token'];
    $output = $this->get('https://oapi.dingtalk.com/user/getuserinfo',['access_token' => $access_token,'code' => $code]);
    $output = json_decode($output, true);
    $user_info = $this->get('https://oapi.dingtalk.com/user/get',['access_token' => $access_token,'userid' => $output['userid']]);
    return json_decode($user_info, true);
  }

  public function getuserinfo_by_userid($user_id,$token){
    $access_token = $token;
    // https://oapi.dingtalk.com/user/get?access_token=ACCESS_TOKEN&userid=zhangsan
    $user_info = $this->get('https://oapi.dingtalk.com/user/get',['access_token' => $access_token,'userid' => $user_id]);
    return json_decode($user_info, true);
  }

 public function getuserinfo_by_userid_wx($user_id,$token){
    $access_token = $token;
    $user_id=$user_id;
    // https://oapi.dingtalk.com/user/get?access_token=ACCESS_TOKEN&userid=zhangsan
    $WeChatUrl = config('WebConfig.WeChat.WeChatUrl');
    $user_info = $this->get($WeChatUrl.'/cgi-bin/user/info',['access_token' => $access_token,'openid' => $user_id]);

    return json_decode($user_info, true);
  }

  public function test(){
    $access_token = $token;
    // https://oapi.dingtalk.com/user/get?access_token=ACCESS_TOKEN&userid=zhangsan
    $user_info = $this->get('https://oapi.dingtalk.com/user/get',['access_token' => $access_token,'userid' => $user_id]);
    return json_decode($user_info, true);
  }

}
