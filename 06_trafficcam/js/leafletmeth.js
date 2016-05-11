var map;

var markers = [];
var cameras = [];

$(function() {
    
    map = L.map('map')
            .setView([1.3521, 103.8198], 11);
            
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);    
      
    getTrafficImages();

});

function getTrafficImages() {
    markers = [];
    cameras = [];
    
    var trafficMarker = L.AwesomeMarkers.icon({
        prefix: 'fa',
        icon: 'car',
        markerColor: 'red'
    });
    
    $.ajax({
        beforeSend: function(request) {
            request.setRequestHeader('api-key', '<YOUR API KEY>');
        },
        dataType: "json",
        url: 'https://api.data.gov.sg/v1/transport/traffic-images',
        success: function(data) {
            cameras = data.items[0].cameras;
            //console.log(cameras);
            
            cameras.forEach(function(cam) {
               var marker = L.marker(
                   [parseFloat(cam.location.latitude), 
                    parseFloat(cam.location.longitude)],
                    {icon: trafficMarker})
                   .addTo(map)
                   .bindPopup('<p><img src="' + cam.image + '" width="250" height="250""/></p>');

            }); //for each
            
        }, // success
        error: function() {
            alert("Sorry, error getting data");
        }
    });
}
