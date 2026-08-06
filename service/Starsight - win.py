POCO, MBOT = 1, 2
import sys, math, random, time, threading, numpy
#This program does not use NumPy.

#print("starting", flush = True)
MACHINEGUN=False
SHIMMER = True
sound=True

ROCKMASS=4
SHIPMASS=1

PI=3.14159265359
captions=['''Hello! You have nearly died, and so I will try to distract you from the mind-numbing implications of your own
 mortality! I hate your shoes.''', 'Scud. Scud. SCUD.', '''By the way, if you do get us killed, be warned that I intend
 to haunt you.''', '''By the way, if you do get us killed, be warned that I intend
 to haunt you.''', 'Resigned sigh.']

part2=['To move:                                   Move your cursor in relation to the dot in the',\
'                                           center of the screen. The position of your cursor',\
'                                           in relation to the dot will determine the direction',\
'                                           and magnitude of your ship\'s acceleration.', '',\
'To apply your ship\'s brake:                Hold down the space bar. Not for too long, though!',\
'To fire destructors:                       Press "/".',\
'To adjust light-lance angle of fire:       Use the scroll wheel on your mouse.',\
'To fire light-lance:                       Right-click.',\
'To start game:                             Left-click.',\
'To return to this screen:                  Press SHIFT.',\
'To respawn:                                Press ENTER.',\
'To restart completely:                     Press "R".',\
'To exit this screen:                       Press the right arrow key.',\
'To turn sound on/off:                      Press "S".']

scrsize=[1100, 850]

rotationangle = 0

mouse, accel, veloc, pos = [450,450], [0, 0], [0, 0], [scrsize[0]/2-200, scrsize[1]/2]
brake, start, respawn, alive, done, restart = False, False, False, True, False, False
angledeg=0
anglerad=0

inputEvents = []
eventSem = threading.Semaphore()

def checkInput():
    global inputEvents, eventSem
    while True:
        newInput = input()
        eventSem.acquire()
        inputEvents.append(newInput)
        eventSem.release()
        if newInput == "q":
            return

inputScanner = threading.Thread(target = checkInput)
inputScanner.start()

def getInputEvents():
    global inputEvents, eventSem

    eventSem.acquire()
    returnVal = inputEvents
    inputEvents = []
    eventSem.release()

    return returnVal

def exitcheck():
    for thisevent in getInputEvents():
        if len(thisevent) != 0 and thisevent[0] == "q":
            sys.exit()

def pause(duration):
    s=time.time()
    while time.time()-s<duration:
        exitcheck()

def chooseship():
    global SHIPTYPE

    done=False
    while not done:
        for thisevent in getInputEvents():
            if len(thisevent) == 0:
                continue
            firstChar = thisevent[0]
            if firstChar == "k":
                nextChar = thisevent[1]
                if nextChar == "p":
                    done=True
                    SHIPTYPE=POCO
                elif nextChar == "m":
                    done=True
                    SHIPTYPE=MBOT
            elif firstChar == "q":
                sys.exit()


chooseship()
#print("ship chosen", flush = True)
if SHIPTYPE==MBOT:
    sensitivity = 13.33
    collisionvects=[[-22, 0], [-19, -9], [-28.0,-21.0], [-21.0,-20.0], [-8.0,-14.0], [3.0,-12.0], [13.0, -9.0], [9, 0], [13.0,9.0], [3.0,12.0], [-8.0,14.0], [-21.0,20.0], [-28.0,21.0], [-19, 9]]
if SHIPTYPE==POCO:
    sensitivity = 6.67
    collisionvects=[[-12, -9], [0.0,-10.0], [-7, -3], [25.0,0.0], [-7, 3], [0.0,10.0], [-12, 9], [-19.0,20.0], [-22.0,19.0], [-23.0,0.0], [-22.0,-19.0], [-19.0,-20.0]]
newcollisionvects=collisionvects.copy()
exploding=False
frames=0
explosions=set([])
explosions2=set([])
destructors=set([])
destructorsToCull = 0

side=1
screenNum=0

LLattached, LLactive, LLlength, LLvector, directionfired, LLtip, LLangle = False, False, 1, [0, 0], None, pos.copy(), 0

spearedrock=None
stopshoot=True
framessincearrow=301
framessincesound=301

krell_overlap, rock_overlap, prev_rock_overlap, prev_krell_overlap = False, False, False, False

crashes=0
untilkrellshoots=400
krellshot=None
#tophits=shelve.open('starsight best hit')

class explosion:
    def __init__(self, pos, duration=5, is_ship=False, rate=6, source=None):
#        if sound and duration==5: explodechannel.play(explosionsfx)
        self.pos=pos
        self.multiplier=1-.075/duration
        self.rate=rate
        self.radius=30
        self.is_ship=is_ship
        self.source=source
        self.markedForRemoval = False

class meteor:
    def reset(self):
        self.distance=0
        self.life=True
        self.countdown=3
        self.breaking=False
        self.offscreen=True
        angle=random.random()*PI*2
        self.speed=random.random()*.5+.25
        self.pos=vectsum(scalrmult([math.cos(angle), math.sin(angle)], -840), scalrmult(scrsize, .5))
        angle+=random.random()*PI-PI/2
        self.veloc=scalrmult([math.cos(angle), math.sin(angle)], self.speed)
        self.was_in_krellarea=False
        self.beenspeared=False
       # self.overlap=False
    def __init__(self):
        self.reset()

class destructor:
    def __init__(self):
        global anglerad, veloc, side, accel
        if accel!=[0, 0]:
            self.direction=unit(accel)
        else:
            self.direction=[math.cos(anglerad), math.sin(anglerad)]
        self.veloc=[0, 0]
        self.SPEED=18
        self.side=side
        self.veloc=vectsum(scalrmult(self.direction, self.SPEED), veloc)
        self.LENGTH=20
        if SHIPTYPE==MBOT: shift=scalrmult(vectorrotate(self.direction, side*PI/2), 11)
        else: shift=scalrmult(self.direction, 20)
        self.pos1=vectsum(pos, scalrmult(self.direction, 4), shift)
        self.pos2=self.pos1
        self.can_hit_krell = not collisionkrell(self.pos1, 0)
        self.markedForRemoval = False
        side*=-1

class krell:
    def reset(self):
        self.collisionvects=[[669, 472], [669, 304]]
        self.health=100
        self.shield=900
        self.life=True
        self.exploding=False
    def __init__(self):
        self.reset()

class krelldestructor:
    def __init__(self, direction):
#        if sound: krellshotsound.play()
        self.direction=direction
        self.end1_dist=1
        self.end2_dist=1
        self.pos1=[725, 390]
        self.pos2=self.pos1.copy()

def primetoshoot(): # Machine gun shoots every 13th frame; this changes the frame number so that the first shot is fired immediately
    global frames, excessframes
    round_up = frames%2 # coin flip to see whether we move the frame counter up or down
    frames = (frames // 13 + round_up) * 13


def events():
    global mouse, veloc, brake, start, respawn, alive, stopshoot, LLactive, LLangle,\
framessincearrow, screenNum, restart, sound, framessincesound
    for thisevent in getInputEvents():
        if len(thisevent) == 0:
            continue
        firstChar = thisevent[0]
        if firstChar == "m": # Mouse motion
            mouse = [int(thisevent[1:3], 36), int(thisevent[3:5], 36)]
        elif firstChar == "q": # X button on window
            sys.exit()
        elif firstChar == "k": # Key down
            nextChar = thisevent[1]
            if nextChar == "/" and alive and start:
                if MACHINEGUN:
                    primetoshoot()
                    stopshoot=False
                else:
                    destructors.add(destructor())
                    if SHIPTYPE==MBOT: destructors.add(destructor())
#                    if sound: destructorsound.play()
            elif nextChar == " ":
                brake=True
            elif nextChar == "R" and (not alive or not krell.life): # If key is Return or "\"
                respawn=True
            elif nextChar == "r": restart=True
            elif nextChar == "S": # If key is Shift
                screenNum=1
    #            musicchannel.pause()
#            elif nextChar == "s":
 #               if sound:
  #                  musicchannel.pause()
   #             else:
    #                if alive: musicchannel.unpause()
     #           sound = not sound
      #          framessincesound=0
        elif firstChar == "l": # (lowercase "L") Key up
            nextChar = thisevent[1]
            if nextChar == "/": stopshoot=True
            elif nextChar == " ": brake=False
            elif nextChar == "e" and alive and SHIPTYPE!=POCO: death(False)
        elif firstChar == "(": start=True # Left click
        elif firstChar == ")" and alive and start: # Right click
#            if not LLactive:
#                if sound: LLfiringsound.play()
            LLactive = not LLactive
        elif firstChar == "+": # Mouse scroll wheel up
            LLangle-=45
            framessincearrow=0
        elif firstChar == "-": # Mouse scroll wheel down
            LLangle+=45
            framessincearrow=0


def lineintersection(m1, b1, m2, b2):
    if round(m1 - m2, 7) == 0:
        if round(b1 - b2, 7) == 0: return (float('inf'), 0)
        else: return None

    if m1 == float('inf'):
        x = b1
        y = m2*x + b2
    elif m2 == float('inf'):
        x = b2
        y = m1*x + b1
    else:
        x = (b1 - b2) / (m2 - m1)
        y = m1*x + b1
    
    return (round(x, 7), round(y, 7))

def linesegmentsintersect(begin1, end1, begin2, end2):
    line1 = linesegmenttoline(begin1, end1)
    line2 = linesegmenttoline(begin2, end2)

    intersectpoint = lineintersection(line1[0], line1[1], line2[0], line2[1])
    if intersectpoint == None: return False
    elif intersectpoint[0] == float('inf'):
        if line1[0]==float('inf'): coord = 1
        else: coord = 0
            
        if begin1[coord] <= end1[coord]:
            if begin2[coord] >= begin1[coord] and begin2[coord] <= end1[coord] or \
               end2[coord] >= begin1[coord] and end2[coord] <= end1[coord]:
                return True
            else:
                return False
        else:
            if begin2[coord] <= begin1[coord] and begin2[coord] >= end1[coord] or \
               end2[coord] <= begin1[coord] and end2[coord] >= end1[coord]:
                return True
            else:
                return False
    

    if line1[0] != float('inf'): coord = 0
    else: coord = 1
    
    line1coordincreases = end1[coord] >= begin1[coord]
    isonline1 = (line1coordincreases and intersectpoint[coord] >= begin1[coord] and intersectpoint[coord] <= end1[coord]) or \
                (not line1coordincreases and intersectpoint[coord] <= begin1[coord] and intersectpoint[coord] >= end1[coord])


    if line2[0] != float('inf'): coord = 0
    else: coord = 1

    line2coordincreases = end2[coord] >= begin2[coord]    
    isonline2 = (line2coordincreases and intersectpoint[coord] >= begin2[coord] and intersectpoint[coord] <= end2[coord]) or \
                (not line2coordincreases and intersectpoint[coord] <= begin2[coord] and intersectpoint[coord] >= end2[coord])

    return isonline1 and isonline2

def linesegmenttoline(point1, point2):
    if round(point2[0] - point1[0], 7) == 0: return (float('inf'), point1[0])
    m = (point2[1] - point1[1])/(point2[0] - point1[0])
    b = point1[1] - (m * point1[0])
    return (m, b)

def distpointlinesegm(point, beginpoint, endpoint):
    line = linesegmenttoline(beginpoint, endpoint)
    if round(line[0], 7)!=0:
        perplinem = -1/line[0]
        perplineb = point[1] - perplinem*point[0]
    else:
        perplinem = float('inf')
        perplineb = point[0]
    

    intersect = lineintersection(line[0], line[1], perplinem, perplineb)

    if line[0] == float('inf'): coord = 1
    else: coord = 0
    
    linecoordincreases = endpoint[coord] >= beginpoint[coord]
    
    isontheline = (linecoordincreases and intersect[coord] >= beginpoint[coord] and intersect[coord] <= endpoint[coord]) or \
                (not linecoordincreases and intersect[coord] <= beginpoint[coord] and intersect[coord] >= endpoint[coord])
    
    if isontheline:
        closestpoint = intersect
    else:
        if linecoordincreases:
            if intersect[coord] < beginpoint[coord]: closestpoint = beginpoint
            else: closestpoint = endpoint
        else:
            if intersect[coord] > beginpoint[coord]: closestpoint = beginpoint
            else: closestpoint = endpoint

    return magn(vectdiff(closestpoint, point))


def vectsum(vect1, vect2, vect3=None):
    summ=[]
    pos=0
    for x in vect1:
        if vect3!=None: summ.append(x+vect2[pos]+vect3[pos])
        else: summ.append(x+vect2[pos])
        pos=pos+1
    return summ

def vectdiff(minuend, subtrahend):
    return vectsum(minuend, scalrmult(subtrahend, -1))

def vectortoangle(vector, rad_or_deg):
    if vector[0]!=0: angle=math.atan(vector[1]/vector[0])
    elif vector[1]>0: angle=PI/2
    elif vector[1]<0: angle=-PI/2
    if vector[0]<0: angle+=PI
    if rad_or_deg==1: angle=angle*180/PI
    return angle

def magn(vector):
    summ=0
    for component in vector:
        summ+=component**2
    return math.sqrt(summ)

def vectorrotate(vector, angle):
    theta=vectortoangle(vector, 0)
    theta+=angle
    magnitude=magn(vector)
    return [magnitude*math.cos(theta), magnitude*math.sin(theta)]

def scalrmult(vector, scalar):
    product=[]
    for x in vector:
        product.append(x*scalar)
    return product

def unit(vector):
    return scalrmult(vector, 1/magn(vector))

def dotPr(vector1, vector2):
    product=0
    for part in range(len(vector1)):
        product+=(vector1[part]*vector2[part])
    return product

def vectproject(projected, onto):
    dotp=dotPr(projected, onto)
    return scalrmult(unit(onto), dotp/magn(onto))

def scalrproject(projected, onto):
    dotp=dotPr(projected, onto)
    return dotp/magn(onto)

def quadraticsolve(a, b, c):
    radicand=b**2-4*a*c
    if radicand<0: return ()
    if radicand==0: return -b/(2*a)
    root=math.sqrt(radicand)
    return ((-b+root)/(2*a), (-b-root)/(2*a))

def screenpos(vector):
    return (round(vector[0]), round(vector[1]))

def brakeon():
    global accel, veloc
    if magn(veloc)!=0: accel=scalrmult(veloc, -sensitivity/(magn(veloc)*1000))
    if magn(veloc)<0.009:
        veloc=[0.0, 0.0]
        accel=[0.0, 0.0]

def deathtext():
#    drawtext('Best Score: '+str(bestscore), pygame.font.SysFont('cambria', 60), window, (100, 260), GREEN)
    plural = crashes!=1
  #  if plural: times=' times.'
   # else: times=' time.'
    #if krell.life and not krell.exploding:
     #   drawtext('You have died '+str(crashes)+times, pygame.font.SysFont('cambria', 60), window, (100, 100), GREEN)
      #  musicchannel.pause()
#    else:
 #       drawtext('Game finished! You died', pygame.font.SysFont('cambria', 60), window, (100, 100), GREEN)
  #      drawtext('a total of '+str(crashes)+times, pygame.font.SysFont('cambria', 60), window, (100, 160), GREEN)
   #     musicchannel.stop()
    #    pygame.display.update()

def end():
    global done, bestscore
    if not MACHINEGUN: legit=True
    else: legit=False
#    scorefile=shelve.open('starsight bestscore')
 #   bestscore=scorefile['bestscore']
  #  if ((not krell.life) or krell.exploding) and crashes<bestscore and legit: scorefile['bestscore']=crashes
   # scorefile.close()
    deathtext()
    done=True

def explode():
    global pos, veloc, explosions
    explosionsToCull = [0, 0]
    expl_sets = [explosions, explosions2];

    for i in (0, 1):
        for expl in expl_sets[i]:
            if expl!=None:
                expl.radius+=expl.rate
                expl.rate*=expl.multiplier
                if expl.rate<0.24:
                    if expl.source!=None: expl.source.life=False
                    if expl.is_ship:
                        pos=[-1500, 0]
                        end()
                    expl.markedForRemoval = True
                    explosionsToCull[i] += 1

    for i in (0, 1):
        while explosionsToCull[i]:
            for expl in expl_sets[i]:
                if expl.markedForRemoval:
                    expl_sets[i].remove(expl)
                    explosionsToCull[i] -= 1
                    break


def destructormove():
    global destructorsToCull
    for this in destructors:
        this.pos1=vectsum(this.pos1, this.veloc)
        this.pos2=vectsum(this.pos1, scalrmult(this.direction, this.LENGTH))
        if this.pos1[0]>2000 or this.pos1[0]<-1050 or this.pos1[1]>1900 or this.pos1[1]<-1050:
            if not this.markedForRemoval: # If it has already been marked for removal, then we shouldn't increment the cull counter again!
                destructorsToCull += 1
            this.markedForRemoval = True

    while destructorsToCull:
        for this in destructors:
            if this.markedForRemoval:
                destructors.remove(this)
                destructorsToCull -= 1
                break


format2dig = "{0:>2}"
format3dig = "{0:>3}"
def encodeSingleCoord(num, format_):
    return format_.format(numpy.base_repr(round(num) + 97, 36))

def encodeNum(num):
    return format2dig.format(numpy.base_repr(round(num), 36))

def encodeCoords(coords):
    if coords[0]>scrsize[0]+97 or coords[0]<-97 or coords[1]>scrsize[1]+97 or coords[1]<-97: #If its center is far enough offscreen
    # that no part of it will be seen onscreen, don't render it. It just so happens that 97 pixels is about how much tolerance
    # I can give before the number won't always fit in an unsigned 2-digit base-36 representation.
        return ""

    return encodeSingleCoord(coords[0], format2dig) + encodeSingleCoord(coords[1], format2dig)

def encodeLineSegmCoords(coords): # If one end of a line segment goes offscreen, we can't just skip rendering it, so we skip the offscreen check.
    # We also give it 3 digits to work with since now it has a much wider range of possible coordinates
    return encodeSingleCoord(coords[0], format3dig) + encodeSingleCoord(coords[1], format3dig)

def updategraphics():
    global rotationangle

    rotationangle += 3
    graphicsstring = ""
    if alive:
        if LLactive:
            graphicsstring += encodeLineSegmCoords(pos) # If the light-lance is active, we're going to be drawing a line segment coming from
            # the ship; even if the ship is offscreen, the light-lance might be onscreen, and we need to know what direction it's pointing
        else:
            graphicsstring += encodeCoords(pos) # Position of the ship
    graphicsstring += ","

    graphicsstring += encodeNum(angledeg % 360) # The angle of the ship

#    graphicsstring += "b," # Render background on top of everything, erasing it all
    if framessincearrow<110:
        arrow = str((LLangle / 45) % 8) # Light-lance arrow is at the given angle

    shield = encodeNum(rotationangle % 360) # Shield is rotated at the given angle
    # Will hard-code on client side that shield should be rendered with its center at (690, 390), with
    # the other shield layer rotated at the opposite angle as this one

    if framessincearrow<110 and alive:
        graphicsstring += arrow
    graphicsstring += ","
    
    if LLactive:
        graphicsstring += encodeLineSegmCoords(LLtip)
    graphicsstring += ","
    
    graphicsstring += numpy.base_repr(round(magn(accel)*20000), 36) + "," # Magnitude of acceleration of the ship,
    # for the purposes of flame length and steering arrow length

    if krellshot!=None:
        graphicsstring += encodeLineSegmCoords(krellshot.pos1) + encodeLineSegmCoords(krellshot.pos2)
    graphicsstring += ","

    for this in destructors:
        coord1 = encodeCoords(this.pos1)
        coord2 = encodeCoords(this.pos2)
        if len(coord1) > 0 and len(coord2) > 0:
            graphicsstring += encodeCoords(this.pos1) + encodeCoords(this.pos2)
    graphicsstring += ","

    for meteor in obstacles:
        if meteor.life and not meteor.offscreen:
            graphicsstring += encodeCoords(meteor.pos)
    graphicsstring += ","

    for expl in explosions2:
        r, p = expl.radius, expl.pos
        graphicsstring += str(round(r)) + " " + str(round(p[0])) + " " + str(round(p[1])) + ","
    graphicsstring += ","

    if krell.shield > 0:
        graphicsstring += shield
    graphicsstring += ","

    for expl in explosions:
        r, p = expl.radius, expl.pos
        graphicsstring += str(round(r)) + " " + str(round(p[0])) + " " + str(round(p[1])) + ","
    graphicsstring += ","

    if krell.shield>0:
        status = str(math.ceil(krell.shield))
    else:
        status = str(math.ceil(krell.health))
    graphicsstring += status + ","

    if done or not krell.life:
        graphicsstring += "d"

    print(graphicsstring, flush = True)

'''
def updategraphics():
    global rotationangle

    rotationangle += 3
    if alive:
        if SHIPTYPE == MBOT:
            graphicsstring = "m"
        else:
            graphicsstring = "p"
    else:
        graphicsstring = ""

    graphicsstring += str(round(pos[0])) + " " + str(round(pos[1])) + "\n" # Starts with position of the ship
    graphicsstring += str(round(angledeg)) + "\n" # The angle of the ship

#    graphicsstring += "b\n" # Render background on top of everything, erasing it all
    if framessincearrow<110:
        arrow = str((LLangle / 45) % 8) # Light-lance arrow is at the given angle

    shield = str(round(rotationangle)) # Shield is rotated at the given angle
    # Will hard-code on client side that shield should be rendered with its center at (690, 390), with
    # the other shield layer rotated at the opposite angle as this one

    if framessincearrow<110 and alive:
        graphicsstring += arrow
    graphicsstring += "\n"
    
    if LLactive:
        graphicsstring += str(round(LLtip[0])) + " " + str(round(LLtip[1]))
    graphicsstring += "\n"
    
    graphicsstring += str(round(magn(accel)*20000)) + "\n" # Magnitude of acceleration of the ship,
    # for the purposes of flame length and steering arrow length
    
    if krellshot!=None:
        graphicsstring += str(round(krellshot.pos1[0])) + " " + str(round(krellshot.pos1[1])) + "\n" + \
        str(round(krellshot.pos2[0])) + " " + str(round(krellshot.pos2[1]))
    graphicsstring += "\n"

    for this in destructors:
        graphicsstring += str(round(this.pos1[0])) + " " + str(round(this.pos1[1])) + " " + \
        str(round(this.pos2[0])) + " " + str(round(this.pos2[1])) + "\n"
    graphicsstring += "\n"

    for meteor in obstacles:
        if meteor.life and not meteor.offscreen:
            graphicsstring += str(round(meteor.pos[0])) + " " + str(round(meteor.pos[1])) + "\n"
    graphicsstring += "\n"

    for expl in explosions2:
        r, p = expl.radius, expl.pos
        graphicsstring += str(round(r)) + " " + str(round(p[0])) + " " + str(round(p[1])) + "\n"
    graphicsstring += "\n"

    if krell.shield > 0:
        graphicsstring += shield
    graphicsstring += "\n"

    for expl in explosions:
        r, p = expl.radius, expl.pos
        graphicsstring += str(round(r)) + " " + str(round(p[0])) + " " + str(round(p[1])) + "\n"
    graphicsstring += "\n"

    if krell.shield>0:
        status = str(math.ceil(krell.shield))
    else:
        status = str(math.ceil(krell.health))
    graphicsstring += status + "\n"

    if done or not krell.life:
        graphicsstring += "d"

    print(graphicsstring, flush = True)

'''


def collisionship():
    global krell_overlap, rock_overlap, prev_rock_overlap, prev_krell_overlap, start, alive
    if (pos[0]>scrsize[0]+900 or pos[0]<-900 or pos[1]<-900 or pos[1]>scrsize[1]+900) and start: return True
    for meteor in obstacles:
        z=vectdiff(pos, meteor.pos)
        if meteor.life and abs(z[0])<68 and abs(z[1])<68:
            prev_rock_overlap=rock_overlap
            rock_overlap=False
            for vector in newcollisionvects:
                point=vectsum(vector, pos)
                distance=magn(vectdiff(point, meteor.pos))
                relative_veloc=vectdiff(veloc, meteor.veloc)
                if distance<40:
                    impactforce=scalrproject(relative_veloc, vectdiff(meteor.pos, pos))
                    if impactforce>.82 and not prev_rock_overlap and alive:
#                        if sound: wilhelmchannel.play(wilhelm)
                        return True
                    rock_overlap=True
    prev_krell_overlap=krell_overlap
    krell_overlap=False
    for point in newcollisionvects:
        spot=vectsum(pos, point)
        if collisionkrell(spot, 0):
            impactforce=scalrproject(veloc, vectdiff([725, 390], pos))
            krell_overlap=True
            if impactforce>.82 and not prev_krell_overlap and alive:
                if krell.shield>0: krell.shield-=(impactforce-.82)*SHIPMASS*25/ROCKMASS
                else: krell.health-=(impactforce-.82)*SHIPMASS*25/ROCKMASS
#                if sound: wilhelmchannel.play(wilhelm)
                return 2

    if krellshot!=None:
        disttokrellshot=distpointlinesegm(pos, krellshot.pos1, krellshot.pos2)
        #print(disttokrellshot)
        if disttokrellshot<=35:
            for i in range(len(newcollisionvects)):
                point = newcollisionvects[i]
                if i != len(newcollisionvects) - 1: nextpoint = newcollisionvects[i+1]
                else: nextpoint = newcollisionvects[0]
                if linesegmentsintersect(vectsum(point, pos), vectsum(nextpoint, pos), krellshot.pos1, krellshot.pos2):
                    return True                    
    return False

def collisionkrell(point, radius):
    if not krell.life: return False
    if krell.shield>0:
        if magn(vectdiff(point, [690, 390]))<150+radius: return True
    else:
        if 626-radius<point[0]<839+radius and 298-radius<point[1]<478+radius:
            if 669<point[0]<748:
                if 304-radius<point[1]<472+radius: return True
            elif point[0]<=644 and magn(vectdiff([748, 389], point))<116+radius: return True
            elif point[0]>=748 and magn(vectdiff([748, 389], point))<85+radius: return True
            elif radius==40:
                for vect in krell.collisionvects:
                    if magn(vectdiff(vect, point))<40: return True
        return False

def destructor_hit_rock():
    global destructorsToCull
    for meteor in obstacles:
        if meteor.breaking: meteor.countdown-=1
        if meteor.countdown==0:
            meteor.life=False
#            if sound: rockbreak.play()
            explosions2.add(explosion(meteor.pos, duration=1, rate=20))
        if meteor.life:
            for shot in destructors:
                if magn(vectdiff(shot.pos1, meteor.pos))<40:
                    meteor.breaking=True
                    if not shot.markedForRemoval: # If it has already been marked for removal, then we shouldn't increment the cull counter again!
                        destructorsToCull += 1
                    shot.markedForRemoval = True
            if krellshot!=None and distpointlinesegm(meteor.pos, krellshot.pos1, krellshot.pos2)<40 and not meteor.offscreen:
#                if sound: rockbreak.play()
                explosions2.add(explosion(meteor.pos, duration=1, rate=20))
                meteor.life=False

def moverocks():
    global spearedrock, obstacles
    for rock in obstacles:
        rock.pos=vectsum(rock.pos, rock.veloc)
        rock.offscreen=rock.pos[0]>scrsize[0]+40 or rock.pos[0]<-40 or rock.pos[1]>scrsize[1]+40 or rock.pos[1]<-40
       # rock.overlap=518<rock.pos[0]<876 and 238<rock.pos[1]<542
        rock.distance+=rock.speed
        if rock.distance>500 and rock.offscreen and spearedrock!=rock: rock.reset()

def newgame(complete=False):
    global exploding, done, pos, veloc, accel, start, respawn, alive, LLangle, destructors, \
LLactive, explosions, restart, crashes, krellshot, untilkrellshoots, explosions2, firstmusicloop, \
background, MACHINEGUN
    exploding=False
    done=False
    pos=[scrsize[0]/2-200, scrsize[1]/2]
    explosions=set([])
    explosions2=set([])
    destructors=set([])
    destructorsToCull = 0
    veloc=[0, 0]
    accel=[0, 0]
    start=False
    respawn=False
    LLactive=False
    alive=True
    restart=False
    krellshot=None
    untilkrellshoots=400
    if complete: MACHINEGUN = False
    obstaclelist()
    if krell.exploding: krell.life=False
    if complete: background = backgrounds[random.randint(0, len(backgrounds) - 1)]
    if complete or not krell.life:
        krell.reset()
        crashes=0
#        if sound: musicchannel.play(intro)
 #       firstmusicloop = True
  #  else:
   #     if sound: musicchannel.unpause()
#    pygame.display.set_caption(captions[random.randint(0,4)])

def kinematics():
    global brake, accel, veloc, pos
    if brake: brakeon()
    elif start and alive: accel=scalrmult(vectsum(mouse, scalrmult(scrsize, -.5)), 1.5/(300000/sensitivity))
    veloc=vectsum(veloc, accel)
    pos=vectsum(pos, veloc)

def anglecalculations():
    global accel, angledeg, anglerad, collisionvects, newcollisionvects
    if accel !=[0.0, 0.0]:
        angledeg=vectortoangle(accel, 1)
        anglerad=vectortoangle(accel, 0)
    for x in range(len(collisionvects)):
        newcollisionvects[x]=vectorrotate(collisionvects[x], anglerad)

def manageframes():
    global frames, start, obstacles, destructors, framessincearrow, untilkrellshoots, beginning, framessincesound
    if frames%13==0 and not stopshoot and alive and start:
        destructors.add(destructor())
        if SHIPTYPE==MBOT: destructors.add(destructor())
#        if sound: destructorsound.play()
    frames+=1
    if magn(veloc)<0.07 and start and alive and not krell.exploding: untilkrellshoots-=1
    elif krellshot==None: untilkrellshoots=400
    framessincearrow+=1
    framessincesound+=1
    if frames>1400: frames=1
    if frames==3 and start:
        obstacles.append(meteor())

def obstaclelist():
    global obstacles
    obstacles=[]
    for x in range(17):
        obstacles.append(meteor())

def movelightlance():
    global directionfired, accel, LLlength, LLvector, LLtip, LLactive, pos, LLangle
    if directionfired==None:
        directionfired=[math.cos(anglerad-PI*LLangle/180), math.sin(anglerad-PI*LLangle/180)]
    LLvector=scalrmult(directionfired, LLlength)
    LLtip=vectsum(pos, LLvector)
    if spearedrock==None:
        LLlength+=4.5
        if LLlength>500: LLactive=False

def bounce():
    global spearedrock, veloc, pos, LLlength, ROCKMASS, SHIPMASS
    diff=vectdiff(pos, spearedrock.pos)
    pos=vectsum(scalrmult(unit(diff), LLlength), spearedrock.pos)
    prev_rock_v=spearedrock.veloc
    prev_ship_v=veloc
    ship_v_proj=scalrproject(veloc, diff)
    rock_v_proj=scalrproject(spearedrock.veloc, diff)
    
    momentum_proj = ROCKMASS*rock_v_proj + SHIPMASS*ship_v_proj
    kin_energy_proj = .5*ROCKMASS*rock_v_proj**2 + .5*SHIPMASS*ship_v_proj**2

    veloc=vectdiff(veloc, vectproject(veloc, diff))
    spearedrock.veloc=vectdiff(spearedrock.veloc, vectproject(spearedrock.veloc, diff))
    
    a=ROCKMASS**2/(2*SHIPMASS)+.5*ROCKMASS
    b=-momentum_proj*ROCKMASS/SHIPMASS
    c=momentum_proj**2/(2*SHIPMASS)-kin_energy_proj

    solutions=quadraticsolve(a, b, c)
    for soln in solutions:
        if rock_v_proj!=0:
            if round(soln/rock_v_proj, 6)!=1: rock_v_scalar=soln
        elif not (-.00005<rock_v_proj-soln<.00005): rock_v_scalar=soln
    
    ship_v_component=scalrmult(unit(diff), (momentum_proj-ROCKMASS*rock_v_scalar)/SHIPMASS)
    rock_v_component=scalrmult(unit(diff), rock_v_scalar)
    
    veloc=vectsum(ship_v_component, veloc)
    Δship_v=vectdiff(veloc, prev_ship_v)
    veloc=vectsum(scalrmult(Δship_v, -.2), veloc)
    spearedrock.veloc=vectsum(rock_v_component, spearedrock.veloc)
    Δrock_v=vectdiff(spearedrock.veloc, prev_rock_v)
    spearedrock.veloc=vectsum(scalrmult(Δrock_v, -.2), spearedrock.veloc)

    spearedrock.speed=magn(spearedrock.veloc)

def lightlancing():
    global directionfired, LLvector, LLtip, LLactive, spearedrock, LLlength
    if LLactive:
        movelightlance()
        if spearedrock==None:
            for rock in obstacles:
                if magn(vectdiff(rock.pos, LLtip))<=40 and rock.life and rock.veloc!=[0.0, 0.0]:
                    spearedrock=rock
                    rock.beenspeared=True
                    LLlength=magn(vectdiff(pos, rock.pos))
#                    if sound: LLattachsound.play()
        else:
            stringphysics()
    else:
        directionfired=None
        LLtip = pos.copy()
        LLlength=1
        spearedrock=None

def managekrell():
    global LLactive, untilkrellshoots, krellshot, tophits
    if krell.shield<0: krell.shield=0
    if krell.health<0: krell.health=0
    for rock in obstacles:
        if rock.life and collisionkrell(rock.pos, 40):
            impactforce=scalrproject(rock.veloc, vectdiff([725, 390], rock.pos))
            if not rock.was_in_krellarea and impactforce>.82:
                damage=(impactforce-.82)*150
                if krell.shield<=0: krell.health-=damage
                else: krell.shield-=damage
                explosions.add(explosion(get_explsn_point(rock), source=rock))
                rock.veloc=[0, 0]
                LLactive=False
#                if damage>tophits['besthit']:
 #                   tophits['besthit']=damage
  #                  print('New record: most damaging hit! '+str(tophits['besthit']))
            rock.was_in_krellarea=True
        else: rock.was_in_krellarea=False
    if krell.health<=0 and not krell.exploding:
        explosions.add(explosion([725, 390], rate=20, source=krell))
        krell.exploding=True
    if untilkrellshoots==0:
#        if sound: wilhelmchannel.play(wilhelm)
        global diff
        diff=vectdiff(pos, [725, 390])
        krellshot=krelldestructor(unit(diff))
    if untilkrellshoots<0:
        krellshot.end1_dist+=18
        krellshot.pos1=vectsum(scalrmult(krellshot.direction, krellshot.end1_dist), [725, 390])
        if krellshot.end1_dist>900:
            krellshot.end2_dist+=18
            krellshot.pos2=vectsum(scalrmult(krellshot.direction, krellshot.end2_dist), [725, 390])
        if krellshot.end2_dist>860:
            krellshot=None
            untilkrellshoots=400

def stringphysics():
    global LLtip, spearedrock, LLactive, LLlength
    if not spearedrock.life:
        LLactive=False
        return
    LLtip=spearedrock.pos
    dist=magn(vectdiff(pos, spearedrock.pos))
    if dist>LLlength:
        bounce()

def death(hit_krell):
    global alive, veloc, accel, explosions, LLactive, crashes
    alive=False
    veloc=[0, 0]
    accel=[0, 0]
    if not hit_krell: explosions2.add(explosion(pos, is_ship=True))
    else: explosions.add(explosion(pos, is_ship=True))
    LLactive=False
    crashes+=1

def destructor_hit_krell():
    global destructorsToCull
    for shot in destructors:
        if shot.can_hit_krell and collisionkrell(shot.pos1, 0):
            if not shot.markedForRemoval: # If it has already been marked for removal, then we shouldn't increment the cull counter again!
                destructorsToCull += 1
            shot.markedForRemoval = True
            if krell.shield>0:
                if SHIPTYPE==MBOT: krell.shield-=.2
                else: krell.shield-=.4
            else:
                if SHIPTYPE==MBOT: krell.health-=.2
                else: krell.health-=.4

def get_explsn_point(meteor):
    return vectsum(scalrmult(unit(vectdiff([725, 390], meteor.pos)), 40), meteor.pos)

def startloop():
    global screenNum, MACHINEGUN, done

    while screenNum < 2:
        for thisevent in getInputEvents():
            if len(thisevent) == 0:
                continue
            firstChar = thisevent[0]
            if firstChar == "k": # Key down
                nextChar = thisevent[1]
                if nextChar == ">": # Right arrow key
                    screenNum += 1
                elif nextChar == "/":
                    MACHINEGUN=True
            elif firstChar == "q":
                sys.exit()

#    if sound: musicchannel.unpause()

def endloop():
    while not restart and not respawn:
        events()    

obstaclelist()
krell=krell()
startloop()
#musicchannel.play(intro)

startTime = time.time_ns()

#mark = time.time()
while True:
#    if not (musicchannel.get_busy()) and sound:
 #       musicchannel.play(musicloop)
  #      if not firstmusicloop:
   #         musicsilent = not musicsilent
    #        if musicsilent and krell.life and not krell.exploding:
     #           musicchannel.play(silence)
      #          e.play()
       # firstmusicloop = False
    explode()
    manageframes()
    destructor_hit_krell()
    hit=collisionship()
    managekrell()
    if hit and alive: death(hit==2)
    if not krell.life:
        end()
        endloop()
    if respawn: newgame()
    if restart: newgame(complete=True)
    kinematics()
    destructormove()
    if start: moverocks()
    anglecalculations()
    events()
    if screenNum < 2: startloop()
    destructor_hit_rock()
    lightlancing()

    if not frames % 3:
        updategraphics()
        elapsedTime = time.time_ns() - startTime
        if elapsedTime < 16000000:
            time.sleep(0.016 - (elapsedTime/1000000000))
        startTime = time.time_ns()
#    if frames%700==0:
 #       print(time.time_ns() - mark, file = sys.stderr)
  #      mark = time.time_ns()
