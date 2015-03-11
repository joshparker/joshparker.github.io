/**
 Copyright (c) 2015, Joshua Parker
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 Redistributions in binary form must reproduce the above copyright notice, this
 list of conditions and the following disclaimer in the documentation and/or
 other materials provided with the distribution.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var icons = {
	'01d': "sunny",
	'02d': "mostly-sunny",
	'03d': "mostly-cloudy",
	'04d': "mostly-cloudy",
	'09d': "rain",
	'10d': "rain",
	'11d': "thunderstorm",
	'13d': "snow",
	'50d': "fog",
	'01n': "clear-night",
	'02n': "mostly-clear-night",
	'03n': "mostly-cloudy-night",
	'04n': "mostly-cloudy-night",
	'09n': "scattered-showers-night",
	'10n': "scattered-showers-night",
	'11n': "scattered-thunderstorms-night",
	'13n': "scattered-snow-night",
	'50n': "fog"
};

$(document).ready(function() {	
	$('input').keypress(function(event) {
		if (event.keyCode == 13) {
			search(event.target.value);
		}
	});
	getClock();
	setInterval(getClock, 1000);
	search("Salt Lake City, UT");
});

function getClock() {
	var d = new Date();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	var url;

	if (hours > 12) {
		hours -= 12;
	} else if (hours === 12) {
		hours = 12;
	}

	if (minutes < 10) {
		minutes = "0"+minutes;
	}

	var time = hours+":"+minutes;
	var date = d.getMonth()+1+"/"+d.getDate()+"/"+d.getFullYear();
	var hour = d.getHours();

	$('#date').html(date)
	$('#time').html(time);

	// Change the header image based on the time
	// TODO: Get city local, sunset, and sunset times
	
	if (hour >= 6 && hour < 8) {
		// Dawn
		headerImage = 'http://lh5.ggpht.com/LeDpxkfCDssG2jwo20Tg01UxnUc4-PZUojwKsPzIQoGJ_CgbXc7KVko8o3nk5zA=w9999-h9999';
	} else if (hour >= 8 && hour < 15) {
		// Day
		headerImage = 'http://lh5.ggpht.com/bosDZkBJxNdwo-dXGZeBkYtfCVnTFq96zqC08UV4dmIccI4YBr5p0CyCE7vmj2w=w9999-h9999';
	} else if (hour >= 15 && hour < 19) {
		// Dusk
		headerImage = 'http://lh4.ggpht.com/DCGfFj7ILzkFXXDgCliyTAq-cjKs8eyoTstREjhB2grAzzjYnlelGfpIQ4cEX4c=w9999-h9999';
	} else if (hour >= 19 || hour >= 0 && hour < 6) {
		// Night
		headerImage = 'http://lh6.ggpht.com/QgqUFGYoAxRkyvbl_5Hq2L6CTsaGXt9kaqrMdSxga-462Uyv2IViGw7OBzDMWNI=w9999-h9999';
	}
	headerImage = 'url('+headerImage+')';
	$('header').css('background-image', headerImage);
}

function search(input) {
	// search input pattern matching
	var re1='([a-zA-Z\s].*)';	// Command Seperated Values 1
	var re2='(,)';	// Any Single Character 1
	var re3='( ?)';	// White Space 1
	var re4='((?:(?:AL)|(?:AK)|(?:AS)|(?:AZ)|(?:AR)|(?:CA)|(?:CO)|(?:CT)|(?:DE)|(?:DC)|(?:FM)|(?:FL)|(?:GA)|(?:GU)|(?:HI)|(?:ID)|(?:IL)|(?:IN)|(?:IA)|(?:KS)|(?:KY)|(?:LA)|(?:ME)|(?:MH)|(?:MD)|(?:MA)|(?:MI)|(?:MN)|(?:MS)|(?:MO)|(?:MT)|(?:NE)|(?:NV)|(?:NH)|(?:NJ)|(?:NM)|(?:NY)|(?:NC)|(?:ND)|(?:MP)|(?:OH)|(?:OK)|(?:OR)|(?:PW)|(?:PA)|(?:PR)|(?:RI)|(?:SC)|(?:SD)|(?:TN)|(?:TX)|(?:UT)|(?:VT)|(?:VI)|(?:VA)|(?:WA)|(?:WV)|(?:WI)|(?:WY)))(?![a-z])';	// US State 1

	//input validation
	console.log(input);
	var p = new RegExp(re1+re2+re3+re4,["i"]);
	var m = p.exec(input);

	console.log(m);

	if (m!=null) {
		var city = m[1];
		var state = m[4];
		$('input').attr('placeholder', city+", "+state);
		console.log("city: "+city);
		console.log("st: "+state);
		/*$('#weather').html('');
		$('#forecast').html('');*/
		$.getJSON("http://api.openweathermap.org/data/2.5/weather?q="+city.split(' ').join('+')+","+state+"&units=imperial", function(data) {
			postCurrent(data);
		});
		$.getJSON( "http://api.openweathermap.org/data/2.5/forecast/daily?q="+city.split(' ').join('+')+","+state+"&units=imperial&cnt=14", function( data ) {
			postForecast(data);
		});
	}
}

function postCurrent(weatherData) {
	console.log(weatherData);
	var date = new Date();

	var city = weatherData.name;
	var current = weatherData.weather[0].main;
	var windspeed = Math.round(weatherData.wind.speed);
	var humidity = Math.round(weatherData.main.humidity);
	var temp = Math.round(weatherData.main.temp);

	var icon = weatherData.weather[0].icon;

	var html = [
		'<section class="card">',
			'<section>',
				'<span id="city"><h1>', city, '</h1></span>',
				'<span class="condition" id="current"><h2>', current, '</h2></span>',
				'<span class="condition" id="wind-speed"><h2>Wind ', windspeed, 'mph</h2></span>',
				'<span class="condition" id="humidity"><h2>Humidity ', humidity, '&#37</h2></span>',
			'</section>',
			'<section>',
			'	<img class="icon-large" id="', icons[icon], '"></img>',
			'	<span class="temperature" id="temp">', temp, '&deg</span>',
			'</section>',
		'</section>'
		].join('');

		$('#weather').html(
			html
		);
}

function postForecast(weatherData) {
	console.log(weatherData);
	
	var d = new Date();
	var day = d.getDay();

	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];		
	var list = weatherData.list;

	Array.prototype.max = function() {
	  return Math.max.apply(null, this);
	};

	Array.prototype.min = function() {
	  return Math.min.apply(null, this);
	};

	$('#forecast').html('');
	for (index=day; index<day+7; index++) {
		// Parse weather data
		var main = weatherData.list[index].weather[0].main;
		var icon = weatherData.list[index].weather[0].icon;
		var temp = weatherData.list[index].temp;
		var range = [];
		var low, high;
		for (var key in temp) {
			if (temp.hasOwnProperty(key)) {
				range.push(temp[key]);
			}
		}

		// Get the lows and highs of the temperatures throughout the day
		var low = Math.round(range.min());
		var high = Math.round(range.max());

		var current = $([
			'<section class="card-forecast">',
				'<section class="forecast-day">',
				'</section>',
				'<section class="forecast">',
					'<img class="icon" id="na"></img>',
					'<p><span>High: ', high, '&deg</span><span>Low: ', low, '&deg</span></p>',
				'</section>',
				'<section class="forecast" id="main">',
					'<p><span></span></p>',
				'</section>',
			'</section>'
		].join(''));

		$('#forecast').append(current);

		$(current).find('.icon').attr('id', icons[icon]);
		$(current).find('.forecast-day').html(days[index%7]);
		$(current).find('.high').html(high);
		$(current).find('.low').html(low);
		$(current).find('#main').html(main);

		var n = 1.1+(index/10);
		$(current).css('-webkit-animation-delay', n+'s')
	}
}