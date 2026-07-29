import time, threading

inputStr = ""

def checkInput():
    global inputStr
    while True:
        s.acquire()
        if len(inputStr) == 0:
            inputStr = input()
        s.release()
        time.sleep(.01)

inputScanner = threading.Thread(target = checkInput)
s = threading.Semaphore()
inputScanner.start()

file = open("something.txt", "w")
while True:
    s.acquire()
    r = inputStr
    inputStr = ""
    s.release()
    if len(r) > 0:
        print(r)
   # time.sleep(0.1)
    
 #   print("output", flush = True)
