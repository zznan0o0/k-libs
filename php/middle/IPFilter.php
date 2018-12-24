<?php

namespace App\Http\Middleware;

use Closure;
use Request;

class IPFilter
{
  public function handle($request, Closure $next)
  {
    if(!in_array($request->getClientIp(),config('WebConfig.filter_ip'))) return ['state' => 0, 'notice' => '权限不够'];
    return $next($request);
  }
}
