<?php

namespace App\Libs;
use Session;

/** 
 * @package SSO
 * @author ZhengZongNan <dx0w0xb@lookout.com>
 * @link https://www.cnblogs.com/fps2tao/p/7966986.html cookie doc
 * @link https://www.cnblogs.com/500m/p/11021492.html cookie doc
 * @link https://www.php.net/manual/zh/function.unserialize.php unserialize doc
 * @link https://blog.csdn.net/weixin_44535476/article/details/88575242
 * @see vendor/laravel/framework/src/Illuminate/Session/Store.php session api
*/
class SSOApi {
    /** 
     * @var string the database name of redis
    */
    static public $redis_database = 'default';

    /** 
     * get session id from cookie
     * @return string session id 
    */
    static public function getSessionIdFromCookie(){
        return $_COOKIE['B8671D46E4989'];
    }

    /** 
     * set session id in cookie
     * @param string $session_id
     * @return boolean
    */
    static public function setSessionId($session_id){
        return setcookie("B8671D46E4989", $session_id, time()+7200,'/');
    }

    /** 
     * get session id 
     * @return string session id
    */
    static public function getSessionIdFromSession(){
        return Session::getId();
    }

    /** 
     * get session data
     * @param string $session_id
     * @return array session data
    */
    static public function getSessionById($session_id){
        return unserialize(Session::getHandler()->read($session_id));
    }

    /** 
     * get session by redis data
     * @param string $session_id
     * @param string $prefix_str prefix of reids key 
     * @return array session data
    */

    static public function getSessionByRedis($session_id, $prefix_str='laravel:'){
        $redis = app('redis');
        $redis = $redis->connection(self::$redis_database);
        $data = $redis->get($prefix_str.$session_id);
        return unserialize(unserialize($data));
    }

}