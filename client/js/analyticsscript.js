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
	var getAmountDoneTodaySameTag = function(){
		$.getJSON("/../amountDoneTodaySameTag.json",function(JSON){
			console.log(JSON);
			var $ul = $("#todayList");
			$ul.empty();
			for(var i =0; i < JSON.length;i++){
				var element  = JSON[i];
				var tag = element['tag'];
				var timesToday = element['timesToday'];
				var total = element['total'];

				var $li = $("<li>").text(tag + ": " + timesToday + "/" + total);
				$ul.append($li);
			}
		});
	}

	var getTop5GoodHabits =  function(){
		$.getJSON("/../top5GoodHabits.json",function(JSON){
			console.log(JSON);

			var $ul = $("#top5good");
			$ul.empty();
			for(var i =0; i < JSON.length;i++){
				var $li = $("<li>").text(JSON[i]);
				$ul.append($li);
			}
		})
	}

	var getTop5BadHabits =  function(){
		$.getJSON("/../top5BadHabits.json",function(JSON){
			console.log(JSON);

			var $ul = $("#top5bad");
			$ul.empty();
			for(var i =0; i < JSON.length;i++){
				var $li = $("<li>").text(JSON[i]);
				$ul.append($li);
			}
		})
	}	

	var getInfo = function(){
		getGoodHabitPercToday();
		getBadHabitPercToday();
		getAmountDoneTodaySameTag();
		getTop5GoodHabits();
		getTop5BadHabits();
	}

	getInfo();
	setInterval(function(){
		getInfo();
	},5000)
	
}



$(document).ready(main);