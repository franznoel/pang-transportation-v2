(function(document) {
  'use strict';

  var startingFrom = document.querySelector('#startingFrom');
  var goingTo = document.querySelector('#goingTo');
  var transportation_stops = document.querySelector('.transportation-list');
  var stopsRef = new Firebase('https://pang-transportation.firebaseio.com/stops/');

  /**
    * creates a stop Info HTML.
    */
  function getStopsHtml(stop) {
    var stopInfo = document.createElement('div');
    stopInfo.setAttribute('class','col-lg-3 col-md-4 col-sm-6');

    var stopHtml = '<div class="panel panel-default stop-info">';
    stopHtml+= '<div class="panel-body">';
    stopHtml+= '<h5>'+ stop.stop_name +'</h5>';

    if (stop.parent_station)
      stopHtml+= '<p class="station"><strong>Parent Station:</strong> '+ stop.parent_station +'</p>';
    else
      stopHtml+= '<p class="station"><strong>Parent Station:</strong> None</p>';

    if (stop.stop_code)
      stopHtml+= '<p class="code"><strong>Stop Code:</strong> '+ stop.stop_code +'</p>';
    else
      stopHtml+= '<p class="code"><strong>Stop Code:</strong> None</p>';

    stopHtml+= '<button type="button" class="btn btn-default btn-xs">Select Stop</button>'
    stopHtml+= '</div>';
    stopHtml+= '</div>';

    stopInfo.innerHTML = stopHtml;
    return stopInfo;
  }

  /**
    * creates a stop Info HTML if empty.
    */
  function getStopsEmptyHtml() {
    var stopHtml = "<div class='alert alert-info'>";
    stopHtml += "<p>Choose a <strong>Starting From</strong> and <strong>Going To</strong> location.</p>";
    stopHtml += "</div>";
    return stopHtml;
  }

  /**
    * Displays the stops depending on the chosen information.
    * @param {string} text coming from startingFrom and goingTo fields.
    */
  function displayStops(keyword) {
    transportation_stops.innerHTML = '';
    stopsRef.orderByChild("stop_name").on("value",function(stops) {
      stops.forEach(function(stopObject) {
        var stop = stopObject.val();
        var stopInfo = null;

        if (keyword) {
          var keyword_matched = (new RegExp(keyword)).test(stop.stop_name);
          if(keyword_matched) {
            stopInfo = getStopsHtml(stop);
            transportation_stops.appendChild(stopInfo);
          }
        } 
      })
    });
  }

  /**
    * Displays the transportation list, and passes the keywords if there are any
    * @param {string} text coming from startingFrom and goingTo fields.
    */
  function displayTransportatonList(keyword) {
    if (keyword) {
      displayStops(keyword);
    } else {
      var stopsHtml = getStopsEmptyHtml();
      transportation_stops.innerHTML = stopsHtml;
    }
  }

  function getJSON(url) {
    return fetch(url,{
      mode: 'no-cors'
    }).then(function(response) {
      console.log("Received: "+ url);
      console.log(response.json());
    });
  }

  /*
   * Filter stop information on keyup
   */
  startingFrom.addEventListener('keyup',function() {
    displayTransportatonList(this.value);
  });

  goingTo.addEventListener('keyup',function() {
    displayTransportatonList(this.value);
  });


})(document);
