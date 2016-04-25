// Global variables 
var map;

var fields = ['Agency Name', 'Armed or Unarmed?', 'City', 'Hispanic or Latino Origin',
                'Hit or Killed?', 'Race', 'Shots Fired', 'Source Link', 'State', 'Summary',
                'Timestamp', 'Date Searched', 'Victim Name', 'Victim\'s Age', 'Victim\'s Gender', 'Weapon'];
                
var allData = [];                
                
// Initialise all the layer groups
var allLayer = new L.layerGroup();
var hitOrKilledLayer = new L.layerGroup();
var armedOrUnarmedLayer = new L.layerGroup();
var genderLayer = new L.layerGroup();
var shotsLayer = new L.layerGroup();    
    
// Function to draw map
var drawMap = function() {
    var baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');    
    
    var baseMaps = {
      "Base": baseLayer  
    };
    
    var overlayMaps = {
        "All": allLayer,
        "Hit or Killed": hitOrKilledLayer,
        "Armed or Unarmed": armedOrUnarmedLayer,
        "Gender": genderLayer,
        "Shots fired": shotsLayer
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
        //console.log('Close button clicked.');
    });    

    // Set sliders
    setSliders();

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
            fillOpacity: 0.5
        });
        var text = createPopupText(entry);
        circle.bindPopup(text);
        //circle.addTo(map);
        
        circle.addTo(allLayer);
        allData.push(entry);

        // Get unique
        /*
        if (entry['Victim\'s Age'] != undefined && entry['Victim\'s Age'] < 100)
            uniqueArray.push(entry['Victim\'s Age']);
        */
            //uniqueArray.push(entry['Gender']);        

        // Process layers 
        addToHitOrKilled(entry);
        addArmedOrUnarmed(entry);
        addGender(entry);
        addShots(entry);
    });
    
    //console.log(uniqueArray);
    //console.log(Math.min.apply(Math, uniqueArray), Math.max.apply(Math, uniqueArray));
    
    //var unique = uniqueArray.filter(function(itm,i,a){
    //    return i == a.indexOf(itm);
    //});    
    //console.log(unique);
}

var addToHitOrKilled = function(entry) {
    var hitOrKilledColours = {'Hit': 'red', 'Killed': 'black', 'undefined': 'green'};
    var circle = new L.circle([entry.lat, entry.lng], 3, {
        color: hitOrKilledColours[entry['Hit or Killed?']],
        fillOpacity: 0.5
    });
    circle.bindPopup(createPopupText(entry));
    circle.addTo(hitOrKilledLayer);
}

var addArmedOrUnarmed = function(entry) {
    var armedOrUnarmedColours = {'Armed': 'red', 'Unarmed': 'black', 'undefined': 'green'};
    var circle = new L.circle([entry.lat, entry.lng], 3, {
        color: armedOrUnarmedColours[entry['Armed or Unarmed']],
        fillOpacity: 0.5
    });
    circle.bindPopup(createPopupText(entry));
    circle.addTo(armedOrUnarmedLayer);
}

var addGender = function(entry) {
    var genderColours = {'Male': 'blue', 'Female': 'red', 'undefined': 'green'};
    var circle = new L.circle([entry.lat, entry.lng], 3, {
        color: genderColours[entry['Victim\'s Gender']],
        fillOpacity: 0.5
    });
    circle.bindPopup(createPopupText(entry));
    circle.addTo(genderLayer);    
}

var addShots = function(entry) {
    var shotsColours = ['blue', 'pink', 'green', 'yellow'];
    var shotsFired = entry['Shots Fired'];

    var circle = new L.circle([entry.lat, entry.lng], shotsFired*0.10, {
        color: shotsColours[Math.floor(Math.random()*shotsColours.length)],
        fillOpacity: 0.5
    });
    circle.bindPopup(createPopupText(entry));
    circle.addTo(shotsLayer);     
}

var createPopupText = function(entry) {
    var text = "";
    text += "<b>Agency Name: </b>" + entry['Agency Name'] + "<br>";
    text += "<b>Summary: </b>" + entry['Summary'] + "<br>";
    text += "<a href=\"" + entry['Source Link'] + "\" target=\"_blank\">Source Link</a><br>";
    text += "<b>Date Searched: </b>" + entry['Date Searched']; 
    
    return text;
}

var getResult = function() {
    var selected_killed = $("#select_hitOrKilled").val();
    var selected_min_age = $("#slider_age").slider( "values", 0 );
    var selected_max_age = $("#slider_age").slider( "values", 1 );
    var selected_gender = $("#select_gender").val();
    var selected_armed = $("#select_armedOrUnarmed").val();
    var selected_min_shots = $("#slider_shots").slider( "values", 0 );
    var selected_max_shots = $("#slider_shots").slider( "values", 1 );
}

function setSliders() {
    // Slider for age

    $("#slider_age").slider(
    {
        range: true,
        step: 3,
        min: 0,
        max: 100,
        values: [30, 50],
        slide: function( event, ui ) {
          $('#slider-age-vals').html(ui.values[0] + " yo - " + ui.values[1] + " yo");
          var selected_age = '(' + ui.values[0] + ','+ ui.values[1]+')';
          $("#slider_age").data("value", selected_age );
          
          getResult();
    }
    });
    
    // Slider for shots
    $("#slider_shots").slider(
    {
        range: true,
        step: 3,
        min: 0,
        max: 150,
        values: [10, 50],
        slide: function( event, ui ) {
          $('#shots-fired-val').html(ui.values[0] + " shots - " + ui.values[1] + " shots");
          var selected_shots = '(' + ui.values[0] + ','+ ui.values[1]+')';
          $("#slider_shots").data("value", selected_shots );
          
          getResult();
    }
    });    
}