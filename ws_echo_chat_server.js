/* Google Developer Group - Pretoria, South Africa
	Event: GDG-Pretoria Bi-Weekly Tech Talk Session
	Hosted vy GeeKulcha, mLab Southern Africa, Pretoria, South Africa
	Date: 6 June, 2014
	Author: Ishmael Makitla, GDG-Pretoria Lead: 

  */

var express = require('express');
var http = require('http');
var sockjs = require('sockjs');
var fs = require('fs');



var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js", websocket:true};
//create a [web]socket server
var chatServer = sockjs.createServer(sockjs_opts);

console.log("sockjs options : "+JSON.stringify(sockjs_opts));

var server = http.createServer();
//handler to handle our normal http requests- in this example, we simply return static chat-page
server.addListener('request', function(req, res){		
  //this is necessary for us to render the static index.html page which acts as a client
  fs.readFile("index.html", "binary", function(err, file) {    
         if(err) {    
                     res.writeHeader(500, {"Content-Type": "text/plain"});    
                     res.write(err);    
                     res.end();                     
          }    
         else{  
                res.writeHeader(200);    
                res.write(file, "binary");    
                res.end();  
            }  
                       
    });  


});
//this bit will handle the HTTP-Upgrade to Websocket requests
server.addListener('upgrade', function(req, res){
	console.log('onUpgrade:::: ');
	res.send();
});
//with this configuration the clients must connect via websockets to "[ws://]ip-of-this-server:8081/dgd_pta_chat"
chatServer.installHandlers(server, {prefix:'/gdg_pta_chat', websocket:true});
server.listen(8081, '0.0.0.0');

//now the sockjs bit

//ideally, yuou'd want to change this into some array so you can have multiple connections
var connection;

chatServer.on('connection', function(remoteConnection){
	console.log("Connection open! :)");	
	//now register onData listener-method on this connection
	remoteConnection.on('data', function(incomingData){		
		console.log('OnData:'+ incomingData + " Connection : "+remoteConnection);
		//just echo the message back or do something useful
		var jsonPayload = JSON.parse(incomingData);
		jsonPayload.arrival = Date.now();
		remoteConnection.write(JSON.stringify(jsonPayload));
	});
	remoteConnection.write("hi there, thank you for connecting!");
});
