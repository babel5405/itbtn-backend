const APP = require('express')();
const HTTP = require('http').Server(APP);
const IO = require('socket.io')(HTTP);
const MYSQL = require('mysql')
let Pool = require('./classes/Mysql');

var createQuery = "CREATE TABLE IF NOT EXISTS ?? (target VARCHAR(50), count INT, Unique Key (target));";
var insertQuery = "INSERT INTO ?? (target, count) VALUES (?, 1) ON DUPLICATE KEY UPDATE count = count + 1;";
var updateQuery = "SELECT `count` FROM ?? WHERE target = ?";

APP.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

IO.on('connection', function(socket) {
    socket.on('initialized', function(data) {
        try {
            var createInserts = [data];
            var updateInserts = [data.button, data.target];
            Pool.Query(MYSQL.format(createQuery, createInserts));
            console.log("updated")
            Pool.Query(MYSQL.format(updateQuery, updateInserts), function(results, fields) {
                IO.emit('cursed', { cursed: {curse: data.button, target: data.target}, count: results[0].count});
            });
        } catch(e) {

        }
        
    });
    
    socket.on('curse', function(data){
        try {
            var insertInserts = [data.button, data.target];
            var updateInserts = [data.button, data.target];
            Pool.Query(MYSQL.format(insertQuery, insertInserts), function() {
                Pool.Query(MYSQL.format(updateQuery, updateInserts), function(results, fields) {
                    IO.emit('cursed', { cursed: {curse: data.button, target: data.target}, count: results[0].count});
                    IO.emit('chat message', data.button + " it " + data.target);
                });
            });
        } catch (e) {
            console.log(e)
            IO.emit('blessed', data);
        }
        
  });
});

HTTP.listen(3000, function(){
  console.log('listening on *:3000');
});
