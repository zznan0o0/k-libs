package ClientRequest

import (
  "net/url"
  "net/http"
  // "fmt"
  "k-lib/HandleData"
  "io/ioutil"
  "encoding/json"
  "bytes"
  // "unsafe"
)


func PostForm(api_str string, submit_data map[string]string) (res_str string, e error ){

  submit_value := url.Values{}

  for k, v := range(submit_data){
    submit_value[k] = []string{v}
  }

  res, e := http.PostForm(api_str, submit_value)
  HandleData.Check(e)
  if e == nil{
    defer res.Body.Close()
    body, e := ioutil.ReadAll(res.Body)
    HandleData.Check(e)
    res_str = string(body)
  }

  return res_str, e
}

func PostJson(api_str string, submit_data map[string]interface{}) (res_str string, e error){
  bytes_data, e := json.Marshal(submit_data)
  HandleData.Check(e)
  if e != nil {return res_str, e}

  submot_bytes_data := bytes.NewReader(bytes_data)

  req, e := http.NewRequest("POST", api_str, submot_bytes_data)
  HandleData.Check(e)
  if e != nil {return res_str, e}

  req.Header.Set("Content-Type", "application/json")

  client := &http.Client{}

  res, e := client.Do(req)
  HandleData.Check(e)
  if e != nil {return res_str, e}

  defer res.Body.Close()
  body, e := ioutil.ReadAll(res.Body)
  HandleData.Check(e)
  if e != nil {return res_str, e}

  res_str = string(body)

  return res_str, e
}

