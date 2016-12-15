global.jQuery = global.$ = require('jquery');
require('rangeslider.js');

var moment = require('moment-timezone');
var renderTimezones = function() {

	// Reduce timezone list as the one shipping with
	// moment-timezone is needlessly long
	var names = Object.keys(moment.tz._zones)
    .map(function(k) { return moment.tz._zones[k].split('|')[0]; })
    .filter(function(z) { return z.indexOf('/') >= 0; })
    .sort();

	names.sort(function(t1, t2){
			var t1Offset = moment.tz(t1).utcOffset(),
				t2Offset = moment.tz(t2).utcOffset();

			if( t1Offset > t2Offset ) {
				return -1;
			} else {
				return 1;
			}

	}).map(function( timezone ){

		var utcOffsetMins = moment.tz(timezone).utcOffset();

		// Find the offset of timezone to display in the Select Box
		var utcOffset = moment
			.utc()
			.startOf('day')
			.add( Math.abs(utcOffsetMins), 'minutes')
			.format('HH:mm');

		 var utcHours =  utcOffsetMins < 0 ? "-" + utcOffset : "+" + utcOffset;

		$("<option>")
			.attr("value", timezone)
			.html( "(GMT " + utcHours + ") " + timezone.replace('_',' ') )
			.appendTo("#ts-timezones");
	});

	// Set Default Timezone (UTC)
	$("#ts-timezones")
		.children("option[value='Etc/UTC']")
		.attr('selected', true);

};

var constructDateFromInputs = function(){

	return moment()
		.second( $("#ts-second").val() )
		.minute( $("#ts-minute").val() )
		.hour( $("#ts-hour").val() )
		.date( $("#ts-date").val() )
		.month( $("#ts-month").val() )
		.year( $("#ts-year").val() );
};

var DateDisplayer = function( unixTimestamp ){
	this.momentDate = moment( unixTimestamp );
};

DateDisplayer.prototype.updateSlider = function(){
	$("#ts-second").val( this.momentDate.seconds() ).change();
	$("#ts-minute").val( this.momentDate.minutes() ).change();
	$("#ts-hour").val( this.momentDate.hours() ).change();
	$("#ts-date").val( this.momentDate.date() ).change();
	$("#ts-month").val( this.momentDate.month() ).change();
	$("#ts-year").val( this.momentDate.year() ).change();

	return this;
};

DateDisplayer.prototype.updateLabels = function(){
	$("#ts-second-disp").html( this.momentDate.format("ss[s]") );
	$("#ts-minute-disp").html( this.momentDate.format("mm[m]") );
	$("#ts-hour-disp").html( this.momentDate.format("hh[h]") );
	$("#ts-date-disp").html( this.momentDate.format("Do")  );
	$("#ts-month-disp").html( this.momentDate.format("MMM") );
	$("#ts-year-disp").html( this.momentDate.format("YYYY")  );

	return this.updateParsedDate();
};

DateDisplayer.prototype.updateParsedDate = function(){
	$("#parsedDate").html( moment( this.momentDate ).format('MMMM Do YYYY, hh:mm:ss A') );
	return this;
};

DateDisplayer.prototype.updateText = function(){
	$("#unix-ts").val( this.momentDate.format("X") );
	return this;
};

document.addEventListener('DOMContentLoaded', function(){
	$("input[type='custom-range']").rangeslider({
		polyfill: false,
		onSlide : function(){

			// Don't update when text input is selected.
			// It causes cursor to lose it's position.
			if( ! $("#unix-ts").is(":focus") ){
				var displayObj = new DateDisplayer(constructDateFromInputs());

				displayObj
					.updateText()
					.updateLabels();
			}
		}
	});

	renderTimezones();

	var displayObj = new DateDisplayer( (new Date().getTime()) );
	displayObj
		.updateText()
		.updateSlider()
		.updateLabels();

	$("#unix-ts").on('input', function(){
		var displayObj = new DateDisplayer( +this.value * 1000 );
		displayObj
			.updateSlider()
			.updateLabels();
	});

	$("#ts-timezones").change(function(){
		moment.tz.setDefault(
			$(this).children(":selected").val()
		);

		var displayObj = new DateDisplayer( +$("#unix-ts").val() * 1000 );
		displayObj
			.updateSlider()
			.updateLabels();
	});
});

