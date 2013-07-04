from pymongo import Connection
import pymongo
import datetime
from boto.s3.connection import S3Connection
import Image
import urllib
import cStringIO
import csv

#S3 storage
myKey = "AKIAIXVQENDGQDLR33JA"
mySecretKey = "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"
myBucket = 'zwamy'

#mongolab
server = 'ds031948.mongolab.com'
port = 31948
db_name = 'zwamy'
username = 'leonzwamy'
password = 'zw12artistic'
classes = ["user","image","comment","viewlist","play","client"]
thumbnail_size = [960,500]


def initIndexes(db):
    #all indexes start from 0, so the none index is -1
    db.index.remove()
    indexObj = {}
    for cl in classes:
        indexObj[cl]=-1
    db.index.insert(indexObj)
    
        

def createUser(db,usrObj):
    #user obj is a hashtable {name:xx, email:xx, first_name:xx,
    #last_name:xx}
    mustHaves = ["email", "first_name", "last_name"]
    for mustHave in mustHaves:
        if not mustHave in usrObj:
            print "user object must have "+mustHave
            return False
    
    #check if user exists  
    if db.users.find({"email":usrObj["email"]}).count() > 0:
           print "user email exists, change email"
           return False
    
    
    addObj = {}
    for mustHave in mustHaves:
        addObj[mustHave]= usrObj[mustHave]
        
    currIndex = db.index.find_one()['user']
    usrObj["id"] = currIndex+1
    
    emptyArrays = ["images","viewlists","friends","adds","requests","owned_clients",
                    "playable_clients","playable_clients","plays"]
    
    for emptyArray in emptyArrays:
        usrObj[emptyArray]=[]
 
    
    db.users.insert(usrObj)
    db.index.update({},{"$set":{"user":currIndex+1}})
    
    return True


def addFriend(db, email, friendEmail):
     usrSet = db.users.find({"email":email})
     if usrSet.count()==0:
         print email+" doesn't exit"
         return False
     
     friendSet = db.users.find({"email":friendEmail})
     if friendSet.count()==0:
         print friendEmail+" doesn't exit"
         return False
     
     usr = usrSet[0]
     friend = friendSet[0]
     if friend["id"] in usr["friends"]:
         print email+" and "+friendEmail+" are already friends!"
         return False
     
     if friend["id"] in usr["requests"]:
         #approve friend request
         db.users.update({"id":usr["id"]},{"$push":{"friends":friend["id"]},"$pull":{"requests":friend["id"]}})
         db.users.update({"id":friend["id"]},{"$push":{"friends":usr["id"]},"$pull":{"adds":usr["id"]}})


         print email+" and "+friendEmail+" are now friends!"
         return True
     
     if friend["id"] in usr["adds"]:
         print "request has already be sent, don't do it again!"
         return True
     
     db.users.update({"id":usr["id"]},{"$push":{"adds":friend["id"]}}) 
     db.users.update({"id":friend["id"]},{"$push":{"requests":usr["id"]}}) 
     print "request sent. Good luck!"  
     return True
     
     
     
     

def deleteUser(db, email):
     usrSet = db.users.find({"email":email})
     if usrSet.count()==0:
         print email+" doesn't exit"
         return False
     
     usr = usrSet[0]
     for friendID in usr["friends"]:
         db.users.update({"id":friendID},{"$pull":{"friends":usr["id"]}}) 
    
     for addID in usr["adds"]:
         db.users.update({"id":addID},{"$pull":{"requests":usr["id"]}}) 
    
     for requestID in usr["requests"]:
         db.users.update({"id":requestID},{"$pull":{"adds":usr["id"]}})
     
     db.users.remove({"email":email})
    
     print email+" has been deleted"


def currUTC():
    # return a current utc datetime string
    #'2013-07-02 22:59:46'
    currTime = datetime.datetime.utcnow()
    return str(currTime).split('.')[0]   

def createImage(db, bucket, imgObj):
    mustHaves = ["creator","url"]
    
    for mustHave in mustHaves:
        if not mustHave in imgObj:
            print mustHave+" is missing"
            return False
    
    #update user's images
    userID = imgObj["creator"]
    userSet = db.users.find({"id":userID})
    if userSet.count()==0:
        print "user"+str(userID)+" doesn't exist"
        return False
    
    
    currIndex = db.index.find_one()['image']    
    imgObj["id"]=currIndex+1
    imgObj["datetime_created"]=currUTC()
    imgObj["thumbnail"]='http://s3.amazonaws.com/zwamy/thumbnails/th'+str(currIndex+1)+'.jpg'
    print imgObj["thumbnail"]
    
    if makeThumbnail(bucket,imgObj["id"],imgObj["url"]):
       userObj = userSet[0]
       userObj["images"].append(currIndex+1)
       db.users.update({"id":userID},{"$set":{"images":userObj["images"]}}) 
       db.images.insert(imgObj)
       db.index.update({},{"$set":{"image":currIndex+1}})
    
def makeThumbnail(bucket,imageID, url):
    if url == "":
        print "url cannot be empty!"
        return False
    text = urllib.urlopen(url = url).read()
    if text[0]=='5':
        print "image url error!"
        return False
    imData = cStringIO.StringIO(text)
    img = Image.open(imData)
    img.thumbnail(thumbnail_size)
    image_name = 'thumbnails/th'+str(imageID)+".jpg"
    key = bucket.new_key(image_name)

    output = cStringIO.StringIO()
    img.save(output,"JPEG")
    key.set_contents_from_string(output.getvalue())
    bucket.set_acl("public-read",image_name)
    return True

def deleteImage(db, imageID):
    print "to be done"
    

def addImageToViewlist(db, imageID, viewlistID):
    imageSet = db.images.find({"id":imageID})
    if imageSet.count() == 0:
        print "image "+str(imageID)+" doesn't exist"
        return False
    
    viewlistSet = db.viewlists.find({"id":viewlistID})
    if viewlistSet.count() == 0:
        print "viewlist "+str(viewlistID)+" doesn't exist"
        return False
    
    imgObj = imageSet[0]
    viewlistObj = viewSet[0]
    if imageID in viewlistObj["images"]:
        print "image"+str(imageID)+" is already in viewlist"+str(viewlistID)
        return False
    
    imgObj["viewlists"].append(viewlistID)
    viewlistObj["images"].append(imageID)
    db.images.update({"id":imageID},{"$set":{"viewlists":imgObj["viewlists"]}})
    db.viewlists.update({"id":viewlistID},{"$set":{"images":viewlistObj["images"]}})
    print imageID+" is successfully added to "+viewlistID
    return True

def removeImageFromViewlist(db, imageID, viewlistID):
    print "to be done"
    
def createViewlist(db, viewlistObj):
    # haven't added images yet
    mustHaves = ["creator"]
    for mustHave in mustHaves:
        if not mustHave in viewlistObj:
            print mustHave+" is missing!"
            return False
        
    viewlistObj["images"] = [] 
    userID = viewlistObj["creator"]
    userSet = db.users.find({"id":userID})
    if userSet.count()==0:
        print "user"+str(userID)+" doesn't exist"
        return False
    
    #update user 
    userObj = userSet[0]
    userObj["viewlists"].append(currIndex+1)
    db.users.update({"id":userID},{"$set":{userObj["viewlists"]}})
            
    currIndex = db.index.find_one()['viewlist']
    viewlistObj["id"]=currIndex+1
    viewlistObj["datetime_created"]=currUTC()
    db.viewlists.insert(imgObj)
    db.index.update({},{"$set":{"viewlist":currIndex+1}})


def addImageToViewlist(db, imageID, viewlistID):
    imageSet = db.images.find({"id":imageID})
    if imageSet.count() == 0:
        print "image"+str(imageID)+" doesn't exist"
        return False
    viewlistSet = db.viewlists.find({"id":viewlistID})
    if viewlistSet.count() == 0:
        print "viewlist"+str(viewlistID)+" doesn't exist"
        return False
    
    imageObj = imageSet[0]
    viewlistObj = viewlistSet[0]
    if imageID in viewlistObj["images"]:
        print "image"+str(imageID)+" is already in viewlist"+str(viewlistID)
        return False
    
    imageObj["viewlists"].append(viewlistID)
    db.images.update({"id":imageID},{"$set":{"viewlists":imageObj["viewlists"]}})
    
    viewlistObj["images"].append(imageID)
    db.viewlists.update({"id":viewlistID},{"$set":{"images":viewlistObj["images"]}})
    return True
        
    
def addPlayerToClient(db, userID, clientID):
    userSet = db.users.find({"id":userID})
    if userSet.count() == 0:
        print "user "+str(userID)+" doesn't exist"
        return False
    
    clientSet = db.clients.find({"id":clientID})
    if clientSet.count() == 0:
        print "client "+str(clientID)+" doesn't exist"
        return False
    
    userObj = userSet[0]
    clientObj = clientSet[0]
    if userID in clientObj["playable_users"]:
        print userID+" is already in the playableList of"+str(clientID)
        return False
    
    clientObj["playable_users"].append(userID)
    userObj["playable_clients"].append(clientID)
    db.clients.update({"id":clientID},{"$set":{"playable_users":clientObj["playable_users"]}})
    db.users.update({"id":userID},{"$set":{"playable_clients":userObj["playable_clients"]}})
    print userID+" is successfully added to the playable list of client"+str(clientID)
    return True
    
def createPlay(db, playObj):
    # create a new play and make a user-client mapping
    #playObj should have
    #client
    #user
    #viewlist
    #curr_index   
    mustHaves = ["client","user","viewlist","curr_index"]
    for mustHave in mustHaves:
        if not mustHave in playObj:
            print mustHave+" is missing"
            return False
    
    clientID = playObj["client"]
    clientSet = db.clients.find({"id":clientID})
    if clientSet.count()==0:
        print "client"+str(clientID)+" doesn't exist"
    
    viewlistID = playObj["viewlist"]
    viewlistSet = db.viewlists.find({"id":viewlistID})
    if viewlistSet.count()==0:
        print "viewlist"+str(viewlist)+"doesn't exist"
        return False
    
    userID = playObj["user"]
    userSet = db.users.find({"id":userID})
    if userSet.count()==0:
        print "user"+str(userID)+"doesn't exist"
        return False
    
    userObj = userSet[0]       
    clientObj = clientSet[0]
    if not userID in clientObj["playable_users"]:
        print "user"+str(userID)+" is not permitted to play on"+" client"+str(clientID)
        return False
    
        
    
    currIndex = db.index.find_one()['play']
    playObj["id"]=currIndex+1
    playObj["datetime_created"]=currUTC()
    playObj["last_update_time"]=playObj["datetime_created"]
        
    #append the new play to the plays of the user
    userObj["plays"].append(currIndex+1)
    db.users.update({"id":userID},{"$set":{"plays":userObj["plays"]}})
    
    
    # inactivate the play on the client
    prevPlayID = clientObj["curr_play"]
    if prevPlayID != -1:
       db.plays.update({"id":prevPlayID},{"$set":{"active":0}}) 
    
    #the curr_play of the client is set as the new play
    db.clients.update({"id":clientID},{"$set":{"curr_play":currIndex+1}})
    
    playObj["active"] = 1   #since the client is updated to have the current play, the play is active
    db.plays.insert(playObj)
    db.index.update({},{"$set":{"play":currIndex+1}})
    
    return True

def rerievePlay(db,userID,clientID):
    #retrieve the play if it exists, and synchronize the client
    playSet = db.plays.find({"user":userID,"client":clientID})
    if playSet.count()==0:
        print "user"+str(userID)+" has never played on client"+str(clientID)+" please create a new play!"
        return None
         
    #update the client status to switch to this play
    db.clients.update({"id":clientID},{"$set":{"curr_play":playID}})
    
    # the play is now active
    playObj = playSet[0]
    playObj["active"]=1
    playID = playObj["id"]
    db.plays.update({"id":playID},{"$set":{"active":1}})
    return playObj



   
def updatePlay(db, playID, viewlistID,curr_index):
    # result index
    # 0: play or viewlist doesn't exist
    # 1: play inactive
    # 2: successfully updated
    results = {"not_exist":0,"inactive":1,"success":2}
    
    playSet = db.plays.find({"id":playID})
    if playSet.count()==0:
        print "play"+str(playID)+" doesn't exist"
        return results["not_exist"]
    
    viewlistSet = db.viewlists.find({"id":viewlistID})
    if viewlistSet.count()==0:
        print "viewlist"+str(viewlistID)+" doesn't exist"
        return results["not_exist"]
    
    #update the play
    db.plays.update({"id":playID},{"$set":{"viewlist":viewlistID,"curr_index":curr_index,"last_update_time":currUTC()}})
    
    playObj = playSet[0]
    if playObj["active"]==0:
        print "warning, your play on client"+str(playObj["client"])+" is inactive, to activate it, please retrieve the play"
        return results["inactive"]
    
    return results["success"]

def createClient(db, account, token, userID, nickname):
    #account must be unqiue
    #account can be a serial number, we need to find a way to define it
    clientSet = db.clients.find({"account":account})
    if clientSet.count() > 0:
        print "this device has already been registered!"
        return False
    
    currIndex = db.index.find_one()['client']
    clientObj = {"account":account}
    clientObj["id"]=currIndex+1
    clientObj["nickname"]=nickname #for a user, we probably want it to be unique 
    clientObj["owner"]=userID
    clientObj["playable_users"] = []
    clientObj["curr_play"]=-1
    db.client.insert(clientObj)
    db.index.update({},{"$set":{"client":currIndex+1}})
    return True

def deleteClient(db,clientId):
    print "to be done"
        
      
def deleteViewlist(db, viewlistID):
    print "to be done"
 
    
def editViewlist(db, newViewlist):
    print "to be done"
         

def deletePlay(db, playID):
    print "to be done"    
    



def test(db,bucket):
    initIndexes(db)
    db.users.remove()
    db.images.remove()
    createUser(db,{"name":"LuckyLeon", "email":"leon@zwamy.com","first_name":"Leon","last_name":"Zhu"})
    createUser(db,{"email":"nancy@zwamy.com","first_name":"Nancy","last_name":"Laube"})  
    
    addImages(db, bucket, "img.csv",1)                     
    
    #createUser(db,{"name":"LeonZw", "email":"newvava@gmail.com",
    #            "first_name":"Lew","last_name":"Zhu"})
    #createUser(db,{"name":"Ruirui", "email":"zhangruiddn@gmail.com",
    #            "first_name":"Rui","last_name":"Zhang"})
    #addFriend(db, "leon@zwamy.com","zhangruiddn@gmail.com")
    #addFriend(db, "zhangruiddn@gmail.com","leon@zwamy.com")
    
    #addFriend(db, "leon@zwamy.com","newvava@gmail.com")
    #addFriend(db, "newvava@gmail.com","leon@zwamy.com")

    #addFriend(db, "zhangruiddn@gmail.com","newvava@gmail.com")
    #addFriend(db, "newvava@gmail.com","zhangruiddn@gmail.com")
    #deleteUser(db, "zhangruiddn@gmail.com")


def addImages(db, bucket, fileName, userID):
    file = open(fileName,'rU')
    reader = csv.reader(file)
    attrs = ["Title","Year","Artist","Permission","url","Medium","Dimensions","Location"]
            
    
    index = 0
    for row in reader:
        if index == 0:
           index += 1
           continue 
        colIndex = 0
        imgObj = {}
        for content in row:
           imgObj[attrs[colIndex]]=content
           colIndex += 1
        imgObj['creator'] = 1
        print imgObj
        createImage(db,bucket,
                imgObj)
        index+=1
        
    file.close()
    



def main():
    conn = Connection(server, port)
    db = conn[db_name]
    db.authenticate(username, password)
    
    connS3 = S3Connection(myKey, mySecretKey)
    bucket = connS3.get_bucket(myBucket)
    
    test(db,bucket)
    conn.close()

if __name__ == "__main__":
    main()