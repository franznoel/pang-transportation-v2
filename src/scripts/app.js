(function(document) {
  'use strict';

  var route = $('#route'),
    inputFocus = null,
    stopTimesRef = new Firebase('https://pang-transportation.firebaseio.com/stop_times/');

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
        var stopKey = stopObject.key(),
          stop = stopObject.val(),
          stopInfo = null;

        if (route.value) {
          var route_matched = routeMatched(stop.stop_code),
            stopId_included = stopIncludes(stop.stop_code);

          if (route_matched && stopId_included) {
            stopInfo = getStopsHtml(stop);
            transportation_stops.appendChild(stopInfo);
          }
        }
      });
    });
  }

  /*
   * Creates a loader in the Train Times Button.
   */
  function loader() {
    var html = '<img src="images/reload.gif" style="height:17px;" /> Loading...';
    $('#get-times-button').html(html);
    $('#get-times-button').addClass('disabled');

    setTimeout(function() {
      $('#get-times-button').removeClass('disabled');
      $('#get-times-button').html('Get Train Times');
    },10000);
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
   * Informs the user that update is ready.
  */
  function updateReady(worker) {
    updateNow.style.display = 'block';

    updateNowButton.addEventListener('click',function(e) {
      e.preventDefault();
      worker.postMessage({action: 'skipWaiting'});
      updateNow.innerHTML = '<p>Cool! Refreshing the page... </p>';
      setTimeout(function() {
        updateNow.style.display = 'none';
        window.location.reload();
      },3000);
    });

    ignoreUpdateButton.addEventListener('click',function(e) {
      e.preventDefault();
      updateNow.style.display = 'none';
    });
  }

  function getTransitTime(stringTime) {
    var time = "20:54:00".split(':'),
      hour = time[0]/2,
      minute = time[1],
      meridiem = (time[0] < 12) ? 'AM' : 'PM',
      transitTime = hour + ':' + minute + ' ' + meridiem;

    return transitTime;
  }

  function isSimilarStopTime(currentStopTime,stopTime) {
    return currentStopTime.stop_id == stopTime.stop_id &&
      currentStopTime.departure_time == stopTime.departure_time &&
      currentStopTime.arrival_time == stopTime.arrival_time;
  }

  function getStopTimeHtml(stopTime) {
    var html = '';
    html += '<div class="col-md-4">';
    html += '<div class="panel panel-default stop-info">';
    html += '<div class="panel-body">';
    html += '<h5>'+ stopTime.stop_id + '</h5>';
    html += '<p class="headsign"><strong>Head Sign:</strong> ' + stopTime.stop_headsign + '</p>';
    html += '<p class="time"><strong>Departure Time:</strong> ' + getTransitTime(stopTime.departure_time) + '</p>';
    html += '<p class="time"><strong>Arrival Time:</strong> ' + getTransitTime(stopTime.arrival_time) + '</p>';
    html += '<button class="btn btn-default btn-xs">Select Stop</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function displayStopTimes() {
    stopTimesRef.orderByChild("stop_id").limitToFirst(100).on("value",function(stopTimes) {
      console.log(stopTimes.val());
      var stopTimesHtml = '',
        currentStopTime = null;

      stopTimes.forEach(function(stopTimeSnapshot) {
        // var depart_matched = stopDepartMatched(stopTime.stop_id);
        var stopTime = stopTimeSnapshot.val();
        // var similar_stopTime = isSimilarStopTime(currentStopTime,stopTime);
        // if (!similar_stopTime) {
        // currentStopTime = stopTime;
        stopTimesHtml += getStopTimeHtml(stopTime);
        // } else {
        //   stopTimesHtml = getStopTimeHtml(stopTime);
        // }
      });

      $('.transportation-list').append(stopTimesHtml);
    });
  }

  /*
   * Tracks the installation of the Service Worker.
  */
  function trackInstalling(worker) {
    worker.addEventListener('statechange',function() {
      if (worker.state == 'installed') {
        updateReady(worker);
      }
    });
  }

  /*
   * Set route value on change
   */
  route.on('change', function() {
    console.log('Changing...');
    displayStopTimes();
    
    // displayTransportationList(null);
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
  departAt.addEventListener('focus',function() { inputFocus = this; });
  arriveAt.addEventListener('focus',function() { inputFocus = this; });

  // $('#get-times-button').on('click',function(e) {
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