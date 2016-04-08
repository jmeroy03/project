/*$(function () {
  $('#datetimepicker5').datetimepicker({
  defaultDate: "11/1/2014",
  disabledDates: [
  moment("12/25/2014"),
  new Date(2013, 11 - 1, 21),
  "11/22/2013 00:53"
  ]
  });
  });


*/

$('#calendarfrom').datepicker();
$('#timefrom').timepicker();
$('#calendarto').datepicker();
$('#timeto').timepicker();
$('#repeatStartDate').datepicker();
$('#repeatEndDate').datepicker();



var Util = {
    startDate: new Date(),
    endDate: new Date(),
    parseTime: function(time_str){
        var hr_min = time_str.split(':');
        var period = hr_min[1].substr(2, hr_min[1].length);
        var min = hr_min[1].substr(0, 2);
        hr_min[1] = (period=='am'? min: (min + 12));
        return hr_min;
    }
};


var Room = function (){
	  this.reservations = [];
}; // constructor : this is where pwede ka maggawa ng maraming object na reservations



Room.prototype.add = function(param){
	  /*var reservedby;
	    var startDateTime;
	    var EndTime;*/

	  // TODO: add logic for checking overlapping time, set conflict=true if there is conflict false otherwise
	  // add logic for repeat reservations
	  var index = this.findOverlap(param);

	  if(index > -1){
		    param.conflict = true;
	  }
	  this.reservations.push(param);

};

Room.prototype.findOverlap = function(param){
    var index = -1;
    var par_from_hr_min = Util.parseTime(param.startTime);
    var par_end_hr_min = Util.parseTime(param.endTime);

    var par_startDate = new Date(param.startDate).setHours(par_from_hr_min[0], par_from_hr_min[1]);
    var par_endDate = new Date(param.endDate).setHours(par_end_hr_min[0], par_end_hr_min[1]);

	  for(var i=0; i<this.reservations.length; i++){
		    var reservation = this.reservations[i];

        var res_from_hr_min = Util.parseTime(reservation.startTime);
        var res_end_hr_min = Util.parseTime(reservation.endTime);

        var res_startDate = new Date(reservation.startDate).setHours(res_from_hr_min[0], res_from_hr_min[1]);
        var res_endDate = new Date(reservation.endDate).setHours(res_end_hr_min[0], res_end_hr_min[1]);

        if (((par_startDate >= res_startDate && par_startDate <= res_endDate) ||
             (par_endDate >= res_startDate && par_endDate <= res_endDate)) &&
            reservation.id != param.id){
            index = i;
            reservation.conflict = true;
            break;
        }
	  }
    return index;
};

Room.prototype.list = function(){
	  return this.reservations;
};


Room.prototype.remove_reservation = function(id){
	  var index = -1;
	  for(var i=0; i<this.reservations.length; i++){
		    var item = this.reservations[i];
		    if(item.id===id){
			      index = i;
			      break;
		    }

	  }

	  this.reservations.splice(index, 1);
};



/*Reservations methods and list method*/

var Reservations = {
    days:['Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'],
	  id: 0,
	  rooms:{
		    Purple: new Room(),
		    Green: new Room(),
		    Yellow: new Room(),
		    Orange: new Room()
	  },
	  table_ids:{
		    Purple: 'purple_reservations',
		    Green: 'green_reservations',
		    Yellow: 'yellow_reservations',
		    Orange: 'orange_reservations'
	  },
    setRepeatDay: function(){
        var day = new Date($('#calendarfrom').val());
        $("#repeat option:first").text('Every ' + this.days[day.getDay()]);
        $('#repeatStartDate').val($('#calendarfrom').val());
    },
    showRepeatOption: function(){
        var repeat = $('#repeat').val();
        if (repeat == 'Never'){
            $('#repeat_option').hide();
        }else{
            $('#repeat_option').show();
        }
    },
    reserve: function(){
		    var reservation = {};
		    color = $('#color').val();
		    // TODO: change random to produce whole number
		    reservation.id = this.id++;
		    reservation.reservedby = $('#usr').val();
        reservation.color = color;
		    reservation.startDate = $('#calendarfrom').val();
		    reservation.startTime = $('#timefrom').val();
		    reservation.endDate = $('#calendarto').val();
		    reservation.endTime = $('#timeto').val();
        reservation.conflict = false;

		    var repeat = $('#repeat').val();
        repeatStartDate = reservation.startDate;
        repeatEndDate = $('#repeatEndDate').val();

        if (reservation.repeat !== 'Never'){
            var endDate = new Date(repeatEndDate);
            var date = new Date(repeatStartDate);
            while(date <= endDate){
                reservation.id = this.id++;
                reservation.startDate = date.getMonth() + '/' + date.getDay() + '/' + date.getYear();
                this.rooms[color].add(reservation);
                date.setDate(date.getDate() + 7);
            }
        }else{
            this.rooms[color].add(reservation);
        }
		    console.log(reservation);
		    this.list_render(color);
	  },

	  list_render: function(color){
		    var reservations = this.rooms[color].list();
		    $('#' + this.table_ids[color]).html('');
		    for(var i=0; i<reservations.length; i++){
			      // TODO: check each item if has conflit then set the row styling color to red
			      var reservation = reservations[i];
            var startDate = new Date(reservation.startDate).toString();
            startDate = startDate.substr(0, startDate.length-5);
			      var row = '';
			      if (reservation.conflict){
				        row = '<li style="background-color: red" class="list-group-item"><p> Reserved by'+
                    reservation.reservedby +
                    ' <button type="button" class="btn btn-link btn-xs pull-right" onclick="Reservations.remove_reservation(' +
                    reservation.id +
                    ', \'' + color +
                    '\')"><span class="glyphicon glyphicon-remove" ></span></button></p>' +
                    '<p> From ' + startDate + ' @ ' + reservation.startTime + '</p>' +
                    '</li>';
			      }else{
				        row = '<li class="list-group-item"><p> Reserved by' + reservation.reservedby +
                    ' <button type="button" class="btn btn-link btn-xs pull-right" onclick="Reservations.remove_reservation(' +
                    reservation.id +
                    ', \'' + color +
                    '\')"><span class="glyphicon glyphicon-remove" ></span></button></p>' +
                    '<p> From ' + startDate + ' @ ' + reservation.startTime + '</p>' +
                    '</li>';
			      }
			      $('#' + this.table_ids[color]).append(row);
		    }
	  },

	  remove_reservation: function(id, color){
		    this.rooms[color].remove_reservation(id);
		    this.list_render(color);
	  }
};
