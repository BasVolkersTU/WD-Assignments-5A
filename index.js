var express = require('express'),
    http = require('http'),
    app;

app = express();

var port = 3000;

http.createServer(app).listen(3000);

app.use(express.static(__dirname + "/client"));
// tell Express to parse incoming
// JSON objects
app.use(express.urlencoded());

app.get("/hello",function(req,res){
    res.send("Hello world!");
})