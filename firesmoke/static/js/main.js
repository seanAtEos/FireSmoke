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

/* Global variables -- should I use UTC as the default? */
// var timeZoneList = new Array();
//     timeZoneList = [
//         [-8,"PDT","Pacific Daylight Time"], // -7 during daylight savings time
//         [-7,"MST","Mountain Standard Time"],
//         [-6,"MDT","Mountain Daylight Time"],
//         [-6,"CST","Central Standard Time"],
//         [-5,"CDT","Central Daylight Time"]
//     ];

// var timeZoneList = new Array();
//     timeZoneList = [
//         [-6,"MDT","Mountain Daylight Time"],
//         [-5,"CDT","Central Daylight Time"],
//         [-4,"EDT","Eastern Daylight Time"],
//         [-3,"ADT","Atlantic Daylight Time"],
//         [-2.5,"NDT","Newfoundland Daylight Time"]
//     ];

// var timeZoneList = [
//     [-8, "PST", "Pacific Time Zone"],  // PST: UCT-8 PDT: UTC-7
//     [-7, "MST", "Mountain Time Zone"], // MST: UTC-7 MDT: UTC-6
//     [-6, "CST", "Central Time Zone"],  // CST: UTC-6 CDT: UTC-5
//     [-5, "EST","Eastern Time Zone"],
//     [-4, "",""],
//     [-3, "",""],
//     [-2.5,"",""],
//     [],
//     [],
//     [],
// ]

// need timedelta function or equiv, need a means of incrementing days
// python datetime.weekday(): Mon=0, Sun=6
// javascript:                Sun=0, Sat=6

var timeZoneList = new Array();
timeZoneList = [
            [-8,"PST","Pacific Standard Time"],
            [-7,"PDT","Pacific Daylight Time"],
            [-7,"MST","Mountain Standard Time"],
            [-6,"MDT","Mountain Daylight Time"],
            [-6,"CST","Central Standard Time"],
            [-5,"CDT","Central Daylight Time"],
            [-5,"EST", "Eastern Standard Time"],
            [-4,"EDT", "Eastern Daylight Time"],
            [-4,"AST", "Atlantic Standard Time"],
            [-3,"ADT", "Atlantic Daylight Time"],
            [-3.5,"NST", "Newfoundland Standard Time"],
            [-2.5,"NST", "Newfoundland Daylight Time"]
        ];

// function dst( forecastDate ) {
//     var dston;
//     var dstoff;
//     // timeZoneList = new Array();

//     d = new Date(forecastDate.getFullYear(), 3, 15);   //2nd sunday in March
//     dston = d - d.getDay();
//     d = new Date(forecastDate.getFullYear(), 11, 8);   //1st Sunday in November
//     dstoff = d - d.getDay();

//     if (forecastDate >= dston && forecastDate < dstoff) {
//         // Write out timeZoneList
//         timeZoneList = [
//             [-7,"PDT","Pacific Daylight Time"],
//             [-6,"MDT","Mountain Daylight Time"],
//             [-5,"CDT","Central Daylight Time"],
//             [-4,"EDT", "Eastern Daylight Time"],
//             [-3,"ADT", "Atlantic Daylight Time"],
//             [-2.5,"NST", "Newfoundland Daylight Time"]
//         ];
//     }
//     else {
//         // plus 0 hours
//         timeZoneList = [
//             [-8,"PST","Pacific Standard Time"],
//             [-7,"MST","Mountain Standard Time"],
//             [-6,"CST","Central Standard Time"],
//             [-5,"EST", "Eastern Standard Time"],
//             [-4,"AST", "Atlantic Standard Time"],
//             [-3.5,"NST", "Newfoundland Standard Time"]
//         ];
//     }
//     return tzlist;
// }

function changeDateTime(datespec) {
    datespec = String(datespec);
    var year  = datespec.substr(0,4);
    var month = datespec.substr(4,2);
    var day   = datespec.substr(6,2);
    var hours = datespec.substr(8,2);
    var d     = new Date( year, month-1, day, hours );

    year  = d.getFullYear();
    month = mon2str( d.getMonth() );
    day   = day2str( d.getDay() );
    date  = date2str( d.getDate() );
    hours = d.getHours();
    document.getElementById('month').innerHTML = datespec;
    console.log(datespec);
    console.log(date);
}

// $(document).ready( function() {
//     var forecastDate = changeDateTime( forecastDate );
//     dst( forecastDate );
// });

/* Functions that run on startup */
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

// Progressive enhancement for forecast images
$(window).load( function() {
    document.getElementById('forecast-controls').style.display = 'block';
    forecastImages = document.getElementById('forecast-imgs');
    imgs = forecastImages.children;
    for (i = imgs.length-1; i>0; i--) {
        imgs[i].parentNode.removeChild(imgs[i]);
    }
});

//Functions that run on some specified event
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


function day2str(day) {
    switch (day) {
    case 0: day = "Sunday"; break;
    case 1: day = "Monday"; break;
    case 2: day = "Tuesday"; break;
    case 3: day = "Wednesday"; break;
    case 4: day = "Thursday"; break;
    case 5: day = "Friday"; break;
    case 6: day = "Saturday"; break;
    }
    return day;
}

function date2str(day) {
    var date;
    switch (day) {
        case '1':  date = '1st'; break;
        case '2':  date = '2nd'; break;
        case '3':  date = '3rd'; break;
        case '21': date = '21st'; break;
        case '22': date = '22nd'; break;
        case '23': date = '23rd'; break;
        case '31': date = '31st'; break;
        default:   date = String(day) + 'th'; break;
    }
    return date;
}

function mon2str(month) {
    switch(month) {
        case 0: month = "January"; break;
        case 1: month = "February"; break;
        case 2: month = "March"; break;
        case 3: month = "April"; break;
        case 4: month = "May"; break;
        case 5: month = "June"; break;
        case 6: month = "July"; break;
        case 7: month = "August"; break;
        case 8: month = "September"; break;
        case 9: month = "October"; break;
        case 10: month = "November"; break;
        case 11: month = "December"; break;
    }
    return month;
}

// function changeTimeZone() {
//     var ddmenu = document.getElementById('timeZoneSelect');
//     var timeZone = ddmenu.options[ddmenu.selectedIndex].text;
//     // associate selected index with timeZone list

//     console.log(timeZone);

//     // changeDateTime(datespec, tz);
// }



// // define timeZone class
// function timeZone() {
//     var tz = [];
// }

// timeZone.prototype = {
//     setTz:function() {
//         var tzSelect = document.getElementById('timeZoneSelect');

//     }
// };

// // define dateTime class
// function dateTime(dateSpec) {
//     var datespec = dateSpec;
//     var date = new Date();
//     var TimeZone = new timeZone();
// }

// dateTime.prototype = {
//     constructor: dateTime,
//     setDatespec:function(ds){
//         this.datespec = ds;
//     },
//     getDatespec:function(){
//         return this.datespec;
//     },
//     setTimeZone:function(tz){
//         this.Timezone = tz;
//     },
//     getTimeZone:function(){
//         return this.Timezone;
//     },
// }

function chgImg(direction) {
    
    if (document.images) {
        ImgNum = ImgNum + direction;
        if (ImgNum > ImgLen) {
            ImgNum = 0;
        }
        if (ImgNum < 0) {
            ImgNum = ImgLen;
        }
        document.querySelector('#forecast-imgs img').src = '../../' + OpsImgs[ImgNum];
        datespec = OpsImgs[ImgNum].substr(-14,10);
        changeDateTime(datespec);
    }
}

function auto() {
    if (lock == true) {
        lock = false;
        document.getElementById('toggle').src = "../../static/images/controls/play_animation.png";
        window.clearInterval(run);
    }
    else if (lock == false) {
        lock = true;
        document.getElementById('toggle').src = "../../static/images/controls/pause.png";
        run = setInterval("chgImg(1)", delay);
        changeSpd(0);
    }
}

function firstImg() {
        ImgNum = 0;
        document.getElementById('forecast-image-{{region}}').src = OpsImgs[ImgNum];
        datespec = OpsImgs[ImgNum].substr(-14,10);
        document.getElementById('imgtag').innerHTML = datespec;
}

function lastImg() {
        ImgNum = OpsImgs.length - 1;
        document.getElementById('forecast-image-{{region}}').src = OpsImgs[ImgNum];
        datespec = OpsImgs[ImgNum].substr(-14,10);
        document.getElementById('imgtag').innerHTML = datespec;
}

function changeSpd(dv) {
    delay = delay + dv;
    if (delay <= 50 ) {
        delay=50;
    }
    else if (delay>=950) {
        delay=950;
    }
    // document.getElementById('show-speed').innerHTML = delay;
    window.clearInterval(run)
    run = setInterval("chgImg(1)", delay);
}
