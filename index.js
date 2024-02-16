const express = require("express");
const cors = require("cors");
// mongoose is used to fetch data from monogodb
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const connectDatabase = async () => {
  mongoose
  .connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PSWD}@snappy-db.agvgbij.mongodb.net/?retryWrites=true&w=majority`, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });
}; 

console.log(process.env.MONGO_URL);
connectDatabase();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  // whenever a user is logged in we establish a connection with this 
  socket.on("add-user", (userId) => {
    // we will grab the userid and socketid 
    onlineUsers.set(userId, socket.id);
  });
  // whenever we get this socket is emitted  ,so the data would have the "to and message "
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    // we will check if the use is in onlineUsers or not , if yes ,,then we will emit the user with the msg-recieve event and if the user isnt online then it would be stored in the database
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
