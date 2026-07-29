import time, threading

inputStr = []

def checkInput():
    global inputStr
    while True:
        newInput = input()
        s.acquire()
        inputStr.append(newInput)
        s.release()

inputScanner = threading.Thread(target = checkInput)
s = threading.Semaphore()
inputScanner.start()

while True:
    s.acquire()
    r = inputStr
    inputStr = []
    s.release()
    if len(r) > 0:
        print(r, flush = True)
