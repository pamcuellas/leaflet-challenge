/* jshint esversion: 6*/ 

// URL to get the Earthquake data.
const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map object
var vMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4,
});


L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(vMap);

// Function to get Additional Earthquake information and colorScale (source data.js)
function getInfo(mag, source) {
  return source.find( obj => (obj.magInterval[0] <= mag && mag < obj.magInterval[1]) );
}

function addMarkers ( response ) {

  // Loop through the cities array and create one marker for each record object
  for (var i = 0; i < response.metadata.count; i++) {

    // REMARK: There are some earthquakes with negative magnitudes.
    // Assign the magnitude to a variable
    var mag = response.features[i].properties.mag;

    // Conditionals for colors accordingly to the magnitude.
    var color = getInfo(mag, colorScale).color;

    // Get the coordinates
    var coordinates = [ response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]];
    
    // Get more information to present on tooltip.
    var moreInfo = getInfo(mag, additionalEarthquakeInfo);

    // Add circles to map
    L.circle(coordinates, {
      stroke: true,
      fillOpacity: 0.7,
      weight: 1,
      color: "white",
      fillColor: color,
      radius: mag * 25000
    }).bindPopup("<h3>" + response.features[i].properties.place + "</h3>" +
                 "<hr>" +
                 "<span>Magnitude: " + mag + "</span><br>" + 
                 "<span>Effect: " + moreInfo.effect + "</span><br>" +
                 "<span>Estimate number each year: " + moreInfo.freqYear + "</span>"
                 ).addTo(vMap);
  }
}


// Perform the API call to get data
d3.json(earthquakeURL,  addMarkers );

// Create a legend for color scale
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "color-scale"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "color-scale");
  return div;
};

// Add the legend to the map
info.addTo(vMap);

// Legend for color scale.
document.querySelector(".color-scale").innerHTML = [
  "<div class='color-range-container'><div class='box-color' style='background:" + getInfo(0,colorScale).color + ";'></div><p class='color-range'>0-1</p></div>",
  "<div class='color-range-container'><div class='box-color' style='background:" + getInfo(1,colorScale).color + ";'></div><p class='color-range'>1-2</p></div>",
  "<div class='color-range-container'><div class='box-color' style='background:" + getInfo(2,colorScale).color + ";'></div><p class='color-range'>2-3</p></div>",
  "<div class='color-range-container'><div class='box-color' style='background:" + getInfo(3,colorScale).color + ";'></div><p class='color-range'>3-4</p></div>",
  "<div class='color-range-container'><div class='box-color' style='background:" + getInfo(4,colorScale).color + ";'></div><p class='color-range'>4-5</p></div>",
  "<div class='color-range-container'><div class='box-color' style='background:" + getInfo(5,colorScale).color + ";'></div><p class='color-range'> 5+</p></div>"
].join("");
