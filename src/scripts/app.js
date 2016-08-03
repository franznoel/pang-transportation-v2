var route = document.querySelector('#route'),
departAt = document.querySelector('#departAt'),
arriveAt = document.querySelector('#arriveAt'),
updateNow = document.querySelector('.update-now'),
updateNowButton = document.querySelector('#update-now-button'),
ignoreUpdateButton = document.querySelector('#ignore-update-button'),
getTimesButton = document.querySelector('#get-times-button'),
transportation_stops = document.querySelector('.transportation-list'),
inputFocus = null,
stopsUrl = 'http://localhost:3000/server/stops.json',
stopTimesUrl = 'http://localhost:3000/server/stop_times.json';


// stopsRef.keepSynced(true);
// stopTimesRef.keepSynced(true);

function getStopTimes() {
  return fetch(stopTimesUrl).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log('Stop Times:', data);
  }).catch(function(err) {
    console.log(err);
  });
}

function getStops() {
  return fetch(stopsUrl).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log('Stops:', data);
  }).catch(function(err) {
    console.log(err);
  });

}


(function(document) {
  'use strict';

  var stopTimes = getStopTimes();
  var stops = getStops();

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
  // departAt.addEventListener('keyup', function() { displayTransportationList(this.value); });
  // arriveAt.addEventListener('keyup', function() { displayTransportationList(this.value); });
  // departAt.addEventListener('click',function() { inputFocus = this; });
  // arriveAt.addEventListener('click',function() { inputFocus = this; });
  // departAt.addEventListener('focus',function() { inputFocus = this; });
  // arriveAt.addEventListener('focus',function() { inputFocus = this; });
  // getTimesButton.addEventListener('click',function(e) {
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