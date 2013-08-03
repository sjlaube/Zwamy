class ClientController < ApplicationController
  require 'rubygems'
  require 'mongo'
  include Mongo
  
  @@server = 'ds031948.mongolab.com'
  @@port = 31948
  @@db_name = 'zwamy'
  @@username = 'leonzwamy'
  @@password = 'zw12artistic'

  def utcMillis
    return (Time.new.to_f*1000).to_i
  end
  
  def verifyUser
    if(params[:email]==nil or params[:email].strip=='')
        result = {"status"=>"failure", "message"=>"email missing!"}
        render :json=>result, :callback => params[:callback]
        return
    end
    
    
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)

    userSet = @db['users'].find({"email"=>(params[:email].strip).downcase})
    
    if userSet.count == 0
        result = {"status"=>"failure", "message"=>"no user mathes!"}
        render :json=>result, :callback => params[:callback]
        return
    end
    
    result = result = {"status"=>"success", "message"=>"user found!", "userObj"=>userSet.to_a[0]}
    render :json=>result, :callback => params[:callback]
  end
  
  
  
  def regUser
    if(params[:email]==nil or params[:email].strip=='')
        result = {"status"=>"failure", "message"=>"email missing!"}
        render :json=>result, :callback => params[:callback]
        return
    end
    
    
    if(params[:name]==nil or params[:name].strip=='')
        result = {"status"=>"failure", "message"=>"name missing!"}
        render :json=>result, :callback => params[:callback]
        return
    end
          
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    
    if @db['users'].find({"email"=>(params[:email].strip).downcase}).count > 0
        result = {"status"=>"failure", "message"=>"This email has been registered!"}
        render :json=>result, :callback => params[:callback]
        return
    end
    
                       
    userObj = {"name"=>params[:name].strip,"email"=>(params[:email].strip).downcase}
    currIndex = @db['index'].find().to_a[0]['user']
    userObj["id"] = currIndex+1
    
    emptyArrays = ["images","viewlists","friends","adds","requests","owned_clients",
                    "playable_clients","plays"]
    
    for emptyArray in emptyArrays
        userObj[emptyArray]=[]
    end    
    @db['users'].insert(userObj)
    @db['index'].update({},{"$set"=>{"user"=>currIndex+1}})
    
    result = result = {"status"=>"success", "message"=>"user created!"}
    render :json=>result, :callback => params[:callback]        
  end
  
  
  def lastVisitsAll
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    result = {}
    @players = @db["clients"].find({}).to_a
    @players.each do |player|
      result[player["account"]]=player["last_visit"]
    end
    render :json =>result, :callback => params[:callback] 
  end
  
  
  def lastVisitsAllmq
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    result = {}
    @players = @db["clients"].find({}).to_a
    @players.each do |player|
      result[player["account"]]=player
    end
    render :json =>result, :callback => params[:callback] 
  end
  
  
  
  def lastVisits
    if(params[:snumbers]==nil)
      result = {"result"=>"error, no serial numbers!"}
      render :json=>result, :callback => params[:callback]
      return
    end
    
    if(params[:snumbers].length==0)
      result = {"result"=>"error, no serial numbers!"}
      render :json=>result, :callback => params[:callback]
      return
    end
    
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    
    result = {}
    params[:snumbers].each do|account|
      playerSet = @db['clients'].find({"account"=>account})
      if playerSet.count>0
        player = playerSet.to_a[0]
        result[account]=player["last_visit"]
      end
    end
    render :json=>result, :callback => params[:callback]    
  end  
  
  def players
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    @players = @db['clients'].find().to_a
    @images = @db['images'].find().to_a
  end
  
  def update
    if(params[:snumber]==nil or params[:imageID]==nil)
        result = {"result"=>"error", "message"=>"parameter missing!"}
        render :json=>result, :callback => params[:callback]
        return
    end
    
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)

    playerSet = @db['clients'].find({"account"=>params[:snumber]})
    if playerSet.count == 0
        result = {"result"=>"error", "message"=>"no player found!"}
        render :json=>result, :callback => params[:callback]
        return
    end
    
    
    imageSet = @db['images'].find({"id"=>params[:imageID].to_i})
    if imageSet.count == 0
        result = {"result"=>"error", "message"=>"no image found!"}
        render :json=>result, :callback => params[:callback]
        return
    end
    
    
    stretch = false
    if params[:stretch]!=nil
      stretch = params[:stretch]
    end


      
    
    player = playerSet.to_a[0]
    currIndex = player["curr_index"]
    
    listSet = @db['viewlists'].find({"id"=>params[:list].to_i})
    if listSet.count > 0
      list = listSet.to_a[0]
       
      index = 0
      while index < list["images"].length
        if list["images"][index].to_i == params[:imageID].to_i
          currIndex = index-1
          break
        end
        index += 1
      end
    end 
    
    
    @db['clients'].update({"account"=>params[:snumber]},"$set"=>{"curr_image"=>params[:imageID].to_i,"image_time_stamp"=>utcMillis(), "stretch"=>stretch,
      "curr_list"=>params[:list], "curr_index"=>currIndex})
      
    @db['users'].update({"email"=>params[:email]},"$set"=>{"curr_image"=>params[:imageID],"curr_list"=>params[:list],"curr_cat"=>params[:cat], "fill"=>stretch})
    result = {"result"=>"success", "message"=>"updated!"}   
    render :json=>result, :callback => params[:callback]
 
  end
  
  
  def allImages
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    @images = @db["images"].find({}).to_a
    render :json=>@images, :callback => params[:callback]  
  end
  
  def allViewlists
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    @viewlists = @db["viewlists"].find({}).to_a
    render :json=>@viewlists, :callback => params[:callback]  
 end
 
 def getViewlist
    if(params[:id]==nil)
      result = {"result"=>"error, no id!"}
      render :json=>result, :callback => params[:callback]
      return
    end
    
    if(params[:id].length==0)
      result = {"result"=>"error, no id!"}
      render :json=>result, :callback => params[:callback]
      return
    end
    
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    viewlistSet = @db["viewlists"].find({"id"=>params[:id].to_i})
    if viewlistSet.count == 0
      result = {"result"=>"unkown viewlist"}
      render :json=>result, :callback => params[:callback]
    end
    
    viewlist = viewlistSet.to_a[0] 
    viewlist["imageSet"]=[]
    viewlist["images"].each do|image|
      imageSet = @db["images"].find({"id"=>image.to_i})
      if imageSet.count > 0
        viewlist["imageSet"].append(imageSet.to_a[0])
      end
    end
    render :json=>viewlist, :callback => params[:callback]
  end
  
  
  def getPlayer
    if(params[:snumber]==nil)
      result = {"result"=>"error, no serial number!"}
      render :json=>result, :callback => params[:callback]
      return
    end
    
    if(params[:snumber].length==0)
      result = {"result"=>"error, no serial number!"}
      render :json=>result, :callback => params[:callback]
      return
    end
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    playerSet = @db["clients"].find({"account"=>params[:snumber]})
    if playerSet.count == 0
      result = {"result"=>"unkown player"}
      render :json=>result, :callback => params[:callback]
    end
    render :json=>playerSet.to_a[0], :callback => params[:callback] 
  end
  
  def selectPlayers
    if(params[:email]==nil)
      result = {"Status"=>"failure", "Message"=>"No user email!"}
      render :json=>result, :callback => params[:callback]
      return
    end
    
    
    if(params[:players]==nil)
      result = {"Status"=>"failure", "Message"=>"No player accounts!"}
      render :json=>result, :callback => params[:callback]
      return
    end
    
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    
    userSet = @db["users"].find({"email"=>params[:email]})
    if userSet.count == 0
      result = {"Status"=>"failure", "Message"=>"No user found!"}
      render :json=>result, :callback => params[:callback]
      return 
    end
    
    @db["users"].update({"email"=>params[:email]},{"$set"=>{"selected_players"=>params[:players]}})
    result = {"Status"=>"success", "Message"=>"The players are selected!"}
    render :json=>result, :callback => params[:callback]
    
  end
  
  def getSelectedPlayers
    if(params[:email]==nil)
      result = {"Status"=>"failure", "Message"=>"No user email!"}
      render :json=>result, :callback => params[:callback]
      return
    end
    
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    
    userSet = @db["users"].find({"email"=>params[:email]})
    if userSet.count == 0
      result = {"Status"=>"failure", "Message"=>"No user found!"}
      render :json=>result, :callback => params[:callback]
      return 
    end
    
    selectedPlayers = userSet.to_a[0]["selected_players"]
    result = {"Status"=>"success", "selectedPlayers"=>selectedPlayers}
    render :json=>result, :callback => params[:callback] 
  end
  
  
   def getUserStatus
    if(params[:email]==nil)
      result = {"Status"=>"failure", "Message"=>"No user email!"}
      render :json=>result, :callback => params[:callback]
      return
    end
    
    
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    
    userSet = @db["users"].find({"email"=>params[:email]})
    if userSet.count == 0
      result = {"Status"=>"failure", "Message"=>"No user found!"}
      render :json=>result, :callback => params[:callback]
      return 
    end
    
    user = userSet.to_a[0]
    if(user["curr_image"]==nil or user["curr_image"]=='')
      result = {"Status"=>"failure", "Message"=>"No image!"}
      render :json=>result, :callback => params[:callback]
      return  
    end
    
    if(user["curr_list"]==nil or user["curr_list"]=='')
      result = {"Status"=>"failure", "Message"=>"No list!"}
      render :json=>result, :callback => params[:callback]
      return  
    end
    
    if(user["curr_cat"]==nil or user["curr_cat"]=='')
      result = {"Status"=>"failure", "Message"=>"No category!"}
      render :json=>result, :callback => params[:callback]
      return  
    end
    
    
    
    result = {"Status"=>"success", "curr_image"=>user["curr_image"], "curr_list"=>user["curr_list"],"curr_cat"=>user["curr_cat"],
      "fill"=>user["fill"], "autoInterval"=>user["autoInterval"]}
    render :json=>result, :callback => params[:callback]
    
  end
  
  
  def setAuto
    if(params[:snumber]==nil or params[:autoInterval]==nil or params[:snumber].strip=='' or params[:autoInterval].strip=='')
        result = {"Status"=>"failure", "message"=>"parameter(s) missing!"}
        render :json=>result, :callback => params[:callback]
        return
    end
    
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)

    playerSet = @db['clients'].find({"account"=>params[:snumber].strip})
    if playerSet.count == 0
        result = {"Status"=>"failure", "message"=>"no player found!"}
        render :json=>result, :callback => params[:callback]
        return
    end
    
    player=playerSet.to_a[0]
    currIndex = player["curr_index"]
    if currIndex == nil
      currIndex = -1
    end

    @db['clients'].update({"account"=>params[:snumber].strip},{"$set"=>{"autoInterval"=>params[:autoInterval].strip.to_i, "lastAutoAssign"=>-1,
      "curr_index"=>currIndex, "auto_user"=>params[:email]}})
      
    @db['users'].update({"email"=>params[:email]},{"$set"=>{"autoInterval"=>params[:autoInterval].strip.to_i}})

    result = {"Status"=>"success", "message"=>"updated!"}   
    render :json=>result, :callback => params[:callback]
 
  end
  
    
end  
