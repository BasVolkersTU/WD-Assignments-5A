var main = function(habitObjects){
	"use strict";



	var week =[];
	var datePointingTo = new Date();

	var daysOfMonth = {
		"Jan":31,
		"Feb":28,
		"Mar":31,
		"Apr":30,
		"May":31,
		"Jun":30,
		"Jul":31,
		"Aug":31,
		"Sep":30,
		"Oct":31,
		"Nov":30,
		"Dec":31,
	};
	var months = {
		1:"Jan",
		2:"Feb",
		3:"Mar",
		4:"Apr",
		5:"May",	
		6:"Jun",	
		7:"Jul",	
		8:"Aug",	
		9:"Sep",	
		10:"Oct",		
		11:"Nov",
		12:"Dec"
	};

	var incrementDate = function(date){
		var dateString = date.toDateString();
		var day = parseInt(dateString.substring(8,10));
		var month = date.toDateString().substring(4,7);
		var year = parseInt(dateString.substring(11,15));

		if(day + 1 <= daysOfMonth[month]){
			day++;
		}	
		else{
			day = 1;
			var monthNum = 0;
			if(date.getMonth() + 2 < 13 ){
				monthNum = date.getMonth() + 2;
			}
			else{
				monthNum = 1;
				year++;
			}
			month = months[monthNum];
		}

		var newDateString = month + " " + day + " " + year;
		date = new Date(newDateString);
		return date;
	}

	var decrementDate = function(date){
		var dateString = date.toDateString();
		var day = parseInt(dateString.substring(8,10));
		var month = date.toDateString().substring(4,7);
		var year = parseInt(dateString.substring(11,15));


		if(day - 1 > 0){
			day--;		
		}
		else{
			var monthNum = 0;
			if(date.getMonth() > 1){
				monthNum = date.getMonth();
			}
			else{
				monthNum = 12;
				year--;
			}
			month = months[monthNum];
			day = daysOfMonth[month];
			
		}
		var newDateString = month + " " + day + " " + year;

		date = new Date(newDateString);

		return date;
	}

	var setWeek = function(date){
		week = [];
		for(var i = 0; i <7;i++){
			var day = parseInt(date.toDateString().substring(8,10))
			var month = date.toDateString().substring(4,7);
			var weekDay = date.toDateString().substring(0,4);
			var thisDate = day + " " + month;
			week.push(thisDate);
			date = incrementDate(date);
		}
	}

	var printWeek = function(){
		for(var i = 0;i <7;i++){
			var elementSelector =("main .dates ul li:nth-child(" + (i+3) + ") p");
			var $p = $(elementSelector);


		
			$p.text(week[i]);
		}
	}


	var moveLeft = function(){
		datePointingTo = decrementDate(datePointingTo);
		setWeek(datePointingTo);
		var dateToAdd = week[0];
		habits.forEach(function(habit){
			var daysFreq = habit.getDaysFreq();
			if(!(dateToAdd in daysFreq)){
				daysFreq[dateToAdd] = 0;	
			}
		});
		printWeek();
		printHabits();
		addListeners();
	}

	var moveRight = function(){
		datePointingTo = incrementDate(datePointingTo);
		setWeek(datePointingTo);
		var dateToAdd = week[6];		
		habits.forEach(function(habit){
			var daysFreq = habit.getDaysFreq();
			if(!(dateToAdd in daysFreq)){
				daysFreq[dateToAdd] = 0;	
			}
		});
		printWeek();
		printHabits();
		addListeners();
	}

	$("#right").on('click',function(){
		moveRight();
		return false;
	});

	$("#left").on('click',function(){
		moveLeft();
		return false;
	});


	






	

	class Habit{
		constructor(name,tag,good,freq,daysFreq){
			this.tag = tag;
			this.name = name;
			this.good = good;
			this.freq = freq;
			this.daysFreq = daysFreq;

			this.getDaysFreq = function(){
				return this.daysFreq;
			}

			this.getName = function () {
	        	return this.name;
	   		 };
	   		 this.setName = function(name){
	   		 	this.name = name;
	   		 }

	   		 this.getTag = function(){
	   		 	return this.tag;
	   		 }
	   		 this.setTag = function(tag){
	   		 	this.tag = tag;
	   		 }

	   		 this.getGood = function () {
	        	return this.good;
	   		 };
	   		 this.setGood = function(good){
	   		 	this.good = good;
	   		 }
	   		 this.getFreq= function(){
	   		 	return this.freq;
	   		 }
	   		 this.setFreq = function(freq){
	   		 	this.freq = freq;
	   		 }
	   		 this.addMark = function(date){
	   		 	if(this.daysFreq[date] < this.freq){
	   		 		this.daysFreq[date] = parseInt(this.daysFreq[date]) + 1;
	   		 	}
	   		 }
	   		 this.delMark = function(date){
	   		 	if(this.daysFreq[date] > 0){
	   		 		this.daysFreq[date] = parseInt(this.daysFreq[date]) - 1;
	   		 	}
	   		 }
	   		 this.equals = function(other){
	   		 	if(this.getName() == other.getName() &&
	   		 	   this.getTag() == other.getTag() &&
	   		 	   this.getGood() == other.getGood() &&
	   		 	   this.getFreq() == other.getFreq() )
	   		 	{
	   		 		return true;
	   		 	}
	   		 	else{
	   		 		return false;
	   		 	}
	   		 }
	   		
		}
	}

	var updateDateFreq =  function(habitIndex,date){
		var newFreq = habits[habitIndex].getDaysFreq()[date];
		var updateInfo = {
			'habitIndex':habitIndex,
			'date':date,
			'newFreq': newFreq
		}

		$.post("/updatehabit",updateInfo,function(result){
			console.log(result);
		})
	}


	var parseHabitJSON = function(habitObjects){
		var newHabits = [];

		for(var i = 0; i < habitObjects.length;i++){
			var habitObject =habitObjects[i];
			var name = habitObject['name'];
			var tag = habitObject['tag'];
			var freq = parseInt(habitObject['freq']);
			var good = (habitObject['good'] == 'true');
			var daysFreq = habitObject['daysFreq'];

			newHabits.push(new Habit(name,tag,good,freq,daysFreq));
		}

		return newHabits;
	}

	var updateHabitJSON = function(newHabitJSON){

		var newHabits = parseHabitJSON(newHabitJSON);

		habits = newHabits;

		printHabits();
		addListeners();
	}

	

	var calculuteWeekPrec = function(habit){
		var sum = 0
		console.log(habit);

		for(var l = 0;l < 7;l++){
			var	date = week[l];
			var daysFreq = habit.getDaysFreq();
			var freqToday = daysFreq[date];
			var ratio = freqToday / habit.getFreq();
			sum += ratio;
		}
		var percentage = sum / 7 * 100;
		percentage = Math.round(10*percentage) / 10;

		if(habit.getGood()){
			return percentage;
		}
		else{
			return (100-percentage);
		}
	}

	var habits = parseHabitJSON(habitObjects);

	var greenLowEnd = {'r':204,'g':255,'b':204};
	var greenHighEnd = {'r':0,'g':255,'b':0};
	var redLowEnd = {'r':255,'g':102,'b':102};
	var redHighEnd = {'r':255,'g':0,'b':0};

	var calculateColor = function(habit,dayIndex){
		var r,g,b;
		var isGood = habit.getGood();
		var	date = week[dayIndex];
		var daysFreq = habit.getDaysFreq();
		var freqToday = daysFreq[date];
		var ratio = freqToday / habit.getFreq();
		if(isGood){
			g = 255;
			r = Math.round(204-204 * ratio)
			b = r;
		}
		else{
			r =255
			g = Math.round(102-102 * ratio)
			b = g;
		}

		var rgb = "rgb(" + r + "," + g + "," + b +")";
		return rgb;
	}

	var printHabits = function(){
		$("main .content").empty();
		console.log(habits);

		for(var i = 0; i < habits.length;i++){
			var habit = habits[i];

			var $div = $("<div>").addClass('habit');
			
			//for info, name and tag
			var $span = $("<span>").addClass('info');
			$span.append($("<p>").text(habit.getTag()));
			$span.append($("<p>").text(habit.getName()));

			$div.append($span);

			var $ul = $("<ul>").addClass('boxes');

			for(var j = 0; j <7;j++){
				var progress = -1;
				if(week[j] in habit.getDaysFreq()){
					
				}
				else{
					habit.getDaysFreq()[week[j]] = 0;
				}
				progress = habit.getDaysFreq()[week[j]];
				var $li = $("<li id='square" + j + "'>").append($("<p>").text(progress + " / " + habit.getFreq()));
				$li.addClass('square');
				$li.css('background-color',calculateColor(habit,j));
				var $addButton = $("<button class='update' id='addMark"+ j +"'>+</button>")
				var $delButton = $("<button class='update' id='delMark"+ j +"'>-</button>")
				$li.append($addButton);
				$li.append($delButton);
				$ul.append($li);
			}

			$div.append($ul);

			var percentage = calculuteWeekPrec(habit);
			var $percSpan = $("<span>").addClass('percentage');
			
			var $idSpan = $("<span id='percentage" + i + "'>").text(percentage);
			var $perSpan = $("<span>").text("%");

			var theP = $("<p>").append($idSpan);
			theP.append($perSpan);

			$percSpan.append(theP);

			$div.append($percSpan);

			var $iconSpan = $("<span>").addClass('icons');
			$iconSpan.append($("<i id='delete" + i + "'>").addClass('fa fa-trash clickable'));
			$iconSpan.append($("<i id='change" + i + "'>").addClass('fa fa-cog clickable'));

			$div.append($iconSpan);

			$("main .content").append($div);
		}
	}

	var addHabit = function(habit){

		var habitJSON = {
			'name' : habit.getName(),
			'tag' : habit.getTag(),
			'good' : habit.getGood(),
			'freq' : habit.getFreq(),
			'daysFreq' : habit.getDaysFreq()
		}

	

		$.post("/addhabit",habitJSON,function(result){
			console.log(result);
		});

		habits.push(habit);
	}

	

	var changeHabit = function(index,habit){
		var habitJSON = {
			'name' : habit.getName(),
			'tag' : habit.getTag(),
			'good' : habit.getGood(),
			'freq' : habit.getFreq(),
			'daysFreq' : habit.getDaysFreq()
		}

		var send = {
			'habitJSON':habitJSON, "index" : index
		}

	

		$.post("/changehabit",send,function(result){
			console.log(result);
		});

		habits[index] = habit;
	}
	
	$("#plus").on('click',function(){
		$("#addDialog").css('display','block');

		$("#addHabit").on('click',function(){
			var name = $('#nameInput').val();
			var tag = $('#tagInput').val();
			var freq = $('#freqInput').val();
			var good = $('input[name=choice]:checked').val();
			if(good === 'true'){
				good = true;
			}
			else {
				good = false;
			}
			$("#nameInput").val("");
			$("#tagInput").val("");
			$("#freqInput").val("");
			$("#goodInput").prop('checked',true);

			var daysFreq = {};
			for(var i = 0; i < 7;i++){
				daysFreq[week[i]] = 0;
			}
	
			addHabit(new Habit(name,tag,good,freq,daysFreq));


			$("#addDialog").css('display','none');

			$("#addHabit").off();
			printHabits();
			addListeners();
		});

	});

	var removeHabit = function(i){
		habits.splice(i, 1);

		var removeJSON = {'index':i};

		$.post("/deletehabit",removeJSON,function(result){
			console.log(result);
		});
	}

	var addListeners = function(){
		$("main .content .fa-cog").toArray().forEach(function(element){
 			$(element).on("click", function () {
 
 				
 				var $element = $(element);
 				var index  = $element.attr('id').substring(6,7);

 				$("#addDialog").css('display','block');
 				$("#addDialog h1").text("Change habit");

 				$('#nameInput').val(habits[index].getName());
				$('#tagInput').val(habits[index].getTag());
				$('#freqInput').val(habits[index].getFreq());

				if(habits[index].getGood()){
					$("#goodInput").prop('checked',true);
				}
				else{
					$("#badInput").prop('checked',true);
				}

				$("#addHabit").on('click',function(){
					var name = $('#nameInput').val();
					var tag = $('#tagInput').val();
					var freq = $('#freqInput').val();
					var good = $('input[name=choice]:checked').val();
					if(good === 'true'){
						good = true;
					}
					else {
						good = false;
					}
					$("#addDialog h1").text("Add habit");
					$("#nameInput").val("");
					$("#tagInput").val("");
					$("#freqInput").val("");
					$("#goodInput").prop('checked',true);


					changeHabit(index,new Habit(name,tag,good,freq,habits[index].getDaysFreq()));


					$("#addDialog").css('display','none');

					$("#addHabit").off();
					printHabits();
					addListeners();
					return false;
				});
 				
 			});
 		})


		$("main .content .fa-trash").toArray().forEach(function(element){
 			$(element).on("click", function () {
 
 				
 				var $element = $(element);
 				var index  = $element.attr('id').substring(6,7);
 
 				removeHabit(index);
 				printHabits();
 				addListeners();
 				return false;
 			});
 		})

 		$("main .content .update").toArray().forEach(function(element){
 			$(element).on('click',function(){
 				$("main .content .square").css('color','red');

 				var $element = $(element)

 				var index = parseInt($element.parent().attr('id').substring(6,7));
 				var habitIndex = parseInt($element.parent().parent().parent().index());
 				var listSel = index + 3;
 				var $p = ($(".happy li:nth-child(" +(listSel)+") p"));
 				var date = $p.text();


 				var id = ($element.attr('id'));
 				if(id.substring(0,1) == 'a'){
 					habits[habitIndex].addMark(date);
 				}
 				else{
					habits[habitIndex].delMark(date);	 					
 				}
 				updateDateFreq(habitIndex,date);
 				printHabits();
 				addListeners();
 				return false;
 				

 			});
 		});
		
	}

	$("#sort").on('click',function(){
		var Habitpercentages = [];
		var percentages = [];
		for(var i = 0; i < habits.length;i++){
			var weekPrec = parseInt($("#percentage" + i).text());
			Habitpercentages.push(
			{
				weekPrec:i
			});
			percentages.push(weekPrec);
		}
		percentages.sort(function(a,b){
			return (b-a);
		})

		var newHabits = [];

		for(var j = 0;j < percentages.length;j++){
			var thisPercentage = percentages[j];

			var index = Habitpercentages[thisPercentage];

			newHabits.push(habits[i]);
		}
		
		
		habits = newHabits;
	});
	setWeek(datePointingTo);
	printWeek();

	printHabits();
	addListeners();

	setInterval(function () {
		$.getJSON("/../habits.json",function(newHabitJSON){
			updateHabitJSON(newHabitJSON);
		});
	}, 2000);
	

		
}

$(document).ready(function(){
	$.getJSON("/../habits.json",function(habitObjects){
		main(habitObjects);
	});
});