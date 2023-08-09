// const app = require('express')
// const http = require('http').Server(app)

// const io = require('socket.io')(http);

// io.on('connection', (socket: any) => {
//     console.log('A new client connected');
//     socket.on('joinCommunity', (data: any) => {
//         console.log('2')
//         io.emit('communityJoined', { userId: data.userId, communityId: data.communityId });
//     });
// });

// http.listen(3333, () => console.log('listening'))