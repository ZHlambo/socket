var socket = io("http://192.168.31.100:9000",{path:"/socket"});
window.socket = socket;
socket.on('connect', (data) => {
  console.log("connect success",JSON.stringify(data));
})
socket.on('success', (data) => {
  console.log("分配的id",JSON.stringify(data),group);
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
  console.log(users);
});
socket.on('msg',function(data){
    console.log('msg',data);
});
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
