/*
datepicker.js 修改过，创建之后，必须unmount里面remove掉，参照 mfz_manage  SearchBar
uploadfiles   参照 mfz_manage
CheckInput    参照 leftText为了自适应，input ==> style={width:0,flexGrow:1}
*/


/*
var compareObject = function (o1,o2){
  if(!o1 || !o2) return
  var obj = {};
  for (var key in o2) {
    if (o2.hasOwnProperty(key)) {
      if(o1[key] != undefined) {
        console.log(typeof o2[key]==typeof o1[key]);
        if(typeof o2[key] == "object" && typeof o1[key] == "object" && !Array.isArray(o1) && !Array.isArray(o2)){
          console.log(key);
          obj[key] = compareObject(o1[key],o2[key])
        }else{
          obj[key] = typeof o2[key] == "object" && JSON.parse(JSON.stringify(o2[key])) || o2[key]
        }
      }else{
        obj[key] = typeof o2[key] == "object" && JSON.parse(JSON.stringify(o2[key])) || o2[key]
      }
    }
  }
  for (var key in o1) {
    if (o1.hasOwnProperty(key)) {
      if(o2[key] == undefined){
        obj[key] = typeof o1[key] == "object" && JSON.parse(JSON.stringify(o1[key])) || o1[key]
      }
    }
  }
  return obj
}
*/
