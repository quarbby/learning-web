// Global variables 
var map;

// Agel Gender; Hit or Killed; Armed or Unarmed; Weapon

// Function to draw map
var drawMap = function() {
    // Create map and set view
    map = L.map('map-container', {
        center: [39.73, -104.99],
        zoom: 4,
        //layers: [grayscale, cities]
    });

    // Create a tile layer variable using the appropriate url
    var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')

    // Add the layer to your map
    layer.addTo(map);

    // Execute your function to get data
    getData();
}

// Function for getting data
var getData = function() {
  // Execute an AJAX request to get the data in data/response.js
    $.getJSON( "data/response.json", function(data) {
        customBuild(data);
    });

  // When your request is successful, call your customBuild function
}

// Loop through your data and add the appropriate layers and points
var customBuild = function(data) {
    //console.log(data);
	
	// Be sure to add each layer to the map
    for (var i=0; i<data.length; ++i) {
        var entry = data[i]; 
        
        var circle = L.circle([entry.lat, entry.lng], 3, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).addTo(map);
    }

	// Once layers are on the map, add a leaflet controller that shows/hides layers
  
}


