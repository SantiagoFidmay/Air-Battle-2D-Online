const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
 
const app = express();
const server = http.createServer(app);
const io = new Server(server);
 
app.use(express.static('public'));
 
const rooms = {};
 
io.on('connection', (socket) => {
    console.log('Jogador conectado:', socket.id);
 
    socket.on('joinRoom', (roomId) => {
        if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter(id => io.sockets.sockets.has(id));
        }
        if (!rooms[roomId]) rooms[roomId] = [];
 
        if (rooms[roomId].length >= 2) {
            socket.emit('roomFull');
            return;
        }
 
        rooms[roomId].push(socket.id);
        socket.join(roomId);
        socket.data.roomId = roomId;
 
        const playerNumber = rooms[roomId].length;
        socket.emit('playerAssigned', playerNumber);
        console.log(`Jogador ${playerNumber} entrou na sala "${roomId}"`);
 
        if (rooms[roomId].length === 2) {
            io.to(roomId).emit('gameStart');
        }
    });
 
    // Repassa posição + pontos + vida do jogador para o oponente
    socket.on('playerMove', ({ roomId, x, y, dir, pontos, vida }) => {
        socket.to(roomId).emit('opponentMove', { x, y, dir, pontos, vida });
    });
 
    socket.on('playerShoot', ({ roomId }) => {
        socket.to(roomId).emit('opponentShoot');
    });
 
    // Inimigos — usa ID em vez de índice
    socket.on('spawnInimigo', (dados) => {
        socket.to(dados.roomId).emit('syncInimigo', dados);
    });
 
    socket.on('removeInimigo', ({ roomId, id }) => {
        socket.to(roomId).emit('syncRemoveInimigo', { id });
    });
 
    // Itens
    socket.on('spawnItem', (dados) => {
        socket.to(dados.roomId).emit('syncItem', dados);
    });
 
    // Boss — só P1 cria, sincroniza para P2
    socket.on('spawnBoss', (dados) => {
        socket.to(dados.roomId).emit('syncBoss', dados);
    });
 
    // Vida do boss — quem acertar sincroniza para o oponente
    socket.on('syncBossVida', ({ roomId, vida }) => {
        socket.to(roomId).emit('updateBossVida', { vida });
    });
 
    // Fundo intermediário
    socket.on('syncFundo', (dados) => {
        socket.to(dados.roomId).emit('syncFundo', dados);
    });
 
    socket.on('gameOver', ({ roomId, vitoria }) => {
        socket.to(roomId).emit('syncGameOver', { vitoria });
    });
 
    socket.on('disconnect', () => {
        console.log('Jogador desconectado:', socket.id);
        const roomId = socket.data.roomId;
        if (roomId && rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            } else {
                io.to(roomId).emit('opponentDisconnected');
            }
        }
    });
});
 
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));