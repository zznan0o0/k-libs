<?php

namespace App\Libs;
use App\Imports\UsersImport;
use Excel;

class LaravelExcel {
    public function read($file_path, $keys=[]){
        $data = Excel::toArray(new UsersImport, $file_path)[0];
        if(count($keys) < 1){
            return $data;
        }

        $returnData = [];

        foreach($data as $v){
            $arr = [];
            foreach($keys as $i => $k){
                if($k !== false){
                    $arr[$k] = $v[$i];
                }
                $returnData[] = $arr;
            }
        }

        return $returnData;
    }
}