var mongodb = require("mongodb");  
var server = new mongodb.Server('localhost',27017,{auto_reconnect:true});  
var db = new mongodb.Db("WebIM",server,{safe:false});  
module.exports = db;