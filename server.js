const express = require("express"); // use the 'express' library to start the app server
const app = express(); // make a new app
const server = require("http").Server(app); // and create an http server for the app
const io = require("socket.io")(server); // then create a socket using that server that clients can connect to
const port = process.env.PORT || 3000; // specify the port where communication will happen

let waitingUser;

server.listen(port, () => {
  //set up server to listen on specified port
  console.log("server is listening on port " + port); // print to the server console to log that the server is running
});

app.use(express.static("public")); // make all the files in 'public' available

io.on("connection", (socket) => {

  socket.on("message", message => {
    let to = getRandomSocketId(socket.id);
    if(to){
      io.to(to).emit("message", message); // forward message to random user
    } else{
      socket.emit("error", "no connected users");
    }
  });

  // function to get a random socket id, excluding the current socket
  function getRandomSocketId(excludeSocketId) {
    // get all connected socket ids
    const connectedSocketIds = Array.from(io.sockets.sockets.keys());

    // filter out the requesting socket id
    const otherSocketIds = connectedSocketIds.filter(
      (id) => id !== excludeSocketId
    );

    // return null if no other sockets are available
    if (otherSocketIds.length === 0) return null;

    // Select a random ID from the remaining sockets
    const randomIndex = Math.floor(Math.random() * otherSocketIds.length);
    return otherSocketIds[randomIndex];
  }

  socket.on("disconnect", () => {
    console.log(socket.id + " just disconnected");
  });
});
