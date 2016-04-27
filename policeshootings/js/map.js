// Global variables 
var map;

var fields = ['Agency Name', 'Armed or Unarmed?', 'City', 'Hispanic or Latino Origin',
                'Hit or Killed?', 'Race', 'Shots Fired', 'Source Link', 'State', 'Summary',
                'Timestamp', 'Date Searched', 'Victim Name', 'Victim\'s Age', 'Victim\'s Gender', 'Weapon'];
                
var fields_dict = {'hit': ['Hit', 'Killed'],
                   'hisLat': ['Hispanic or Latino Origin', 'Not of Hispanic or Latino Origin'],
                   'gender': ['Male', 'Female'],
                   'armed': ['Armed', 'Unarmed']
                    };
                
var allData = [];                
                
// Initialise all the layer groups
var allLayer = new L.layerGroup();
var hitOrKilledLayer = new L.layerGroup();
var armedOrUnarmedLayer = new L.layerGroup();
var genderLayer = new L.layerGroup();
var shotsLayer = new L.layerGroup();   
var filterLayer = new L.layerGroup();
var baseMaps;
var overlayMaps;
    
// Function to draw map
var drawMap = function() {
    var baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');    
    
    baseMaps = {
      "Base": baseLayer
    };
    
    overlayMaps = {
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
    var armedOrUnarmedColours = {'Armed': 'red', 'Unarmed': 'blue', 'undefined': 'green'};
    var circle = new L.circle([entry.lat, entry.lng], 3, {
        color: armedOrUnarmedColours[entry['Armed or Unarmed?']],
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
    var shotsFired = entry['Shots Fired'];
    if (shotsFired == undefined) return;

    var shotGradient = 'cyan'
    shotsFired < 3 ?  shotGradient = 'cyan' :
    shotsFired < 7 ?  shotGradient = 'yellow' :
    shotsFired < 20 ?  shotGradient = 'blue'  :
    shotsFired < 40 ? shotGradient = 'green' :
    shotsFired < 70 ? shotGradient = 'red' :
    shotsFired < 100 ? shotGradient = 'black' :
                        shotGradient = 'cyan';

    //console.log(shotGradient);

    var circle = new L.circle([entry.lat, entry.lng], 5, {
        //color: shotsColours[Math.floor(Math.random()*shotsColours.length)],
        color: shotGradient,
        fillOpacity: 0.5
    });
    circle.bindPopup(createPopupText(entry));
    circle.addTo(shotsLayer);     
}

var createPopupText = function(entry) {
    var text = "";
    text += "<b>Agency Name: </b>" + entry['Agency Name'] + "<br>";
    if (entry['Summary'] != undefined) {
        text += "<b>Summary: </b>" + entry['Summary'] + "<br>";
    }
    if (entry['Shots Fired'] != undefined) {
        text += "<b>Shots Fired: </b>" + entry['Shots Fired'] + "<br>";
    }
    if (entry['Victim\'s Gender'] != undefined) {
        text += "<b>Gender: </b>" + entry['Victim\'s Gender'] + "<br>";
    }    
    if (entry['Hit or Killed?'] != undefined) {
        text += "<b>Hit or Killed: </b>" + entry['Hit or Killed?'] + "<br>";
    }    
    if (entry['Armed or Unarmed?'] != undefined) {
        text += "<b>Armed or Unarmed: </b>" + entry['Armed or Unarmed?'] + "<br>";
    }   
    
    if (entry['Shots Fired'] != undefined) {
        text += "<b>Shots Fired: </b>" + entry['Shots Fired'] + "<br>";
    }      
    
    text += "<a href=\"" + entry['Source Link'] + "\" target=\"_blank\">Source Link</a><br>";
    text += "<b>Date Searched: </b>" + entry['Date Searched']; 
    
    return text;
}

var getResult = function() {
    clearLayers();  
    filterLayer = new L.layerGroup();
    
    var selected_killed = $("#select_hitOrKilled").val();
    var selected_origin = $("#select_origin").val();
    var selected_min_age = $("#slider_age").slider( "values", 0 );
    var selected_max_age = $("#slider_age").slider( "values", 1 );
    var selected_gender = $("#select_gender").val();
    var selected_armed = $("#select_armedOrUnarmed").val();
    var selected_min_shots = $("#slider_shots").slider( "values", 0 );
    var selected_max_shots = $("#slider_shots").slider( "values", 1 );
    
    /*
    console.log(selected_killed + " " + selected_min_age + " " + selected_max_age 
                    + " " + selected_gender + " " + selected_armed + " " 
                    + selected_min_shots + " " + selected_max_shots);
                    
    */
    
    for (var i in allData) {
        var entry = allData[i];

        if (selected_killed != 'all') {
            if (selected_killed != entry['Hit or Killed?']) continue;
        }
        
        if (selected_armed != 'all') {
            if (selected_killed != entry['Armed or Unarmed?']) continue;
        }
        
        if (selected_gender != 'all') {
            if (selected_gender != entry['Victim\'s Gender']) continue;
        }     
        
        if (selected_origin != 'all') {
            if (selected_origin != entry['Hispanic or Latino Origin']) continue;
        }        
        
        if (entry['Victim\'s Age'] < selected_min_age || 
            entry['Victim\'s Age'] > selected_max_age)  continue;         

        if (entry['Shots Fired'] < selected_min_shots || 
            entry['Shots Fired'] > selected_max_shots)  continue;  
            
        //console.log(entry);
        
        var circle = new L.circle([entry.lat, entry.lng], 3, {
            color: 'red',
            fillOpacity: 0.5
        });
        var text = createPopupText(entry);
        circle.bindPopup(text);
        circle.addTo(filterLayer);
    }
    map.addLayer(filterLayer);
}

function clearLayers() {
    $.each(overlayMaps, function(index, value){
        map.removeLayer(value);
    });
    map.removeLayer(filterLayer);
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

function buttonClick() {
    //var hitRowChecked = $('#hit_row').prop('checked');

    var rowSelected, colSelected;
    $('#rowCheckboxGroup input:checked').each(function() {
        rowSelected = $(this).attr('name');
    }); 
    
    $('#colCheckboxGroup input:checked').each(function() {
        colSelected = $(this).attr('name');
    });     
    
    console.log(rowSelected);
    console.log(fields_dict[rowSelected]);
    
    var tablearea = document.getElementById('table-div');
    $('#table-div').empty();
    
    if (rowSelected == undefined || 
        colSelected == undefined) {
        tablearea.innerHTML = "Please select one item each to cross tabulate";
    }
    else if (rowSelected == colSelected) {
        tablearea.innerHTML = "Please select different attributes to cross tabulate";
    }
    else {
        var rowArray = fields_dict[rowSelected];
        var colArray = fields_dict[colSelected];
        
        var table = document.createElement('table');
            table.className = 'table table-striped';
            
        // Row 1 
        var tr = document.createElement('tr');
    
        tr.appendChild( document.createElement('td') );
        tr.appendChild( document.createElement('td') );
        tr.appendChild( document.createElement('td') );
    
        tr.cells[0].appendChild( document.createTextNode('///'));
        tr.cells[1].appendChild( document.createTextNode(colArray[0]));
        tr.cells[2].appendChild( document.createTextNode(colArray[1]));
    
        table.appendChild(tr); 
        
        // Row 2
        var tr = document.createElement('tr');
    
        tr.appendChild( document.createElement('td') );
        tr.appendChild( document.createElement('td') );
        tr.appendChild( document.createElement('td') );
    
        tr.cells[0].appendChild( document.createTextNode(rowArray[0]))
        tr.cells[1].appendChild( document.createTextNode(getNumber(rowArray[0], colArray[0])));
        tr.cells[2].appendChild( document.createTextNode(getNumber(rowArray[0], colArray[1])));     
        
        table.appendChild(tr);
        
        // Row 3
        var tr = document.createElement('tr');
    
        tr.appendChild( document.createElement('td') );
        tr.appendChild( document.createElement('td') );
        tr.appendChild( document.createElement('td') );
    
        tr.cells[0].appendChild( document.createTextNode(rowArray[1]))
        tr.cells[1].appendChild( document.createTextNode(getNumber(rowArray[1], colArray[0])));
        tr.cells[2].appendChild( document.createTextNode(getNumber(rowArray[1], colArray[1])));     
        
        table.appendChild(tr);        

        tablearea.appendChild(table);        
    }
    
}

var getNumber = function(row, col) {
    console.log(row, col);
    var count = 0;
    
    for (var i in allData) {
        var entry = allData[i];
        var found = 0;
        for(property in entry) {
            if (entry[property] == row) { found++; }
            if (entry[property] == col) { found++; }
        }
        if (found == 2) { count++; }
    }
    
    return count;
}