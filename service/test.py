import time, select, sys

inputEvents = []

while True:
#    time.sleep(3)
    
    while len(select.select([sys.stdin], [], [], 0)[0]) != 0:
        inputEvents.append(input())        
        print(inputEvents)
    inputEvents.clear()
