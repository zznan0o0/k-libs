import paramiko
import os
import time
import datetime

from KFS import KFS
from KLogger import KLogger
from ClientRequest import ClientRequest


class BackupSql:
  def __init__(self, config):
    self.__config = config
    self.__kFS = KFS()
    self.__KLogger = KLogger('log/%Y/%m/log.txt')
    self.__ClientRequest = ClientRequest()
    
  def backup(self):
    now = datetime.datetime.now()
    year = now.year
    month = now.month
    day = now.day
    y_m = '%s/%s/' % (year, month)

    for v in self.__config:
      path = v['bak']['bak_path'] + '%s/%s/' % (year, month)
      self.__kFS.mkdir(path)

      ssh = self.createSSH(v['ssh'])
      stdin, stdout, stderr = ssh.exec_command(
        'cd %s; mkdir -p %s; cd %s; mysqldump -u%s -p%s --databases %s > %s.sql' % (v['bak']['online_path'], y_m, y_m, v['database']['user'], v['database']['password'], ' '.join(v['database']['databases']), day)
      )
      err = stderr.readlines()

      if len(err) > 2 or len(err) > 0 and '[Warning] Using a password on the command' not in err[0]:
        err_str = ''.join(err)
        self.__KLogger.write(err_str)
        self.__ClientRequest.postGo('v1/Dingding/SendText', {'touser': v['postErr'], 'text': err_str})
      
      else:
        sftp = self.createSFTPBySSH(ssh)
        online_file_path = '%s%s/%s.sql' % (v['bak']['online_path'], y_m, day)
        local_file_path = '%s%s.sql' % (path, day)
        sftp.get(online_file_path, local_file_path)
        sftp.close()

      ssh.close()

      self.__KLogger.write('complete copy %s at %s \n' % (v['name'], now))

  
  def check(self):
    try:
      self.backup()
    except Exception as e:
      self.__KLogger.write(e)
      self.__ClientRequest.postGo('v1/Dingding/SendText', {'touser': '091716111036380986', 'text': e})
  


  def createSSH(self, config):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(config['ip'], config['port'], config['user'], config['password'])
    return ssh
  
  def createSFTPBySSH(self, ssh):
    # sftp = paramiko.SFTPClient.from_transport(ssh.get_transport())
    sftp = ssh.open_sftp()
    return sftp


if __name__ == '__main__':

  config = [
    {
      'name': 'wms',
      'ssh': {
        'ip': '192.168.10.4',
        'port': '22',
        'user': 'dever',
        'password': 'dever',
      },
      'database': {
        'databases': ['db_warehouse_glass','db_warehouse_state_glass'],
        'user': 'root',
        'password': 'root',
      },
      'bak': {
        'online_path': '/var/www/html/bak/online/',
        'bak_path': '/project/BackupSql/bak/wms/'
      },
      'postErr': ['091716111036380986'] #钉钉id
    }
  ]

  backupSql = BackupSql(config)
  backupSql.check()

