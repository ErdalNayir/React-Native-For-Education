const express = require("express");
const app = express();
const PORT = 4000;

//allows data transfer between server and client domains
const http = require("http").Server(app);
const cors = require("cors");

//create a real-time connection
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "<http://192.168.245.24:4000>",
  },
});

/* 
express is a fast minimalistic framework for web servers
cors is a node.js package that allows communication between different domains
nodemon is a node.js tool that automatically restart server once it detects file changes
socket.io allows us to configurea real time connection to server
*/

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Id's for chatRooms
const generateID = () => Math.random().toString(36).substring(2, 10);
let chatRooms = [];

//The function just bellow establishes a connection with the React app, then creates a unique ID for each socket and logs the ID to the console whenever you refresh the app.
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("createRoom", (name) => {
    socket.join(name);
    //👇🏻 Adds the new group name to the chat rooms array
    chatRooms.unshift({ id: generateID(), name, messages: [] });
    //👇🏻 Returns the updated chat rooms via another event
    socket.emit("roomsList", chatRooms);
  });

  socket.on("findRoom", (id) => {
    //👇🏻 Filters the array by the ID
    let result = chatRooms.filter((room) => room.id == id);
    //👇🏻 Sends the messages to the app
    socket.emit("foundRoom", result[0].messages);
  });

  //Listen to the event on the server and update the chatRoom array.
  socket.on("newMessage", (data) => {
    //👇🏻 Destructures the property from the object
    const { room_id, message, user, timestamp } = data;
    //👇🏻 Finds the room where the message was sent
    let result = chatRooms.filter((room) => room.id == room_id);

    //👇🏻 Create the data structure for the message
    const newMessage = {
      id: generateID(),
      text: message,
      user,
      time: `${timestamp.hour}:${timestamp.mins}`,
    };
    //👇🏻 Updates the chatroom messages
    console.log("New Message", newMessage);
    socket.to(result[0].name).emit("roomMessage", newMessage);
    result[0].messages.push(newMessage);

    //👇🏻 Trigger the events to reflect the new changes
    socket.emit("roomsList", chatRooms);
    socket.emit("foundRoom", result[0].messages);
  });

  //When you refresh or close the app, the socket fires the disconnect event showing that a user has disconnected from the socket.
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

//Also, return the chat room list via the API route as below:
app.get("/api", (req, res) => {
  res.json(chatRooms);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
