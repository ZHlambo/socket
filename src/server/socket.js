const socket = function(server){
  const io = require('socket.io')(server, {
    path: '/socket',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
  });

  var group = "group1"
  io.on('connection', function (socket) {
    socket.emit('join',{ c_status: "connection",group:group });
    socket.on('draw', function (data) {
      socket.in(group).emit('draw', data);
    });
    socket.on(group, function (data) {
      socket.join(group);
    });
  });
  function broadcast(message, socket) {
    var cleanup = []
    for(var i=0;i<socketList.length;i+=1) {
      if(socket !== socketList[i]) {
        if(socketList[i].writable) { // 先检查 sockets 是否可写
          socketList[i].emit('message',socket.name + " says " + message+"\n");
        } else {
          cleanup.push(socketList[i]) // 如果不可写，收集起来销毁。销毁之前要 Socket.destroy() 用 API 的方法销毁。
          socketList[i].destroy()
        }

      }
    }  //Remove dead Nodes out of write loop to avoid trashing loop index
    for(i=0;i<cleanup.length;i+=1) {
      socketList.splice(socketList.indexOf(cleanup[i]), 1)
    }
  }
}
module.exports = socket;
