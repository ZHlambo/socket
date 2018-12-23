
var array = new Set()
for (var i = 0; i < questions.length; i++) {
  array.add(questions[i].value)
}
console.log(questions,array);
this.time = 10;
this.showPrompt = 0.5;//计时器的一半就展示prompt
var users = [{name:"lambo",id:1},{name:"drod",id:2},{name:"尐",id:3},{name:"zongheng",id:4}];
var getRandom = function(){
  var random = Math.round(Math.random()*questions.length)
  var question = questions[random]
  questions.splice(random)
  var spliceQ = questions.splice(0,random)
  questions = questions.concat(spliceQ);
  console.log(questions);
  for (var i = 0; i < questions.length; i++) {
    if(!questions[i])console.log(questions[i]);
  }
  return question
}
var setView = function(){
  var time = data.time,user = users[data.index%users.length],question = data.question;
  document.getElementById("time").innerHTML = time + "s"
  var userText = "当前画师："+user.name;
  var questionText = "谜题："+ question.value + "　提示："+ question.tip + (time < this.time*this.showPrompt ? "　"+ question.prompt : "");
  if(document.getElementById("user").innerHTML != userText) document.getElementById("user").innerHTML = userText;
  if(document.getElementById("question").innerHTML != questionText) document.getElementById("question").innerHTML = questionText;
}
var data = {time:this.time,index:0,question:getRandom()}
setView();
// setInterval(function(){
//   if(data.time != 0){
//     data.time--;
//     setView();
//   }else{
//     data.index++;
//     data.time = this.time;
//     data.question = getRandom();
//     setView();
//   }
// },1000)
