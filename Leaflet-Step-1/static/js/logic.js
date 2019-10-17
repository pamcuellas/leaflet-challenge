/* jshint esversion: 6*/ 

// Create a map object
var vMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 3,
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

  console.log("Geometry ", response.features[0].geometry.coordinates) ;
  console.log(response);

  // Loop through the cities array and create one marker for each record object
  for (var i = 0; i < response.metadata.count; i++) {

    // Conditionals for colors
    var color = "";
    if (response.features[i].properties.mag > 2) {
      color = "yellow";
    }
    else if (response.features[i].properties.mag > 5) {
      color = "blue";
    }
    else if (response.features[i].properties.mag > 7) {
      color = "green";
    }
    else {
      color = "purple";
    }

    // Get the coordinates
    var coordinates = [ response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]];
    var mag = response.features[i].properties.mag;

    var moreInfo = getInfo(mag);

    // Add circles to map
    L.circle(coordinates, {
      stroke: false,
      record: 0.75,
      color: "white",
      fillColor: color,
      radius: mag * 30000
    }).bindPopup("<spam><strong>" + response.features[i].properties.place + "</strong></span>" +
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


