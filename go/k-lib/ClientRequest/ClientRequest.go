package ClientRequest

import (
  "net/url"
  "net/http"
  "fmt"
  "k-lib/HandleData"
  "io/ioutil"
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

