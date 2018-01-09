var configuration = require('./configuration');

var app = configuration.app;

module.exports.home = function(){
    app.get("/home(page)?",function(req,res){
        res.redirect('/index.html');
    })
}
module.exports.habittracker = function(){
    app.get("/hab+it?(trac?ker)?",function(req,res){
        res.redirect('/html/habittracker.html');
    })
}
module.exports.analytics = function(){
    app.get("/anal((y||i)tic?s?)?",function(req,res){
        res.redirect('/html/analytics.html');
    })
}