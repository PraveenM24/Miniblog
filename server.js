var express = require("express");

var app = express();

var http = require("http").createServer(app);
var users = [];

global.fetch = require("node-fetch");

const io = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
});

io.on("connection", function(socket) {
    console.log("User connected", socket.id);

    // attach incoming listener for new user
    socket.on("user_connected", function(username) {
        // save in array
        users[username] = socket.id;

        // socket ID will be used to send message to individual person

        // notify all connected clients
        io.emit("user_connected", username);
    });

    // listen from client inside IO "connection" event
    socket.on("send_message", function(data) {
        // send event to receiver
        var socketId = users[data.receiver];

        io.to(socketId).emit("new_message", data);

        fetch('https://tpgitminiblog.herokuapp.com/messages', {
                method: 'POST',
                body: JSON.stringify({
                    sender: data.sender,
                    receiver: data.receiver,
                    message: data.message
                }),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
            })
            .catch(function(error) {
                console.log(error);
            });
    });
});




http.listen(3000, function() {
    console.log("Listening to port 3000");
});