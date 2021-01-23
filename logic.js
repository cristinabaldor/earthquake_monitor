// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


  console.log(queryUrl);
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});



function createFeatures(earthquakeData) {


    // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  // Need to make circles where the markers are, radius = mag, color = depth
  function onEachFeature(feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "Magnitude: " + feature.properties.mag);
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (earthquakeData, latlng) {
      return L.circleMarker(latlng, {
        radius: earthquakeData.properties.mag * 2,
        fillColor: selectcolor(earthquakeData.geometry.coordinates[2]),
        // color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    })
  }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function selectcolor (d) {
return d> 90 ? "#800026":
d > 70  ? "#BD0026" :
d > 50 ? "#E31A1C" :
d > 30 ? "#FC4E2A" :
d> 10 ? "#FD8D3C" :
"#FEB24C" 
}



function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      15, 15
    ],
    zoom: 2.5,
    layers: [darkmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

   // Set up the legend
   var legend = L.control({ position: "bottomright" });
   legend.onAdd = function() {
     var div = L.DomUtil.create("div", "info legend");
     var limits = [-10,10,30,50,70,90];
     var labels = [];
 
     for (var i = 0; i < limits.length; i++) {
      div.innerHTML +=
        '<i style="background:' + selectcolor(limits[i] + 1) + '"></i> ' +
        limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
    }
    return div

  
   };
 
   // Adding legend to the map
   legend.addTo(myMap);
 

 
}
