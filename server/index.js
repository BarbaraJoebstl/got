var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('client'));

app.get('/got', function(req, res){
    res.status(200).send('Lets start to play');
});

function Player(id, name){
    this.id = id;
    this.name = name;
}

function Game(playerA, playerB, numbers, operators, isPlaying) {
    this.playerA = playerA;
    this.playerB = playerB;
    this.numbers = numbers;
    this.operators = operators;
    this.isPlaying = isPlaying;
}

players = [];
game = new Game();
var randomNumber = Math.floor(Math.random() * (21 - 2 + 1)) + 2;
var newNumber = 0;

io.on('connection', function(socket){
    players.push(socket);

    if(players.length === 1){   
        var info = "Hi. Please wait for the second player";
        player = new Player(socket.id, 'player1');
        game.playerA = player;
        io.sockets.connected[socket.id].emit('info', info);
        io.sockets.emit('game', game);
    } else if(players.length === 2) {  
        var info = "Let's start. Its your turn";
        var player = new Player(socket.id, 'player2');
        game.playerB = player;
        game.isPlaying = game.playerB.id;
        game.numbers = [];
        game.numbers.push(randomNumber);

        game.operators = [];
    
        io.sockets.connected[socket.id].emit('info', info);
        io.sockets.emit('game', game);
    } else {
        var info = "Sorry, there are already two guys playing. Watch and learn!"
        io.sockets.connected[socket.id].emit('info', info);
        io.sockets.emit('game', game);
    };

    socket.on('next-move', function(data){ 
        number = game.numbers[game.numbers.length-1];
        number = parseInt(number);
        operator = parseInt(data);
        newNumber = (number + operator) / 3;
        game.numbers.push(data);
        game.numbers.push(newNumber);

        if(game.isPlaying){
            game.isPlaying = game.playerA.id ? game.playerA.id : game.playerB.id; 
        }
    
        io.sockets.emit('game', game);
        if (newNumber === 1) {
            var info = "The winner is: " +  game.isPlaying.name;

            io.sockets.emit('info', info);
        }
    });

    socket.on('disconnect', function() {
        var index = players.indexOf(socket);
        //find player with socket.id and remove
        //TODO remove player from game
        if (index != -1) {
            players.splice(index, 1);
        }
    });
});

server.listen(1337, function(){
    console.log('server up');
});

