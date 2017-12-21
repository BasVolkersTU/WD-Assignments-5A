var main = function(){
	var getGoodHabitPercToday = function(){
		$.getJSON("/../getGoodHabitPercToday.json",function(percentageJSON){
			console.log(percentageJSON['percentage']);
			$(".first p").text(percentageJSON['percentage'] + "%");
			
		});
	}
	var getBadHabitPercToday = function(){
		$.getJSON("/../getBadHabitPercToday.json",function(percentageJSON){
			console.log(percentageJSON['percentage']);
			$(".second p").text(percentageJSON['percentage'] + "%");
		});
	}

	getGoodHabitPercToday();
	getBadHabitPercToday();
}



$(document).ready(main);