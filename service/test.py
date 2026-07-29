import time, select, sys

inputStr = ""

while True:
#    time.sleep(3)
    
    if len(select.select([sys.stdin], [], [], 0)[0]) != 0:
        inputStr = input()
        print(inputStr)
