var express = require('express'),
    http = require('http'),
    bodyParser  = require('body-parser'),
    mysql = require('mysql'),
    routing = require('./routing.js');
    configuration = require('./configuration.js');
    database = require('./database.js');

var app = configuration.app;
app.set('views',__dirname + "/views");
app.set("view engine",'ejs');

var con = database.con;
database.connect();

//analytics page
database.getTop5GoodHabits();
database.getTop5BadHabits();
database.getBadHabitPercToday();
database.getGoodHabitPercToday();
database.getAmountDoneTodaySameTag();

//habittracker page
database.getHabits();

routing.home();
routing.analytics();
routing.habittracker();
configuration.init();

//habittracker page
app.post("/updatehabit",function(req,res){
    database.updateHabit(req,res);
});
app.post("/addHabit",function(req,res){
    database.addHabit(req,res);
});
app.post("/changeHabit",function(req,res){
    database.changeHabit(req,res);
})
app.post("deleteHabit",function(req,res){
    database.deleteHabit(req,res);
})













