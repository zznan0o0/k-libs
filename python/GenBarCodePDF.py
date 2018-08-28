from reportlab.pdfgen import canvas
from reportlab.graphics.barcode import code39, code128, code93
import reportlab.pdfbase.ttfonts
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics  
from reportlab.pdfbase.cidfonts import UnicodeCIDFont  
from reportlab.lib import fonts, colors


# mm = 1.75

# pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))
reportlab.pdfbase.pdfmetrics.registerFont(reportlab.pdfbase.ttfonts.TTFont('simsun', 'fonts/simsun.ttc')) 

# reportlab.pdfbase.pdfmetrics.registerFont(reportlab.pdfbase.ttfonts.TTFont('simhei', 'pycode/SIMSUN.TTC')) 
# print(fonts)
# print(pdfmetrics.dumpFontData())

class GenBarCodePDF:
  def __init__(self, pdf_id):
    self._canvas = canvas.Canvas(pdf_id)
    

  def drawBarCode(self, barcode_value, x, y):
    # barcode = code39.Extended39(barcode_value)
    barcode = code128.Code128(value=barcode_value, barWidth=1.3, barHeight=15*mm)
    barcode.drawOn(self._canvas, x, y)

  def drawString(self, value, x, y):
    self._canvas.drawString(x, y, str(value)) 

  def drawImage(self, image_path, x, y, w, h):
    self._canvas.drawImage(image_path, x, y, w, h) 

  def drawRow(self, data, row_index):
    self.drawContainer(data, row_index, 0)
    self.drawContainer(data, row_index, 97)

  def drawContainer(self, data, col_index, containWidth):
    marginLeft = 9
    marginBottom = 8
    marginTopPerRow = 57

    marginLeftPerCol = 10
    # containWidth = 97

    rowMarginBottom = marginBottom + marginTopPerRow * int(col_index)

    colMarginLeft = marginLeftPerCol + marginLeft + containWidth

    self._canvas.setFont('simsun', 8)
    self.drawString('品牌: ' + str(data[1]), colMarginLeft * mm, (rowMarginBottom + 46) * mm)
    self.drawString('品类: ' + str(data[2]), colMarginLeft * mm, (rowMarginBottom + 42) * mm)
    self.drawString('级别: ' + str(data[3]), colMarginLeft * mm, (rowMarginBottom + 38) * mm)
    self.drawString('片数: ' + str(data[4]), colMarginLeft * mm, (rowMarginBottom + 34) * mm)
    self.drawString('规格: ' + str(data[5]), colMarginLeft * mm, (rowMarginBottom + 30) * mm)
    self.drawString('包装: ' + str(data[9]), colMarginLeft * mm, (rowMarginBottom + 26) * mm)
    self.drawImage('img/logo.jpg', (colMarginLeft + 34) * mm, (rowMarginBottom + 30) * mm, 42 * mm, 15 * mm)

    self._canvas.setFont('simsun', 16)
    self.drawBarCode(data[0], (colMarginLeft - 5) * mm, (rowMarginBottom + 8) * mm)
    self.drawString(data[0], (colMarginLeft + 20) * mm, (rowMarginBottom + 3) * mm)

  def drawPage(self, data):
    barcode_num_per_page = 5
    length = len(data)
    surplus = length % barcode_num_per_page
    pages = int(length / barcode_num_per_page) + (1 if surplus > 0 else 0)

    for page_index in range(pages):
      row_start = page_index * barcode_num_per_page
      row_end = row_start

      if page_index == pages - 1 and surplus > 0:
        row_end += surplus
      else:
        row_end += barcode_num_per_page

      for col_index in range(row_start, row_end):
        self.drawRow(data[col_index], col_index - row_start)
      self._canvas.showPage()

    self._canvas.save()

  def convertData(self, glass_tuple_list):
    tuple_list = []

    for item in glass_tuple_list:
      tuple_list.append((
        item[0],
        item[1],
        item[2],
        item[3],
        str(int(item[8])),
        str(int(item[5])) + ' * ' + str(int(item[6])) + ' * ' + str(float(item[7])) + 'mm'
      ))

    return tuple_list


if __name__ == '__main__':
  data = ['', '本溪玉晶', '白玻', '一等品', '30片', '3660 * 2440 * 6mm', '', '', '', '裸包']
  # id_head = '2018030110285722978430'
  # id_head = 'X4p7CTIiZI'
  # data_list = []
  # for i in range(16):
  #   str_id = id_head + str(i)
  #   data[0] = str_id
  #   data_list.append(tuple(data))

  data_list = [
    ('180514000000040b', '安全 (沙河)', '白玻', '一等品', '75', '2440 * 2000 * 4mm', '', '', '', ''), 
    ('180514000000040a', '安全 (沙河)', '白玻', '一等品', '30', '2440 * 2000 * 4mm', '', '', '', '')
  ]

  pdf_path = '拆分180514000000040.pdf'
  genBarCodePDF = GenBarCodePDF(pdf_path)
  genBarCodePDF.drawPage(data_list)

