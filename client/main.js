/* use the ip if you want to connect from mobile */
var socket = io.connect('http://localhost:1337', {'forceNew': true});

socket.on('game', function(data){
    render(data);
});

socket.on('info', function(data) {
    renderInfo(data);
});

function render(data){
    var elems = document.getElementsByTagName('button');
    var len = elems.length;

    if(data.isPlaying && data.isPlaying != socket.id) { 
for (var i = 0; i < len; i++) {
    elems[i].disabled = true;
}   
 } else {
for (var i = 0; i < len; i++) {
    elems[i].disabled = false;
}      }

    if (data.playerB.numbers && data.playerA.numbers && data.operators){
    
    var playerA = data.playerA.numbers.map(function(numberA, index){
           return(`<div><div>${numberA}</div></div>`)
    }).join(' ');

    var operator_ = data.operators.map(function(operator, index){
        return(`<div><div>${operator}</div></div>`)
    }).join(' ');

   var playerB = data.playerB.numbers.map(function(numberB, index){
           return(`<div><div>${numberB}</div></div>`)
    }).join(' ');

    var div_playerA = document.getElementById('container-a');
    div_playerA.innerHTML = playerA;

    var div_operators = document.getElementById('container-operator');
    div_operators.innerHTML = operator_;

    var div_playerB = document.getElementById('container-b');
    div_playerB.innerHTML = playerB;

    var div_play = document.getElementById('playground');
    div_play.scrollTop = div_play.scrollHeight; 
    }
 }

function nextMove(operator){
    socket.emit('next-move', operator);
}

function renderInfo(data){
    var div_info = document.getElementById('info-box');
    div_info.innerHTML = data;
}
