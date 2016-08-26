var updateNow = $('.update-now'),
  updateNowButton = $('#update-now-button'),
  ignoreUpdateButton = $('#ignore-update-button'),
  inputFocus = null,
  stopsUrl = 'http://localhost:3000/server/stops.json',
  stopTimesUrl = 'http://localhost:3000/server/stop_times.json';

/*
 * Get the stop times
*/
function getStopTimes() {
  return fetch(stopTimesUrl)
  .then(function(stopTimes) {
    // Return the stop times.
    return stopTimes.json();
  })
  .then(function(stop_times) {
    // Get the stops if there is a leaveAt.
    var leaveAt = $('#leaveAt').val();
    if (!leaveAt) getStops(stop_times);
    return stop_times;
  })
  .then(function(stop_times) {
    // Display Stop Times if leaveAt exist.
    var leaveAt = $('#leaveAt').val();
    // console.log(stop_times);
    var stops = getStops(stop_times);
    if (leaveAt) displayStopTimes(stops,stop_times);
  })
  // .catch(function(err) {
  //   console.log(err);
  // });
}

/*
 * Get the stops
 * @param {Object[]} stop_times list
*/
function getStops(stop_times) {
  var leaveAt = $('#leaveAt').val();
  var arriveAt = $('#arriveAt').val();

  return fetch(stopsUrl)
  .then(function(stops) {
    return stops.json();
  })
  .then(function(stops) {
    if (leaveAt == '' || arriveAt == '') displayUniqueStops(stops,stop_times);
    return stops;
  })
  .catch(function(err) {
    console.log(err);
  });
}

/*
 * Get the unique trip IDs
 * @param {Object[]} stop_times list
*/
function getUniqueTripIds(stop_times) {
  var tripIds = [];
  stop_times.forEach(function(stop_time) {
    if (!tripIds.includes(stop_time.trip_id))
      tripIds.push(stop_time.trip_id);
  });
  // console.log(tripIds);

  return tripIds;
}

/*
 * Display the Unique Stops in .transportation-list
*/
function displayUniqueStops(stops,stop_times) {
  // Get Unique Stop IDs
  var stop_ids = [];
  stops.forEach(function(stop) {
    var stop_id = String(stop.stop_id);
    stop_id = stop_id.substring(0,5);
    stop_ids.push(stop_id);
  });

  stop_ids = $.unique(stop_ids);

  // Display unique Stops
  var html = '';
  // console.log(stops);
  stops.forEach(function(stop) {
    var stop_id = String(stop.stop_id),
      route_matched = routeMatched(stop_id);
    if (stop_ids.includes(stop_id) && route_matched) {
      html += '<div class="col-sm-6 col-md-4 col-lg-3">';
      html += '<div class="panel panel-default stop-info">';
      html += '<div class="panel-body">';
      html += '<h5 class="station">' + stop.stop_name + '</h5>';
      html += '<p><strong>Stop ID:</strong> ' + stop.stop_id + '</p>'
      html += '<button type="button" data-stop-name="'+ stop.stop_name +'" class="btn btn-default btn-xs select-stop" value="' + stop.stop_id + '">Select Stop</button>';
      html += '</div>';
      html += '</div>';
      html += '</div>';
    }
  });
  $(".transportation-list").html(html);

  // console.log(stop_ids);
  return stop_ids;
}

/*
 * Display Stop Times in transportation-list
*/
function displayStopTimes(stops,stop_times) {
  var html = '';
  html += '<div class="col-sm-12 col-md-12 col-lg-12">';
  html += '<table class="table table-bordered">';
  html += '<tr>';
  html += '<th>Trip ID</th>';
  html += '<th>Departure Time</th>';
  html += '<th>Arrival Time</th>';
  html += '<th>Duration</th>';
  html += '</tr>';

  // get Unique Trip IDs
  var tripIds = getUniqueTripIds(stop_times);

  loader();

  // get Unique Stop Times
  var stop_times_data = getUniqueStopTimes(stop_times);
  // console.log(unique_stop_times);

  stop_times_data.forEach(function(stop_time) {
    if (stop_time.length > 1) {
      stop_time.forEach(function(stop_time_info) {
        html += '<tr>';
        html += '<td>' + stop_time_info.trip_id + '</td>';
        html += '<td>' + stop_time_info.departure_time + '</td>';
        html += '<td>' + stop_time_info.arrival_time + '</td>';
        html += '<td>' + (stop_time_info.departure_time-stop_time_info.arrival_time) + '</td>';
        html += '</tr>';
      });
    }
  });

  html += '</table>';
  html += '</div>';

  $('.transportation-list').html(html);
}


/*
 * Get Unique Stop Times
*/
function getUniqueStopTimes(stop_times) {
  var uniqueStopTimes = [],
    leaveAt = $('#leaveAt').val(),
    arriveAt = $('#arriveAt').val(),
    new_stop_times = [];

  stop_times.forEach(function(stop_time) {
    var stop_time_exists = null,
      departure_time = null,
      arrival_time = null,
      new_stop_time = null;

    // console.log(!new_stop_times[stop_time.trip_id] && (stop_time.stop_id == leaveAt || stop_time.stop_id == arriveAt));
    var valid_stop_times = !new_stop_times[stop_time.trip_id] && (stop_time.stop_id == leaveAt || stop_time.stop_id == arriveAt)

    if (valid_stop_times)
      new_stop_times[stop_time.trip_id] = [];

    if (stop_time.stop_id == leaveAt)
      new_stop_times[stop_time.trip_id].push(stop_time);

    if (stop_time.stop_id == arriveAt)
      new_stop_times[stop_time.trip_id].push(stop_time);
  });

  console.log(new_stop_times);

  return new_stop_times;
}

/*
 * Checks if stop_times exists.
*/
function stopTimesExists(stop_time,key,value) {
  return stop_time.hasOwnProperty(key) && stop_time[key] === value;
}

/*
 * Gets the duration
*/
function getDuration(departure_time,arrival_time) {
  return String("");
}

/*
 * A helper that compares if the stop belongs to a route.
 * @param {string or number} stop_id - String value of stop_id.
 */
function routeMatched(stop_id) {
  var stop_id = String(stop_id);
  return $('#route').val() == stop_id.substring(0,3);
}

/*
 * A helper which identifies if the stops matched
 * @params {Object} stop
 * @params {Object} stop_time
*/
function stopMatched(stop,stop_time) {
  var stop_id = String(stop.stop_id);
  return stop_id.substring(0,5) == String(stop_time.stop_id);
}

/*
 * Returns boolean if the stop_time matches with stop_id
 * @param {Object} stop_time
*/
function stopMatchedSelected(stop_time) {
  var stop_id = String(stop_time.stop_id);
  var leaveAt = $('#leaveAt').val();
  if (leaveAt == stop_time.stop_id) return stop;
  return null;
}

function loader() {

}


(function(document) {
  'use strict';

  // Select Route
  $('#route').on('change', function() {
    getStopTimes();
    $('#leaveAt').focus();
    inputFocus = $('#leaveAt');
  });

  // Select Stops
  $(document).on('click','.select-stop',function(e) {
    var stop_name = $(this).data('stop-name');
    var leaveAt = $('#leaveAt').val();
    var arriveAt = $('#arriveAt').val();

    if (leaveAt == '') {
      $('#leaveAt').val(this.value);
      $('#arriveAt').focus();
      inputFocus = $('#arriveAt');
      $('.transportation-stop-start').html('From: ' + stop_name);
    } else {
      $('#arriveAt').val(this.value);
      $('#get-times-button').focus();
      inputFocus = $('#get-times-button');
      $('.transportation-stop-end').html('To: ' + stop_name);
      getStopTimes();
    }
  });

  // Select Time
  $(document).on('click','.select-time',function(e) {
    $('#selectedTime').val(this.value);
  });

  $('#get-times-button').on('click',function(e) {
    e.preventDefault();
  })

  /*
   * Filter stop information on keyup
   */
  // departAt.on('keyup', function() { displayTransportationList(this.value); });
  // arriveAt.on('keyup', function() { displayTransportationList(this.value); });
  // departAt.on('click',function() { inputFocus = this; });
  // arriveAt.on('click',function() { inputFocus = this; });
  // departAt.on('focus',function() { inputFocus = this; });
  // arriveAt.on('focus',function() { inputFocus = this; });
  // getTimesButton.on('click',function(e) {
  //   e.preventDefault();
  //   getTrainTimes();
  // });

  /*
   * Registering the Service Worker
  */
  // if (navigator.serviceWorker) {
  //   navigator.serviceWorker.register('/sw.js').then(function(reg) {
  //     console.log('Service Worker registered!');

  //     if(!navigator.serviceWorker.controller) return;

  //     if (reg.waiting) {
  //       console.log('waiting');
  //       updateReady(reg.waiting);
  //       return;
  //     }

  //     if (reg.installing) {
  //       console.log('installing');
  //       trackInstalling(reg.installing);
  //       return;
  //     }

  //     reg.addEventListener('updatefound', function() {
  //       console.log('updatefound');
  //       trackInstalling(reg.installing);
  //     });

  //     var refreshing;
  //     reg.addEventListener('controllerchange', function() {
  //       console.log('controllerchange');
  //       if (refreshing) return;
  //       window.location.reload();
  //       refreshing = true;
  //     });

  //   }).catch(function(err) {
  //     console.log('Service Worker not working. ' + err);
  //   });
  // }

})(document);