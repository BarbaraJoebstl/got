## Game of Three
When _Player A_ starts a random whole number is generated and the player can  choose between adding one of {-1, 0, 1} as an operator to get to a number that is divisible by 3. The number is divided it by three. The resulting whole number is then sent to player B. Player B repeats those step. The player who calculates 1 is the winner.

### Implementation 
As the game requires communication between the players, a server is needed. The choosen technolog is [socket.io](https://socket.io/), because it enables real time networking and supports web sockets and works well with the webframework [Express](https://expressjs.com/).
Because the game is a small application the logic for the server and client is written in _vanilla js_. For the styling _CSS3_ without any preprocessors is used.

On init a game object is created. A game object consists of two players, an operator array, and the current player id. A player consits of a numbers array (holding the players numbers), a name, an id and an _isPlaying_ flag (to handle style issues in the web interface easily).
This design is chosen in order to enable multiple games later on.

### Sketch


### Features
- **Notification Area.** The web interface has a notifiaction area on top, to inform the player who is on the move. 
- **First player.**: A player can start the game even if there is no second player (yet) connected.
- **Operators.**: The operator buttons are disabled, if the the player is not on the move.
- **Third player.**: If a third player connects, an info message is displayed and the third player can watch the game. Audio is also provided and the players can pause the music.
- **Responsive Design.**

### Run app in dev mode
- run `npm install` to install the needed packages
- run `node start` to start the app with nodemon - this will watch for changes and update automatically

the app can be reached at [localhost:1337](https://localhost:1337) 

- you can change the IP in the client/main.js in order to connect with other devices
- recommended browser: chrome

### Packages used
 - [Express](https://expressjs.com/): Node.js web application framework
 - [socket.io](https://socket.io/): WebSocket API
 - [nodemon](https://nodemon.io/): used for development

### Possible next steps
 - error handling, if one player leaves an ongoing game
 - enable multiple games: for every 2 players open a new "room" and start a new game
 - improve ux
