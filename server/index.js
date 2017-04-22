var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('client'));

app.get('/got', function(req, res){
    res.status(200).send('Lets start to play');
});

function Player(id, name, numbers){
    this.id = id;
    this.name = name;
    this.numbers = numbers;
}

function Game(playerA, playerB, numbers, operators, isPlaying) {
    this.playerA = playerA;
    this.playerB = playerB;
    this.operators = operators;
    this.isPlaying = isPlaying;
}

function calcNewNumber(number, data){
    newNumber = (number + parseInt(data)) / 3;
    return newNumber;
};

function togglePlayer() {
      if(game.isPlaying){
            game.isPlaying = game.playerA.id ? game.playerA.id : game.playerB.id; 
        }
}

players = [];
game = new Game();
var randomNumber = Math.floor(Math.random() * (21 - 2 + 1)) + 2;
var newNumber = 0;

io.on('connection', function(socket){
    players.push(socket);

    if(players.length === 1){   
        var info = "Hi. Please wait for the second player...";
        player = new Player(socket.id, 'Player A', []);
        game.playerA = player;
        game.playerB = new Player();
        io.sockets.connected[socket.id].emit('info', info);
        io.sockets.emit('game', game);
    } else if(players.length === 2) {  
        var info = "Let's start. Its your turn, Player B";
        numbers = [randomNumber];
        var player = new Player(socket.id, 'Player B', numbers);
        game.playerB = player;
        game.isPlaying = game.playerB.id;
        game.operators = [];
    
        io.sockets.connected[socket.id].emit('info', info);
        io.sockets.emit('game', game);
    } else {
        var info = "Sorry, there are already two guys playing...!"
        io.sockets.connected[socket.id].emit('info', info);
        io.sockets.emit('game', game);
    };

    socket.on('next-move', function(data){ 
        game.operators.push(data);
        //get current player
        if(game.isPlaying === game.playerA.id) {
            number = game.playerA.numbers[game.playerA.numbers.length-1];
            newNumber = calcNewNumber(number, data);
            game.playerB.numbers.push(newNumber);
            togglePlayer();
        } else {
             number = game.playerB.numbers[game.playerB.numbers.length-1];
            newNumber = calcNewNumber(number, data);
            game.playerA.numbers.push(newNumber);
            togglePlayer();
        }
        info = "It's on!";
        io.sockets.connected[game.playerA.id, game.playerB.id].emit('info', info);
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

