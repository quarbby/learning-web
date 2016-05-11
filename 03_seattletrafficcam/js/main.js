$(function() {
    
    // Create Google Map
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.6, lng: -122.3},
        zoom: 12
    });

    var infoWindow = new google.maps.InfoWindow();
    var markers = [];
    var allData = [];
    
    $.getJSON('https://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            allData = data;
            
            allData.forEach(function(allData) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: parseFloat(allData.location.latitude),
                        lng: parseFloat(allData.location.longitude)
                    },
                    animation: google.maps.Animation.DROP
                });

                google.maps.event.addListener(marker, 'click', function() {
                    map.panTo(this.getPosition());
                    map.panBy(0,-100);
                    var infoHtml = '<p>' + allData.cameralabel + '</p>';
                    infoHtml += '<img src="' + allData.imageurl.url + '"/>';
                    
                    infoWindow.setContent(infoHtml);
                    infoWindow.open(map, this);
                });

                google.maps.event.addListener(map, 'click', function() {
                    infoWindow.close();
                });

                markers.push(marker);
                console.log(markers);
                
                // To use allData globally, use a callback  
                $('#search').bind('search keyup', function() {
                    var cameraNames = allData.cameralabel.toLowerCase(); 
                    console.log(cameraNames);
                    var searchString = this.value.toLowerCase();
                    if (cameraNames.indexOf(searchString) < 0) {
                        marker.setMap(null);
                    } else {
                        marker.setMap(map);
                    }
                });                
                
            });

            var markerCluster = new MarkerClusterer(map, markers);
        })
        .fail(function(err) {
          alert("Error getting data");  
        });
        
                

});
