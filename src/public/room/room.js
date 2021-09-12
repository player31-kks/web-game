import { App } from "../game/app.js";

const socket = io();
const nickNameForm = document.querySelector(".js-nickname-form");
const nickNameInput = nickNameForm.querySelector("input");
const roomForm = document.querySelector(".js-room-form");
const waitingRoom = document.querySelector(".js-waiting-room");
const roomInput = roomForm.querySelector("input");
const roomList = document.querySelector(".js-room-list");
let myPeerConnection;
let roomName;
let myDataChannel;

roomForm.hidden = true;

//host

socket.on("welcome", async () => {
  myDataChannel = myPeerConnection.createDataChannel("chat");
  console.log("made dataChannel");
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("send offer");

  socket.emit("offer", offer, roomName);
});

//guest

//common

function handleNickName(event) {
  event.preventDefault();
  const nickname = nickNameInput.value;
  socket.emit("nickname", nickname, showRoom);
  nickNameInput.value = "";
}

nickNameForm.addEventListener("submit", handleNickName);

function showRoom(nickname) {
  nickNameForm.hidden = true;
  roomForm.hidden = false;
  const h3 = roomForm.querySelector("h3");
  h3.innerText = `nickname : ${nickname}`;
}

function handleRoomEnter(event) {
  event.preventDefault();
  roomName = roomInput.value;
  makeConnection();
  socket.emit("room enter", roomName);
  roomInput.value = "";
  waitingRoom.hidden = true;
}
roomForm.addEventListener("submit", handleRoomEnter);

// socket code
socket.on("room info", (roomInfo) => {
  roomInfo.forEach((roomName) => {
    const li = document.createElement("li");
    li.innerText = roomName;
    roomList.appendChild(li);
  });
});

socket.on("game start", () => {
  const app = new App(myDataChannel, "1p");
});

socket.on("offer", async (offer) => {
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    const app = new App(myDataChannel, "2p");
    socket.emit("game start", roomName);
  });
  console.log("receive offer");

  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  console.log("send answer");

  socket.emit("answer", answer, roomName);
});

socket.on("answer", (answer) => {
  console.log("receive answer");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  myPeerConnection.addIceCandidate(ice);
  console.log("send candidate");
});

// RTC
function handleIce(data) {
  console.log("send candidate");
  socket.emit("ice", data.candidate, roomName);
}
function makeConnection() {
  // both mypeeerconnection created
  myPeerConnection = new RTCPeerConnection({});
  myPeerConnection.addEventListener("icecandidate", handleIce);
}

// iceServers: [
//   {
//     urls: [
//       "stun.l.google.com:19302",
//       "stun1.l.google.com:19302",
//       "stun2.l.google.com:19302",
//       "stun3.l.google.com:19302",
//       "stun4.l.google.com:19302",
//     ],
//   },
// ],
