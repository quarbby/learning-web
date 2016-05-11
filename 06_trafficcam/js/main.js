var infoWindow = new google.maps.InfoWindow();
var map;

var markers = [];
var cameras = [];

$(function() {
    
    // Data.gov API key: uHXCqKsDBhM9nfk1mJDk7TiSBEdGnOhn
    
    // Create Google Map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 1.3521, lng: 103.8198},
        zoom: 11
    });
    
    getTrafficImages();

});

function getTrafficImages() {
    markers = [];
    cameras = [];
    
    $.ajax({
        beforeSend: function(request) {
            request.setRequestHeader('api-key', 'uHXCqKsDBhM9nfk1mJDk7TiSBEdGnOhn');
        },
        dataType: "json",
        url: 'https://api.data.gov.sg/v1/transport/traffic-images',
        success: function(data) {
            cameras = data.items[0].cameras;
            //console.log(cameras);
            
            cameras.forEach(function(cam) {
               var marker = new google.maps.Marker({
                  position: {
                      lat: parseFloat(cam.location.latitude),
                      lng: parseFloat(cam.location.longitude)
                  },
                  map: map
               }); // marker
               
               google.maps.event.addListener(marker, 'click', function(){
                   map.panTo(this.getPosition());
                   var infoHtml = '<p><img src="' + cam.image + '" width="250" height="250""/></p>';
                   
                   infoWindow.setContent(infoHtml);
                   infoWindow.open(map, this);
               }); // click listener
               
               google.maps.event.addListener(map, 'click', function() {
                   infoWindow.close();
               });
               
               markers.push(marker);
               //console.log(markers);
               
               
               var markerCluster = new MarkerClusterer(map, markers);
               
            }); //for each
            
        }, // success
        error: function() {
            alert("Sorry, error getting data");
        }
    });
}
