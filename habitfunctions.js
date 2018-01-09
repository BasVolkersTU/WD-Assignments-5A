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

var setWeek = function(date){
		var week = [];
		for(var i = 0; i <7;i++){
			var day = parseInt(date.toDateString().substring(8,10))
			var dayString = day;
			if(day < 10){
				dayString = "0" + dayString;
			}
			var month = date.getMonth()+1;
			if(month < 10){
				month = "0" + month;
			}
			var weekDay = date.toDateString().substring(0,4);
			var year = date.getFullYear();
			var thisDate = year + "-" + month + "-" + dayString;
			week.push(thisDate);
			date = incrementDate(date);
        }
        return week;
}

var calculateWeekPrec = function(habitFreq,freq){
    var thisWeek = setWeek(new Date());
    var totalDone = 0;
    for(var i =0;i < 7;i++){
        var date = thisWeek[i];
        var done = habitFreq[date];
        totalDone += done;
    }
    var percentage = (totalDone / (freq*7)) * 100
    var roundedPercentage = Math.round(10*percentage)/10
    return roundedPercentage;
}

var calculateColor = function(done,freq,good){
    var greenLowEnd = {'r':204,'g':255,'b':204};
	var greenHighEnd = {'r':0,'g':255,'b':0};
	var redLowEnd = {'r':255,'g':102,'b':102};
	var redHighEnd = {'r':255,'g':0,'b':0};

	var r,g,b;
    var ratio = done / freq
	if(good == 'true'){
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

module.exports.setWeek = setWeek;
module.exports.calculateWeekPrec = calculateWeekPrec;
module.exports.calculateColor = calculateColor;