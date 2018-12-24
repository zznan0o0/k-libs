<?php

namespace App\Http\Middleware;

use Closure;

class CorsAjax
{
  public function handle($request, Closure $next)
  {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Allow-Headers: Content-Type,Access-Token");
    header("Access-Control-Expose-Headers: *");

    return $next($request);
  }
}
