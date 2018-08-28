# import psycopg2
import pymysql
import json
import copy


class OpeartingDB:
  def __init__(self):
    db_config_file = open('db_config.json')
    db_config = json.load(db_config_file)
    db_config_file.close()
    self._config = db_config
    self._connect_array = []
    self._cursor_array = []

  def connection(self, database):
    db_config = self._config[database]
    connect = pymysql.connect(database=db_config['database'], user=db_config['user'], password=db_config['password'], host=db_config['host'], port=db_config['port'], cursorclass=pymysql.cursors.DictCursor,charset="utf8")

    self._connect_array.append(connect)

    cursor = connect.cursor()
    self._cursor_array.append(cursor)

    return connect, cursor

  def commitAll(self):
    for v in self._connect_array:
      v.commit()

  def closeAll(self):
    for item in self._connect_array:
      item.commit()

    for item in self._cursor_array:
      item.close()

    for item in self._connect_array:
      item.close()

    self._cursor_array = []
    self._connect_array = []

  def close(self, connect, cursor):
    connect.commit()
    cursor.close()
    connect.close()
    cur_index = self._cursor_array.index(cursor)
    conn_index = self._connect_array.index(connect)
    del self._cursor_array[cur_index]
    del self._connect_array[conn_index]


  def addQuotes(self, x):
    return "'%s'" % x

  def getWhereInString(self, array):
    return ','.join(list(map(self.addQuotes, array)))

  def covertTuple(self, k, d):
    tuple_list = []
    for v in d:
      tuple_tmp = []
      for kv in k:
        val = self.isKey(kv, v, kv)
        tuple_tmp.append(val)

      tuple_list.append(tuple(tuple_tmp))

    return tuple_list

  def addPropOneToOne(self, d1, d2, k1, p, k2=False):
    k2 = k2 if k2 else k1
    d1 = copy.deepcopy(d1)
    d2 = copy.deepcopy(d2)
    d2_dic = self.convertDic(d2, k2)
    for v in d1:
      key = self.covertKey(v, k1)
      if key in d2_dic.keys():
        self.addProp(v, d2_dic[key], p)
      else:
        self.addProp(v, {}, p)

    return d1

  def addProp(self, d1, d2, p):
    for v in p:
      int_val = '' if len(v) <= 2 else v[2] 
      d1[v[0]] = self.isKey(v[1], d2, int_val)

  def convertDic(self, d, ks):
    d = copy.deepcopy(d)
    dic = {}
    for v in d:
      k_arr =[]
      key = self.covertKey(v, ks)
      dic[key] = v

    return dic

  def covertKey(self, d, k):
    k_arr = []
    for v in k:
      k_arr.append(d[v])

    return ','.join(k_arr)

  def isKey(self, k, data, v=''):
    return v if k not in data.keys() else data[k]