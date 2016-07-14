(function(document) {
  'use strict';

  var startingFrom = document.querySelector('#startingFrom');
  var goingTo = document.querySelector('#goingTo');
  var transportation_stops = document.querySelector('.transportation-list');
  var stopsRef = new Firebase('https://pang-transportation.firebaseio.com/stops/');

  function displayStops() {
    stopsRef.on("value",function(stops) {
      stops.forEach(function(stopObject) {
        var stop = stopObject.val();

        var column = document.createElement('div');
        column.setAttribute('class','col-lg-3 col-md-4 col-sm-6');

        var stopHtml = '<div class="panel panel-default stop-info">';
        stopHtml+= '<div class="panel-body">';
        stopHtml+= '<h5>'+ stop.stop_name +'</h5>';
        stopHtml+= '<p class="station"><strong>Parent Station:</strong> '+ stop.parent_station +'</p>';
        stopHtml+= '<p class="code"><strong>Stop Code:</strong> '+ stop.stop_code +'</p>';
        stopHtml+= '<button type="button" class="btn btn-default btn-xs">Select Stop</button>'
        stopHtml+= '</div>';
        stopHtml+= '</div>';

        column.innerHTML = stopHtml;
        transportation_stops.appendChild(column);
      });
    });
  }

  function getJSON(url) {
    return fetch(url,{
      mode: 'no-cors'
    }).then(function(response) {
      console.log("Received: "+ url);
      console.log(response.json());
    });
  }

  // Show stop information on click.
  startingFrom.addEventListener('click',function() {
    displayStops();
  });

  goingTo.addEventListener('click',function() {
    displayStops();
  });

  // Filter stop information on keypress
  startingFrom.addEventListener('keyup',function() {
    console.log('starting keyup');
  });

  goingTo.addEventListener('keyup',function() {
    console.log('going keyup');
  });


})(document);
