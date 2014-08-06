
// Load SlideBars and intialize view based on display width
(function($) {
    $(document).ready(function() {
        $.slidebars();
        $("#sb-forecasts").click(function(){
            $(".sub-li").toggleClass('displayed');
        });
    });
    
    if ( $(window).width() < 768 ) {
        $('.sb-toggle-left').css({"display":"block"});
        $('nav').css({"display": "none"});
    }
    else {
        $('.sb-toggle-left').css({"display": "none"});
        $('nav').css({"display": "block"});
    }

    setDay();
}) (jQuery);

// Register all events
(function($) {
    // Register events to handle the forecast gallery controls
    $('#radio-once').click( function(){
        window.clearInterval(forecast.run);
        if ( forecast.ImgNum >= forecast.OpsImgs.length-1) { 
            forecast.ImgNum = 0;
            document.getElementById('forecast-slider').value = forecast.ImgNum;
        }
        forecast.fwd = true;
        forecast.run = setTimeout(loopOnceFwd, forecast.delay);
    });
    $('#radio-loop').click( function(){
        window.clearInterval(forecast.run);
        forecast.fwd = true;
        forecast.run = setTimeout(loopContinuous, forecast.delay);
    });
    $('#radio-reflect').click( function(){
        window.clearInterval(forecast.run);
        forecast.run = setTimeout(loopReflect, forecast.delay);
    });

    $('#deformField1').change( function(){
        setDay();
    });
    $('#deformField2').change( function(){
        setDay();
    });

}) (jQuery);

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

// if forecast page initialize the slideshow
$(window).load( function() {
    if (forecast) {
        document.getElementById('forecast-controls').style.display = 'block';
        forecastImages = document.getElementById('forecast-imgs');
        imgs = forecastImages.children;
        for (i = imgs.length-1; i>0; i--) {
            imgs[i].parentNode.removeChild(imgs[i]);
        }
        forecast.ImgLen = forecast.OpsImgs.length-1;
        initializeRangeSlider();
        dst();
    }
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
    console.log('intializeRangeSlider()');
    var len = forecast.OpsImgs.length-1;
    var rs = document.createElement('Input');
    attrs = {"type":"range", "id":"forecast-slider", "onchange":"jump2img(this.value)", "min":0,"max":len, "step":0, "title": String(forecast.ImgNum) + '/' + String(len)}
    
    for (var key in attrs) {
        rs.setAttribute(key, attrs[key]);
    }
    fc = document.getElementById('forecast-controls');
    fc.insertBefore(rs, fc.firstChild);
}

// Initializes the timezone drop down menu based on forecast.timeZoneList's entries
function initializeDropDown() {
    var dropDownHTML = new String();
    dropDownHTML += '<select id="timeZoneSelect" onchange="changeDateTime()"><option value="">Change Time Zone</option>';

    for (i in forecast.timeZoneList) {
        dropDownHTML += '<option value="' + i + '">' + forecast.timeZoneList[i][1] + '</option>';
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
function dst() {
    var dston;
    var dstoff;
    var currentDate = new Date();
    
    d = new Date(currentDate.getFullYear(), 3, 15);   //2nd sunday in March
    dston = d - d.getDay();
    d = new Date(currentDate.getFullYear(), 11, 8);   //1st Sunday in November
    dstoff = d - d.getDay();

    if (currentDate >= dston && currentDate < dstoff) {
        forecast.timeZoneList = {
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
        forecast.timeZoneList = {
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
    forecast.ImgNum = parseInt(val);
    document.querySelector('#forecast-imgs img').src = '../../' + forecast.OpsImgs[forecast.ImgNum];
    forecast.datespec = forecast.OpsImgs[forecast.ImgNum].substr(-14,10);
    changeDateTime();
}

// change image -1,0,+1 steps through the array of images
function chgImg(direction) {
    if (document.images) {
        forecast.ImgNum = forecast.ImgNum + direction;

        if (forecast.ImgNum > forecast.ImgLen) {
            forecast.ImgNum = 0;
        }
        if (forecast.ImgNum < 0) {
            forecast.ImgNum = forecast.ImgLen;
        }
        document.querySelector('#forecast-imgs img').src = '../../' + forecast.OpsImgs[forecast.ImgNum];
        forecast.datespec = forecast.OpsImgs[forecast.ImgNum].substr(-14,10);
        document.getElementById('forecast-slider').value = forecast.ImgNum;
        changeDateTime();
    }
}

// takes forecast.datespec and changes text on webpage to represent the date and time of the displayed image
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

// converts the forecast.datespec to an array of strings representing the date: [year, month, day, date, time ]
function datespec2txt() {
    var d;
    var year    = forecast.datespec.substr(0,4);
    var month   = forecast.datespec.substr(4,2);
    var day     = forecast.datespec.substr(6,2);
    var hours   = forecast.datespec.substr(8,2);
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

    for ( var i in forecast.timeZoneList) {
        if ( timeZoneTxt === forecast.timeZoneList[i][1] ) {
            if (Math.abs(forecast.timeZoneList[i][0]) % 1 !== 0 ) {
                tz = [i, Math.ceil( forecast.timeZoneList[i][0] ), -30]; // UTC-2.5 hrs instead of -3, and UTC-3.5hrs instead of -4
            }
            else {
                tz = [i, forecast.timeZoneList[i][0], 0];
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

function loopContinuous() {
    if (document.images) {
        if (forecast.ImgNum >= forecast.ImgLen) {
            document.getElementById('forecast-slider').value = forecast.ImgNum;
        }
        chgImg(1);
        forecast.run = setTimeout(loopContinuous, forecast.delay);
    }
}

function clearLoopInterval() {
    if (forecast.lock === true) {
        forecast.lock = false;
        document.getElementById('toggle').src = "../../static/images/controls/play_animation.png";
        window.clearInterval(forecast.run);
    }
}

function loopReflect(fwd) {
    if (document.images) {
        if (forecast.fwd === true && forecast.ImgNum >= forecast.ImgLen) {
            forecast.fwd = false;
            console.log('retreat!')
        }
        else if (forecast.fwd === false && forecast.ImgNum <= 0 ) {
            forecast.fwd = true;
            console.log('onward ho!');
        }
        if (forecast.fwd === true) {
            chgImg(1);
        }
        else if (forecast.fwd === false) {
            chgImg(-1)
        }
        forecast.run = setTimeout(loopReflect, forecast.delay);
    }
}

function loopOnceFwd() {
    if (document.images) {
        if (forecast.ImgNum >= forecast.ImgLen) {
            console.log('end of run');
            clearLoopInterval();
        }
        else {
            console.log('about to call chgImg(1), forecast.delay: ' + forecast.delay);
            chgImg(1);
            forecast.run = setTimeout(loopOnceFwd, forecast.delay)
        }
    }
}

// Loop forward through the images continuously
function auto() {
    if (forecast.lock == true) {
        forecast.lock = false;
        document.getElementById('toggle').src = "../../static/images/controls/play_animation.png";
        // clear forecast.run
        window.clearInterval(forecast.run);
    }
    else if (forecast.lock == false) {
        forecast.lock = true;
        document.getElementById('toggle').src = "../../static/images/controls/pause.png";
        // set forecast.run
        if ( document.getElementById('radio-once').checked ) {
            if ( forecast.ImgNum >= forecast.OpsImgs.length-1) { 
                forecast.ImgNum = 0;
                document.getElementById('forecast-slider').value = forecast.ImgNum;
            }
            forecast.fwd = true;
            forecast.run = setTimeout(loopOnceFwd, forecast.delay);
        }
        if ( document.getElementById('radio-loop').checked ) {
            forecast.fwd = true;
            forecast.run = setTimeout(loopContinuous, forecast.delay);
        }
        if ( document.getElementById('radio-reflect').checked ) {
            forecast.run = setTimeout(loopReflect, forecast.delay);
        }
        // changeSpd(0);
    }
}

// Go to first image
function firstImg() {
    forecast.ImgNum = 0;
    document.querySelector('#forecast-imgs img').src = '../../' + forecast.OpsImgs[forecast.ImgNum];
    forecast.datespec = forecast.OpsImgs[forecast.ImgNum].substr(-14,10);
    changeDateTime(forecast.datespec);
}

// Go to last image
function lastImg() {
    console.log('entered');
    forecast.ImgNum = forecast.OpsImgs.length - 1;
    document.querySelector('#forecast-imgs img').src = '../../' + forecast.OpsImgs[forecast.ImgNum];
    forecast.datespec = forecast.OpsImgs[forecast.ImgNum].substr(-14,10);
    changeDateTime(forecast.datespec);
}

// change the speed of the image looping
function changeSpd(dv) {
    forecast.delay = forecast.delay + dv;
    if (forecast.delay <= 50 ) {
        forecast.delay=50;
    }
    else if (forecast.delay>=950) {
        forecast.delay=950;
    }
    document.getElementById('displaySpeed').innerHTML = forecast.delay;
    // window.clearInterval(forecast.run)
    // forecast.run = setInterval("chgImg(1)", forecast.delay);
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

function str2mon(month) {
    console.log('in str2mon')
        switch(month) {
        case 'jan': month = 1; break;
        case 'feb': month = 2; break;
        case 'mar': month = 3; break;
        case 'apr': month = 4; break;
        case 'may': month = 5; break;
        case 'jun': month = 6; break;
        case 'jul': month = 7; break;
        case 'aug': month = 8; break;
        case 'sep': month = 9; break;
        case 'oct': month = 10; break;
        case 'nov': month = 11; break;
        case 'dec': month = 12; break;
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

// Accounts for leap year in forecast dropdown menu - must test with new js code as I'm not sure if it works
function daysInMonth(month, year) {
    month = str2mon(month);
    var dd = new Date(year, month, 0);
    return dd.getDate();
}

function setDayDrop(dyear, dmonth, dday) {
    var newOption;
    var year = dyear.options[dyear.selectedIndex].value;
    var month = dmonth.options[dmonth.selectedIndex].value;
    var day = dday.options[dday.selectedIndex].value;
    var days = daysInMonth(month, year);
    
    while (dday.firstChild) {
        dday.removeChild(dday.firstChild);
    }

    for (var i = 1; i <= days; i++) {
        newOption = document.createElement('option');
        newOption.value = i;
        newOption.innerHTML = i;
        dday.appendChild( newOption );
    }
}

function setDay() {
    var year = document.getElementById('deformField1');
    var month = document.getElementById('deformField2');
    var day = document.getElementById('deformField3');
    setDayDrop(year, month, day);
}