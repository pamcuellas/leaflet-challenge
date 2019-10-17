/* jshint esversion: 6*/ 

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


//  Additional Earthquake information. Source: http://www.geo.mtu.edu/UPSeis/magnitude.html
var additionalEarthquakeInfo = [ 
{magInterval: [-1000, 2.5 ], effect:"Usually not felt, but can be recorded by seismograph.", freqYear: "900,000"},
{magInterval: [2.5  , 5.5 ], effect:"Often felt, but only causes minor damage.",             freqYear: "30,000"},
{magInterval: [5.5  , 6.1 ], effect:"Slight damage to buildings and other structures.",      freqYear: "500"},
{magInterval: [6.1  , 7.0 ], effect:"May cause a lot of damage in very populated areas.",    freqYear: "100"},
{magInterval: [7.0  , 8.0 ], effect:"Serious damage.",                                       freqYear: "20"},
{magInterval: [8.0  , 1000],	effect:"Can totally destroy communities near the epicenter.",  freqYear: "One every 5 to 10 years"}
];

// Function to get Additional Earthquake information
function getInfo(mag) {
  return additionalEarthquakeInfo.find( obj => (obj.magInterval[0] <= mag && mag < obj.magInterval[1]) );
}

function addMarkers ( response ) {

  // Loop through the cities array and create one marker for each record object
  for (var i = 0; i < response.metadata.count; i++) {

    // REMARKS: There are some earthquakes with negative magnitudes.

    // Assign the magnitude to a variable
    var mag = response.features[i].properties.mag;

    // Conditionals for colors
    var color = "";
    if (mag <= 1) {
      color = "#e474d6";
    }
    else if (mag <= 2) {
      color = "#e474d6";
    }
    else if (mag <= 3 ) {
      color = "#e474d6";
    }
    else if (mag <= 4 ) {
      color = "#d732d1";
    }
    else if (mag <= 5 ) {
      color = "#5b005b";
    }
    else {
      color = "#340034";
    }

    // Get the coordinates
    var coordinates = [ response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]];
    

    var moreInfo = getInfo(mag);

    // Add circles to map
    L.circle(coordinates, {
      stroke: true,
      fillOpacity: 0.5,
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

const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// Perform an API call to the Citi Bike Station Information endpoint
d3.json(earthquakeURL,  addMarkers );

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "color-scale");
  return div;
};
// Add the info color-scale to the map
info.addTo(vMap);

document.querySelector(".color-scale").innerHTML = [
  "<span class='color1'></span><p class='color-range'>0 - 1</p>",
  "<span class='color2'></span><p class='color-range'>1 - 2</p>",
  "<span class='color3'></span><p class='color-range'>2 - 3</p>",
  "<span class='color4'></span><p class='color-range'>3 - 4</p>",
  "<span class='color5'></span><p class='color-range'>4 - 5</p>",
  "<span class='color6'></span><p class='color-range'> 5+  </p>"
].join("");
