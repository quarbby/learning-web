// Global variables 
var map;

var fields = ['Agency Name', 'Armed or Unarmed?', 'City', 'Hispanic or Latino Origin',
                'Hit or Killed?', 'Race', 'Shots fired', 'Source Link', 'State', 'Summary',
                'Timestamp', 'Victim Name', 'Victim\'s Age', 'Victim\'s Gender', 'Weapon'];
                
// Initialise all the layer groups
var allLayer = new L.layerGroup();
var hitOrKilledLayer = new L.layerGroup();
var armedOrUnarmedLayer = new L.layerGroup();
var raceLayer = new L.layerGroup();
    
// Function to draw map
var drawMap = function() {
    var baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');    
    
    var baseMaps = {
      "Base": baseLayer  
    };
    
    var overlayMaps = {
        "All": allLayer,
        "Hit or Killed": hitOrKilledLayer
    };    
    
    // Create map and set view
    map = L.map('map-container', {
        center: [39.82, -98.58],
        zoom: 4,
        layers: [baseLayer, allLayer]
    });

    // Add layer control
    L.control.layers(overlayMaps).addTo(map);
    
    // Add sidebar
    var sidebarOpened = true; 
    L.easyButton('fa-crosshairs', 
                  function() { 
                    if (sidebarOpened == true) {
                        sidebar.hide();
                    } else {
                        sidebar.show();
                    }
                    sidebarOpened = !sidebarOpened;
                  },
                 'Query and Filter'
                ).addTo(map);    
    
    var sidebar = L.control.sidebar('sidebar', {
        closeButton: true,
        position: 'left',
        autopan: 'true'
    });
    
    map.addControl(sidebar);
    map.on('click', function () {
        sidebar.hide();
    });   
    
    sidebar.show();
    
    L.DomEvent.on(sidebar.getCloseButton(), 'click', function () {
        sidebarOpened = false;
        console.log('Close button clicked.');
    });    

    // Execute your function to get data
    getData();
}

// Function for getting data
var getData = function() {
  // Execute an AJAX request to get the data in data/response.js
    $.getJSON( "data/response.json", function(data) {
        customBuild(data);
    });

}

// Loop through your data and add the appropriate layers and points
var customBuild = function(data) {
    //console.log(data);
    var circle;
	
	var uniqueArray = [];
	
	// Be sure to add each layer to the map
    data.map (function (entry) {
        circle = new L.circle([entry.lat, entry.lng], 3, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        });
        var text = createPopupText(entry);
        circle.bindPopup(text);
        //circle.addTo(map);
        
        circle.addTo(allLayer);

        // Get unique
        uniqueArray.push(entry['Armed or Unarmed?']);

        // Process layers 
        addToHitOrKilled(entry);
    });
    
    var unique = uniqueArray.filter(function(itm,i,a){
        return i == a.indexOf(itm);
    });    
    console.log(unique);
}

var addToHitOrKilled = function(entry) {
    var hitOrKilledColours = {'Hit': 'red', 'Killed': 'black', 'undefined': 'green'};
    var circle = new L.circle([entry.lat, entry.lng], 3, {
        color: hitOrKilledColours[entry['Hit or Killed?']],
        fillColor: '#f03',
        fillOpacity: 0.5
    });
    circle.bindPopup(createPopupText(entry));
    circle.addTo(hitOrKilledLayer);
}

var createPopupText = function(entry) {
    var text = "";
    text += "<b>Agency Name: </b>" + entry['Agency Name'] + "<br>";
    text += "<b>Summary: </b>" + entry['Summary'] + "<br>";
    text += "<a href=\"" + entry['Source Link'] + "\" target=\"_blank\">Source Link</a><br>";
    text += "<b>Timestamp: </b>" + entry['Timestamp']; 
    
    return text;
}