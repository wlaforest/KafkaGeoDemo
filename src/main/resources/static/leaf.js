var uniqueId = stringToHash(navigator.userAgent) + new Date().getTime();
var toggleState = true;
var colorArray = generateRandomColors(50);
var map = L.map('mapid', {drawControl: true}).setView([41.85166206156541,  -87.72445678710939], 11);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
  }).addTo(map);

// add leaflet-geoman controls with some options to the map
map.pm.addControls({
  position: 'topleft',
  drawCircle: false,
  pinningOption: false,
  snappingOption: false
});

map.on('pm:create', e => {
  console.log(e);
  sendToServer(JSON.stringify(e.layer.toGeoJSON()));
});

function toggleButtooHandler()
{
  var timage = document.getElementById("toggleImage");
  if (timage.src.endsWith("images/toggle-on.png")) {
    timage.src = "images/toggle-off.png";
  } else {
    timage.src = "images/toggle-on.png";
  }
}

function sendToServer(json)
{
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/topics/fence_raw/pub', true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Do processing here.
    }
  }
  xhr.send(json);
}

polyLines = {};

var busSource = new EventSource('/topics/ctaPrepped/sse?requestId=' + uniqueId + '&jsonSyncPath=$.DTIME&period=1000'); //ENTER YOUR TOPICNAME HERE
busSource.addEventListener('message', function(e){

  var obj = JSON.parse(e.data);
  var id = obj.VID
  var polyLine = polyLines[id];
  if ( polyLine == null) {
    var lineColor = colorArray[(id % colorArray.length)-1];
    var pointList = [[obj.LAT, obj.LON]]
    var polyLine = L.polyline(pointList, {
      color: lineColor,
      weight: 3,
      smoothFactor: 1
    }).addTo(map);
    polyLines[id] = polyLine;
  }
  else
  {
    polyLine.addLatLng([obj.LAT, obj.LON]);
  }
}, false);

var alertSource = new EventSource('/topics/alert/sse?requestId=' + uniqueId + '&period=1000');
alertSource.addEventListener('message', function(e) {
  var obj = JSON.parse(e.data);
  console.log('recieved alert: ' + JSON.stringify(obj));
  var alertsDiv = document.getElementById('AlertsDiv');
  var newAlert = document.createElement("div")
  newAlert.setAttribute("class", "sys-message sys-error");
  var newP = document.createElement("p");
  var textNode = document.createTextNode(e.data);
  newP.appendChild(textNode);
  newAlert.appendChild(newP);
  alertsDiv.appendChild(newAlert);

}, false);

var bins = {};

var binSource = new EventSource('/topics/GEO_HEAT_MAP/sse?requestId=' + uniqueId + '&jsonSyncPath=$.WS&period=1000');
binSource.addEventListener('message', function(e) {
  var obj = JSON.parse(e.data);

  var boxCoords = decode_bbox(obj.GEOHASH)
  var boxCoordsString = JSON.stringify(boxCoords)
  var boxColor = perc2color(obj.TOTAL, 0, 210); //getColorFromRedToGreenByPercentage(obj.TOTAL, 959);
  var currentBin = bins[boxCoordsString];
  console.log('recieved bin: ' + JSON.stringify(obj) + " color = " + boxColor);
  if (currentBin == null)
  {
    var bounds = [ [boxCoords[0], boxCoords[1]], [boxCoords[2], boxCoords[3]] ];
    var mapRectangle = L.rectangle(bounds, {stroke: false, fill: true, fillOpacity: .3, fillColor: boxColor, weight: 1}).addTo(map);
    bins[boxCoordsString] = mapRectangle;
  }
  else
  {
    currentBin.setStyle({stroke: false, fill: true, fillOpacity: .3, fillColor: boxColor, weight: 1} )
  }


}, false);