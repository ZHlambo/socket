const Sequelize = require('sequelize');
const URL = require('url');
var sequelize = new Sequelize('dord','root','root',{dialect: 'mysql',
    define: {timestamps:false}, host: 'localhost'});
var User = sequelize.define('user', {
    name: {
      type: Sequelize.STRING,
    },
    headerimg: {
      type: Sequelize.STRING,
    }
  }, {
    freezeTableName: true, // Model 对应的表名将与model名相同
});
const sendResponse = function (res,code,data) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET,DELETE,PUT,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.statusCode = code;
    res.end(JSON.stringify(data));
}
const action = function(req, res) {
  var parseUrl = URL.parse(req.url, true);
  var id = parseUrl.path.split("/")[parseUrl.path.split("/").length - 1];
  // sendResponse(res, 404, "找不到请求");
  switch (req.method) {
    case "GET":
            console.log(parseUrl,sequelize.isDefined("user"));
            try {
                User.findAll().then(function(result){
                    sendResponse(res,200,result);
                });
            } catch (e) {
                sendResponse(res,400, e)
            } finally {

            }
      break;
    case "POST":
      // req.on("data", function(data) {
      //   var data = JSON.parse(data)
      //   _model = new model(data)
      //   model.add(_model, (err, response) => sendResponse(res, err
      //     ? 400
      //     : 200, err || '新增成功'))
      // });
      break;
    case "DELETE":
      // console.log(parseUrl.search);
      // model.remove({
      //   _id: id
      // }, (err, response) => sendResponse(res, err
      //   ? 400
      //   : 200, err || response))
      break;
    case "PUT":
      //   req.on("data", function(putData) {
      //     putData = JSON.parse(putData)
      //     var data = {
      //       set: putData,
      //       id
      //     }
      //     model.put(data, (err, response) => sendResponse(res, err
      //       ? 400
      //       : 200, err || '修改成功'))
      //   });
      break;
    default:
      sendResponse(res, 404, "找不到请求");
      break;
  }
};
module.exports = action;
