var express = require('express'),
    http = require('http'),
    app;

app = express();

var modified = false;
var port = 3000;

habits = [{
    "name" : "1",
    "tag" : "2",
    "freq" : 5,
    "good" : true,
    "daysFreq" :{}
}]

http.createServer(app).listen(3000);

app.use(express.static(__dirname + "/client"));
// tell Express to parse incoming
// JSON objects
app.use(express.urlencoded());

app.get("/habits.json", function (req, res) {
    var habitsJson = habits;
    res.json(habitsJson);
});

app.post("/addhabit",function(req,res){
    var newHabit = req.body;

    console.log(newHabit);
    
    habits.push(newHabit);
    console.log(habits);

    // send back a simple object
    res.json({"message":"You added a habit to the server!"});
});

app.post("/changehabit",function(req,res){
    var newHabit = req.body;

    console.log(newHabit);
    
    habits[newHabit['index']] = (newHabit['habitJSON']);
    console.log(habits);

    // send back a simple object
    res.json({"message":"You changed a habit on the server!"});
});

app.post("/updatehabit",function(req,res){
    var updateObject = req.body;

    console.log(updateObject);

    var index = updateObject['habitIndex'];
    var date = updateObject['date'];
    var newFreq = updateObject['newFreq'];

    console.log(index);
    console.log(date);
    console.log(newFreq);

    habits[index]['daysFreq'][date] = newFreq;

    console.log(habits[index]['daysFreq'])

    res.json({"message":"You updated a habit on the server!"});
})

app.post("/deletehabit",function(req,res){
    var jsonObject = req.body;
    var deleteIndex = jsonObject['index'];

    console.log("deleteIndex: " + deleteIndex)
    console.log(habits);
    habits.splice(deleteIndex,1);
    console.log(habits);

    var msg = "You deleted habit " + deleteIndex + " on the server!"
    res.json({"message":msg});
})