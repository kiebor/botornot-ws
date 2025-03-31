import express, { Request, Response } from 'express';
import { Game } from './types/Game';
import { randomUUID } from 'crypto';
const http = require('http');
const socketio = require('socket.io');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

const PLAYER_PER_ROOM = 2;
let gameList: Game[] = [];

app.get('/', (_: any , res : any) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/join-game', (_: Request, response: Response<Game>) => {
  console.log('Join game called')
  let gameDetails: Game;
  if (gameList.length == 0) {
    console.log('No game were found, creating a new one...');
    // Create a new game
    gameDetails = { roomId: randomUUID(), players: [] }
    gameList.push(gameDetails);
  } else {
    gameDetails = gameList[0];
    console.log('No need to create a new game, sending the game token')
  }
  
  response.json(gameDetails);
});

io.on('connection', (socket: any) => {
  console.log('a user connected => ');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('room:join', (msg: any) => {
    console.log(msg);
    console.log('new player joined the room');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
