var express= require('express'),
    http = require('http'),
    bodyParser  = require('body-parser');
var app = express();
var port = 3000;

module.exports.app = app;
module.exports.init = function(){
    http.createServer(app).listen(port);

    app.use(express.static(__dirname + "/client"));
    // tell Express to parse incoming
    // JSON objects
    app.use(express.json());
    app.use(bodyParser.urlencoded({
        extended: true
      }));
}