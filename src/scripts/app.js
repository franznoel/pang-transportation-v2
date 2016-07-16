(function(document) {
  'use strict';

  var route = document.querySelector('#route');
  var departAt = document.querySelector('#departAt');
  var arriveAt = document.querySelector('#arriveAt');
  var inputFocus = null;
  var getTimesButton = document.querySelector('#get-times-button');
  var transportation_stops = document.querySelector('.transportation-list');
  var stopsRef = new Firebase('https://pang-transportation.firebaseio.com/stops/');
  var stopTimesRef = new Firebase('https://pang-transportation.firebaseio.com/stop_times/');

  /**
    * creates a stop Info HTML.
    */
  function getStopsHtml(stop) {
    var stopInfo = document.createElement('div');
    stopInfo.setAttribute('class','col-lg-3 col-md-4 col-sm-6');

    var panel = document.createElement('div');
    panel.setAttribute('class','panel panel-default stop-info');

    var panelBody = document.createElement('div');
    panelBody.setAttribute('class','panel-body');

    var stopContent = '<h5>' + stop.stop_name + '</h5>';
    if (stop.parent_station) {
      stopContent+= '<p class="station"><strong>Parent Station:</strong> ';
      stopContent+= stop.parent_station
      stopContent+= '</p>';
    } else {
      stopContent+= '<p class="station"><strong>Parent Station:</strong> ';
      stopContent+= 'None';
      stopContent+= '</p>';
    }
    stopContent+= '<p class="code"><strong>Stop Code:</strong> '+ stop.stop_code +'</p>';

    var stopButton = document.createElement('button');
    stopButton.setAttribute('type','button');
    stopButton.setAttribute('class','btn btn-default btn-xs select-stop');
    stopButton.innerHTML = 'Select Stop';
    stopButton.addEventListener('click',function() {
      inputFocus.value = stop.stop_code;
      if (inputFocus==departAt) {
        arriveAt.focus();
        inputFocus = arriveAt;
      } else if(inputFocus==arriveAt) {
        getTimesButton.focus();
        getTrainTimes();
      }
      // console.log(inputFocus,stop.stop_code);
    });

    panelBody.innerHTML = stopContent;
    panelBody.appendChild(stopButton);
    panel.appendChild(panelBody);
    stopInfo.appendChild(panel);

    return stopInfo;
  }

  /**
    * creates a stop Info HTML if empty fields on starting From and Going to.
    */
  function getStopsEmptyHtml() {
    var stopHtml = "<div class='alert alert-info'>";
    stopHtml += "<p>Choose <strong>Departure</strong> ";
    stopHtml += "and <strong>Arrival</strong> stops.</p>";
    stopHtml += "</div>";
    return stopHtml;
  }

  /*
   * A helper that compares if the stop belongs to a route.
   * @param {string} route - String value of route.
   * @param {string or number} stop_code - String value of stop_code.
   */
  function routeMatched(stop_code) {
    var stop_code = String(stop_code);

    if (route.value == stop_code.substring(0,3))
      return true;

    return false;
  }

  function stopDepartMatched(stop_id) {
    var depart_stop_id = String(departAt.value);

    if (depart_stop_id.substring(0,5) == stop_id)
      return true;

    return false;
  }

  function stopArriveMatched(stop_id) {
    var arrive_stop_id = String(arriveAt.value);

    if (arrive_stop_id.substring(0,5) == stop_id)
      return true;

    return false;
  }

  /*
   * Display stops by route in transportation list
   * @param {Object} route - DOM object of route.
  */
  function displayStopsByRoute() {
    transportation_stops.innerHTML = '';
    stopsRef.orderByChild("stop_name").on("value",function(stops) {
      stops.forEach(function(stopObject) {
        var stopKey = stopObject.key();
        var stop = stopObject.val();
        var stopInfo = null;

        if (route.value) {
          var route_matched = routeMatched(stop.stop_code);
          if (route_matched) {
            stopInfo = getStopsHtml(stop);
            transportation_stops.appendChild(stopInfo);
          }
        }
      });
    });
  }


  /**
    * Displays the stops depending on the chosen information.
    * @param {string} text coming from departAt and arriveAt fields.
    */
  function displayStops(keyword) {
    transportation_stops.innerHTML = '';
    stopsRef.orderByChild("stop_name").on("value",function(stops) {
      stops.forEach(function(stopObject) {
        var stopKey = stopObject.key();
        var stop = stopObject.val();
        var stopInfo = null;

        if (route.value && keyword) {
          var keyword_matched = (new RegExp(keyword)).test(stop.stop_name);
          var route_matched = routeMatched(stop.stop_code);
          if(keyword_matched && route_matched) {
            stopInfo = getStopsHtml(stop);
            transportation_stops.appendChild(stopInfo);
          }
        }
      })
    });
  }

  /**
    * Displays the transportation list, and passes the keywords if there are any
    * @param {string} text coming from departAt and arriveAt fields.
    */
  function displayTransportationList(keyword) {
    if (route.value && keyword) {
      // console.log("Display Stops.");
      displayStops(keyword);
    } else if (route.value) {
      // console.log("Display Stops by route.");
      displayStopsByRoute();
    } else {
      var stopsHtml = getStopsEmptyHtml();
      transportation_stops.innerHTML = stopsHtml;
    }
  }

  /* 
   * Gets the train times, and validates departsAt and arriveAt
  */
  function getTrainTimes() {
    console.log('Get Train Times!');
    stopTimesRef.orderByChild("arrival_time").on("value",function(stopTimes) {
      stopTimes.forEach(function(stopTime) {
        var transit = stopTime.val();
        var departMatch = stopDepartMatched(transit.stop_id);
        var arriveMatch = stopArriveMatched(transit.stop_id);

        if (departMatch) {
          console.log("Depart: ",transit);
          // TODO: Add table for depart or create HTML function to display the table.
        }

        if (arriveMatch) {
          console.log("Arrival: ",transit)
          // TODO: Add table for arrive or create HTML function to display the table.
        }

        // TODO: Replace transportation-list content with Depart and Arrival train times.
      });
    });

  }

  function getJSON(url) {
    return fetch(url, {
      mode: 'no-cors'
    }).then(function(response) {
      console.log("Received: "+ url);
      console.log(response.json());
    });
  }

  /*
   * Set route value on change
   */
  route.addEventListener('change', function() {
    displayTransportationList(null);
    departAt.focus();
    inputFocus = departAt;
  });

  /*
   * Filter stop information on keyup
   */
  departAt.addEventListener('keyup', function() { displayTransportationList(this.value); });
  arriveAt.addEventListener('keyup', function() { displayTransportationList(this.value); });
  departAt.addEventListener('click',function() { inputFocus = this; });
  arriveAt.addEventListener('click',function() { inputFocus = this; });
  getTimesButton.addEventListener('click',function(e) {
    e.preventDefault();
    getTrainTimes();
  });


})(document);
