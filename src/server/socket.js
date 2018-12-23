

const groupList = {};


const socket = function(server){
    const io = require('socket.io')(server, {
    path: '/socket',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
  });
  io.on('connection', function (socket) {
    var opener = true;
    var id = "id" + new Date().getTime();
    var group = "";

    socket.emit('success',{ socket_status: "connection", id });
    socket.on("join", function (data) {
      opener = data.group == id;
      group = (data.group || id).replace("id", "group");
      groupList[group] = groupList[group] || {group,drawList: [], users: {}};
      socket.join(group);
    });
    // 获取已有数据
    socket.on("getData", function (data) {
      socket.emit('initial', groupList[group]);
    });

    socket.on('login', function (data) {
      groupList[group].users[id] = data;
      socket.in(group).emit('users', groupList[group].users);
    });

    socket.on('draw', function (data) {
      if (data.action === "RESTORE") {
        groupList[group].drawList.splice(data.index, groupList[group].drawList.length);
      } else if (data.action === "CLEAR") {
        groupList[group].drawList = [];
      } else {
        groupList[group].drawList.push(data);
      }
      socket.in(group).emit('draw', data);
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
