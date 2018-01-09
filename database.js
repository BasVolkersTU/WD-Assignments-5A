var configuration = require('./configuration.js'),
    mysql = require('mysql'),
    habitfunctions = require('./habitfunctions.js');
var app = configuration.app;

var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Nienke321'
})

habitSize = 0;

module.exports.con = con;

module.exports.connect = function(){
    con.connect(function(err){
        if(err){
            throw err;
        }
        con.query("USE habits",function(err,result){
            if (err) throw err;
            console.log("Result:");
            console.log(result);
        });
    })
}

module.exports.getTop5GoodHabits = function(){
    var getTop5GoodHabits = app.get("/top5GoodHabits.json",function(req,res){
        var sql = "SELECT title,COUNT(timestamp) AS amount FROM habit\n"+
        "FULL JOIN habit_done ON(id = habit_done.habit_id)\n"+
        "WHERE good='true' GROUP BY(title) ORDER BY amount DESC LIMIT 5;\n"

        con.query(sql,function(err,result){
            var titles = [];

            for(var i  = 0; i < result.length;i++){
                titles.push(result[i]['title']);
            }

            console.log(titles);
            res.json(titles);
        })
    });
}

module.exports.getTop5BadHabits = function(){
    app.get("/top5BadHabits.json",function(req,res){
        var sql = "SELECT title,COUNT(timestamp) AS amount FROM habit\n"+
        "FULL JOIN habit_done ON(id = habit_done.habit_id)\n"+
        "WHERE good='false' GROUP BY(title) ORDER BY amount ASC LIMIT 5;\n"
    
        con.query(sql,function(err,result){
            var titles = [];
    
            for(var i  = 0; i < result.length;i++){
                titles.push(result[i]['title']);
            }
    
            console.log(titles);
            res.json(titles);
        })
    })
}

module.exports.getGoodHabitPercToday = function(){
    app.get("/getGoodHabitPercToday.json",function(req,res){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if(month < 10){
            month = "0" + month;
        }
        var day = date.getDate();
        if(day < 10){
            day = "0" + day;
        }
        var today = year + "-" + month + "-" + day;
        
        
        console.log(today);
    
        var sql = "SELECT SUM(amount) AS total FROM frequency INNER JOIN habit ON (frequency_id = frequency.id) WHERE good='true'"
    
        con.query(sql,function(err,result){
            if(err) throw err;
            var sql2  = "SELECT COUNT(*) AS done FROM habit_done JOIN habit ON(habit.id = habit_done.habit_id)\n" 
            + "WHERE timestamp LIKE '" + today + "%' AND good = 'true'";
    
            con.query(sql2,function(err2,result2){
                if (err2) throw err2;
                var done = parseInt(result2[0]['done']);
                var total = parseInt(result[0]['total']);
    
                var fraction = done / total;
                var percentage = fraction * 100;
                res.json({'percentage':percentage})
            })
        })
    
    })
};

module.exports.getBadHabitPercToday = function(){
    
    app.get("/getBadHabitPercToday.json",function(req,res){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if(month < 10){
            month = "0" + month;
        }
        var day = date.getDate();
        if(day < 10){
            day = "0" + day;
        }
        var today = year + "-" + month + "-" + day;
        
        console.log(today);

        var sql = "SELECT SUM(amount) AS total FROM frequency INNER JOIN habit ON (frequency_id = frequency.id) WHERE good='false'"

        con.query(sql,function(err,result){
            if(err) throw err;
            var sql2  = "SELECT COUNT(*) AS done FROM habit_done JOIN habit ON(habit.id = habit_done.habit_id)\n" 
            + "WHERE timestamp LIKE '" + today + "%' AND good = 'false'";

            con.query(sql2,function(err2,result2){
                if (err2) throw err2;
                var done = parseInt(result2[0]['done']);
                var total = parseInt(result[0]['total']);

                var fraction = done / total;
                var percentage = fraction * 100;
                res.json({'percentage':percentage})
            })
        })
        
    })
};

module.exports.getAmountDoneTodaySameTag = function(){
    app.get("/amountDoneTodaySameTag.json",function(req,res){
        var date = new Date();
        var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
        console.log(today);
    
        var sql="SELECT COUNT(*) AS size FROM habit_list";
        con.query(sql,function(err,result){
            if(err) throw err;
            console.log(result);
    
            var sql2 = "SELECT habit_list.id,habit_list.name,habit.title,SUM(amount) as total FROM habit_list\n"+ 
            "INNER JOIN habit ON(habit_list.id = habit.habit_list_id)\n"+
            "INNER JOIN frequency ON(frequency_id = frequency.id)\n"+
            "GROUP BY(name) ORDER BY(id)\n;"
    
            con.query(sql2,function(err2,result2){
                if(err2) throw err2;
    
                var sql3 = "SELECT habit_list.id,habit_list.name AS tag, COUNT(habit_id) AS timesToday FROM habit_done\n"+
                "INNER JOIN habit ON (habit_id = habit.id)\n"+
                "INNER JOIN habit_list ON(habit_list_id = habit_list.id)\n"+
                "WHERE timestamp LIKE ('" + today + "%') GROUP BY (habit_list_id)\n;";
    
                con.query(sql3,function(err3,result3){
                    if(err3) throw err3;
    
                    var returnJSON = []
    
                    for(var i =0; i <result3.length;i++){
                        for(var k = 0; k < result2.length;k++){
                            if(result3[i]['id'] === result2[k]['id']){
                                //same id
                                var total = result2[k]['total'];
                                var timesToday = result3[i]['timesToday'];
                                var tag = result3[i]['tag'];
                                var object = {
                                    'tag':tag,
                                    'total':total,
                                    'timesToday':timesToday
                                }
                                returnJSON.push(object);
                            }
                        }
                    }
    
                    console.log(returnJSON);
                    res.json(returnJSON);
                })
            })
    
    
    
        })
    
    })
}

module.exports.renderHabits = function(req,res){
    var habitsJSON = [];
    var sql= "SELECT habit.id AS id, habit.title AS name,habit_list.name AS tag,habit.good AS good, frequency.amount,SUBSTRING(timestamp,1,10) AS date FROM habit\n"
    +"LEFT JOIN habit_list ON (habit_list.id=habit.habit_list_id)\n"
    +"INNER JOIN frequency ON (habit.frequency_id = frequency.id)\n"
    +"LEFT JOIN habit_done ON (habit_done.habit_id=habit.id)\n"
    +"ORDER BY(habit.id)\n";
    con.query("USE habits;")
    con.query(sql,function(err,habitResult){
        if(err) throw err;
        //console.log(habitResult);
        habitSize = 0;

        for(var i = 0;i < habitResult.length;i++){
            var result = habitResult[i];
           var habitID = result['id'];
           var habitIndex = habitID - 1;
    
           if(habitIndex == habitsJSON.length){
               habitSize++;
               var date = result['date'];
               var daysFreq = {};

               if(date != null){
                    daysFreq[date] = 1;
               }
                var habitObject = {
                    'name':result['name'],
                    'tag':result['tag'],
                    'good':result['good'],
                    'freq':result['amount'],
                    'daysFreq' : daysFreq
                };
                habitsJSON.push(habitObject);
           }
           else{
                var date = result['date'];
               var habit = habitsJSON[habitIndex];
               
            


                if(date != 'NULL'){

                    if(date in habit['daysFreq']){
                       habit['daysFreq'][date] = habit['daysFreq'][date] + 1;
                    }
                    else{
                        habit['daysFreq'][date] = 1;
                    }
                    
                }   
            }
        }
        var dates = habitfunctions.setWeek(new Date());

        habitsJSON.forEach(function(habit){
            dates.forEach(function(date){
                var isIn = false;
                Object.keys(habit.daysFreq).forEach(function(element){
                    if(element == date){
                        isIn = true;
                    }
                })
                if(!isIn){
                    habit.daysFreq[date] = 0;
                }
            })
        })

        for(var i =0; i < habitsJSON.length ; i++){
            habitsJSON[i]['percentage'] = habitfunctions.calculateWeekPrec(habitsJSON[i]['daysFreq'],habitsJSON[i]['freq'])
        }

       
        for(var j = 0; j < habitsJSON.length ; j++){
            var colors = [];
            for(var k = 0; k < 7;k++){
                var date = dates[k];
                var freq = parseInt(habitsJSON[j]['freq']);
                var done = parseInt(habitsJSON[j]['daysFreq'][date]);
                var good = habitsJSON[j]['good'];
                var color = habitfunctions.calculateColor(done,freq,good);
                colors.push(color);
            }
            habitsJSON[j]['colors'] = colors;
        }

        res.render('newhabittracker',{
            'habits':habitsJSON,
            'dates':dates,
        });
    });
}

module.exports.getHabits = function(){
     app.get("/habits.json", function (req, res) {
        
            var habitsJSON = [];
            var sql= "SELECT habit.id AS id, habit.title AS name,habit_list.name AS tag,habit.good AS good, frequency.amount,SUBSTRING(timestamp,1,10) AS date FROM habit\n"
            +"LEFT JOIN habit_list ON (habit_list.id=habit.habit_list_id)\n"
            +"INNER JOIN frequency ON (habit.frequency_id = frequency.id)\n"
            +"LEFT JOIN habit_done ON (habit_done.habit_id=habit.id)\n"
            +"ORDER BY(habit.id)\n";
            con.query(sql,function(err,habitResult){
                if(err) throw err;
                //console.log(habitResult);
                habitSize = 0;
        
                for(var i = 0;i < habitResult.length;i++){
                    var result = habitResult[i];
                   var habitID = result['id'];
                   var habitIndex = habitID - 1;
            
                   if(habitIndex == habitsJSON.length){
                       habitSize++;
                       var date = result['date'];
                       var daysFreq = {};
        
                       if(date != null){
                            daysFreq[date] = 1;
                       }
                        var habitObject = {
                            'name':result['name'],
                            'tag':result['tag'],
                            'good':result['good'],
                            'freq':result['amount'],
                            'daysFreq' : daysFreq
                        };
                        habitsJSON.push(habitObject);
                   }
                   else{
                        var date = result['date'];
                       var habit = habitsJSON[habitIndex];
                       
                    
        
        
                        if(date != 'NULL'){
        
                            if(date in habit['daysFreq']){
                               habit['daysFreq'][date] = habit['daysFreq'][date] + 1;
                            }
                            else{
                                habit['daysFreq'][date] = 1;
                            }
                            
                        }   
                    }
                }
                console.log(habitsJSON);
                res.json(habitsJSON);
            });

        });
};

module.exports.addHabit = function(req,res){
        console.log(req);

        var newHabit = req.body;
        var name = newHabit['name'];
        var good = newHabit['good'];
        var amount = newHabit['freq'];
    
        var newID = habitSize + 1;
    
        var description = "NULL";
        var creationDate = "NULL";
    
        var habit_list_id = "NULL";
        var part_of_week_id = "NULL";
    
        var owner = 1;
        var isPublic = 1;
        var tag = newHabit['tag'];
        
         con.query("SELECT name FROM habit_list",function(err2,result2){
                    if(err2) throw err2
    
                    con.query("INSERT INTO frequency(id,amount) VALUES(" + newID + "," + amount + ");\n",function(err,result){
                        if(err) throw err;
                    });
    
                     var isIn = false;
                     var inIndex = 0;
                    for(var i =0; i < result2.length;i++){
                        if (result2[i]['name'] === tag){
                            isIn = true;
                            inIndex = i;
                        }
                    }
                    if(tag === ''){
                        console.log(" tag is empty");
                        var insertHabit = "INSERT INTO habit(id,title,description,creationDate,habit_list_id,frequency_id,part_of_week_id,good)\n" 
                        + "VALUES(" + newID + ",'" + name + "'," + description + "," 
                        + creationDate + "," + habit_list_id + "," + newID + "," + part_of_week_id + ",'" + good + "');\n";
    
                        con.query(insertHabit,function(err,result)
                        {
                            if(err) throw err;
                         });
                    }
                    else if(isIn){
                         console.log(tag + " is in");
                         console.log("aaaaaa")
                         habit_list_id = inIndex + 1;
                      
                        var insertHabit = "INSERT INTO habit(id,title,description,creationDate,habit_list_id,frequency_id,part_of_week_id,good)\n" 
                        + "VALUES(" + newID + ",'" + name + "'," + description + "," 
                        + creationDate + "," + habit_list_id + "," + newID + "," + part_of_week_id + ",'" + good + "');\n"; 
    
                        con.query(insertHabit,function(err,result){
                            if(err) throw err;
                         });                   
                    }
                    else{
                        console.log(tag + " is not in");
                        console.log("bbbbbbbb");
                        con.query("SELECT COUNT(*) AS size FROM habit_list",function(err3,result3){
                            if(err3) throw err3;
                            var habit_list_id = parseInt(result3[0]['size']) + 1
                                            
                            var insertHabit = "INSERT INTO habit(id,title,description,creationDate,habit_list_id,frequency_id,part_of_week_id,good)\n" 
                            + "VALUES(" + newID + ",'" + name + "'," + description + "," 
                            + creationDate + "," + habit_list_id + "," + newID + "," + part_of_week_id + ",'" + good + "');\n";
                            var insertHabitList = "INSERT INTO habit_list(id,name,creationDate,owner,isPublic)\n"
                            + "VALUES(" + habit_list_id +",'" + tag + "'," + creationDate + "," + owner + "," + isPublic + ");\n";
                            
                            con.query(insertHabit,function(err,result){
                                if(err) throw err;
                            });
                            con.query(insertHabitList,function(err,result){
                                if(err) throw err;
                            }); 
                        })
                    }
    
                    habitSize++;
                    res.json({"message":"You added a habit to the server!"});
                    
         })
};

module.exports.deleteHabit = function(req,res){
    /*
    //TODO: fix this
        var jsonObject = req.body;
        var deleteIndex = jsonObject['index'] + 1;

    var habitDel = "DELETE FROM habit WHERE id = " + deleteIndex + ";"
    var freqDel = "DELETE FROM habit WHERE id = " + deleteIndex + ";"
    con.query(habitDel,function(err,result){
        if(err) throw err;
    });
    con.query(freqDel,function(err,result){
        if(err) throw err;
    });

        var msg = "You deleted habit " + deleteIndex + " on the server!"
        res.json({"message":msg});
    */
}

module.exports.updateHabit = function(req,res){
        var updateObject = req.body;
    
        console.log("--------------------");
        console.log(updateObject);
        var habit_id = parseInt(updateObject['habitIndex']) + 1;
    
    
        if(updateObject['add'] === 'true'){
            var now = new Date();
            var timestamp = updateObject['date'] + 
            " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    
            console.log('adding mark...');
            con.query("INSERT INTO habit_done(habit_id,timestamp) VALUES(" + habit_id + ",'" + timestamp + "');");
            console.log("INSERT INTO habit_done(habit_id,timestamp) VALUES(" + habit_id + "," + timestamp + ");");
        }
        else{
            console.log('deletign mark...');
            con.query("DELETE FROM habit_done WHERE habit_id = " + habit_id + " AND timestamp LIKE '" + updateObject['date'] + "%' LIMIT 1");
            console.log("DELETE FROM habit_done WHERE habit_id = " + habit_id + " AND timestamp LIKE '" + updateObject['date'] + "%' LIMIT 1")
        }
};

module.exports.changeHabit = function(req,res){
        var habitInfo = req.body;
    var newHabit = habitInfo['habitJSON'];

    var habit_id = parseInt(habitInfo['index']) + 1;
    console.log("----CHANGE--INFO-----")
    console.log(newHabit);
    var newTitle = newHabit['name'];
    var newGood = newHabit['good'];
    var newTag = newHabit['tag'];

    var newFreq = parseInt(newHabit['freq']);

    con.query("SELECT frequency_id FROM habit WHERE habit.id = " + habit_id,function(err,result){
        if (err) throw err;

        console.log(result);
        con.query("UPDATE frequency SET amount = " + newFreq + " WHERE id = " + result[0]['frequency_id']);
        console.log("UPDATE frequency SET amount = " + newFreq + " WHERE id = " + result[0]['frequency_id']);

        if(newTag === ''){
            con.query("UPDATE habit SET habit_list_id = NULLL, title = '" + newTitle + "', good = '" + newGood + "' WHERE habit.id =" + habit_id);
            console.log("UPDATE habit SET habit_list_id = NULL,title = '" + newTitle + "', good = '" + newGood + "' WHERE habit.id =" + habit_id);
        }
        else{
            con.query("SELECT name FROM habit_list",function(err2,result2){
                if(err2) throw err2

                    var isIn = false;
                    var inIndex = 0;
                for(var i =0; i < result2.length;i++){
                    if (result2[i]['name'] === newTag){
                        isIn = true;
                        inIndex = i;
                    }
                }

                if(isIn){
                    console.log(newTag + " is in");
                    var habit_list_id = inIndex + 1;

                    con.query("UPDATE habit SET habit_list_id = " + habit_list_id + ", title = '" + newTitle + "', good = '" + newGood + "' WHERE habit.id =" + habit_id);
                        console.log("UPDATE habit SET habit_list_id = " + habit_list_id + ", title = '" + newTitle + "', good = '" + newGood + "' WHERE habit.id =" + habit_id);
                }
                else{
                    console.log(newTag + " is not in");
                    con.query("SELECT COUNT(*) AS size FROM habit_list",function(err3,result3){
                        if(err3) throw err3;
                        var habit_list_id = parseInt(result3[0]['size']) + 1
                        con.query("INSERT INTO habit_list(id,name,creationDate,owner,isPublic)\n" +
                        "VALUES(" + habit_list_id + ",'" + newTag + "',NULL,1,0);");

                        con.query("UPDATE habit SET habit_list_id = " + habit_list_id + ", title = '" + newTitle + "', good = '" + newGood + "' WHERE habit.id =" + habit_id);
                        console.log("UPDATE habit SET habit_list_id = " + habit_list_id + ", title = '" + newTitle + "', good = '" + newGood + "' WHERE habit.id =" + habit_id);

                    })
                }


                
            })
        }
    })
};