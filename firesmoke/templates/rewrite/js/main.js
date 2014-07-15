// looks up any number of string arguments as id'string
// and returns an opject that maps id's to corresponding
// Element object.  Throws an error if any id's undefined
function getElements() {
	var elements = {};
	for (var i = 0; i < arguments.length; i++) {
		var id = arguments[i];
		var elt = document.getElementById( id );
		if (elt === null){
			throw new Error( "No element with id: " + id );
		}
		elements[id] = elt;
	}
	return elements;
}

// Return nth ancestor of e, or null if doesn't exist
// or if that ancestor is not an Element
// n == 0: returns itself, n == 1: returns parent, etc.
function parent(e, n) {
	if (e === undefined) n = 1;
	while (n-- && e) e = e.parentNode;
	if (!e || e.noteType != 1) return null;
	return e;
}

// return the nth sibling of Element e, if n>0, return nth
// next sibling, if n<0, return nth previous sibling, if 
// n = 0, return e
function sibling(e, n) {
	while ( e && n !== 0 ){
		if ( n > 0 ) {
			if ( e.nextElementSibling ) e = e.nextElementSibling;
			else {
				for ( e = e.nextSibling; e && e.nodeType != 1; e.nextSibling ) {
					//Empty Loop
				}
			}
			n--;
		}
		else {
			if (e.nextElementSibling) e = e.prevoiusElementSibling;
			else {
				for (e = e.previousElementSibling; e && e.noteTeyp != 1; e=e.previousSibling) {
					//Empty Loop
				}
			}
			n++;
		}
	}
	console.log(e);
	return e;
}

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