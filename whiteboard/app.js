const express = require('express')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

app.use(express.static(__dirname + '/public'))

io.on('connection', function(socket){
    console.log('a user connected')

    socket.on('drawing', function(data){
        socket.broadcast.emit('drawing', data)
    })

    socket.on('disconnect', function(){
        console.log('a user disconnected')
    })
})

server.listen(8080, function(){
    console.log('server on localhost:8080')
})

