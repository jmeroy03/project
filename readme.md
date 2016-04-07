High Level Diagram
==================

[alt text] (/resources/reservations_hlvl_diagram.png "High Level Diagram")

Details of Implementaion
========================

In your single js file let say main.js, create
Room object with properties based on the digram above.
To do that, here is the sample snippet:

```
    var Room = function (){
        this.reservations = [];
    }
    
    Room.prototype.add = function(param){
        /**
        parameters:
        
        param -> is expected to be in json format
        e.g
        {reserved_by: 'John Doe',
         from: '2016-05-09 10:30'
         to: '2016-05-09 10:30'
         .....
        }
        */
        
        //add the new reservation
        //TODO: before adding check for overlapping dates from existing reservtions
        // if overlapping found set param.overlap=true otherwise false
        this.reservations.push(param);
    }
    
    Room.prototype.list = function(){
        //return reservations
    }
    
    Room.prototype.delete_reservation = fuction(id){
        /**
        lookup for reservation which has id=id the get the index
        then use splice command to delete the reservation
        e.g 
        index = find(id)
        this.reservtions.splice(index, 1);
        */
    }
```

In the same file, create the Main(let's rename it to Reservations) class that has methods reserve() and list() that
accepts a color string. Main class also have intances of each Room color.

```
    var Reservations = {
        rooms: {
            // define different instances of Room by color
            purple: new Room(),
            red: new Room(),
            ...
        },
        reserve: function(){
            /**
            get all inputs from html form inputs
            ex.
            color = $('#color').val(); //using jquery
            var reservation = {};
            reservation.id = Math.random();
            reservation.reserved_by = $('#reserved_by').val(); //using jquery
            reservation.from = $('#from').val(); //using jquery
            .....
            
            to reserve:
            
            switch(color):
                case 'purple':
                    this.rooms.purple.add(reservation);
                    break;
                case 'red':
                    this.rooms.red.add(reservation);
                    break;
                ...... # continue other cases for other colors
            */
        },
        
        list: function(color){
            /**
            switch(color):
                case 'purple':
                    this.render_list(this.rooms.purple);
                    break;
                case 'red':
                    this.render_list(this.rooms.red);
                    break;
                ...... # continue other cases for other colors
            */
        },
        
        render_list: function(room, table_id){
            /**
            peudo code:
            // get the list of reservations for the room
            var room_reservations = room.list();
            //empty the table for that room to refresh content
            $('#'+table_id).html('');
            for each reservation in room_reservations{
                //render row to table
                var row = '<tr><td>'+ reservation.reserved_by + '</td></tr>'; // this is just a sample
                // then style each row based on its attribute overlap
                // if it overlap then set the row color to red otherwise do not set row color
                $('#'+table_id).append(row);
            }
            */
        },
        
        delete: function(color, id){
            /**
            switch(color){
                case 'purple':
                    this.rooms.purple.delete(id); this.list('purple'); // delete then rerender list
                    break;
                case 'red':
                    this.rooms.red.delete(id); this.list('red');
                    break;
                ...... # continue other cases for other colors
            }
            */
        }
    }
```

In the html markup form, include jquery or any css frameworks for your design.
For your form, when reserve button is click call Reservations.reserve().

for example,

```
<form>
    <!-- id should be map in getting values s.t $('#reserved_by') in reserve funtion in Reservations-->
    <input id="reserved_by" type="text"/> 
    <input id="from" type="">
    ....
    ...
    <input type="button" on-click="Reservations.reserve()">
</form>
```

For listing, separate each table by room color. Table was only a suggestion, unordered list may also be used.
Place this code in your js file in global scope to be executed during page load

```
Reservations.list('purple'); 
Reservations.list('red');
....
Reservations.list('yellow'); 
```
 The table id should have an id corresponds to color names to render approriately the list per room color.
 
 Cheers!
