window.lineWidth = 3;
window.lineColor = 'red';
var changeline = function(value) {
    window.lineWidth = value
}
var changeColor = function(value) {
    window.lineColor = value
    ctx.strokeStyle = value
}
var canvas = document.getElementById('canvas');
window.canvas = canvas;
canvas.addEventListener('mousemove', onMouseMove, false);
canvas.addEventListener('mousedown', onMouseDown, false);
canvas.addEventListener('mouseup', onMouseUp, false);

canvas.addEventListener('touchstart', onMouseDown, false);
canvas.addEventListener('touchmove', onMouseMove, false);
canvas.addEventListener('touchend', onMouseUp, false)


canvas.height = getWidth();
canvas.width = getWidth();
var ctx = canvas.getContext('2d');

ctx.lineWidth = window.lineWidth; // 设置线宽
ctx.strokeStyle = window.lineColor; // 设置线的颜色

var flag = false;

function onMouseMove(evt) {
    evt.preventDefault();
    if (flag) {
        var p = pos(evt);
        drawCanvas({action:"MOVE",p:p});//向服务器发送消息
    }
}

function onMouseDown(evt) {
    evt.preventDefault();
    var p = pos(evt);
    drawCanvas({action:"DOWN",p:p});//向服务器发送消息
}


function onMouseUp(evt) {
    evt.preventDefault();
    drawCanvas({action:"UP"});
    flag = false;
}
function drawCanvas(data){
  if(data.action == "DOWN"){
    ctx.beginPath();
    ctx.moveTo(data.p.x, data.p.y);
    flag = true;
  }else if(data.action == "MOVE"){
    ctx.lineTo(data.p.x, data.p.y);
    ctx.lineWidth = window.lineWidth; // 设置线宽
    ctx.stroke();
  }else if(data.action == "CLEAR"){
    clear();
  }else if(data.action == "RESTORE"){
    restore(data);
  }
  // data.width 不是从socket来则上传，是则不上传
  if(socket.emit && !data.fromSocket){
    data.width = canvas.width;
    data.lineWidth = window.lineWidth;
    data.lineColor = window.lineColor;
    data.fromSocket = true;
    socket.emit('draw',data);//向服务器发送消息
  }
   if (data.action !== "RESTORE" && data.action !== "CLEAR") {
     drawList.push(data);
   }
}

var clear = function() {
    drawList = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
var restore = function(data) {
  let arr = drawList.slice(0, data.index);
  clear();
  arr.forEach(drawCanvas)
}
document.getElementById('c').addEventListener('click', function(){drawCanvas({action:"CLEAR"})}, false);
document.getElementById('restore').addEventListener('click',function(){
  var index = 0;
  for (var i =  drawList.length - 1; i >= 0; i--) {
    if (drawList[i].action === "DOWN") {
      index = i;
      break;
    }
  }
  index && drawCanvas({action:"RESTORE",index})
}, false);


function pos(event) {
    var x, y;
    if (isTouch(event)) {
        x = event.touches[0].pageX;
        y = event.touches[0].pageY;
    } else {
        x = event.layerX;
        y = event.layerY;
    }
    return {
        x: x,
        y: y
    };
}
function isTouch(event) {
    var type = event.type;
    if (type.indexOf('touch') >= 0) {
        return true;
    } else {
        return false;
    }
}
function getWidth() {
    var xWidth = null;

    if (window.innerWidth !== null) {
        xWidth = window.innerWidth;
    } else {
        xWidth = document.body.clientWidth;
    }

    return xWidth;
}
