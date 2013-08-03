/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in
 * Maqetta.
 */

define.amd.jQuery = true;
require(["jquery",
	    "dojo/ready",
        "dojo/dom",
        "dojo/dom-style",
        "dijit/registry",
        "dojo/on",
        "dojo/date/stamp",
        "dojo/data/ItemFileWriteStore",
        "dojo/_base/connect",
        "dijit/form/Select",
        "dojo/dom-attr"
    ],
    function (
    	$,
    	ready,
        dom,
        domStyle,
        registry,
        on,
        stamp,
        ItemFileWriteStore,
        connect,
        select,
        domAttr ) {



        ready(function () {
        	
        	
        	var metaPlane1 = dojo.byId("MediumDateSize");
            var metaPlane2 = dojo.byId("ArtLocation");
            var metaPlane3 = dojo.byId("viewtableline1");
            var metaPlane4 = dojo.byId("viewtableline2");
            var metaPlane5 = dojo.byId("viewtableline3");
            var metaPlane6 = dojo.byId("viewtableline4");
            var metaPlane7 = dojo.byId("viewtableline5");
            var metaPlane8 = dojo.byId("WorkLocation");
        	
        	

            
            var base = "http://evening-garden-3648.herokuapp.com/client/";
            var selectListView = registry.byId("PlaylistView");
            var listList = registry.byId("listList");
            var playerList = registry.byId("playerList");
            var imagesList = registry.byId("ImageList");
            
            var catList = registry.byId("catList");
            var ownedPlayerList = registry.byId("ownedPlayerList");
            var removePlayerList = registry.byId("removePlayerList");
            var selectPlayerView = registry.byId("select_player");
            var selectCatView = registry.byId("select_category");  
            var imageView = registry.byId("ImageView");
            
            
            var addUserView = registry.byId("add_user_player");
            var removePlayerView = registry.byId("removeplayer");
            
            window.foundIndex = false;
            window.selectedPlayers = {};
            window.justLogin = true;
            window.imageMap = {};
            window.email = null;
            window.fill = false;
            window.ownedPlayers={};
            window.removePlayers={};
            window.playerSet = {};
            window.currList = null;
            window.currImage = null;
            window.currCat = null;
            window.owndedPlayers={};
            window.removePlayers={};
			window.menushow=false;
			window.justCreatePlayer=false;
        	
        	
        	
        	function getCookie(c_name) {
                      var c_value = document.cookie;
                      var c_start = c_value.indexOf(" " + c_name + "=");
                      if (c_start == -1)
                               {
                                   c_start = c_value.indexOf(c_name + "=");
                               }
                      if (c_start == -1)
                               {
                                   c_value = null;
                               }
                      else
                               {
                                   c_start = c_value.indexOf("=", c_start) + 1;
                                   var c_end = c_value.indexOf(";", c_start);
                                   if (c_end == -1)
                                       {
                                          c_end = c_value.length;
                                       }
                                   c_value = unescape(c_value.substring(c_start,c_end));
                                }
                       return c_value;
              }

        	
        	
        	
        	function setCookie(c_name,value,exdays){
                var exdate=new Date();
                exdate.setDate(exdate.getDate() + exdays);
                var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
                document.cookie=c_name + "=" + c_value;
            }


function checkCookie() {
                var email = getCookie("email");
     //      alert("checkCookie " + email);
             var I0 = registry.byId("Intro0");  
    //         alert ("Io= " + I0 + I0.selected);
             var Iv = registry.byId("ImageView");
			  var splash = dojo.byId("splash");
   //         alert("Imageview= "+ Iv + Iv.selected);
  //      I0.startup();
   //     alert ( "intro0 startup"); 
       I0.show();
      Iv.startup();
	 // alert ("try spash= " + splash);

	//   splash.style.display = "none";
	//  alert ("did splash");

   //     alert ("imageview startup");
            
                
                if (email != null && email != ""  && email != "null") {
                //alert ("good to go");
                
                
              //      alert("Welcome again " + email);
                    var base = "http://evening-garden-3648.herokuapp.com/player/"
                    dojo.io.script.get({
                        url: base + "getUser?email=" + email,
                        callbackParamName: "callback",
                        load: function (result) {
                            if (result["Status"] == "success") {
                            
                     //        var currView = dijit.registry.byId("Intro0");
                     //        var mycurrView = currView.getShowingView();
                                   window.email = email;
								     Iv.selected = true;
                                         Iv.show();
								splash.style.display = "none";
                       //       mycurrView.performTransition("ImageView", 1, "slide", null);
                            
                   //             var currView = registry.byId("Intro0");
                        //        window.email = email;
                       //         currView.performTransition("ImageView", 1, "slide", null);

                            } else splash.style.display = "none";
                        }

                    });

                }else splash.style.display = "none";
            }
          
          /*
           
           function updateImages(startIndex){
           	   if (currList==null){
           	   	 currList = 126;
           	   }
           	   
           	   $.ajax({
           	   	   url: base+"getViewlist?id=" + currList,
           	   	   dataType: 'jsonp',
           	   	   jsonCallback: "images",
           	   	   success: function(result){
           	   	   	  
           	   	   }
           	   });
           	
           }
           
           */
          
           function syncImage(){
           	     for (var player in window.playerSet) {
                    if (window.playerSet[player]) {
                    	//alert(base + "update.json?snumber=" + player.substring(1) + "&imageID=" + window.currImage +"&stretch="+window.fill+"&email="+window.email+"&list="
                         //   +window.currList+"&image="+window.currImage);
                        dojo.io.script.get({
                            url: base + "update.json?snumber=" + player.substring(1) + "&imageID=" + window.currImage +"&stretch="+window.fill+"&email="+window.email+"&list="
                            +window.currList+"&cat="+window.currCat,
                            callbackParamName: "callback",
                            load: function (result) {
                            	//alert(base + "update.json?snumber=" + player.substring(1) + "&imageID=" + view.getChildren()[0]['alt']+"&stretch="+window.fill);

                            }
                        });

                    }
                }
           	
           }
           
           function loadImages(){      
 
           	    

                if (window.currList == null) {
                    window.currList = 155;
                }
                
                
                //alert("updating"+currList);
                dojo.io.script.get({
                    url: base + "getViewlist?id=" + window.currList,
                    callbackParamName: "callback", 
                    load: function (viewlist) {    
                    	            
                        window.currImage = viewlist["imageSet"][0]["id"];
                        //alert("currImage "+window.currImage);
                        //alert("tarImage "+window.tarImage);
                        if(window.currImage==window.tarImage){
                        	window.foundIndex=true;
                        }
                        if(window.foundIndex){
                        	syncImage();
                        }
                        
                        for (var i in viewlist["imageSet"]) {
                        	
                            imageMap[viewlist["imageSet"][i]["id"]] = viewlist["imageSet"][i];
                      //      alert(viewlist["imageSet"][i]["Title"].replace(":","\:"));
                            image = {
                                "alt": viewlist["imageSet"][i]["id"],
                                "src": viewlist["imageSet"][i]["thumbnail"]
                             //  "footerText": viewlist["imageSet"][i]["Artist"],
                              //  "headerText": viewlist["imageSet"][i]["Title"].replace("'", "", "")
                            };
                            window.imageStore.newItem(image);
                            //alert("done"+viewlist["imageSet"][i]["thumbnail"]);
                            if (i == viewlist["imageSet"].length - 1){
                                imagesList.setStore(null);
                                imagesList.setStore(window.imageStore);
                                //alert(imagesList);
                       //         alert("store set");
                            }
                        }
                        //alert(window.currImage);
                        //alert(window.tarImage);
                        
                        if((!window.foundIndex)&&(window.currImage!=window.tarImage)){
                        	imagesList.currentView.goTo(1);
                        }
 //
						dijit.registry.byId("ImageViewHeader").set("label",imageMap[currImage]["Artist First N"] + " " +imageMap[currImage]["Artist Last N"]);
                        metaPlane3.innerHTML = "<b>" + imageMap[currImage]["Title"].replace("'", "", "") + "</b>" +" " +  imageMap[currImage]["Year"] ;
                        metaPlane4.innerHTML = imageMap[currImage]["Artist First N"] + " " +imageMap[currImage]["Artist Last N"] ;
                        // figure out which dimension
                        if ( imageMap[currImage]["Width cm"] > 0)   
                       		metaPlane5.innerHTML = imageMap[currImage]["Type"] + " " + imageMap[currImage]["Width cm"] + "x" + imageMap[currImage]["Height cm"] + "cm" ;
                        else
                        	metaPlane5.innerHTML = imageMap[currImage]["Type"] + " " + imageMap[currImage]["Width Px"] + "x" + imageMap[currImage]["Height Px"] + "px" ;
                       // metaPlane7.innerHTML = imageMap[currImage]["Dimensions"];
                       metaPlane6.innerHTML = imageMap[currImage]["Location"];
                         if (imageMap[currImage]["More Info Link"] )
                    {
                            if (imageMap[currImage]["More Info Link"].substring(0,4) == "http" )                  
                                    metaPlane7.innerHTML = "<a href=" + imageMap[currImage]["More Info Link"] + " >More Info</a>";
                            else
                                    metaPlane7.innerHTML = "<a href=http://" + imageMap[currImage]["More Info Link"] + " >More Info</a>";
                     }
                     else
                                     metaPlane7.innerHTML = "";
                    }
                });
           	
           }
          
           function updateImages(startIndex) {
                
                var imageData = {
                    "items": []
                };
                window.imageStore = new ItemFileWriteStore({
                    data: imageData
                });
                
                if(window.justLogin){
                dojo.io.script.get({
                	url: base + "getUserStatus?email="+window.email,
                	callbackParamName: "callback", 
                	load:function(result){
                		if(result["Status"]=="success"){
                			window.tarImage = result["curr_image"];
                			//alert("tar"+window.tarImage);
                			window.currList = result["curr_list"];
                			window.currCat = result["curr_cat"];

                		    window.fill = (result["fill"]=="true");
                			//alert(window.fill);
                			var switchValue = "off";
                			if(window.fill){
                				switchValue = "on";
                			}
                            dijit.byId("fillswitch").set("value", switchValue);               			
                			$("option#"+result["autoInterval"]).attr('selected', 'selected');
                			
                		}else{
                			window.tarImage = "956";
                			window.currList = "155";
                			window.currCat = "Top Lists"
                		}
                		loadImages();
                		//alert(window.currCat);
                		updateLists(window.currCat);
                	}
                });
                }
                else{
                	loadImages();
                }

            }

          function  updateRemovePlayers(){
                var base = "http://evening-garden-3648.herokuapp.com/player/";
                window.removePlayers={};
                var playerData = {
                    "items": []
                };
                var playerStore = new ItemFileWriteStore({
                    data: playerData
                });
                
                removePlayerList.setStore(null);
                removePlayerList.setStore(playerStore);
                //alert(base + "getPlayers?email="+window.email);
                dojo.io.script.get({
                       url:base + "getPlayers?email="+window.email,
                       callbackParamName: "callback",
                        load: function(result){
                            var players= result["players"];
                            for(var i in players){
                               playerStore.newItem({"label":players[i]["nickname"],"paccount":players[i]["account"], "onClick":function(){removePlayerClick(this.paccount)}});
                               window.removePlayers[players[i]["account"]]=false;
                           }
                        }
                       
                });
                
            }
            function removePlayerClick(paccount){
            	if(window.removePlayers[paccount]){
            		window.removePlayers[paccount] = false;
            	}
            	else{
            		window.removePlayers[paccount] = true;
            	}
            	
            }
            function ownedPlayerClick(paccount){
            	if(window.ownedPlayers[paccount]){
            		window.ownedPlayers[paccount] = false;
            	}
            	else{
            		window.ownedPlayers[paccount] = true;
            	}
            }
             
            function  updateOwnedPlayers(){
                var base = "http://evening-garden-3648.herokuapp.com/player/";
                window.ownedPlayers={};
                var playerData = {
                    "items": []
                };
                var playerStore = new ItemFileWriteStore({
                    data: playerData
                });
                ownedPlayerList.setStore(null);
                ownedPlayerList.setStore(playerStore);
                dojo.io.script.get({
                      url: base + "getOwnedPlayers?email="+window.email,
                      callbackParamName: "callback",
                      load: function(result){
                           //alert( result["players"].length);
                           var players= result["players"];
                           for(var i in players){
                               playerStore.newItem({"label":players[i]["nickname"],"paccount":players[i]["account"], "onClick":function(){ownedPlayerClick(this.paccount)}});
                               window.ownedPlayers[players[i]["account"]]=false;
                           }
                      }
                });
            }

         /*
         function  updateOwnedPlayers(){
                var base = "http://evening-garden-3648.herokuapp.com/player/";
                window.ownedPlayers={};
                ownedPlayerList.destroyRecursive(true);
            	$("#ownedPlayerList").html('');
            	alert( base + "getOwnedPlayers?email="+window.email);
                dojo.io.script.get({
                      url: base + "getOwnedPlayers?email="+window.email,
                      callbackParamName: "callback",
                      load: function(result){
                           //alert( result["players"].length);
                           alert(result["players"]);
                           var players= result["players"];
                           for(var i in players){
                               //playerStore.newItem({"label":players[i]["nickname"],"paccount":players[i]["account"]});
                               //window.ownedPlayers[players[i]["account"]]=false;
                                alert(players[i]["nickname"]);
                                li = new dojox.mobile.ListItem({id:players[i]["account"], 
                                                              label:players[i]["nickname"],
                                                              onClick:function(){
                                                              	alert(this.id);
                                                              },                                                   
                                                              });
                                ownedPlayerList.addChild(li);   
                           }
                      }
                });
            }
           
*/
            function updateCats(){
            	var base = "http://evening-garden-3648.herokuapp.com/content/";
            	catList.destroyRecursive(true);
            	$("#catList").html('');
            	dojo.io.script.get({
            		url: base + "allCategories",
            		callbackParamName: "callback",
            		load: function (result) {
            			var cats = result["categories"];
            			for(var i in cats){
            				newCat = new dojox.mobile.ListItem({id:cats[i]["name"], 
            				
                                                              label:cats[i]["name"]+"<br><i><small>"+cats[i]["viewlists"].length+" lists</small></i></br>",
                                                              
                                                              rightIcon:"mblDomButtonArrow",
                                                              variableHeight:true,
                                                              onClick:function(){
                                                              	//alert(this.id);
                                                              	window.currCat = this.id;
                                                  
                                                              	updateLists(window.currCat);
                                                              },
                                                              moveTo:"PlaylistView"
                                                              //rightText:
                                                              });
            				//alert("new");
            				catList.addChild(newCat);
            				
            				//var li = "<li data-dojo-type=\"dojox/mobile/ListItem\" moveTo=\"ImageView\" rightIcon=\"mblDomButtonArrow\" variableHeight=\"true\"> <label class=\"mblListItemLabel\">World's 10 Most Popular Paintings<br><i><small> 10 images</small></i></br></label></li>"
                            //console.log(li);
            				//$("#catList").append(li);
            				
            			}

            		}
            		
            	});
            }
            
            
            function updateLists(catName){
            	var base = "http://evening-garden-3648.herokuapp.com/content/";
                listList.destroyRecursive(true);
            	$("#listList").html('');
            	
				
            	dojo.io.script.get({
            		url:base + "getViewlistsByCategory?catName=" + catName,
            		callbackParamName: "callback",
            		load: function (result) {
            			 var lists = result["viewlists"];
            			 for(var i in lists){
            			 	  newList = new dojox.mobile.ListItem({id:lists[i]["id"], 
            				
                                                              label:lists[i]["name"]+"<br><i><small>"+lists[i]["images"].length+" images</small></i></br>",
                                                              
                                                              rightIcon:"mblDomButtonArrow",
                                                              variableHeight:true,
                                                              onClick:function(){
                                                              	//alert(this.id);
                                                              	window.currList = this.id;
                                                              	updateImages(0);
                                     
                                                              },
                                                              moveTo:"ImageView"
                                                              });
            			 	  listList.addChild(newList);
            			 	
            			 }
            		}
            		
            	});
            }
            
            
            function rememberSelectPlayers(){
            	  //alert("remembering");
            	  var url = base + "selectPlayers?email="+window.email;
        	   	  for(var player in window.playerSet){
        	   	  	    //alert(playerSet[player]);
                    	if(window.playerSet[player]){
                    		url+="&players[]="+player.substring(1);
                    		//alert(url);
                    	}
                    	
                  }
                  //alert(url);
                  dojo.io.script.get({
                            url: url,
                            callbackParamName: "callback",
                            load: function (result) {
                            }
                    });
            }

        	
        	function playerClick(id){
        		if(window.playerSet[id]){
        			window.playerSet[id] = false;
        		}
        		else{
        			window.playerSet[id] = true;
        		}
        		
        	}
        	
        	
        	function updatePlayers(selectedPlayers){
        		var base = "http://evening-garden-3648.herokuapp.com/player/";
        		//alert("players");

        		
        		dojo.io.script.get({
                    url: base + "getPlayers?email="+window.email,
                    callbackParamName: "callback",
                    load: function(result) {
        
                    var curr = new Date().getTime();
                    var newPlayerSet = {};
                    
                    if(window.justLogin){
                      //alert("justLogin,updatePlayers");
                      //playerList.destroyRecursive(true);
                      //$("#ownedPlayerList").html('');
                      playerList.destroyDescendants();
                      for(var i in result["players"]){
                       	  var player = result["players"][i];
                       	  
                       	  //alert(curr-player["last_visit"]);
                       	  
                       	  if(curr-player["last_visit"]<5000){
                       	      var status = "images/greenbutton.png"; 
                       	  }
                       	  else{
                       	      var status = "images/graybutton.png";
                       	  }
                       	  
                       	  
                       	  
                       	  var li = registry.byId("s"+player["account"]);
                       	  
                       	  
                       	  if(player["account"] in selectedPlayers){
                       	  	//alert(player["account"]+"in");
                       	  	var checked = true;
                       	  	window.playerSet["s"+player["account"]]=true;
                       	  }
                       	  else{
                       	  	//alert(player["account"]+"out");
                       	  	var checked = false;
                       	  	window.playerSet["s"+player["account"]]=false;
                       	  }
                       	  
                       	  li = new dojox.mobile.ListItem({id:"s"+player["account"], 
                                                              icon:status,
                                                              label:player["nickname"],
                                                              onClick:function(){
                                                              	playerClick(this.id);
                                                              },
                                                              checked:checked
                                                              
                                                              });
                          playerList.addChild(li);                                                            
                       	  
                      }
                      window.justLogin = false;
                      //syncImage();
                      return;
                      
                    }
                      
                    
                    

                       
                       for(var i in result["players"]){
                       	  var player = result["players"][i];
                       	  
                       	  //alert(curr-player["last_visit"]);
                       	  
                       	  if(curr-player["last_visit"]<5000){
                       	      var status = "images/greenbutton.png"; 
                       	  }
                       	  else{
                       	      var status = "images/graybutton.png";
                       	     
                       	  }
                       	  
                       	  newPlayerSet["s"+player["account"]]=1;
                       	  var li = registry.byId("s"+player["account"]);
                       	  //alert(player["account"]);
                       	  if(li==undefined){
                       	  	//alert("new"+player["account"]);
                       	  	li = new dojox.mobile.ListItem({id:"s"+player["account"], 
                                                              icon:status,
                                                              label:player["nickname"],
                                                              onClick:function(){
                                                              	playerClick(this.id);
                                                              },
                                                              checked:true
                                                              
                                                              });
                       	  	playerList.addChild(li);
                       	  	window.playerSet["s"+player["account"]]=true;
                       	  	
                       	  }
                       	  
                       	  else{
                       	  	li.set("icon", status);
                       	  }

                       }
                       
                       
                       
                       //clear up deleted ones
                       for(var playerId in window.playerSet){
                       	   if(!(playerId in newPlayerSet)){
                       	   	   //alert(playerId+"is gone!");
                       	   	   
                       	   	   registry.remove(playerId);
                       	   	   $("#"+playerId).remove();
                       	   	   delete window.playerSet[playerId]

                       	   }
                       }
                       
                       if(window.justCreatePlayer){
                       	 //alert("justPlayer");
                       	 rememberSelectPlayers();
                       	 window.justCreatePlayer=false;
                       }  
                    }
                 });
        		
        	}

		    hidemenu();
        	
        	checkCookie();
        	
        	// select player transition
            on(selectPlayerView, "beforeTransitionIn",
                
                function () {
                    //alert("Transition in!");
                    updatePlayers();
                    
            });
        	
        	
        	
        	on(selectPlayerView, "beforeTransitionOut",
        	   function(){
                   rememberSelectPlayers()
        	   });
        	
        	
        	on(imageView, "beforeTransitionIn",
                
                function () {
                    //alert("Transition in!");    
					hidemenu();					
                    if(window.justLogin){
                    	updateImages(0);
                    	dojo.io.script.get({
                    		url: base + "getSelectedPlayers?email="+window.email,
                    		callbackParamName: "callback",
                    		load: function (result) {
                    			if(result["Status"]=="success"){
                    				var selectedPlayers = {};
                    				for(var i in result["selectedPlayers"]){
                    					selectedPlayers[result["selectedPlayers"][i]]=1;
                    					//alert(result["selectedPlayers"][i]);
                    				}
                    				
                    				updatePlayers(selectedPlayers);
                    			
                    			}
                    	    }
                    	});
                    }
                    else if(window.justCreatePlayer){
                    	updatePlayers();
                    	updateImages(0);                      
                    }
            });
            
            
            on(selectCatView, "beforeTransitionIn",
                
                function () {
                    //alert("Transition in!");
					hidemenu();
                    updateCats();
					
            });
            
            on(selectListView , "beforeTransitionIn",
                
                function () {
		    	dijit.registry.byId("PlaylistHeader").set("label",currCat);
				hidemenu();
                    //alert("Transition in!");
                    if(window.currCat == null){
                    	window.currCat = "Top Lists";
                    	updateLists(window.currCat);
                    }
                    

            });
        	
            
            on(addUserView, "beforeTransitionIn",
                function () {
                //alert ("adduser transitionin");
                   updateOwnedPlayers();
            });
        	
           on(removePlayerView, "beforeTransitionIn",
                function () {
                   updateRemovePlayers();
                }
           );        	

        	

           connect.subscribe("/dojox/mobile/viewChanged", function (view) {

               //alert(view);
                //
               // alert(view.getChildren()[0]['alt']);
               
               if((view+"").split(', ')[1][0]=='I')
                    return;
               
                window.currImage = view.getChildren()[0]['alt'];
                if((!window.foundIndex)&&(window.currImage!=window.tarImage)){
           	    	view.goTo(1);
           	    	return;
           	    }
           	    
           	    window.foundIndex = true;
                window.currImage = view.getChildren()[0]['alt'];
                
					dijit.registry.byId("ImageViewHeader").set("label",imageMap[currImage]["Artist First N"] + " " +imageMap[currImage]["Artist Last N"]);
                    metaPlane3.innerHTML = "<b>" + imageMap[currImage]["Title"].replace("'", "", "") + "</b>" +" " +  imageMap[currImage]["Year"] ;
                    metaPlane4.innerHTML = imageMap[currImage]["Artist First N"] + " " +imageMap[currImage]["Artist Last N"] ;
                    if ( imageMap[currImage]["Width cm"] > 0)   
                       		metaPlane5.innerHTML = imageMap[currImage]["Type"] + " " + imageMap[currImage]["Width cm"] + "x" + imageMap[currImage]["Height cm"] + "cm" ;
                    else
                        	metaPlane5.innerHTML = imageMap[currImage]["Type"] + " " + imageMap[currImage]["Width Px"] + "x" + imageMap[currImage]["Height Px"] + "px" ;
                       // metaPlane5.innerHTML = imageMap[currImage]["Type"] + " " + imageMap[currImage]["Dimensions"];
                       // metaPlane7.innerHTML = imageMap[currImage]["Dimensions"];
                       metaPlane6.innerHTML = imageMap[currImage]["Location"];
                         if (imageMap[currImage]["More Info Link"] )
                    {
                            if (imageMap[currImage]["More Info Link"].substring(0,4) == "http" )                  
                                    metaPlane7.innerHTML = "<a href=" + imageMap[currImage]["More Info Link"] + " >More Info</a>";
                            else
                                    metaPlane7.innerHTML = "<a href=http://" + imageMap[currImage]["More Info Link"] + " >More Info</a>";
                     }
                     else
                                     metaPlane7.innerHTML = "";
                  //  alert(imageMap[currImage]["Type"]+" "+ imageMap[currImage]["Width cm"]  )   ;
              //  metaPlane1.innerHTML = imageMap[view.getChildren()[0]['alt']]["Medium"] + ", " + imageMap[view.getChildren()[0]['alt']]["Year"] + ", " + imageMap[view.getChildren()[0]['alt']]["Dimensions"];
              //  metaPlane2.innerHTML = imageMap[view.getChildren()[0]['alt']]["Location"];
                for (var player in window.playerSet) {
                    if (window.playerSet[player]) {
                    	//alert(window.fill);
                        dojo.io.script.get({                        	
                            url: base + "update.json?snumber=" + player.substring(1) + "&imageID=" + view.getChildren()[0]['alt']+"&stretch="+window.fill+
                            "&email="+window.email+"&list="+window.currList+"&cat="+window.currCat,
                            callbackParamName: "callback",
                            load: function (result) {
                            	//alert(base + "update.json?snumber=" + player.substring(1) + "&imageID=" + view.getChildren()[0]['alt']+"&stretch="+window.fill);

                            }
                        });

                    }
                }
                

            });


     
        	
       //sliderReady();
        	
        	
        	
        	
        	
        });
});
     
     
     
     
     
function login() {
    //alert("login!");
    var base = "http://evening-garden-3648.herokuapp.com/client/";
    var currView = dijit.registry.byId("Login");
    dojo.io.script.get({
        url: base + "verifyUser?email=" + dojo.byId("loginEmail").value,
        callbackParamName: "callback",
        load: function (result) {
            //alert(result["message"]);
            if (result["status"] == "success") {
                userObj = result["userObj"];
                alert("Welcome! " + userObj["name"]);
                window.email = dojo.byId("loginEmail").value.replace(/^\s\s*/, '').replace(/\s\s*$/, '').toLowerCase();
                //alert(window.email);
                setCookie("email",window.email,365);
                currView.performTransition("ImageView", 1, "slide", null);
            } else {
                alert("login failed, please check your email and password or register!");
            }
        }
    });
}

function goToReg() {
    var currView = dijit.registry.byId("Login");
    currView.performTransition("registeruser", 1, "slide", null);
}

function goToresetpassword() {
    var currView = dijit.registry.byId("Login");
    currView.performTransition("reset_password", 1, "slide", null);
}
function showviewlistmenu()
{
            var menulist=dijit.registry.byId("Viewlistmenu");
		
            
		     if (window.viewmenushow || window.systemmenushow){
			        hidemenu();
			}
			else{
			        menulist.show();window.viewmenushow=true;
			}
}
function showviewlistmenu2()
{
            var menulist=dijit.registry.byId("Viewlistmenu2");
		
            
		     if (window.viewmenushow2 || window.systemmenushow2){
			        hidemenu();
			}
			else{
			        menulist.show();window.viewmenushow2=true;
			}
}
function showsystemmenu()
{
            var menulist=dijit.registry.byId("Systemmenu");
		
            
		     if (window.systemmenushow){
			        hidemenu();
			}
			else{
			        menulist.show();window.systemmenushow=true;
			}
}
function showsystemmenu2()
{
            var menulist=dijit.registry.byId("Systemmenu2");
		
            
		     if (window.systemmenushow2){
			        hidemenu();
			}
			else{
			        menulist.show();window.systemmenushow2=true;
			}
}
function hidemenu()
{
	
              var syslist=dijit.registry.byId("Systemmenu");
              var menulist=dijit.registry.byId("Viewlistmenu");
			  var syslist2=dijit.registry.byId("Systemmenu2");
              var menulist2=dijit.registry.byId("Viewlistmenu2");
 			  menulist.hide();
			  syslist.hide();
			  menulist2.hide();
			  syslist2.hide();
			  window.systemmenushow=false;
			  window.viewmenushow=false;
			  window.systemmenushow2=false;
			  window.viewmenushow2=false;


}
function goToLogin1() {
    var currView = dijit.registry.byId("Intro0");
    var mycurrView = currView.getShowingView()
    mycurrView.performTransition("Login", 1, "slide", null);
}

function dologout(){

var currView = dijit.registry.byId("LogOff");
    window.email=null;
// code to delete cookie and log out user goes here
    setCookie("email",null,1)
    currView.performTransition("Login", 1, "slide", null);
    cleanUp();


}

function regnewroku(){
var currView = dijit.registry.byId("registernewplayer");

// processes register new roku button
    currView.performTransition("registernewroku", 1, "slide", null);
    
}

function installartkick(){
//alert ("install artkick");
var win=window.open("https://owner.roku.com/add/ArtkickV0", '_blank');
win.focus();

}

function goToReg1() {
    var currView = dijit.registry.byId("Intro0");
    var mycurrView = currView.getShowingView()
    mycurrView.performTransition("registeruser", 1, "slide", null);
}

function notimplemented(){
alert("Feature not yet implemented");
hidemenu();
}

function createUser() {
    var currView = dijit.registry.byId("registeruser");
    var base = "http://evening-garden-3648.herokuapp.com/client/";

    dojo.io.script.get({
        url: base + "regUser?email=" + dojo.byId("regUserEmail").value + "&name=" + dojo.byId("regUserName").value,
        callbackParamName: "callback",
        load: function (result) {
            if (result["status"] == "success") {
                alert("Welcome " + dojo.byId("regUserName").value + "!");
                currView.performTransition("ImageView", 1, "slide", null);
                window.email = dojo.byId("regUserEmail").value.replace(/^\s\s*/, '').replace(/\s\s*$/, '').toLowerCase();
                //alert(window.email);
            } else {
                alert(result["message"]);
            }

        }
    });

}



function removePlayersAction(){
    var r=confirm("Are you sure you want to delete the selected players?");
    if (r==false) {
         return;
    }
     var base =  "http://evening-garden-3648.herokuapp.com/player/";
     var currView = dijit.registry.byId("removeplayer");
     var i = 0;
     for(var key in window.removePlayers){
          if(window.removePlayers[key]){
               i++;
          }
     }
     for(var key in window.removePlayers){
           if(window.removePlayers[key]){
                    dojo.io.script.get({
                       url:base+"removePlayer?email="+window.email+"&playerId="+key,
                       callbackParamName: "callback",
                       load:function(result){
                           alert(result["Message"]);
                           i--;
                           if(i==0){
                                currView.performTransition("select_player", 1, "slide", null);
                           }
                       }
                    });
           }

     }     
}



function addUserToPlayers(){
     var email= dojo.byId("addPlayerEmail").value;
     
     var base =  "http://evening-garden-3648.herokuapp.com/player/";
     for(var key in window.ownedPlayers){
           if(window.ownedPlayers[key]){
                    dojo.io.script.get({
                       url:base+"addUserToPlayer?email="+email+"&playerId="+key,
                       callbackParamName: "callback",
                       load:function(result){
                           alert(result["Message"]);
                       }
                    });
           }

     }
}



function searchUser() {
    var email= dojo.byId("addPlayerEmail").value;
    //alert(email);
    var base =  "http://evening-garden-3648.herokuapp.com/player/";
    dojo.io.script.get({
          url:base+"getUser?email="+email,
          callbackParamName: "callback",
          load:function(result){
              alert(result["Message"]);
          }
    });
}



function setAuto(interval) {
    var base =  "http://evening-garden-3648.herokuapp.com/client/";
    for(var player in window.playerSet){
        if(window.playerSet[player]){
        	  //alert(base+"setAuto?email="+window.email+"&snumber="+player.substring(1)+"&autoInterval="+interval);
        	  dojo.io.script.get({
              url:base+"setAuto?email="+window.email+"&snumber="+player.substring(1)+"&autoInterval="+interval,
              callbackParamName: "callback",
              load:function(result){
              }
            });
        	
        }

    	
    }

}



function createPlayer() {
    var currView = dijit.registry.byId("registernewroku");
    var base = "http://evening-garden-3648.herokuapp.com/reg/";
    //alert(base + "userReg?regCode=" + dojo.byId("regPlayerCode").value + "&nickname=" + dojo.byId("regPlayerName").value + "&email=" + window.email);
    dojo.io.script.get({
        url: base + "userReg?regCode=" + (dojo.byId("regPlayerCode").value).toLowerCase() + "&nickname=" + dojo.byId("regPlayerName").value + "&email=" + window.email,
        callbackParamName: "callback",
        load: function (result) {
            if (result["Status"] == "success") {
                alert("Player " + dojo.byId("regPlayerName").value + " is now registered!");
                window.tarImage = "956";
                window.currList = "155";
                window.currCat = "Top Lists";
                window.justCreatePlayer=true;
                currView.performTransition("ImageView", 1, "slide", null);                
                
                
                
            } else {
                alert(result["Message"]);
            }

        }
    });
}

function fillswitch(){
	 //alert(window.fill);
     if(window.fill){
          window.fill = false;
     }
     else{
          window.fill = true;
     }
     //alert(window.fill);
}



function setCookie(c_name,value,exdays){
     var exdate=new Date();
     exdate.setDate(exdate.getDate() + exdays);
     var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
     document.cookie=c_name + "=" + c_value;
}



function cleanUp(){
	        window.foundIndex = false;
	        window.selectedPlayers = {};
            window.justLogin = true;
            window.imageMap = {};
            window.email = null;
            window.fill = false;
            window.ownedPlayers={};
            window.removePlayers={};
            window.playerSet = {};
            window.currList = null;
            window.currImage = null;
            window.currCat = null;
            window.owndedPlayers={};
            window.removePlayers={};
			window.menushow=false;
			window.justCreatePlayer=false;
            $("#addPlayerEmail").attr('value','');
}




function sendfeedback() {
//var currView = dijit.registry.byId("Feedback");
  window.location="mailto:feedback@artkick.com?Subject=Artkick%20feedback";
  //  win.focus();
    currView.performTransition("ImageView", 1, "slide", null);
}





 