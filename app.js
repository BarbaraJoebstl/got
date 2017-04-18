var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');

});
app.use('/client', express.static(__dirname + '/client'));
server.listen(1337);

//create a list of players
//limit them to two.
var SOCKET_LIST = {};
var PLAYER_LIST = {};

var Player = function (id) {
    var self = {
        id: id,
        number: "" + Math.floor(10 * Math.random()),
        numbers: []
    }
}
var io = require('socket.io')(server, {});
io.sockets.on('connection', function (socket) {
    //assign id to each socket
    socket.id = Math.random();
    socket.currentNumber;
    SOCKET_LIST[socket.id] = socket;
    var player = Player(socket.id);
    PLAYER_LIST[socket.it] = player;

    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    })

    socket.on('startGame', function (data) {
        console.log(data.number);
        socket.currentNumber = data.number;
        console.log('SOCKET ID', socket.id);
        console.log('CURRENT NUMBER', socket.currentNumber);
        socket.currentNumber = socket.currentNumber / 3;
    });

    socket.emit('updateNumbers', {
        numbers: 'number'
    });

    socket.on('newNumber', function (data) {
        console.log(data.newNumber);
        number = number / 3;
        console.log('new number', number);
        for (var j in SOCKET_LIST) {
            var socket = SOCKET_LIST[j];
            socket.emit('updateNumbers', {
                numbers: number
            });
        }
    });
});
