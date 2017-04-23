var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('client'));

app.get('/got', function(req, res){
    res.status(200).send('nothing happens here...');
});

function Player(id, name, numbers, isPlaying){
    this.id = id;
    this.name = name;
    this.numbers = numbers;
    this.isPlaying = isPlaying;
}

function Game(playerA, playerB, numbers, operators, movingPlayerId) {
    this.playerA = playerA;
    this.playerB = playerB;
    this.operators = operators;
    this.movingPlayerId = movingPlayerId;
}

players = [];
game = new Game();
var randomNumber = Math.floor(Math.random() * (21 - 2 + 1)) + 2;
var newNumber = 0;
var info = ' ';

function executeNextMove(movingPlayer, waitingPlayer) {
    number = waitingPlayer.numbers[waitingPlayer.numbers.length-1];
    operator = game.operators[game.operators.length-1];
    newNumber = calcNewNumber(number, operator);
    movingPlayer.numbers.push(newNumber);
    movingPlayer.isPlaying = false;
    waitingPlayer.isPlaying = true;

    game.movingPlayerId = waitingPlayer.id;
    info_waiting = '...waiting for ' + waitingPlayer.name + ' to a move!';
    info_moving = 'Please make a move ' + waitingPlayer.name + '!'
    
    io.sockets.connected[movingPlayer.id].emit('info', info_waiting);

    if(waitingPlayer.id != 'notAvailable') {
        io.sockets.connected[waitingPlayer.id].emit('info', info_moving);
    }
    io.sockets.emit('game', game);
}

function calcNewNumber(number, operator){
    newNumber = (number + operator) / 3;
    return Math.round(newNumber);
};

function getCurrentPlayerName(game) {
    return (game.movingPlayerId === game.playerA.id) ? game.playerA.name : game.playerB.name;
}

function togglePlayer() {
     game.movingPlayerId === game.playerA.id ? game.playerA.id : game.playerB.id; 
}
 
io.on('connection', function(socket){
    players.push(socket);

    if(players.length === 1){   
        player = new Player(socket.id, 'Player A', [], true);
        game.playerA = player;
        game.playerB = new Player('notAvailable', 'Player B', [randomNumber], false);
        game.movingPlayerId = game.playerA.id;
        game.operators = [];
        info = 'Hi Player A, please make a move.'
        io.sockets.connected[socket.id].emit('info', info);
        //emit game user only to our first player
        io.sockets.connected[socket.id].emit('game', game);
    } else if(players.length === 2) {
        game.playerB.id = socket.id;
        if(game.movingPlayerId === game.playerA.id) {
            info = 'Hi Player B! ...waiting for Player A';
        } else {
            info = 'Hi Player B! Please make a move.';
            game.movingPlayerId = game.playerB.id;
        }
       
        io.sockets.connected[socket.id].emit('info', info);
        io.sockets.emit('game', game);
    } else {
         info = "Sorry, there are already two guys playing...!"
        io.sockets.connected[socket.id].emit('info', info);
        io.sockets.emit('game', game);
    };

    socket.on('next-move', function(data){ 
        game.operators.push(parseInt(data));
        if(game.movingPlayerId === game.playerA.id) {
            executeNextMove(game.playerA, game.playerB);
        } else {
            executeNextMove(game.playerB, game.playerA);
        }
        if (newNumber === 1) {
            //because movingPlayerId was just switched
            if (game.playerB.id.match(game.movingPlayerId)){
                info = "The winner is Player A";
            } else {
                info = "The winner is Player B";
            }
            io.sockets.emit('info', info);
            //io.close();
        }
    });

    socket.on('disconnect', function() {
        //remove player from list
        var index = players.indexOf(socket);
        if (index != -1) {
            players.splice(index, 1);
        }
        //TODO error handling for game
        //io.close();
    });
});

server.listen(1337, function(){
    console.log('server running');
});

