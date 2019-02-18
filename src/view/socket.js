function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var group = getQueryString("group");
var drawList = [],users = {}, userList = []; user = {};

document.getElementById('login').addEventListener('click', function () {
  var value = prompt("请输入名称");
  var obj = {name: value};
  users[user.id] = obj;
  console.log(users);
  setUser();
  user.data = obj;
  socket.emit("login", obj);
});

document.getElementById('start').addEventListener('click', function () {
  if (userList.length < 3) {
    alert("人数不够，至少三人")
  } else {
    start();
  }
});

var socket = io("http://192.168.3.195:9000",{path:"/socket"});
window.socket = socket;
socket.on('connect', (data) => {
  console.log("connect success",JSON.stringify(data));
})
socket.on('success', (data) => {
  console.log("分配的id",JSON.stringify(data),group);
  user.id = data.id;
  if (group) {
    socket.emit("join", {group, id: data.id});
    socket.emit("getData", {id: data.id});
  } else {
    socket.emit("join", {group: data.id});
  }
})

socket.on("initial", (data) => {
  console.log(data);
  data.drawList.forEach(drawCanvas);
  users = data.users;
  setUser();
  // NOTE: unuse
  group = data.group;
})

socket.on('draw', (data) => {
    if(data.width && data.p){//手机屏幕尺寸不一样需要缩放
      var scale = canvas.width/data.width
      data.p.x = data.p.x*scale
      data.p.y = data.p.y*scale
      window.lineWidth = data.lineWidth
      window.lineColor = data.lineColor
      ctx.lineWidth = window.lineWidth;
      ctx.strokeStyle = window.lineColor;
    }
    drawCanvas(data)
})

socket.on('users',function(data){
  users = data;
  setUser();
  console.log(users);
});
socket.on('msg',function(data){
    console.log('msg',data);
});

function setUser () {
  userList = [];
  for (var key in users) {
    userList.push({id: key,data: users[key]});
  }
  document.getElementById("users").innerHTML = "房间共" + userList.length + "人";
}
// socket.on('connecting', (data) => {
//   console.log("connecting",JSON.stringify(data));
// })
// socket.on('connect_failed', (data) => {
//   console.log("connect_failed",JSON.stringify(data));
// })
// socket.on('error', (data) => {
//   console.log("error",JSON.stringify(data));
// })
// socket.on('auth', (data, fn) => {
//   console.log("auth",JSON.stringify(data));
//   fn({token: user.token})
// })
