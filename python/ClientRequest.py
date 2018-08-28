import urllib.request
import urllib.parse
import json

class ClientRequest:
  def __init__(self):
    self.__ApiUserId = '1111'
    self.__token = '111'
    self.__host = 'http://127.0.0.1:9091/'

  def covertDic(self, k, d):
    dic = {}
    for v in d:
      dic[v[k[0]]] = v[k[1]]

    return dic

  def addGlassPropId(self, d, k=False):
    k = k if k else ['brand','category','level','glass_film']
    url = self.url('v1/GlassOrders/GetBrandSku')
    submit_data = {};
    props = json.loads(self.post(url, submit_data))
    # brands_id moxi moxi_id
    levels = self.covertDic(['level', 'level_id'], props['data']['levels'])
    moxi = self.covertDic(['moxi', 'moxi_id'], props['data']['moxi'])
    brands = self.covertDic(['brand', 'brands_id'], props['data']['brands'])
    categories = self.covertDic(['category', 'category_id'], props['data']['categories'])

    for v in d:
      v['brand_id'] = self.isKey(v[k[0]], brands)
      v['category_id'] = self.isKey(v[k[1]], categories)
      v['level_id'] = self.isKey(v[k[2]], levels)
      v['glass_film_id'] = self.isKey(v[k[3]], moxi)

    return d

  def getOrderDetail(self, order_id):
    url = self.url('v1/GlassOrders/GetOrderDetail')
    submit_data = {'OrderID': order_id}
    order_data = json.loads(self.post(url, submit_data))
    formatOrder = self.formatOrderDetail(order_data)
    return {'order': order_data, 'formatOrder': formatOrder}

  def isKey(self, k, data, v=''):
    return v if k not in data.keys() else data[k]

  def formatOrderDetail(self, data):
    customer = data['customer']
    order = data['order']
    order_items = data['order_items']

    order_dict = {
      'order': {
        'order_id' : self.isKey('OrderID', order),
        'state' : self.isKey('OrderState', order),
        'buyer_salesman' : self.isKey('LinkMan', customer),
        # 'seller_salesman' : self.isKey('OrderID', order),
        # 'buyer_id' : self.isKey('OrderID', order),
        # 'seller_id' : self.isKey('OrderID', order),
        'total_price' : self.isKey('TotalBidPrice', order),
        # 'effective_date' : self.isKey('OrderID', order),
        # 'delivery_address' : self.isKey('OrderID', order),
        # 'consignee' : self.isKey('OrderID', order),
        # 'phone_number' : self.isKey('OrderID', order),
        'way_of_receiving' : self.isKey('IsPtwl', order),
        'way_of_paid' : self.isKey('PayTpye', order),
        # 'order_time' : date('Y-m-d', strtotime(self.isKey('CreateTime', order))),
        'total_price' : self.isKey('TotalPrice', order),
        'total_bid_price' : self.isKey('TotalBidPrice', order),
      },
      'order_items' :[]
    }

    for v in order_items:
      brand = v['brand']
      category = v['class']
      guige = v['guige']
      level = v['level']
      moxi = v['moxi']
      order_item = v['order_item']
      product = v['product']
      bao_num = order_item['BaoNum'] if int(order_item['BaoNum']) > 0 else 1
      chip = self.isKey('PianNum', order_item, 0)
      bao_num = int(bao_num)
      chip = int(chip)
      chip = chip / bao_num

      order_dict['order_items'].append({
        'order_id': self.isKey('OrderID', order),
        'brand': self.isKey('BrandTitle', brand),
        'category': self.isKey('ClassTitle', category),
        'level': self.isKey('LevelTitle', level),
        # 'colour': self.isKey('OrderID', order_item),
        'glass_film': self.isKey('MoxiName', moxi),
        'width': self.isKey('Height', product),
        'height': self.isKey('Width', product),
        'thickness': self.isKey('Weight', product),
        'chip': chip,
        # 'packing': self.isKey('OrderID', product),
        'packing': '',
        'packing_number': bao_num,
        'area': self.isKey('Area', order_item),
        'area_price': self.isKey('BidPrice', order_item),
        'total_price': self.isKey('ToPrice', order_item),
        # 'weight_case_price': self.isKey('OrderID', order_item),
        'ton': self.isKey('ToNum', order_item),
        # 'beltline': self.isKey('OrderID', order_item),
        # 'company_id': self.isKey('OrderID', order_item),  
      })

    return order_dict


  def url(self, url):
    return self.__host + url

  def mergeToken(self, submit_data):
    submit_data['ApiUserId'] = self.__ApiUserId
    submit_data['token'] = self.__token
    return submit_data

  def post(self, url, submit_data):
    submit_data = self.mergeToken(submit_data);
    submit_data = urllib.parse.urlencode(submit_data)
    submit_data = submit_data.encode('utf-8')
    request = urllib.request.Request(url)
    request.add_header("Content-Type","application/x-www-form-urlencoded;charset=utf-8")
    res = urllib.request.urlopen(request, submit_data)
    return res.read().decode('utf-8')

if __name__ == '__main__':
  clientRequest =  ClientRequest()
  clientRequest.addGlassPropId([{'brand': '南玻 (成都)', 'level': '一等品', 'category': 'aaa', 'glass_film': ''}, {'brand': '南玻 (成都)', 'level': '一等品', 'category': 'aaa', 'glass_film': ''}])
