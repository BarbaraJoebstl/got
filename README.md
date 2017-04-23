## Game of Three
When a player starts, it incepts a random (whole) number and sends it to the second player as an approach of starting the game.
The receiving player can now always choose between adding one of {-1, 0, 1} as an operator to get to a number that is divisible by 3. Divide it by three. The resulting whole number is then sent back to the original sender. The player who calculates 1 is the winner.

### run app in dev mode
- run `npm install` to install the needed packages
- run `node start` to start the app with nodemon - this will watch for changes and update automatically

the app can be reached at [localhost:1337](https://localhost:1337) 
-- you can change the IP in the client/main.js in order to connect with other devices
-- recommended browser: chrome

### packages used
 - express: Node.js web application framework
 - socket.io: WebSocket API
 - nodemon: used for development

### possible next steps
 - error handling, if one player leaves an ongoing game
 - enable multiple games: for every 2 players open a new "room" and start a new game
 - improve ux
