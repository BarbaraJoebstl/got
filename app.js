var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');

});
app.use('/client', express.static(__dirname + '/client'));
server.listen(1337);

var SOCKET_LIST = {};
var players = [];
var NUMBER_LIST = [];

var io = require('socket.io')(server, {});
io.sockets.on('connection', function (socket) {
    //assign id to each socket
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    players.push(socket.id);

    socket.on('startGame', function (data) {
        console.log('SOCKET ID', socket.id);
        console.log('PLAYER NUMBER', Object.keys(SOCKET_LIST)[0])
        console.log(Object.keys(SOCKET_LIST).length);
        if (players.length === 1) {
            socket.emit('info', {
                msg: 'Hello - lets wait for a second gamer',
                numberList: NUMBER_LIST
            })
        }
        else if (players.length === 2) {
            var randomNumber = Math.floor(Math.random() * (21 - 2 + 1)) + 2;
            NUMBER_LIST.push(randomNumber);
            socket.emit('info', {
                msg: 'Hello - you start',
                numberList: NUMBER_LIST
            })
        } else {
            socket.emit('info', {
                msg: 'Sorry there are already two guys playing...you can watch',
                numberList: NUMBER_LIST
            })
        }
    });

    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
    });

    socket.on('calc', function (data) {
        console.log(NUMBER_LIST[NUMBER_LIST.length - 1])
        newNumber = (NUMBER_LIST[NUMBER_LIST.length - 1]) + data.modifier / 3
        if (newNumber != 1) {
            NUMBER_LIST.push(data.modifier);
            NUMBER_LIST.push(newNumber);
            socket.emit('updateNumberList', {
                msg: 'go on',
                numberList: NUMBER_LIST
            })
        } else {
            socket.emit('updateNumberList', {
                msg: 'YOU ARE A WINNER',
                numberList: NUMBER_LIST
            })
        }
    });

});

