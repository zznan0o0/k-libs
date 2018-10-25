package HandleData

import (
  "fmt"
  "strings"
  "strconv"
  "encoding/json"
)


func Check(err error){
  if err != nil {
    fmt.Println(err)
  }
}

func ConvertKey(d map[string]string, p []string) (key string){
  var key_arr []string
  for _, v := range p{
    key_arr = append(key_arr, IsKey(d, v, ""))
  }

  key = strings.Join(key_arr, ",")
  return key
}

func IsKey(d map[string]string, k string, init_val string) (string){
  if _, ok := d[k]; ok {
    return d[k]
  } else {
    return init_val
  }
}

func ConvertDicOne(d []map[string]string, p []string) (map[string]map[string]string){
  res_d := make(map[string]map[string]string)
  for _, v := range d{
    key := ConvertKey(v, p)
    res_d[key] = v
  }

  return res_d
}

func ConvertDicMany(d []map[string]string, p []string) (map[string][]map[string]string){
  res_d := make(map[string][]map[string]string)
  for _, v := range d{
    key := ConvertKey(v, p)
    res_d[key] = append(res_d[key], v)
  }

  return res_d
}

func AdditionPropMapListInt(d []map[string]string,  p[]string, values[][2]string) ([]map[string]string){
  dic := ConvertDicMany(d, p)
  var arr []map[string]string
  m_m := make(map[string]map[string]string)
  for k, v_arr := range dic{
    var m map[string]string
    m_byt, e := json.Marshal(v_arr[0])
    Check(e)
    json.Unmarshal(m_byt, &m)

    for _, v := range values{
      m[v[0]] = "0"
    }
    m_m[k] = m

    for _, v_map :=  range v_arr{
      for _, v := range values{
        i1, e := strconv.ParseInt(m_m[k][v[0]], 10, 64)
        Check(e)
        i2, e := strconv.ParseInt(v_map[v[1]], 10, 64)
        Check(e)
        m_m[k][v[0]] = strconv.FormatInt(i1+i2, 10)
      }
    }
  }

  for _, v := range m_m{
    arr = append(arr, v)
  }

  return arr
}


func AddPropMapList(d1 []map[string]string, d2[]map[string]string, p1[]string, p2[]string, values[][3]string) ([]map[string]string){
  d2_dic := ConvertDicOne(d2, p2)

  for _, d_v := range d1{
    key := ConvertKey(d_v, p1)
    if _, ok := d2_dic[key]; ok {
      for _, v := range values{
        d_v[v[0]] = IsKey(d2_dic[key], v[1], v[2])
      }
    } else {
      for _, v := range values{
        d_v[v[0]] = v[2]
      }
    }
  }

  return d1
}

func ConvertSQLWhereIn(d []string) (string){
  arr := []string{}

  for _, v := range d{
    arr = append(arr, "'" + v + "'")
  }
  return strings.Join(arr, ",")
} 

func ConvertSQLValues(d []map[string]string, p[]string) (string){
  var arr []string
  for _, v := range d{
    var v_arr []string
    for _, p_v := range p{
      v_arr = append(v_arr, "'"+v[p_v]+"'")
    }

    arr = append(arr, "("+strings.Join(v_arr, ",")+")")
  }

  return strings.Join(arr, ",")
}

func GetPropArray(d []map[string]string, p string) (arr [] string){
  for _, v := range d{
    arr = append(arr, v[p])
  }

  return arr
}

func GetMapKey(m map[string]string) (arr []string){
  for k, _ := range m{
    arr = append(arr, k)
  }

  return arr
}

func DuplicateRemovalString(d []string) (arr []string){
  dic := make(map[string]string)
  for _, v := range d{
    if _, ok := dic[v]; !ok {
      dic[v] = ""
    }
  }

  return GetMapKey(dic)
}


func ConvertInterfaceToMap(d map[string]interface{}) (m map[string]string){
  m_s, e := json.Marshal(d)
  Check(e)
  e = json.Unmarshal([]byte(m_s), &m)
  Check(e)
  return m
}

func ConvertArrayInterfaceToArrayMap(d []interface{}) (a []map[string]string){
  a_s, e := json.Marshal(d)
  Check(e)
  e = json.Unmarshal([]byte(a_s), &a)
  Check(e)
  return a
}

func ConvertIndexArray(m map[string]map[string]string) (arr []map[string]string){
  for _, v := range m{
    arr = append(arr, v)
  }
  return arr
}

func MatchAToBArrayDicInt(a []map[string]string, b[]map[string]string, ap[]string, bp[]string, values[]string) ([]map[string]string){
  a_dic := ConvertDicOne(a, ap)

  for _, v := range b{
    key := ConvertKey(v, bp)
    if _, ok := a_dic[key]; ok {
      for _, val_v := range values{
        a_val := IsKey(a_dic[key], val_v, "0")
        a_val_int, _ := strconv.ParseInt(a_val, 10, 64)
        b_val := IsKey(v, val_v, "0")
        b_val_int, _ := strconv.ParseInt(b_val, 10, 64)
        a_dic[key][val_v] = strconv.FormatInt(a_val_int - b_val_int, 10)
      }
    } else {
      a_dic[key] = v
      for _, val_v := range values{
        a_dic[key][val_v] = IsKey(a_dic[key], val_v, "0")
        if a_dic[key][val_v] != "0" {
          a_dic[key][val_v] = "-" + a_dic[key][val_v]
        }
      }
    }
  }

  return ConvertIndexArray(a_dic)
}

func InitIntValues(d []map[string]string, vals[]string) ([]map[string]string){
  for _, v := range d{
    for _, val_v := range vals{
      f, e :=  strconv.ParseFloat(IsKey(v, val_v, "0"), 64)
      Check(e)
      v[val_v] = strconv.FormatInt(int64(f), 10)
    }
  }
  return d
}

func ConvertArrayToMap(d []string) (map[string]int){
  m := make(map[string]int)
  for _, v := range d{
    if _, ok := m[v]; ok{
      m[v] += 1
    } else {
      m[v] = 1
    }
  }
  return m
}

func DiffSetArray(a []string, b []string) (r []string){
  a_m := ConvertArrayToMap(a)
  for _, v := range b{
    if _, ok := a_m[v]; ok{
      a_m[v] -= 1
    }
  }

  for k, v := range a_m{
    if(v > 0){
      r = append(r, k)
    }
  }

  return r
}

func UnmarshalJsonString(s string) (r []map[string]interface{}){
  e := json.Unmarshal([]byte(s), &r)
  Check(e)
  return r
}