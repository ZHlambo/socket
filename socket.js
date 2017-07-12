const server = require('http').createServer();
const hostname = getIPAdress();
const PROT = 9000;
var {question} = require("./data.js")

const io = require('socket.io')(server, {
  path: '/test',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

function getIPAdress(){//o获取本机ip
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
          var iface = interfaces[devName];
          for(var i=0;i<iface.length;i++){
               var alias = iface[i];
               if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                     return alias.address;
               }
          }
    }
}

server.listen(PROT,hostname,() => {
  console.log(`Server running at http://${hostname}:${PROT}`);
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

// const port = 3000;
// const server = http.createServer((req, res) => {
//   action(req,res)
// });
// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// var net = require('net');
//
// var chatServer = net.createServer(),
//     socketList = [];
//
// chatServer.on('connection', function(socket) {
//   // JS 可以为对象自由添加属性。这里我们添加一个 name 的自定义属性，用于表示哪个客户端（客户端的地址+端口为依据）
//   socket.name = socket.remoteAddress + ':' + socket.remotePort;
//   socket.write('Hi ' + socket.name + '!\n');
//   socketList.push(socket);
//   socket.on('data', function(data) {
//     console.log(data.toString());
//      broadcast(data.toString(), socket);// 接受来自客户端的信息
//   });
//   socket.on('end', function() {
//     socketList.splice(socketList.indexOf(socket), 1); // 删除数组中的制定元素。这是 JS 基本功哦~
//   })
// });
// function broadcast(message, socket) {
//   var cleanup = []
//   for(var i=0;i<socketList.length;i+=1) {
//     if(socket !== socketList[i]) {
//       if(socketList[i].writable) { // 先检查 sockets 是否可写
//         socketList[i].write(socket.name + " says " + message+"\n")
//       } else {
//         cleanup.push(socketList[i]) // 如果不可写，收集起来销毁。销毁之前要 Socket.destroy() 用 API 的方法销毁。
//         socketList[i].destroy()
//       }
//
//     }
//   }  //Remove dead Nodes out of write loop to avoid trashing loop index
//   for(i=0;i<cleanup.length;i+=1) {
//     socketList.splice(socketList.indexOf(cleanup[i]), 1)
//   }
// }
//
// chatServer.listen(9000,hostname, () => {
//   console.log(`Server running at http://${hostname}:9000/`);
// });
