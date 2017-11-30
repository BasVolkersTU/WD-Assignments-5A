var main = function(){
	"use strict";

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
	});

	class Habit{
		constructor(name,tag,good,freq){
			this.tag = tag;
			this.name = name;
			this.good = good;
			this.freq = freq;
			this.daysFreq = {"1 Apr":0};
			this.streak = 0;

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
	   		 this.getFreq= function(){
	   		 	return this.freq;
	   		 }

	   		 this.getStreak = function(){
	   		 	return this.streak;
	   		 }
	   		 this.setStreak = function(streak){
	   		 	this.streak = streak;
	   		 }
	   		 this.addMark = function(date){
	   		 	this.daysFreq[date] = this.daysFreq[date] + 1;
	   		 }
	   		
		}
	}

	var habits = [];

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

			for(var j = 0; j < 7; j++){
				$col = $("<div class='col-sm-1 name square' id='square" + (7*i+j + 1) + "'>");
				var selector =".dates div:nth-child(" + (j+3) + ") p:first-child";
				var thisDay = $(selector).text();
				var freqThisDay = habit.getDaysFreq()[thisDay];
				$col.append($("<p>").text(freqThisDay + " / " + habit.getFreq()));
				$row.append($col);
			}

			//streak
			$col = $("<div class='col-sm-1 name'>");
			$col.append($("<p>").text(habit.getStreak()));
			$row.append($col);

			//gearwheel icon
			$col = $("<div class='col-sm-1 name'>");
			$col.append($("<i id='change" + (i+1) + "' class='fa fa-cog'>"));
			$row.append($col);

			//trash icon
			$col = $("<div class='col-sm-1 name'>");
			$col.append($("<i id='delete" + (i+1) + "' class='fa fa-trash'>"));
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

		var habit = new Habit(name,tag,good,freq);
		habits.push(habit);

		$dialog.dialog('close');

	    //clear textfields
	 	$("#nameInput").val("");
	    $("#tagInput").val("");

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
		$changeDialog.append($('<button id="confirmChanges">Ok</button>'));

		$("#confirmChanges").on("click",function(){
			console.log("confirmed changes");
			habit.setName($("#changeNameInput").val());
			habit.setTag($("#changeTagInput").val());
			$changeDialog.dialog('close');
			$changeDialog.empty();
			printHabits();
			addListeners();	
			return false;
		});
		
	}
	
	$("#plus").on("click",function(){
		$dialog.append($('<button id="addHabit">Add habit</button>'));

		$dialog.dialog('open');

		$("#addHabit").on("click",function(){
			addHabit();
			return false;
		});
		
		
		return false;
	});

	$("#left").on("click",function(){
		console.log("left");
		
		return false;
	});

	$("#right").on("click",function(){
		console.log("right");
		
		return false;
	});

	var addListeners = function(){
		$("main .content .square").toArray().forEach(function(element){
			$(element).on("click", function () {

				var $element = $(element);
				var index = parseInt(($element.parent().attr('id')).substring(3,4)) - 1;
				var date = $(".dates div:nth-child(" + ($element.index()+1) + ") p:first-child").text();
				console.log(date);
				console.log(habits[index]);
				habits[index].addMark(date);
				$element.css("background-color","green");
				console.log(habits[index].getDaysFreq()[date]);
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