/* Accounts for leap year in forecast dropdown menu */
function daysInMonth(month, year) {
    var dd = new Date(year, month, 0);
    return dd.getDate();
}

function setDayDrop(dyear, dmonth, dday) {
    var year = dyear.options[dyear.selectedIndex].value;
    var month = dmonth.options[dmonth.selectedIndex].value;
    var day = dday.options[dday.selectedIndex].value;
    if (day == ' ') {
        var days = (year == ' ' || month == ' ') ? 31 : daysInMonth(month, year);
        dday.options.length = 0;
        dday.options[dday.options.length] = new Option(' ', ' ');
        for (var i = 1; i <= days; i++)
            dday.options[dday.options.length] = new Option(i, i);
    }
}

function setDay() {
    var year = document.getElementById('year');
    var month = document.getElementById('month');
    var day = document.getElementById('day');
    setDayDrop(year, month, day);
}

(function($) {
  $(document).ready(function() {
    $.slidebars();
  });
}) (jQuery);

$(function() { 
	$("#sb-forecasts").click(function(){
		$(".sub-li").toggleClass('displayed');
	});
});

/* Removes unnecessary items from navigation bar if javascript 
   enabled when document loads or window is resized */
$(function() {
	if ( $(window).width() < 768 ) {
		$('.sb-toggle-left').css({"display":"block"});
		$('nav').css({"display": "none"});
	}
	else {
		$('.sb-toggle-left').css({"display": "none"});
		$('nav').css({"display": "block"});
	}
});

$(window).on('resize', function() {
	if ( $(window).width() < 768 ) {
		$('.sb-toggle-left').css({"display":"block"});
		$('nav').css({"display": "none"});
	}
	else {
		$('.sb-toggle-left').css({"display": "none"});
		$('nav').css({"display": "block"});
	}
});

var timeZoneList = new Array();
	timeZoneList = [
		[0,"PDT","Pacific Daylight Time"],
		[0,"MST","Mountain Standard Time"],
		[1,"MDT","Mountain Daylight Time"],
		[1,"CST","Central Standard Time"],
		[2,"CDT","Central Daylight Time"]
	];

$(function() {
		var dropDownHTML = new String();
		dropDownHTML += '<select id="timeZoneSelect" onchange="changeTimeZone(this.value)"><option value="">Change Time Zone</option>';
		
		for (var a = 0; a < timeZoneList.length; a++) {
			dropDownHTML += '<option value="'+a+'">'+timeZoneList[a][2]+'</option>';
		}
		
		dropDownHTML += '</select>';
		document.getElementById("timeZoneDropDown").innerHTML = dropDownHTML;
		// The BC Airquality website has some fancy XML or AJAX stuff here, is it necessary/beneficial?
});