var updateNow = $('.update-now'),
  updateNowButton = $('#update-now-button'),
  ignoreUpdateButton = $('#ignore-update-button'),
  getTimesButton = $('#get-times-button'),
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
    // Get the stops if there is selected stop.
    var selectedStop = $('#selectedStop').val();
    if (!selectedStop) getStops(stop_times);
    return stop_times;
  })
  .then(function(stop_times) {
    var selectedStop = $('#selectedStop').val();
    if (selectedStop) displayStopTimes(stop_times);
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
  var selectedStop = $("#selectedStop").val();

  return fetch(stopsUrl)
  .then(function(stops) {
    // Return the stops JSON response
    return stops.json();
  })
  .then(function(stops) {
    if (!selectedStop)
      displayUniqueStops(stops,stop_times);
    return stops;
  })
  .then(function(stops) {

    // console.log('Stops:', stops);
  })
  .catch(function(err) {
    console.log(err);
  });
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
    var stop_id = String(stop.stop_id);
    var route_matched = routeMatched(stop_id);
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
function displayStopTimes(stop_times) {
  var leaveOrArrive = $('#leaveOrArrive').val();
  var html = '';
  html += '<div class="col-sm-12 col-md-4 col-lg-4">';
  html += '<table class="table table-bordered">';

  // Title
  if (leaveOrArrive == 'leave') html += '<tr></th><h3>Leaves At</h3></th></tr>';
  else if (leaveOrArrive == 'arrive') html += '<tr></th><h3>Arrive</h3></th></tr>';

  // Times
  stop_times.forEach(function(stop_time) {
    var route_matched = routeMatched(stop_time.stop_id);
    if (route_matched) {
      var the_time = (leaveOrArrive == 'leave') ? stop_time.departure_time : stop_time.arrival_time;
      html += '<tr><td>';
      html += the_time + ' <button type="button" class="btn btn-default btn-xs select-time" value="' + the_time + '">Select Time</button>';
      html += '</td></tr>';
    }
  });

  html += '</table>';
  html += '</div>';

  $('.transportation-list').html(html);
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
  var selectedStop = $('#selectedStop').val();
  if (selectedStop == stop_time.stop_id) return stop;
  return null;
}

(function(document) {
  'use strict';

  // Set route value on change
  $('#route').on('change', function() {
    getStopTimes();
    $('#selectedStop').focus();
    inputFocus = $('#selectedStop');
  });

  // Select Stop
  $(document).on('click','.select-stop',function(e) {
    var stop_name = $(this).data('stop-name');
    $("#selectedStop").val(this.value);
    $('#selectedTime').focus();
    $('.transportation-stop').html(stop_name + ' Stop Times');
    inputFocus = $('#selectedTime');
    // TODO: Get the stopTimes of the selected stop

    // console.log('Selected',this.value);
  });

  // Select time
  $(document).on('click','.select-time',function(e) {
    $('#selectedTime').val(this.value);
  });

  // Display stop_times list for stops on focus.
  $('#selectedTime').on('focus',function() {
    getStopTimes();
  });

  // Set stopTime on selectedStop change.
  $('#selectedStop').on('change',function() {
    getStopTimes();
    $('#selectedTime').focus();
    inputFocus = $('#selectedTime')
  });

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