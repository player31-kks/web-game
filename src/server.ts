import { ExtendedSocket } from "./type/socket";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use("/", express.static(__dirname + "/public"));
app.engine("html", require("ejs").renderFile);

app.get("/game", (req, res) => {
  res.render("game.html");
});

app.get("/", (req, res) => {
  res.render("room.html");
});

const server = http.createServer(app);
const io = new Server(server);

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const publicRooms: string[] = [];
  rooms.forEach((_, key) => {
    if (!sids.get(key)) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

io.on("connection", (socket) => {
  socket.on("nickname", (nickname, done) => {
    (socket as ExtendedSocket).nickName = nickname;
    console.log(`nickname : ${nickname}`);
    done(nickname); // 클라이언트 쪽에서 실행
    socket.emit("room info", publicRooms());
  });

  socket.on("room enter", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });

  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });

  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });

  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });

  socket.on("game start", (roomName) => {
    socket.to(roomName).emit("game start");
  });
});

server.listen(3000, () => {
  console.log("server opended!!");
});
