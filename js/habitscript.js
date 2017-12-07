var main = function(){
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
		//console.log("new date: " + newDateString);
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
				console.log("new monthNum: " + monthNum);
			}
			else{
				monthNum = 12;
				year--;
			}
			month = months[monthNum];
			day = daysOfMonth[month];
			
		}
		var newDateString = month + " " + day + " " + year;
		console.log("new date: " + newDateString);
		date = new Date(newDateString);
		console.log(date);
		return date;
	}

	var setWeek = function(date){
		week = [];
		for(var i = 0; i <7;i++){
			var day = parseInt(date.toDateString().substring(8,10))
			var month = date.toDateString().substring(4,7);
			var weekDay = date.toDateString().substring(0,4);
			var thisDate = day + " " + month;
			week.push({
				"weekDay":weekDay,
				"date":thisDate
			});
			date = incrementDate(date);
		}
	}

	var printWeek = function(){
		for(var i = 0;i <7;i++){
			var divSelector =("main .dates div:nth-child(" + (i+3) + ")");
			var $pDate = $(divSelector + " p:first-child");
			$pDate.text(week[i]["date"]);

			var $pDay = $(divSelector + " p:nth-child(2)");
			$pDay.text(week[i]["weekDay"]);
			$pDay.text()
		}
	}










	

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
	   		 		this.daysFreq[date] = this.daysFreq[date] + 1;
	   		 	}
	   		 }
	   		 this.delMark = function(date){
	   		 	if(this.daysFreq[date] > 0){
	   		 		this.daysFreq[date] = this.daysFreq[date] - 1;
	   		 	}
	   		 }
	   		
		}
	}

	var calculuteWeekPrec = function(habit){
		var sum = 0
		for(var l = 0;l < 7;l++){
			var	date = week[l]["date"];
			var ratio = habit.getDaysFreq()[date] / habit.getFreq();
			console.log(ratio);
			sum += ratio;
		}
		var percentage = sum / 7 * 100;
		console.log(percentage);

		if(habit.getGood()){
			return percentage;
		}
		else{
			return (100-percentage);
		}
	}

	var habits = [];

	var greenLowEnd = {'r':204,'g':255,'b':204};
	var greenHighEnd = {'r':0,'g':255,'b':0};
	var redLowEnd = {'r':255,'g':102,'b':102};
	var redHighEnd = {'r':255,'g':0,'b':0};

	var calculateColor = function(isGood,ratio){
		console.log("Color: " + isGood);
		console.log("ratio: " + ratio)
		var r,g,b;
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
		console.log(rgb);
		return rgb;
	}

	var printHabits = function(){
		console.log(habits);
		console.log("printing habits");
		$("main .content").empty();

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
				var $li = $("<li>").append($("<p>").text("0 / " + habit.getFreq()));
				$ul.append($li);
			}

			$div.append($ul);

			var $iconSpan = $("<span>").addClass('icons');
			$iconSpan.append($("<i>").addClass('fa fa-trash'));
			$iconSpan.append($("<i>").addClass('fa fa-cog'));

			$div.append($iconSpan);

			$("main .content").append($div);
		}
	}

	var addHabit = function(habit){
		habits.push(habit);
	}

	var changeHabit = function(habit){
		
		console.log(habit);

		var $div = $('<div>');
		var $span1 = $('<span class="leftbox">')
		var $span2 = $('<span class="rightbox">')
		var $inputGood = $('<input type="radio" id="goodChangeHabit" name="days" value="true"/>')
		var $inputBad = $('<input type="radio" id="badChangeHabit" name="days" value="false"/>');
		$div.append('<p>Is it a good or bad habit?</p>')
		if(habit.getGood()){
			$inputGood.attr("checked","checked");
		}
		else{
			$inputBad.attr("checked","checked");
		}

		$span1.append($inputGood);
		$span1.append('<label for="goodChangeHabit">Good Habit</label>');
		$div.append($span1);

		$span2.append($inputBad);
		$span2.append('<label for="badChangeHabit">Bad Habit</label>');
		$div.append($span2);

		
		

		var confirmChanges = function(){
			console.log("confirmed changes");
			habit.setName($("#changeNameInput").val());
			habit.setTag($("#changeTagInput").val());
			habit.setFreq($("#changeFreqInput").val());

			var good = $('#goodChangeHabit:checked').val();
			if(good){
				habit.setGood(true);
				console.log("setting habit to good");
			}
			else{
				habit.setGood(false);
				console.log("setting habit to bad");
			}

			$div.empty();
			$inputBad.empty();
			$inputGood.empty();
			printHabits();
			addListeners();	
		}

		$("#confirmChanges").on("click",function(){
			confirmChanges();
			return false;
		});

		$(document).keypress(function(e) {
		    if(e.which == 13) {
		        confirmChanges();
		        $(document).off();
				return false;
		    }
		});
		
	}

	var moveLeft = function(){
		datePointingTo = decrementDate(datePointingTo);
		console.log("Pointer: " + datePointingTo);
		setWeek(datePointingTo);
		var dateToAdd = week[0]['date'];
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
		console.log("Pointer: " + datePointingTo);
		setWeek(datePointingTo);
		var dateToAdd = week[6]['date'];		
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
	
	addHabit(new Habit("name","tag",true,5,{}));
	printHabits();
	console.log(habits);

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


			addHabit(new Habit(name,tag,good,freq,{}));
			console.log(habits);


			$("#addDialog").css('display','none');

			$("#addHabit").off();
			printHabits();
		});

	});
	

		
}

$(document).ready(main);