/* use the ip if you want to connect from mobile */
var socket = io.connect('http://localhost:1337', { 'forceNew': true });

socket.on('game', function (data) {
    render(data);
});

socket.on('info', function (data) {
    renderInfo(data);
});

function render(data) {
    var movingPlayer;
    var waitingPlayer;

    //get all operator buttons
    var button = document.getElementsByTagName('button');
    var buttonList = Array.prototype.slice.call(button);

    //set styling for moving player
    if (data.playerA.isPlaying) {
        movingPlayer = document.getElementById('player-a');
        waitingPlayer = document.getElementById('player-b');
    } else {
        movingPlayer = document.getElementById('player-b');
        waitingPlayer = document.getElementById('player-a');
    }
    movingPlayer.className = 'active';
    waitingPlayer.className = '';

    if (data.movingPlayerId === socket.id) {
        buttonList.forEach(function (button) {
            button.disabled = false;
        });
    } else {
        buttonList.forEach(function (button) {
            button.disabled = true;
        });
    }

    if (data.playerB.numbers && data.playerA.numbers && data.operators) {

        var playerA = data.playerA.numbers.map(function (numberA, index) {
            return (`<div><div>${numberA}</div></div>`)
        }).join(' ');

        var operator = data.operators.map(function (operator, index) {
            return (`<div><div>${operator}</div></div>`)
        }).join(' ');

        var playerB = data.playerB.numbers.map(function (numberB, index) {
            return (`<div><div>${numberB}</div></div>`)
        }).join(' ');

        var div_playerA = document.getElementById('container-a');
        div_playerA.innerHTML = playerA;

        var div_operators = document.getElementById('container-operator');
        div_operators.innerHTML = operator;

        var div_playerB = document.getElementById('container-b');
        div_playerB.innerHTML = playerB;

        var div_play = document.getElementById('playground');
        div_play.scrollTop = div_play.scrollHeight;
    }
}

function nextMove(operator) {
    socket.emit('next-move', operator);
}

function renderInfo(data) {
    var div_info = document.getElementById('info-box');
    div_info.innerHTML = data;
}

function toggleAudio() {
    var sound = document.getElementById("sound");
    return sound.paused ? sound.play() : sound.pause();
}
