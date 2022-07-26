const chatform = document.querySelector("#chat-form");
const msginp = document.querySelector("#msg");
const chatmassage = document.querySelector(".chat-messages");
const usersH = document.querySelector("#users");
const roomName = document.querySelector("#room-name");

const socket = io();

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("joinRoom", {
  username,
  room,
});

socket.on("roomUsers", (users) => {
  outputRoomName(users[0].room);
  outputUser(users);
});

socket.on("message", (messager) => {
  output(messager);
  chatmassage.scrollTop = chatmassage.scrollHeight;
});

chatform.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = msginp.value;
  socket.emit("chat-message", msg);
  msginp.value = "";
});

function output(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${msg.username}<span>${msg.time}</span></p>
    <p class="text">
    ${msg.msg}
    </p>
    `;
  chatmassage.appendChild(div);
}

function outputUser(users) {
  return (usersH.innerHTML = `
  ${users.map((users) => `<li>${users.username}</li>`).join("")}
  `);
}

function outputRoomName(room) {
  return (roomName.innerText = `${room}`);
}
