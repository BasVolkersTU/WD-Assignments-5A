var main = function(){
	var getGoodHabitPercToday = function(){
		$.getJSON("/../getGoodHabitPercToday.json",function(percentageJSON){
			console.log(percentageJSON['percentage']);
			$(".first p").text((Math.round(parseFloat(percentageJSON['percentage']) * 100) / 100) + "%");
			
		});
	}
	var getBadHabitPercToday = function(){
		$.getJSON("/../getBadHabitPercToday.json",function(percentageJSON){
			console.log(percentageJSON['percentage']);
			$(".second p").text((Math.round(parseFloat(percentageJSON['percentage']) * 100) / 100) + "%");
		});
	}

	getGoodHabitPercToday();
	getBadHabitPercToday();
}



$(document).ready(main);