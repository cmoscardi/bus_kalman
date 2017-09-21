L.RotatedMarker = L.Marker.extend({
  options: { angle: 0 },
  _setPos: function(pos) {
    L.Marker.prototype._setPos.call(this, pos);
    if (L.DomUtil.TRANSFORM) {
      // use the CSS transform rule if available
      this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.angle + 'deg)';
    } else if (L.Browser.ie) {
      // fallback for IE6, IE7, IE8
      var rad = this.options.angle * L.LatLng.DEG_TO_RAD,
      costheta = Math.cos(rad),
      sintheta = Math.sin(rad);
      this._icon.style.filter += ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
        costheta + ', M12=' + (-sintheta) + ', M21=' + sintheta + ', M22=' + costheta + ')';
    }
  }
});

L.rotatedMarker = function(pos, options) {
  return new L.RotatedMarker(pos, options);
};


$(function () {
  var map = L.map('map').setView([40.7127, -74.0059], 13);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiY21vc2NhcmRpIiwiYSI6ImNpanN4d2tndzBobnl1eWx4ZTh4djhrMjYifQ.YNqoV7GRERfm_GvxJGy3kQ'
  }).addTo(map);

  data = d3.json("/static/test.json", function(unclear, resp){
    dog = resp;
    qq = map;
    //setTimeout(runUpdate(resp, map), 5000);
  });

});

function runUpdate(resp, map){
  var timeIncrement = 0;
  var initialTime = resp.actual[0][0];
  timestamps = resp.actual.map(function(x) { return x[0] - initialTime });
  var actualCircle = null;
  var predCircle = null;
  var latestActualIndex = 0;
  return function(){
    var predIndex = Math.floor(timeIncrement / 5);
    var actualIndex = timestamps.indexOf(timeIncrement) ;
    if(actualIndex != -1){
      latestActualIndex = actualIndex;
    }
    var circles = plotCircles(map, resp.actual[latestActualIndex], resp.preds[predIndex][0]);
    console.log("at t=" + timeIncrement);
    timeIncrement += 1;
  }
}

var actualCircle;
var predCircle;
function plotCircles(map, actual, pred){
  console.log(actual);
  if(actual){
    latlng = L.latLng(actual[1], actual[2]);
//    actualCircle = L.circle(latlng, {
//	color: 'blue',
//	fillColor: '#f03',
//	fillOpacity: 0.9,
//	radius: 50
//    }).addTo(map);
    var marker = L.rotatedMarker(latlng, {
      icon: L.divIcon({
	className: 'svg-marker',
	html: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path d="M15 6.818V8.5l-6.5-1-.318 4.773L11 14v1l-3.5-.682L4 15v-1l2.818-1.727L6.5 7.5 0 8.5V6.818L6.5 4.5v-3s0-1.5 1-1.5 1 1.5 1 1.5v2.818l6.5 2.5z"/></svg>',
	iconSize: [24, 24],
      }),
      draggable: true,
      angle: 90-actual[3],
    });
    marker.addTo(map);

  }

  console.log(pred);
  if(pred){
    predCircle = L.circle([pred[0], pred[1]], {
	color: 'red',
	fillColor: '#f03',
	fillOpacity: 0.9,
	radius: 50
    }).addTo(map);
  }

  return [actualCircle, predCircle]
}
