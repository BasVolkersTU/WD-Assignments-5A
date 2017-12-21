var express = require('express'),
    http = require('http'),
    bodyParser  = require('body-parser'),
    mysql = require('mysql'),
    app

app = express();

var modified = false;
var port = 3000;

var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Nienke321'
})

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

http.createServer(app).listen(process.env.PORT || port);

app.use(express.static(__dirname + "/client"));
// tell Express to parse incoming
// JSON objects
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

habitSize = 0;

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

app.post("/addhabit",function(req,res){
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
    
    console.log(newHabit);
    con.query("SELECT COUNT(*) AS size FROM habit_list",function(err2,result){
        if(err2) throw err2;
        console.log(result);
        var habitListSize = result[0]['size'];
        var habit_list_id = habitListSize + 1;

        console.log(habit_list_id);

        var insertFreq = "INSERT INTO frequency(id,amount) VALUES(" + newID + "," + amount + ");\n"
        var insertHabit = "INSERT INTO habit(id,title,description,creationDate,habit_list_id,frequency_id,part_of_week_id,good)\n" 
        + "VALUES(" + newID + ",'" + name + "'," + description + "," 
        + creationDate + "," + habit_list_id + "," + newID + "," + part_of_week_id + ",'" + good + "');\n";
        var insertHabitList = "INSERT INTO habit_list(id,name,creationDate,owner,isPublic)\n"
        + "VALUES(" + habit_list_id +",'" + tag + "'," + creationDate + "," + owner + "," + isPublic + ");\n";


        con.query(insertFreq,function(err,result){
            if(err) throw err;
        });
        con.query(insertHabit,function(err,result){
            if(err) throw err;
        });
        con.query(insertHabitList,function(err,result){
            if(err) throw err;
        });
    })
    

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

})


//TODO: fix this
app.post("/deletehabit",function(req,res){
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
})

app.get("/getGoodHabitPercToday.json",function(req,res){
    var date = new Date();
    var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
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

app.get("/getBadHabitPercToday.json",function(req,res){
    var date = new Date();
    var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
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



