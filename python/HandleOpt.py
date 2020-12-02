import sys
import getopt
sys.path.append("..")

help_str = """
eg: checkping -c ./Config/ping.yml -l ./Log

-h, --help      display the help
-c, --config    set the profile directory (default current directory ./Config/ping.yml)
-l, --log       set the log file directory (default ./Log)
-t, --time      set the sleep time default 1800s

因为socket包需要root用户才能执行此程序!!!
"""


class HandleOpt:
    @staticmethod
    def getOPT():
        try:
            opts, args = getopt.getopt(sys.argv[1:], "hc:l:t:", ["help", "config=", "log=", "time="])
        except getopt.GetoptError as e:
            print(e)
            sys.exit(2)
        
        sopt = {
            'c': './Config/ping.yml',
            'l': './Log',
            't': 1800,
        }
        
        for opt, arg in opts:
            if opt in ("-h", "--help"):
                print(help_str)
                sys.exit()
            
            elif opt in ("-c", "--config"):
                sopt['c'] = arg
            
            elif opt in ("-l", "--log"):
                sopt['l'] = arg

            elif opt in ("-t", "--time"):
                sopt['t'] = arg
        
        return sopt

if __name__ == "__main__":
    print(HandleOpt.getOPT())
    

