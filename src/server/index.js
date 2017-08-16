const http = require('http');
const URL = require('url');
const setSocket = require("./socket");
const parseRequest = require("./server");

const hostname = getIPAdress();
const port = 9000;

function getIPAdress(){// 获取本机ip
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
const server = http.createServer((req, res) => {
    var parseUrl = URL.parse(req.url, true).path;
    if(parseUrl.indexOf("/socket") == 0){
      socket(req,res);
    }else{
      parseRequest(req,res);
    }
});

setSocket(server);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
