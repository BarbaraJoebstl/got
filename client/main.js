/* use the ip if you want to connect from mobile */
var socket = io.connect('http://localhost:1337', {'forceNew': true});

socket.on('game', function(data){
    render(data);
});

socket.on('info', function(data) {
    renderInfo(data);
});

function render(data){
    
    if(data.numbers) {
  toggleButton = document.getElementById("submit-operator");
    if(data.isPlaying && data.isPlaying === socket.id) { 
        toggleButton.disabled = false;
    } else {
        toggleButton.disabled = true;
    }


    var move = data.numbers.map(function(number, index){
        return(`
            <div class="number">
                <div>${number}</div>
            </div>
        `)
    }).join(' ');

    var div_play = document.getElementById('playground');
    div_play.innerHTML = move;
    div_play.scrollTop = div_play.scrollHeight; 
}
 }

function nextMove(){
    var e = document.getElementById("operator-list");
    var data = e.options[e.selectedIndex].value;

    socket.emit('next-move', data);
}

function renderInfo(data){
    var div_info = document.getElementById('info-box');
    div_info.innerHTML = data;
}
