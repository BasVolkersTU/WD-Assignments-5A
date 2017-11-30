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


	setWeek(datePointingTo);
	printWeek();
	console.log(week);









	//Initialize dialog
	var $dialog = $("#dialog").dialog({
		    autoOpen: false,
	    show: {
	        effect: "blind",
	        duration: 1000
	    },
	    hide: {
	        effect: "fade",
	        duration: 0
    	},
    	resizable:false,
    	modal:true,
    	maxWidth:500,
        maxHeight: 400,
        width: 500,
        height: 400
	});

	//Initialize changeDialog
	var $changeDialog = $("#changeDialog").dialog({
		    autoOpen: false,
	    show: {
	        effect: "blind",
	        duration: 1000
	    },
	    hide: {
	        effect: "fade",
	        duration: 0
    	},
    	resizable:false,
    	modal:true,
    	maxWidth:500,
        maxHeight: 350,
        width: 500,
        height: 350
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
		$(".content").empty();

		for(var i = 0; i < habits.length;i++){
			var habit = habits[i];

			var $row = $("<div id='row" + (i+1) + "'class='row'>");

			//tag
			var $col = $("<div class='col-sm-1 tag'>");
			$col.append($("<p>").text(habit.getTag()));
			$row.append($col);

			//name
			$col = $("<div class='col-sm-1 name'>");
			$col.append($("<p>").text(habit.getName()));
			$row.append($col);

			//squares
			for(var j = 0; j < 7; j++){
				$col = $("<div class='col-sm-1 square' id='square" + (7*i+j + 1) + "'>");
				var selector =".dates div:nth-child(" + (j+3) + ") p:first-child";
				var thisDay = $(selector).text();
				var freqThisDay = habit.getDaysFreq()[thisDay];
				$col.append($("<p>").text(freqThisDay + " / " + habit.getFreq()));
				$col.append($("<button id='button" + (j+1) + "add'>+</button>"))
				$col.append($("<button id='button" + (j+1) + "del'>-</button>"))

				var backgroundColor = calculateColor(habit.getGood(),(freqThisDay/habit.getFreq()));
				if(habit.getGood() && freqThisDay > 0){
					$col.css("background",backgroundColor);
				}
				else if(!habit.getGood() && freqThisDay > 0){
					$col.css("background",backgroundColor);
				}
				$row.append($col);
			}

			

			//gearwheel icon
			$col = $("<div class='col-sm-1 '>");
			$col.append($("<i id='change" + (i+1) + "' class='fa fa-cog'>"));
			$row.append($col);

			//trash icon
			$col = $("<div class='col-sm-1 '>");
			$col.append($("<i id='delete" + (i+1) + "' class='fa fa-trash'>"));
			$row.append($col);

			//percentage
			$col = $("<div class='col-sm-1 percentage'>");
			$col.append($("<p>").text(Math.round(calculuteWeekPrec(habit)*10)/10 + "%"));
			$row.append($col);

			var $habit = $("<div class='habit'>");
			$habit.append($row);
			$("main .content").append($habit);


		}
	}


	printHabits();

	var addHabit = function(){
		console.log("calling add habit");

		var name = $("#nameInput").val();
		var tag = $("#tagInput").val();
		var freq = $("#freqInput").val();

		var good = $('#goodHabit:checked').val();
		if(good == null){
			good = false;
		}

		var daysFreq = {};
		for(var k = 0;k < 7;k++){
			daysFreq[week[k]["date"]] = 0;
		}


		var habit = new Habit(name,tag,good,freq,daysFreq);
		habits.push(habit);

		$dialog.dialog('close');

	    //clear textfields
	 	$("#nameInput").val("");
	    $("#tagInput").val("");
	    $("#freqInput").val("");

		//uncheck buttons
		for(var i = 1;i <= 7;i++){
			$('#day' + i + ':checked').prop("checked", false);
		}

		$("#goodHabit").prop("checked", true);

		$dialog.children().last().remove();
		printHabits();
		addListeners();	
	}

	var changeHabit = function(habit){
		$changeDialog.dialog('open');
		console.log(habit);

		$changeDialog.append('<h1>Change habit</h1>')
		$changeDialog.append('<p>Name:<input value ="' + habit.getName() + '" class="textInput" id="changeNameInput" type="text" /></p>');
		$changeDialog.append('<p>Tag:<input value ="' + habit.getTag() + '" class="textInput" id="changeTagInput" type="text" /></p>')
		$changeDialog.append('<p>Frequency:<input value ="' + habit.getFreq() + '" class="textInput" id="changeFreqInput" type="text" /></p>')
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

		$changeDialog.append($div);
		$changeDialog.append($('<button id="confirmChanges">Ok</button>'));

		

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

			$changeDialog.dialog('close');
			$changeDialog.empty();
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
	
	$("#plus").on("click",function(){
		$dialog.append($('<button id="addHabit">Add habit</button>'));

		$dialog.dialog('open');

		$("#addHabit").on("click",function(){
			addHabit();
			return false;
		});
		$(document).keypress(function(e) {
		    if(e.which == 13) {
		        addHabit();
		        $(document).off();
				return false;
		    }
		});
		
		
		return false;
	});


	$("#left").on("click",function(){
		moveLeft();
		return false;
	});

	$("#right").on("click",function(){
		moveRight();
		return false;
	});

	/*
	$(document).on("keydown",function(e){
		if(e.which == 39){
			moveRight();
		}
		else if(e.which == 37){
			moveLeft();
		}
		return false;
	});*/

	$("#sort").on("click",function(){
		var newHabits = habits;
		console.log(newHabits);

		newHabits.sort(function(a,b){
			return (calculuteWeekPrec(b)-calculuteWeekPrec(a));
		});

		console.log("Sorted:")
		console.log(newHabits);

		habits = newHabits;
		printHabits();
		addListeners();
	});

	var addListeners = function(){
		$("main .content button").toArray().forEach(function(element){
			$(element).on("click", function () {
				var $element = $(element);
				console.log($element);
				var id = (($element.attr('id')));
				var dateNum = (parseInt(id.substring(6,7)));
				var habitIndex = ($element.parent().parent().parent().index());
				console.log("habitIndex = " + habitIndex);
				var date = $(".dates div:nth-child(" + (2+dateNum) + ") p:first-child").text();
				console.log("Date: " + date);
				console.log("Id: " + id.substring(7,10));
				
				if(id.substring(7,10) == "add"){
					habits[habitIndex].addMark(date);
				}
				else{
					habits[habitIndex].delMark(date);
				}

			



				printHabits();
				addListeners();
				return false;
			});
		});

		$("main .content .fa-trash").toArray().forEach(function(element){
			$(element).on("click", function () {

				
				var $element = $(element);
				console.log($element.attr('id'));
				var index = parseInt($element.attr('id').substring(6,7)) - 1;
				console.log("Index to be deleted: " + index);

				habits.splice(index,1);
				printHabits();
				addListeners();
				return false;
			});
		});

		$("main .content .fa-cog").toArray().forEach(function(element){
			$(element).on("click", function () {

				var $element = $(element);
				console.log($element.attr('id'));
				var index = parseInt($element.attr('id').substring(6,7)) - 1;
				console.log("Index to be changed: " + index);

				changeHabit(habits[index]);
				return false;
			});
		});

	}

	

	

		
}

$(document).ready(main);