$(function() {
 
    //Set up instafeed
    var imgs = [];
    var feed = new Instafeed({
        clientId: 'f2259c6e745d4df087e9d4659325ae97',
        //target: 'instafeed',
        get: 'tagged',
        tagName: 'cats',
        links: true,
        limit: 8,
        sortBy: 'most-recent',
        success: function(images) {
            
            //console.log(images.data);
            $.ajax({
                url: "https://api.projectoxford.ai/vision/v1.0/describe?maxCandidates=1",
                beforeSend: function(xhrObj){
                    // Request headers
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","bc6e814e6a3c4db595d49fb5ec045ee7");
                },
                type: "POST",
                // Request body
                data: '{ "url": "https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/13098967_164793917250826_685040446_n.jpg?ig_cache_key=MTIzOTExNDM1OTY4NTAyMzkwNA%3D%3D.2.l" }',
            })
            .done(function(data) {
                console.log(data);
                var desc = data.description.caption[0].text;
                var confidence = data.description.caption[0].confidence;
            })
            .fail(function() {
                console.log("error");
            });
            
            /*            
            $.ajax({
                type: "POST",
                url: "https://api.projectoxford.ai/vision/v1.0/describe?maxCandidates=",
                data: '{ "url": "https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/13098967_164793917250826_685040446_n.jpg?ig_cache_key=MTIzOTExNDM1OTY4NTAyMzkwNA%3D%3D.2.l"}',
                success: success,
                dataType: dataType
            });       
                
            $.post( "ajax/https://api.projectoxford.ai/vision/v1.0/describe?maxCandidates=1", function(data) {
                console.log(data);
            }); 
            */           
            
            var result;
            for (var i in images.data) {
                var image = images.data[i];
                console.log(image);
                var imgUrl = image.images.standard_resolution.url;
                
                result = this._makeTemplate(this.options.template, {
                    model: image,
                    link: image.link,
                    image: image.images[this.options.resolution].url,
                    caption: image.caption.text,
                    likes: image.likes.count,
                    date: image.date,
                    imgUrl: imgUrl.substring(0,20)
                });
                imgs.push(result);
            }
            $('#_instafeed').html(imgs);
        },
        resolution: 'standard_resolution',
        template: '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">' +
                    '<div class="photo-box"><div class="image-wrap">' +
                    '<a href="{{link}}"><img src="{{image}}"></a>' +
                    '<div class="likes">{{imgUrl}} Likes</div></div>' +
                    '<div class="description">{{caption}}' +
                    '<div class="date">{{imgUrl}}</div></div></div></div>'
    });
    feed.run();
 
});

// MS cognitive vision key: bc6e814e6a3c4db595d49fb5ec045ee7