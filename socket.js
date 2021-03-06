const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const { generateMessage } = require('./client/sms/src/components/Chat/GenerateMessage')

var urlServer = null, connectionCount = 0, playStateServer = true, playedTimeServer = 0; // URL server has the URL of the existing session
let connectedUsers = []
let messages = []


io.on('connection', (socket) => {
    connectedUsers = [...connectedUsers, socket.id]
    connectionCount = connectionCount + 1;
    console.log('New WebSocket connection')

    socket.broadcast.emit("message", { text: "A new user has joined!" })

    socket.on('message', (message) => {
        messages.push(message)
        console.log('server', message, generateMessage(message, socket.id))
        io.emit("message", generateMessage(message, socket.id))
    })

    socket.on('playPause', (playState) => {
        playStateServer = playState
        //Same playPause state is broadcasted to everyone in that socket
        socket.broadcast.emit('playState', playState)
    })

    socket.on('url', (url) => {
        urlServer = url
        //Same URL is broadcasted to everyone in that socket
        socket.broadcast.emit('updateURL', url)
    })

    //It is listening only from host
    socket.on('onProgress', (state) => {
        playedTimeServer = state.played
        //If user stops the video and host is still playing, to sync it with the host we are doing this
        socket.broadcast.emit('sync', { played: state.played, url: urlServer })
    })

    //This will keep the new users joining existing session updated with the URL
    socket.emit('newConnection', { url: urlServer, playStateServer: playStateServer })


    socket.on('disconnect', () => {
        connectionCount = connectionCount - 1;
        connectedUsers = connectedUsers.filter(id => {
            id !== socket.id
        })
        console.log("Disconnected")
        if (connectionCount === 0) {
            // If there are no users in the session, on new connection again the URL is set to null
            urlServer = null;
            playedTimeServer = 0
            playStateServer = true

        }
    })
})

module.exports = { io, server, app }