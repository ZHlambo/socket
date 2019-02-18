

const groupList = {};
const socketList = {};

function checkSocket(group, socket, id) {
}


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
      if (groupList[group]) {
        groupList[group].users[id] = data.login || {};
        socketList[group].push(socket);
      } else {
        groupList[group] =  {group,drawList: [], data: {opener: id}, users: {[id]: data.login || {}}};
        socketList[group] = [socket];
      }
      socket.join(group);
      socket.in(group).emit('users', groupList[group].users);
    });
    // 获取已有数据
    socket.on("getData", function (data) {
      checkSocket(group, socket, id);
      console.log(groupList[group].group , groupList[group].users);
      socket.emit('initial', groupList[group]);
    });

    socket.on('login', function (data, cb) {
      groupList[group].users[id] = data;
      checkSocket(group, socket, id);
      socket.in(group).emit('users', groupList[group].users);
      cb({code: 200});
    });

    socket.on('draw', function (data) {
      if (data.action === "RESTORE") {
        groupList[group].drawList.splice(data.index, groupList[group].drawList.length);
      } else if (data.action === "CLEAR") {
        groupList[group].drawList = [];
      } else {
        groupList[group].drawList = groupList[group].drawList || [];
        groupList[group].drawList.push(data);
      }
      checkSocket(group, socket, id);
      socket.in(group).emit('draw', data);
    });

    socket.on('disconnect', function () { // 这里监听 disconnect，就可以知道谁断开连接了
      if (groupList[group] && groupList[group].users[id]) {
        delete groupList[group].users[id];
      }
      for (let i = 0; i < socketList[group].length; i++) {
        if (socketList[group][i] == socket) {
          socketList[group].splice(i, 1);
          break;
        }
        socket.in(group).emit('users', groupList[group].users);
      }
    });
  });
}
module.exports = socket;
