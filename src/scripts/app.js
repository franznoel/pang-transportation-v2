var leaveAt = $('#leaveAt'),
  arriveBy = $('#arriveBy'),
  updateNow = $('.update-now'),
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
  .then(function(response) {
    return response.json();
  })
  .then(function(stop_times) {
    getStops(stop_times);

  })
  .then(function(stop_times) {
    displayDeparture(stop_times);
    // console.log('Stop Times:', stop_times);
  })
  .catch(function(err) {
    console.log(err);
  });
}

/*
 * Get the stops
 * @param {Object[]} stop_times list
*/
function getStops(stop_times) {
  return fetch(stopsUrl)
  .then(function(stops) {
    // Return the stops JSON response
    return stops.json();
  })
  .then(function(stops) {
    displayUniqueStops(stops,stop_times);

    // Get the name of the stop
    // stop_times.forEach(function(stop_time) {
    //   stops.forEach(function(stop) {
    //     var stop_matched = stopMatched(stop,stop_time);

    //     // var stop_list = [];
    //     // if (stop_matched) {
    //     //   stop_list.push(stop);
    //     // }
    //     // console.log(stop_list);
    //   });
    // });
    return stops;
  })
  .then(function(stops) {
    // console.log('Stops:', stops);
  })
  .catch(function(err) {
    console.log(err);
  });
}

function displayDeparture(stop_times) {
  var route = $('#route').val();
  if (!stop_times) return;
  var html = '';

  stop_times.forEach(function(stop_time) {
    var route_matched = routeMatched(stop_time.stop_id);
    if (route_matched) {
      html += '<div class="col-lg-3 col-md-4 col-sm-6 stop-container">';
      html += '<div class="panel panel-default stop-info">';
      html += '<div class="panel-body">';
      html += '<h5>' + stop_time.stop_id + '</h5>';
      html += '<p class="time"><strong>Departure Time: </strong>'+ stop_time.departure_time +'</p>';
      html += '</div>';
      html += '</div>';
      html += '</div>';
    }
  });

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
      html += '<div class="col-sm-12 col-md-4 col-lg-3">';
      html += '<div class="panel panel-default stop-info">';
      html += '<div class="panel-body">';
      html += '<h5 class="station">' + stop.stop_name + '</h5>';
      html += '<p><strong>Stop ID:</strong> ' + stop.stop_id + '</p>'
      html += '<button type="button" class="btn btn-default btn-xs">Select Stop</button>';
      html += '</div>';
      html += '</div>';
      html += '</div>';
    }
  });
  $(".transportation-list").html(html);

  // console.log(stop_ids);
  return stop_ids;
}


(function(document) {
  'use strict';

  /*
   * Set route value on change
   */
  $('#route').on('change', function() {
    getStopTimes();
    $('#selectedStop').focus();
    inputFocus = $('#selectedStop');
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