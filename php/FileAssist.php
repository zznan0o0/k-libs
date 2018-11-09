<?php 

namespace App\Libs;

use App\Libs\FormatData;

class FileAssist extends FormatData{
  public function makeDateDir($folder_name){
    $whole_path = '';
    if($folder_name){
      $whole_path = $folder_name . '/';
    }
    else{
      $whole_path = 'storage/';
    }

    $year = date('Y');
    $month = date('m');
    $day = date('d');
    $whole_path = $whole_path . $year . '/' . $month . '/' . $day . '/';
    $this->makedir($whole_path);
    return $whole_path;
  }

  public function makedir($whole_path){
    if(!is_dir($whole_path)) mkdir($whole_path, 0777, true);
    return $whole_path;
  }

  public function getId(){
    return md5(uniqid(md5(microtime(true)),true));
  }

  public function processingFile($folder_name, $file){
    if($file->isValid()){
      $file_id = $this->getId();
      $file_orginal_name = $file->getClientOriginalName();
      $file_ext = $file->getClientOriginalExtension();
      $file_type = $file->getClientMimeType();
      $file_path = $file->getRealPath();
      $file_name = $file_id.'.'.$file_ext;
      $whole_path = $this->makeDateDir($folder_name);
      $save_path = $whole_path . $file_name;
      $isExist = copy($file_path, $save_path);
      $size = filesize($file);
      $kb_size = ceil($size / 1024);
      $company_id = session('company_id');
      $warehouse_id = session('warehouse_id');
      $user_id = session('user_id');

      if($isExist){
        return [
          "id" => $file_id,
          "type" => $file_ext,
          "size" => $kb_size,
          "function_id" => $function_id,
          "path" => $whole_path,
          "orgin_name" => $file_orginal_name,
          "name" => $name,
          "company_id" => $company_id,
          "warehouse_id" => $warehouse_id,
          "bill_id" => $bill_id,
          "user_id" => $user_id,
        ];
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }


}