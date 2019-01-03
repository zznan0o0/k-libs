import datetime, time

class KTimeTask:
  def __init__(self):
    self.__dayfn = {}
  
  def day(self, time_str, fn):
    if time_str not in self.__dayfn.keys():
      self.__dayfn[time_str] = []
    self.__dayfn[time_str].append(fn)
  
  def runDay(self, dtime):
    dtime_str = dtime.strftime("%H:%M:%S")
    for k, v in self.__dayfn.items():
      if k == dtime_str:
        for fn_v in v:
          fn_v()
      
  def run(self):
    while True:
      dtime = datetime.datetime.now()
      self.runDay(dtime)
      time.sleep(1)

if __name__ == '__main__':
  def aaa():
    print(111)
  
  kTimeTask = KTimeTask()
  kTimeTask.day('11:06:01', aaa)
  kTimeTask.run()