# Tectonic plates versus seismic activity

In this Leaflet map application, we can check out how the earthquakes are closely connected to tectonic plates. The visualization combines the dataset of the United States Geological Survey (USGS), that is a JSON URL with Earthquakes data from the Past 7 Days', updated every 5 minutes, and a tectonic plates JSON file available at https://github.com/fraxen/tectonicplates.

#### Leaflet, GeoJSON, D3, HTML5, and CSS3 are the technologies used to build this application.

#### The app is available on the link below if you consider to check it out.
https://leaflet-geojson-earthquake.herokuapp.com/

If you consider to clone this repository, everything you need to do to make it work is add your own config.js file with the <a href="https://account.mapbox.com/" >mapbox access token</a>. The token have to be declared on the config.js file with the format:<br>
const API_KEY = "Put your Access Token Here.";<br>
Copy the file to folders ./Leaflet-Step-1/static/js/ and ./Leaflet-Step-2/static/js/ or just relocate it to just one place and modified the html files. The project is divided in two steps but you can jump directly to step 2, the most complete part. 
