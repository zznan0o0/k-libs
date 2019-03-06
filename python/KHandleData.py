class KHandleData:
  def mapDictDict(self, d1, d2, k1, k2, fn):
    dict2 = self.convertDict(d2, k2)
    arr = []
    for v in d1:
      key = self.convertKey(v, k1)
      arr.append(fn(v, self.getVal(dict2, key, []), key))
    
    return arr

  def convertDict(self, d, k):
    dic = {}
    for v in d:
      key = self.convertKey(v, k)
      dic[key] = v
    
    return dic
  
  def convertKey(self, d, k):
    arr = []
    for kv in k:
      arr.append(str(self.getVal(d, kv, '')))

    return ','.join(arr)

  def getVal(self, d, k, intval = ''):
    return intval if k not in d.keys() else d[k]
  
  def getDictsVal(self, d, k, intval = ''):
    arr = []
    for v in d:
      arr.append(intval if k not in v.keys() else v[k])

    return arr

if __name__ == '__main__':
  kHandleData = KHandleData()

  d1 = [{'k': 1, 'v':2}, {'k': 2, 'v':3}]
  d2 = [{'k': 1, 'c':3}, {'k': 2, 'c':4}]
  c = []
  def aaa(v1, v2, key):
    v1['c'] = kHandleData.getVal(v2, 'c', '')
    c.append(v1)
    return v1

  bbb = kHandleData.mapDictDict(d1, d2, ['k'], ['k'], aaa)
  print(c)