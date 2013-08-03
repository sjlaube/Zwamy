class ClientController < ApplicationController
  require 'rubygems'
  require 'mongo'
  include Mongo
  require 'json'
  
  @@server = 'ds031948.mongolab.com'
  @@port = 31948
  @@db_name = 'zwamy'
  @@username = 'leonzwamy'
  @@password = 'zw12artistic'
  def utcMillis
    return (Time.new.to_f*1000).to_i
  end
  
  def checkin
   if(params[:snumber]==nil)
      result = {"result"=>"error", "message"=>"no serial number!"}
      render json: result
      return
    end
    
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    
    if @db['clients'].find({'account'=>params[:snumber]}).count == 0
      result = {"result"=>"error", "message"=>"no player found!"}
      render json: result
      return
    end
    
    @player = @db['clients'].find({'account'=>params[:snumber]}).to_a[0]
    utctime = utcMillis()
    
    
        
    pullInterval = 500
    
    if @player["autoInterval"].to_i > 0
      
      targetTime = @player["lastAutoAssign"].to_i+@player["autoInterval"].to_i
      
      if (@player["lastAutoAssign"].to_i == -1) or (utctime > targetTime) or (targetTime >= utctime and targetTime <= (utctime+pullInterval))
        
         lastAutoAssign = utctime
         
         listSet = @db['viewlists'].find({"id"=>@player["curr_list"].to_i})
         if listSet.count == 0
           currListObj = @db['viewlists'].find({"id"=>155}).to_a[0]
         else
           currListObj = listSet.to_a[0]
         end
         
         images = currListObj["images"]
         currIndex = (@player["curr_index"].to_i + 1)%images.length
         currImageIndex = images[currIndex]
             
    
         imageSet = @db['images'].find({'id'=>currImageIndex.to_i})
         if imageSet.count > 0
           currImage = imageSet.to_a[0]
         else
           currImage = @db["images"].find({"id"=>956})
         end 
         
         image_time_stamp = @player["image_time_stamp"]
         if image_time_stamp == nil
            image_time_stamp = utctime
         end
    
         stretch = "false"
         if @player["stretch"] != nil
           stretch = @player["stretch"].to_s
         end
         
         @db['clients'].update({'account'=>params[:snumber]},"$set"=>{'last_visit'=>utctime,
           'curr_index'=>currIndex, 'lastAutoAssign'=>lastAutoAssign, 'curr_image'=>currImage["id"]})
                     
         result = {"result"=>"success", "message"=>"updated "+utctime.to_s+" "+@player["nickname"], "player"=>@player["nickname"],
               "currImage"=>currImage, "image_time_stamp"=>image_time_stamp}    
        
                
         render json: JSON.pretty_generate(result)   
         
         return
         
      end
      
      
    end
    

    currImageIndex = 956
    if @player["curr_image"].to_i != -1
      currImageIndex = @player["curr_image"].to_i
    end
    
    imageSet = @db['images'].find({'id'=>currImageIndex.to_i})
    if imageSet.count > 0
      currImage = imageSet.to_a[0]
    end
    
    
    @db['clients'].update({'account'=>params[:snumber]},"$set"=>{'last_visit'=>utctime})
    result = {"result"=>"success", "message"=>"updated "+utctime.to_s+" "+@player["nickname"], "player"=>@player["nickname"],
               "currImage"=>currImage, "image_time_stamp"=>@player["image_time_stamp"]}
    render json: result
  end
  
  
  def player 
  end
  
  def currentImage       
    if(params[:snumber]==nil)
      result = {"result"=>"error", "message"=>"no serial number!"}
      render json: result
      return
    end
    
    if(params[:regToken]==nil)
      result = {"result"=>"error", "message"=>"no reg token!"}
      render json: result
      return
    end
    
    @client = MongoClient.new(@@server,@@port)
    @db = @client[@@db_name]
    @db.authenticate(@@username,@@password)
    
    if @db['clients'].find({'account'=>params[:snumber], "reg_token"=>params[:regToken]}).count == 0
      result = {"result"=>"error", "message"=>"Player cannot be identified"}
      render json: result
      return
    end
    
    @player = @db['clients'].find({'account'=>params[:snumber]}).to_a[0]
    currImageIndex = 790
    if @player["curr_image"].to_i != -1
      currImageIndex = @player["curr_image"].to_i
    end
    
    imageSet = @db['images'].find({'id'=>currImageIndex.to_i})
    if imageSet.count > 0
      currImage = imageSet.to_a[0]
    end
    
    utctime = utcMillis()
    image_time_stamp = @player["image_time_stamp"]
    if image_time_stamp == nil
      image_time_stamp = utctime
    end
    @db['clients'].update({'account'=>params[:snumber]},"$set"=>{'last_visit'=>utctime})
    result = {"imageURL"=>currImage["url"],"title"=>currImage["Title"],"caption"=>currImage["Artist"],
      "timeStamp"=>image_time_stamp}
    render json: JSON.pretty_generate(result)     
  end
  
  
end  
