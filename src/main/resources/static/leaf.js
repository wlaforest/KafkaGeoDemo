console.log("loaded leaf.js");

//  The maximum number of vertices in a path.  How many points do you want on the tail.
const maxPathLength = 20;

//  The maximum value for calculating the color gradiant.
const maxBinValue = 50;

// Starting lat lon for the view
const configViewLat = 38.8950;
const configViewLon = -77.0533;

// starting zoom level
const configZoomLevel = 11;

// MapBox API ket
const configMapBoxToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

// name of the Vehicle topic
const configVehicleTopic = "bus_prepped";

// name of geohash bins topic
const configBinTopic  = "GEO_HEAT_MAP";
const configGeoHash = "GH"

// name of the alert topic
const configAlertTopic  = "alert";

// Keys for the returned data from kafka.
const configLatKey = "LAT";
const configLonKey = "LON";
const configIdKey = "VEHICLEID";

// Done config variables -----------------------------------------------------------------------------------------

var uniqueId = stringToHash(navigator.userAgent) + new Date().getTime();
var colorArray = generateRandomColors(50);
var map = L.map('mapid', {drawControl: true}).setView([configViewLat, configViewLon ], configZoomLevel);
var polyLines = {};
var latLonArrays = {};
var bins = {};
var showLines = true;

console.log("Loading leaflet layer");

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + configMapBoxToken, {
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

console.log("finished setting up leaflet objects");

function toggleButtonHandler()
{
  var timage = document.getElementById("toggleImage");
  if (timage.src.endsWith("images/toggle-on.png")) {
    timage.src = "images/toggle-off.png";
    showLines = false;
    hideLines();
    displayBins();
  } else {
    timage.src = "images/toggle-on.png";
    showLines = true;
    hideBins();
    displayLines();
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

console.log("Creating event source");
var busSourceUrl = '/topics/' + configVehicleTopic + '/sse?requestId=' + uniqueId + '&jsonSyncPath=$.DTIME&period=1000';
var busSource = new EventSource(busSourceUrl);
busSource.addEventListener('message', function(e){

  console.log("in event listener for vehicle path");
  var obj = JSON.parse(e.data);
  var id = obj[configIdKey];
  var polyLine = polyLines[id];
  var pointList = latLonArrays[id];
  if ( pointList == null) {
    // determine the line color based on a mod on the color array
    var lineColor = colorArray[(id % colorArray.length)-1];

    // created a fixed length array of lat-lon's
    pointList = getArrayWithLimitedLength(maxPathLength);

    // save the fixed length lat lon correlated to object id
    latLonArrays[id] = pointList;

    pointList.push([obj[configLatKey], obj[configLonKey]]);
    polyLine = L.polyline(pointList, {
      color: lineColor,
      weight: 3,
      smoothFactor: 1
    });
    if (showLines) polyLine.addTo(map)
    polyLines[id] = polyLine;
  }
  else
  {
    pointList.push([obj[configLatKey], obj[configLonKey]]);
    polyLine.setLatLngs(pointList);
  }
}, false);

var alertSource = new EventSource('/topics/' + configAlertTopic + '/sse?requestId=' + uniqueId + '&period=1000');
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

var binSource = new EventSource('/topics/' + configBinTopic + '/sse?requestId=' + uniqueId + '&jsonSyncPath=$.WS&period=1000');
binSource.addEventListener('message', function(e) {
  var obj = JSON.parse(e.data);

  var boxCoords = decode_bbox(obj[configGeoHash])
  var boxCoordsString = JSON.stringify(boxCoords)
  var boxColor = perc2color(obj.TOTAL, 0, maxBinValue); //getColorFromRedToGreenByPercentage(obj.TOTAL, 959);
  var currentBin = bins[boxCoordsString];
  if (currentBin == null)
  {
    var bounds = [ [boxCoords[0], boxCoords[1]], [boxCoords[2], boxCoords[3]] ];
    var mapRectangle = L.rectangle(bounds, {stroke: false, fill: true, fillOpacity: .3, fillColor: boxColor, weight: 1});
    if (!showLines) mapRectangle.addTo(map);
    bins[boxCoordsString] = mapRectangle;
  }
  else
  {
    currentBin.setStyle({stroke: false, fill: true, fillOpacity: .3, fillColor: boxColor, weight: 1} )
  }


}, false);

function hideLines() {
  for (cLine in polyLines) {
    polyLines[cLine].remove();
  }
}

function displayLines() {
  for (cLine in polyLines) {
    polyLines[cLine].addTo(map);
  }
}

function hideBins() {
  for (cBin in bins) {
    bins[cBin].remove();
  }
}

function displayBins() {
  for (cBin in bins) {
    bins[cBin].addTo(map);
  }
}