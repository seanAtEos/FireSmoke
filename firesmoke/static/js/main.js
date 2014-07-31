// declare global variables here
var timeZoneList = new Array();

// 
// Functions that run on startup
// 

// Load SlideBars - the javascript and css responsible for mobile navigation
(function($) {
  $(document).ready(function() {
    $.slidebars();
  });
}) (jQuery);

// set element with id #sb-forecasts as the button that toggles the left SlideBar
$(function() { 
	$("#sb-forecasts").click(function(){
		$(".sub-li").toggleClass('displayed');
	});
});

// Initizes the webpage for javascript enabled users (progressive enhancement)
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

// Changes list of images to single frame slideshow
$(window).load( function() {
    document.getElementById('forecast-controls').style.display = 'block';
    forecastImages = document.getElementById('forecast-imgs');
    imgs = forecastImages.children;
    for (i = imgs.length-1; i>0; i--) {
        imgs[i].parentNode.removeChild(imgs[i]);
    }
    initializeRangeSlider();
    dst(forecastDate);
    
});

// When window is resized adjust the webpage's responsive layout accordingly
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

// Initialize Slider to show which forecast img is being displayed
function initializeRangeSlider() {
    var len = OpsImgs.length-1
    var rs = document.createElement('Input');
    attrs = {"type":"range", "id":"forecast-slider", "onchange":"jump2img(this.value)", "min":0,"max":len, "step":0, "title": String(ImgNum) + '/' + String(len)}
    for (var key in attrs) {
        rs.setAttribute(key, attrs[key]);
    }
    fc = document.getElementById('forecast-controls');
    fc.insertBefore(rs, fc.firstChild);
}

// Initializes the timezone drop down menu based on timeZoneList's entries
function initializeDropDown() {
    var dropDownHTML = new String();
    dropDownHTML += '<select id="timeZoneSelect" onchange="changeDateTime()"><option value="">Change Time Zone</option>';

    for (i in timeZoneList) {
        dropDownHTML += '<option value="' + i + '">' + timeZoneList[i][1] + '</option>';
    }
    
    dropDownHTML += '</select>';
    document.getElementById("timeZoneDropDown").innerHTML = dropDownHTML;
}

// Checks to see if localStorage is supported in users browser
function checkLocalStorage() {
    if ( typeof(Storage) !== "undefined") {
        if (localStorage.timeZone) {
            // console.log(localStorage.timeZone);
            return localStorage.timeZone;
        }
    }
    else { //return default of UTC
        return "UTC";
    }
}

// Set the selected option as the value stored in localStorage if supported
function initializeTimeZone() {
    var selectedTz = checkLocalStorage();
    var sel = document.getElementById('timeZoneSelect')

    for(var i=0; i < sel.options.length; i++)
    {
      if(sel.options[i].value == selectedTz)
        sel.selectedIndex = i;
    }
}

// Determines if daylight savings time is currently in effect for user in users present state
function dst( currentDate ) {
    var dston;
    var dstoff;
    var currentDate = new Date();
    
    d = new Date(currentDate.getFullYear(), 3, 15);   //2nd sunday in March
    dston = d - d.getDay();
    d = new Date(currentDate.getFullYear(), 11, 8);   //1st Sunday in November
    dstoff = d - d.getDay();

    if (currentDate >= dston && currentDate < dstoff) {
        timeZoneList = {
            "UTC": [0, "UTC: Coordinated Univeral Time"],
            "PDT": [-7,"PDT: Pacific Daylight Time"],
            "MDT": [-6,"MDT: Mountain Daylight Time"],
            "CDT": [-5,"CDT: Central Daylight Time"],
            "EDT": [-4, "EDT: Eastern Daylight Time"],
            "ADT": [-3, "ADT: Atlantic Daylight Time"],
            "NDT": [-2.5, "NDT: Newfoundland Daylight Time"]
        }
    }
    else {
        timeZoneList = {
            "UTC": [0, "UTC: Coordinated Univeral Time"],
            "PST": [-8, "PST: Pacific Standard Time"],
            "MST": [-7, "MST: Mountain Standard Time"],
            "CST": [-6, "CST: Central Standard Time"],
            "EST": [-5, "EST: Eastern Standard Time"],
            "AST": [-4, "AST: Atlantic Standard Time"],
            "NST": [-3.5, "NST: Newfoundland Standard Time"]
        }
    }

    initializeDropDown();
    initializeTimeZone();
    chgImg(0);
}

function jump2img(val) {
    ImgNum = parseInt(val);
    document.querySelector('#forecast-imgs img').src = '../../' + OpsImgs[ImgNum];
    datespec = OpsImgs[ImgNum].substr(-14,10);
    changeDateTime();
}

// change image -1,0,+1 steps through the array of images
function chgImg(direction) {
    var ImgLen = OpsImgs.length-1;
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
        document.getElementById('forecast-slider').value = ImgNum;
        changeDateTime();
    }
}

// takes datespec and changes text on webpage to represent the date and time of the displayed image
function changeDateTime() {
    var imgDateTime = datespec2txt();
    var year  = imgDateTime[0];
    var month = mon2str( imgDateTime[1] );
    var day   = day2str( imgDateTime[2] );
    var date  = date2str( imgDateTime[3] );
    var time  = time2str( imgDateTime[4], imgDateTime[5]);
    
    // Maybe reduce this to a single line?
    document.getElementById('imageYear').innerHTML  = year;
    document.getElementById('imageMonth').innerHTML = month;
    document.getElementById('imageDay').innerHTML   = day;
    document.getElementById('imageDate').innerHTML  = date;
    document.getElementById('imageTime').innerHTML = time;
}

// converts the datespec to an array of strings representing the date: [year, month, day, date, time ]
function datespec2txt() {
    var d;
    var year    = datespec.substr(0,4);
    var month   = datespec.substr(4,2);
    var day     = datespec.substr(6,2);
    var hours   = datespec.substr(8,2);
    var minutes = 0;
    var tz      = getTimeZone();

    hours = String( parseInt(hours) + tz[1] );
    minutes = tz[2];
    d = new Date( Date.UTC(year, month-1, day, hours, minutes) );
    return [ d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes() ];
}

// returns an array representing the selected timezone: returns [ str tzAbbreviation, int hours, int minutes] (using C syntax)
function getTimeZone() {
    var tz = 'UTC';  // Default value
    var ddmenu = document.getElementById('timeZoneSelect');
    var timeZoneTxt = ddmenu.options[ddmenu.selectedIndex].text;

    for ( var i in timeZoneList) {
        if ( timeZoneTxt === timeZoneList[i][1] ) {
            if (Math.abs(timeZoneList[i][0]) % 1 !== 0 ) {
                tz = [i, Math.ceil( timeZoneList[i][0] ), -30]; // UTC-2.5 hrs instead of -3, and UTC-3.5hrs instead of -4
            }
            else {
                tz = [i, timeZoneList[i][0], 0];
            }
            localStorage.setItem('timeZone', i);
            break;
        }
        else {
            tz = ['UTC', 0, 0];
        }
    }
    return tz;
}



function loopOnceFwd() {
    // console.log('hi');
    var ImgLen = OpsImgs.length-1;
    if (document.images) {
        // console.log('ImgNum === ImgLen: ' + ImgNum === ImgLen);
        if (ImgNum >= ImgLen) {
            clearLoopInterval();
        }
        else {
            chgImg(1);
        }
    }
}

function loopOnceRev() {
    var ImgLen = OpsImgs.length-1;
    if (document.images) {
        if (ImgNum <= 0 ) {
            clearLoopInterval();
        }
        else {
            chgImg(-1);
        }
    }
}

function loopReflect(fwd) {
    var ImgLen = OpsImgs.length-1;
    if (document.images) {
        if (fwd === true && ImgNum >= ImgLen) {
            fwd = false;
            console.log('retreat!');
        }
        else if (fwd === false && ImgNum <= 0 ) {
            fwd = true;
            console.log('oneward ho!');
        }
        run = setTimeout(loopReflect, delay, fwd);

        if (fwd === true) {
            // start looping fwd through images
            loopOnceFwd();
        }
        else if (fwd === false) {
            // start looping rev through images
            loopOnceRev();
        }
    }
}

function clearLoopInterval() {
    if (lock === true) {
        lock = false;
        document.getElementById('toggle').src = "../../static/images/controls/play_animation.png";
        window.clearInterval(run);
    }
}

// Loop forward through the images continuously
function auto() {
    if (lock == true) {
        lock = false;
        document.getElementById('toggle').src = "../../static/images/controls/play_animation.png";
        window.clearInterval(run);
    }
    else if (lock == false) {
        lock = true;
        document.getElementById('toggle').src = "../../static/images/controls/pause.png";
        if ( document.getElementById('radio-once').checked ) {
            run = window.setInterval(loopOnceFwd, delay, true);
        }
        if ( document.getElementById('radio-loop').checked ) {
            run = window.setInterval('chgImg(1)', delay);
        }
        if ( document.getElementById('radio-reflect').checked ) {
            run = window.setTimeout(loopReflect, delay, true);
        }
        // changeSpd(0);
    }
}

// // Loop forward through the images continuously
// function auto() {
//     if (lock == true) {
//         lock = false;
//         document.getElementById('toggle').src = "../../static/images/controls/play_animation.png";
//         window.clearInterval(run);
//     }
//     else if (lock == false) {
//         lock = true;
//         document.getElementById('toggle').src = "../../static/images/controls/pause.png";
//         run = setInterval("chgImg(1)", delay);
//         changeSpd(0);
//     }
// }

// Go to first image
function firstImg() {
    ImgNum = 0;
    document.querySelector('#forecast-imgs img').src = '../../' + OpsImgs[ImgNum];
    datespec = OpsImgs[ImgNum].substr(-14,10);
    changeDateTime(datespec);
}

// Go to last image
function lastImg() {
    console.log('entered');
    ImgNum = OpsImgs.length - 1;
    document.querySelector('#forecast-imgs img').src = '../../' + OpsImgs[ImgNum];
    datespec = OpsImgs[ImgNum].substr(-14,10);
    changeDateTime(datespec);
}

// change the speed of the image looping
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

// modifies the month to be human readable
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

// modifies the day of the week to be human readable
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

// modifies the date to be human readable
function date2str(day) {
    var date;
    switch (day) {
        case 1:  date = '1st'; break;
        case 2:  date = '2nd'; break;
        case 3:  date = '3rd'; break;
        case 21: date = '21st'; break;
        case 22: date = '22nd'; break;
        case 23: date = '23rd'; break;
        case 31: date = '31st'; break;
        default:   date = String(day) + 'th'; break;
    }
    return date;
}

// modifies the time to be human readable
function time2str(hours, minutes) {
    var mins;
    if (minutes < 10) {
        mins = '0' + minutes;
    }
    else {
        mins = String(minutes);
    }
    return String(hours) + ':' + mins;
}

// Accounts for leap year in forecast dropdown menu - must test with new js code as I'm not sure if it works
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